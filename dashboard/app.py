import streamlit as st
import pandas as pd
import requests
import plotly.express as px
import time

# Configuration
API_URL = "http://127.0.0.1:8000"
st.set_page_config(page_title="DMT Dashboard", page_icon="📊", layout="wide")

# Helper to fetch data
def fetch_api(endpoint):
    try:
        response = requests.get(f"{API_URL}{endpoint}", timeout=2)
        if response.status_code == 200:
            return response.json()
    except requests.exceptions.RequestException:
        pass
    return None

# Sidebar Navigation
st.sidebar.title("DMT Admin")
page = st.sidebar.radio("Go to", ["Overview (KPIs)", "Student Progress", "Content Management"])

# -----------------------------------------------------------------------------
# PAGE: OVERVIEW (KPIs)
# -----------------------------------------------------------------------------
if page == "Overview (KPIs)":
    st.title("📊 System Overview & KPIs")
    
    # Fetch core stats
    stats = fetch_api("/stats")
    
    col1, col2, col3 = st.columns(3)
    
    if stats:
        col1.metric("Active Users", stats.get("active_users_mock", 0), "+5%")
        col2.metric("Total Requests", stats.get("total_requests", 0), "Live")
        col3.metric("Avg Latency", f"{stats.get('avg_latency', 0) * 1000:.1f} ms", "-5 ms")
    else:
        st.error("⚠️ Backend is offline. Ensure FastAPI is running on port 8000.")
        col1.metric("Active Users", "-", "-")
        col2.metric("Total Requests", "-", "-")
        col3.metric("Avg Latency", "-", "-")

    # Mock Map of Users (Netherlands)
    st.subheader("📍 User Distribution (Netherlands)")
    map_data = pd.DataFrame({
        'lat': [52.3676, 51.9244, 52.0907, 52.5185, 51.4416], # Ams, Rot, Utr, Zwolle, Eind
        'lon': [4.9041, 4.4777, 5.1214, 6.0830, 5.4697],
        'users': [120, 85, 60, 45, 90]
    })
    st.map(map_data, zoom=6)

# -----------------------------------------------------------------------------
# PAGE: STUDENT PROGRESS
# -----------------------------------------------------------------------------
elif page == "Student Progress":
    st.title("🎓 Student Achievements")

    # Fetch users
    users = fetch_api("/user/")
    if users:
        user_options = {u['name']: u['id'] for u in users}
        selected_name = st.selectbox("Select Student", list(user_options.keys()))
        
        if selected_name:
            user_id = user_options[selected_name]
            
            # Fetch sessions
            # sessions = fetch_api(f"/session/user/{user_id}") # Endpoint exists
            # Using mock data for better visualization if no sessions exist
            
            st.divider()
            
            # Student Profile Header
            col1, col2 = st.columns([1, 3])
            with col1:
                st.image("https://api.dicebear.com/7.x/avataaars/svg?seed=" + selected_name, width=150)
            with col2:
                st.subheader(f"{selected_name}")
                st.write("Group 5 | Level: DMT 2")
                st.progress(75, text="Progress directly to Level 3")

            # Charts
            st.divider()
            st.subheader("📈 Reading Speed (WPM) Trend")
            
            # Mock trend data
            trend_data = pd.DataFrame({
                "Date": ["Jan 1", "Jan 3", "Jan 5", "Jan 7", "Jan 9"],
                "WPM": [45, 48, 47, 52, 55],
                "Accuracy": [90, 92, 91, 95, 96]
            })
            
            fig = px.line(trend_data, x="Date", y=["WPM", "Accuracy"], markers=True)
            st.plotly_chart(fig, use_container_width=True)
            
            # Badges
            st.subheader("🏆 Earned Badges")
            cols = st.columns(4)
            cols[0].success("🚀 Speedster")
            cols[1].info("📚 Bookworm")
            cols[2].warning("🔥 Streak: 5 Days")
    
    else:
        st.warning("No users found or backend offline.")

# -----------------------------------------------------------------------------
# PAGE: CONTENT MANAGEMENT
# -----------------------------------------------------------------------------
elif page == "Content Management":
    st.title("📝 Content Management")
    
    st.write("Manage reading words and difficulty levels.")
    
    tab1, tab2 = st.tabs(["Words", "Upload"])
    
    with tab1:
        words = fetch_api("/word/")
        if words:
            df = pd.DataFrame(words)
            st.dataframe(df, use_container_width=True)
        else:
            st.info("No words found.")
            
    with tab2:
        st.write("Upload CSV of new words. Columns: `text`, `difficulty_level`, `pattern_tags`")
        uploaded_file = st.file_uploader("Choose CSV", type="csv")
        
        if uploaded_file is not None:
            if st.button("Upload Words"):
                try:
                    df = pd.read_csv(uploaded_file)
                    required_cols = {'text'}
                    if not required_cols.issubset(df.columns):
                        st.error(f"CSV must contain columns: {required_cols}")
                    else:
                        success_count = 0
                        fail_count = 0
                        progress_bar = st.progress(0)
                        
                        for i, row in df.iterrows():
                            # Default values if missing
                            payload = {
                                "text": str(row['text']),
                                "difficulty_level": int(row.get('difficulty_level', 1)),
                                "pattern_tags": str(row.get('pattern_tags', "")) if pd.notna(row.get('pattern_tags')) else None
                            }
                            
                            try:
                                res = requests.post(f"{API_URL}/word/", json=payload)
                                if res.status_code == 200:
                                    success_count += 1
                                else:
                                    fail_count += 1
                            except:
                                fail_count += 1
                            
                            progress_bar.progress((i + 1) / len(df))
                        
                        st.success(f"Uploaded {success_count} words successfully!")
                        if fail_count > 0:
                            st.warning(f"Failed to upload {fail_count} words.")
                            
                except Exception as e:
                    st.error(f"Error parsing CSV: {e}")

# Footer
st.markdown("---")
st.caption("DMT Backend v1.0 | Dashboard v1.0")
