from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from google import genai
import os
from dotenv import load_dotenv
import requests
from pydantic import BaseModel
import PIL.Image
import io

load_dotenv()

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

class ImageURL(BaseModel):
    url: str

@app.get("/")
def read_root():
    return {"message": "Agriculture Tracker Backend is Running!"}

@app.get("/generate")
def generate_content():
    response = client.models.generate_content(
        model="gemini-2.5-flash", contents="Explain how AI works in a few words"
    )
    return {"text": response.text}

@app.post("/analyze-leaf")
async def analyze_leaf(file: UploadFile = File(...)):
    image_data = await file.read()
    image = PIL.Image.open(io.BytesIO(image_data))
    prompt = "Look at this crop leaf. Identify the disease and suggest 3 organic cures."
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[prompt, image]
    )
    return {"analysis": response.text}

@app.post("/analyze-leaf-url")
async def analyze_leaf_url(item: ImageURL):
    print(f"Downloading image from: {item.url}")
    response = requests.get(item.url) 
    if response.status_code != 200:
        return {"error": "Failed to download image from URL"}
    image_data = response.content
    image = PIL.Image.open(io.BytesIO(image_data)) 
    prompt = "Look at this crop leaf. Identify the disease and suggest 3 organic cures."
    ai_response = client.models.generate_content(
        model="gemini-2.5-flash", 
        contents=[prompt, image]
    )
    return {"analysis": ai_response.text}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, ssl_keyfile="key.pem", ssl_certfile="cert.pem")