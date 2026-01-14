# Step 1: Use Python 3.11 base image
FROM python:3.11-slim

# Step 2: Set working directory inside container
WORKDIR /app

# Step 3: Copy requirements file and install dependencies
COPY backend/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Step 4: Copy all backend code
COPY backend /app

# Step 5: Command to start your app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
