from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS so your React Frontend (http://localhost:5173) can talk to this Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

@app.get("/")
def read_root():
    return {"message": "Agriculture Tracker Backend is Running!"}

@app.get("/generate")
def generate_content():
    response = client.models.generate_content(
        model="gemini-2.5-flash", contents="Explain how AI works in a few words"
    )
    return {"text": response.text}

# This allows you to run the server with: python main.py
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, ssl_keyfile="key.pem", ssl_certfile="cert.pem")