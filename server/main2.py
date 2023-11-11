from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import logging
import numpy as np
import cv2
import insightface
import math
import random
import time
import pickle
import csv
from fastapi import FastAPI, Request, Form, File, UploadFile
from pymongo import MongoClient
from pydantic import BaseModel

model = insightface.app.FaceAnalysis(name="buffalo_l")
model.prepare(ctx_id=-1)

class Item(BaseModel):
    data: list

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

try:
    client = MongoClient("mongodb://localhost:27017/")
    database = client["Attendance_Face"]
    print("Connected to MongoDB successfully")
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/uploadfiles")
async def create_upload_files(files: List[UploadFile], user:str, classId:str, date:str):
    # print(user)
    # print(classId)
    # print(date)
    output = set()
    try:
        collection = database[user]
        count = collection.count_documents({"type":"students", "classId":classId})
        # print(count)
        if count>0:
            cursor = collection.find({"type":"students", "classId":classId})
            # print(cursor[0])
            base_embeddings = {}
            for row in cursor[0]['students']:
                if len(row)>3:
                    base_embeddings[str(row[1])]=np.array(row[3], dtype='float32')

        for file in files:
            photo = await file.read()
            nparr = np.fromstring(photo, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            faces = model.get(img)
            final = []
            sensitivity = 0.2
            for face in faces:
                max_score=sensitivity
                max_roll=0
                for roll in base_embeddings:
                    e1 = base_embeddings[roll]
                    score = compareEmbedding(e1,face['embedding'])
                    if max_score<score:
                        max_score = score
                        max_roll = roll

                if(max_roll!=0):
                    final.append(max_roll)

        final = set(final)
        output = output.union(final)
        output = list(output)
        output.sort()
        count = collection.count_documents({"type":"attendance", "classId":classId, "date":date})
        # print(count)
        if count>0:
            result = collection.update_one({"type":"attendance", "classId":classId, "date":date}, {"$set": {'present':output}})
        if count==0:
            cursor = collection.insert_one({"type":"attendance", "classId":classId, "date":date, 'present':output})
    except Exception as e:
        print(e)
    return {"present": output}
    
@app.get("/Class")
async def getClass(user: str):
    try:
        collection = database[user]
        cursor = collection.find({"type":"class"})
        
        output = []
        for document in cursor:
            output.append({"id":str(document["_id"]), "batch": document["batch"], "code": document["code"], "color":document["color"]})
        return output
    except Exception as e:
        print(e)

@app.post("/Class")
async def postClass(data: Item, user:str):
    data = list(data)[0][1]
    colors = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fushsia', 'pink', 'rose']
    random.seed(time.time())
    color = random.choice(colors)
    # print(color)
    collection = database[user]
    cursor = collection.insert_one({"type":"class", "code": data[0], "batch": data[1], "color": color})
    print(cursor)
    print({"result": str(cursor)})

@app.get("/Config")
async def getStudents(user:str, classId:str):
    print(classId)
    print(user)
    collection = database[user]
    count = collection.count_documents({"type":"students", "classId":classId})
    if count>0:
        cursor = collection.find({"type":"students", "classId":classId}, {'students':1, '_id':0})
        output = []
        for row in cursor[0]['students']:
            output.append([str(row[1]), row[2]])
        return output
    else:
        return []

@app.post("/Config") # Embedding Database upload
async def postStudents(files: List[UploadFile], user:str, classId:str): #for embeddings
    print(user)
    print(classId)
    upload = {}
    for file in files:
        photo = await file.read()
        nparr = np.fromstring(photo, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        faces = model.get(img)
        upload[file.filename] = faces[0]['embedding']

    # print(upload)
    collection = database[user]
    count = collection.count_documents({"type":"students", "classId":classId})
    if count>0:
        cursor = collection.find({"type":"students", "classId":classId}, {'students':1, '_id':0})
        studentData = cursor[0]['students']
        for student in studentData:
            if(str(student[1]) in upload):
                if(len(student)==3):
                    student.append(upload[str(student[1])].tolist())
                if(len(student)>3):
                    student[3]=upload[str(student[1])].tolist()
        result = collection.update_one({"type":"students", "classId":classId}, {"$set": {'students':studentData}})
        # print(studentData)
    return "Successfully uploaded."


@app.post("/ConfigAddStudent")
async def addStudent(data:Item, user:str, classId:str):
    data = list(data)[0][1]
    print(classId)
    print(user)
    print(data)
    collection = database[user]
    count = collection.count_documents({"type":"students", "classId":classId})
    if count>0:
        cursor = collection.find({"type":"students", "classId":classId}, {'students':1, '_id':0})
        newStudents = cursor[0]['students']
        newStudents.append([len(newStudents), data[1], data[0]])
        result = collection.update_one({"type":"students", "classId":classId}, {"$set": {'students':newStudents}})
    else:
        newStudents = []
        newStudents.append([len(newStudents), data[1], data[0]])
        result = collection.insert_one({"type":"students", "classId":classId, 'students':newStudents})
    output = []
    for row in newStudents:
        output.append(row[1:])
    return output