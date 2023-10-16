from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import logging
import numpy as np
import cv2
from PIL import Image
from mtcnn import MTCNN
import insightface
import math
import pickle
import json

model = insightface.app.FaceAnalysis(name="buffalo_l")
model.prepare(ctx_id=-1)

from sklearn.metrics.pairwise import cosine_similarity
def compare(address1,address2):
    img1 = cv2.imread(address1)
    img2 = cv2.imread(address2)
    e1 = model.get(img1)[0]['embedding']
    e1 = e1/np.linalg.norm(e1)
    e2 = model.get(img2)[0]['embedding']
    e2 = e2/np.linalg.norm(e2) 
    return cosine_similarity([e1], [e2])[0][0]

def compareEmbedding(e1,e2):
    e1 = e1/np.linalg.norm(e1)
    e2 = e2/np.linalg.norm(e2) 
    return cosine_similarity([e1], [e2])[0][0]

def draw_bounding_boxes(image, coordinates):
    for coord in coordinates:
        x1, y1, x2, y2 = math.floor(coord['bbox'][0]), math.floor(coord['bbox'][1]), math.floor(coord['bbox'][2]), math.floor(coord['bbox'][3])
        color = (0, 255, 0)
        thickness = 1
        image = cv2.rectangle(image, (x1, y1), (x2, y2), color, thickness)
    return image

logging.basicConfig(
    level=logging.DEBUG,  # You can adjust the log level as needed (e.g., INFO, WARNING, ERROR)
    filename='fastapi.log',  # Log to a file
    filemode='a',  # Append to the log file
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/uploadfiles")
async def create_upload_files(files: List[UploadFile]):
    with open("./attendance_embeddings.pkl", 'rb') as file:
        base_embeddings = pickle.load(file)

    output = set()
    for file in files:
        photo = await file.read()
        nparr = np.fromstring(photo, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        faces = model.get(img)
        # print(faces)
        # img = draw_bounding_boxes(img, faces)
        # img = Image.fromarray(img)
        # print("hi")
        # img.save("./image.png")

        final = []
        for face in faces:
            max_score=0.35
            max_roll=0
            for roll in base_embeddings:
                for e1 in base_embeddings[roll]:
                    score = compareEmbedding(e1,face['embedding'])
                    if max_score<score:
                        max_score = score
                        max_roll = roll

            if(max_roll!=0):
                final.append(max_roll)
        
        
        final = set(final)
        # print(file.filename, ":")
        # print(final)
        output = output.union(final)
    output = list(output)
    output.sort()
    # print(output)
    return {"present": output}
    