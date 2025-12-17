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
import pymongo
import security

load_dotenv()

app = FastAPI()

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
myclient = pymongo.MongoClient(os.getenv("MONGODB_URI"))
db = myclient["agriculture-tracker"]
col = db["login"]

class User(BaseModel):
    username: str
    password: str

class ImageURL(BaseModel):
    url: str

class TokenRequest(BaseModel):
    token: str

@app.get("/")
def read_root():
    return {"message": "Agriculture Tracker Backend is Running!"}

@app.get("/api/generate")
def generate_content():
    response = client.models.generate_content(
        model="gemini-2.5-flash", contents="Explain how AI works in a few words"
    )
    return {"text": response.text}

@app.post("/api/analyze-leaf")
async def analyze_leaf(file: UploadFile = File(...)):
    image_data = await file.read()
    image = PIL.Image.open(io.BytesIO(image_data))
    prompt = "Look at this crop leaf. Identify the disease and suggest 3 organic cures."
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[prompt, image]
    )
    return {"analysis": response.text}

@app.post("/api/analyze-leaf-url")
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

@app.post("/api/register")
async def register(user: User):
    find_user = col.find_one({"username": user.username})
    if find_user:
        return {"message": "User already exists"}
    hashed_password = security.get_password_hash(user.password)
    new_user  = {"username": user.username, "password": hashed_password}
    col.insert_one(new_user)
    return {"message": "User registered successfully"}

@app.post("/api/login")
async def login(user: User):
    find_user = col.find_one({"username": user.username})
    if not find_user:
        return {"message": "User not found"}
    if not security.verify_password(user.password, find_user["password"]):
        return {"message": "Incorrect password"}

    access_token = security.create_access_token(data={"username": user.username})
    return {"message": "Login successful", "access_token": access_token}

@app.post("/api/verify-token")
async def verify_token(request: TokenRequest):
    try:
        payload = security.verify_token(request.token)
        return {"message": "Token is valid", "payload": payload}
    except:
        return {"message": "Invalid token"}

        
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True, ssl_keyfile="key.pem", ssl_certfile="cert.pem")