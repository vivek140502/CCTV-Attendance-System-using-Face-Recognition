from fastapi import FastAPI, UploadFile, File,HTTPException
# import os
from fastapi.middleware.cors import CORSMiddleware
from api import router as api_router
# from typing import List
# from database import get_database_connection
#
# import shutil

app = FastAPI()

app.add_middleware(
 CORSMiddleware,
 allow_origins=["*"],
 allow_credentials=True,
 allow_methods=["*"],
 allow_headers=["*"],
 )
app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app,host="127.0.0.1",port=8000)


# @app.post("/users")
# async def create_user(user: User):
#     # print("Data From React",user)
#     connection = get_database_connection()
#     cursor.connection.cursor()
#     query = "select * from user_details where email=%s"
#     value = (user_in.email,)
#     cursor.execute(query, value)
#
#     cursor = connection.cursor()
#     res=check_email(user.email)
#     if res:
#         raise HTTPException(status_code=400,detail="Email id already exists")
#     else:
#         query = "INSERT INTO user_details(name, email,phone_number,address,department,gender,date_of_birth) VALUES (%s,%s,%s,%s,%s,%s,%s)"
#         values = (user.name, user.email, user.phone_number,user.address,user.department,user.gender,user.date_of_birth)
#         cursor.execute(query, values)
#         connection.commit()
#         connection.close()
#         return {'Values inserted Successfully '}

# @app.post("/check_email")
# def check_email(user: User):
#     connection = get_database_connection()
#     cursor = connection.cursor()
#
#     query = "SELECT * FROM user_details WHERE email = %s"
#     value=(user.email,)
#     cursor.execute(query,value)
#     result = cursor.fetchone()
#
#     if result:
#         raise HTTPException(status_code=400, detail="Email already exists")
#     else:
#         insert_query = "INSERT INTO user_details(name, email,phone_number,address,department,gender,date_of_birth) VALUES (%s,%s,%s,%s,%s,%s,%s)"
#         values = (user.name, user.email, user.phone_number,user.address,user.department,user.gender,user.date_of_birth)
#         cursor.execute(insert_query,values)
#         connection.commit()
#         connection.close
#
#     return {"message": "Email inserted into the database successfully"}
#
# @app.get("/users")
# async def read_users():
#     connection = get_database_connection()
#     cursor = connection.cursor()
#     query = "SELECT * FROM user_details"
#     cursor.execute(query)
#     users = cursor.fetchall()
#     print(users[0][1])
#     connection.close()
#     return users







# @app.post("/upload/")
# async def upload_image(file: UploadFile = File(...)):
#     contents = await file.read()
#
#     # Specify the folder where you want to store the image
#     folder = "D:\images"
#
#     # Create the folder if it doesn't exist
#     os.makedirs(folder, exist_ok=True)
#
#     # Write the contents of the file to a new file in the folder
#     with open(os.path.join(folder, file.filename), 'wb') as f:
#         f.write(contents)
#
#     return {"filename": file.filename}
#def verify_user(email:str,phone_no:str):


# from fastapi import FastAPI
#
# app = FastAPI()
#
# @app.get("/")
# async def root():
#     return {"message": "Hello, World!"}