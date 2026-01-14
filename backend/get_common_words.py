import requests

url = "https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/nl/nl_50k.txt"
response = requests.get(url)
if response.status_code == 200:
    lines = response.text.splitlines()
    words = [line.split()[0] for line in lines if line.strip()]
    top_5000 = words[:5000]
    with open("c:/repo/dmt-app/backend/dutch_5000.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(top_5000))
    print("Saved 5000 words to c:/repo/dmt-app/backend/dutch_5000.txt")
else:
    print(f"Failed to download: {response.status_code}")
