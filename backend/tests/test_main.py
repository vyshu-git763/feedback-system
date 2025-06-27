import pytest
from fastapi.testclient import TestClient
from app.main import app
import random
client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Feedback System!"}

def test_signup():
    unique_id = random.randint(1000, 9999)
    payload = {
        "username": f"testuser{unique_id}",
        "email": f"test{unique_id}@example.com",
        "password": "testpass123",
        "role": "employee"
    }
    response = client.post("/signup", json=payload)
    assert response.status_code == 200

def test_login():
    signup_data = {
    "username": "loginuser",
    "email": "loginuser@example.com",
    "password": "loginpass123",
    "role": "employee"
}
    client.post("/signup", json=signup_data)

    login_data = {
    "username": "loginuser",
    "password": "loginpass123"
}
    response = client.post("/login", json=login_data)

    assert response.status_code == 200

    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
