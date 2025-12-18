from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Header
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
from bson import ObjectId
import security
from datetime import datetime
from typing import Optional

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
col2 = db["crops"]

class User(BaseModel):
    username: str
    password: str

class ImageURL(BaseModel):
    url: str

class TokenRequest(BaseModel):
    token: str

class Crop(BaseModel):
    crop_name: str
    crop_type: str
    planting_date: str
    expected_harvest: str
    area: str
    status: str
    notes: Optional[str] = ""

class CropUpdate(BaseModel):
    crop_name: Optional[str] = None
    crop_type: Optional[str] = None
    planting_date: Optional[str] = None
    expected_harvest: Optional[str] = None
    area: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ")[1]
    payload = security.verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload["username"]

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
    try:
        find_user = col.find_one({"username": user.username})
        if find_user:
            raise HTTPException(status_code=400, detail="User already exists")
        
        hashed_password = security.get_password_hash(user.password)
        new_user = {"username": user.username, "password": hashed_password}
        col.insert_one(new_user)
        return {"message": "User registered successfully", "success": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@app.post("/api/login")
async def login(user: User):
    try:
        find_user = col.find_one({"username": user.username})
        if not find_user:
            raise HTTPException(status_code=401, detail="User not found")
        if not security.verify_password(user.password, find_user["password"]):
            raise HTTPException(status_code=401, detail="Incorrect password")

        access_token = security.create_access_token(data={"username": user.username})
        return {"message": "Login successful", "access_token": access_token, "success": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@app.post("/api/verify-token")
async def verify_token(request: TokenRequest):
    try:
        payload = security.verify_token(request.token)
        return {"message": "Token is valid", "payload": payload}
    except:
        return {"message": "Invalid token"}

@app.get("/api/crops")
async def get_crops(username: str = Depends(get_current_user)):
    crops = list(col2.find({"username": username}))
    for crop in crops:
        crop["_id"] = str(crop["_id"])
    return {"crops": crops}

@app.post("/api/crops")
async def create_crop(crop: Crop, username: str = Depends(get_current_user)):
    crop_data = crop.dict()
    crop_data["username"] = username
    crop_data["created_at"] = datetime.now().isoformat()
    result = col2.insert_one(crop_data)
    crop_data["_id"] = str(result.inserted_id)
    return {"message": "Crop added successfully", "crop": crop_data}

@app.put("/api/crops/{crop_id}")
async def update_crop(crop_id: str, crop_update: CropUpdate, username: str = Depends(get_current_user)):
    try:
        update_data = {k: v for k, v in crop_update.dict().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        result = col2.update_one(
            {"_id": ObjectId(crop_id), "username": username},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Crop not found")
        
        return {"message": "Crop updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/api/crops/{crop_id}")
async def delete_crop(crop_id: str, username: str = Depends(get_current_user)):
    try:
        result = col2.delete_one({"_id": ObjectId(crop_id), "username": username})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Crop not found")
        return {"message": "Crop deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(username: str = Depends(get_current_user)):
    total_crops = col2.count_documents({"username": username})
    active_crops = col2.count_documents({"username": username, "status": "Active"})
    harvested_crops = col2.count_documents({"username": username, "status": "Harvested"})
    
    return {
        "total_crops": total_crops,
        "active_crops": active_crops,
        "harvested_crops": harvested_crops,
        "username": username
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)