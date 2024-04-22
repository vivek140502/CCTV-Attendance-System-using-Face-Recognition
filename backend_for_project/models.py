from pydantic import BaseModel
from datetime import date
from fastapi import File,Form,UploadFile
class User(BaseModel):
    # id: int
    name: str
    email: str
    phone_number:str
    address:str
    department:str
    gender:str
    date_of_birth:date
    password:str
    #photo: UploadFile = File(...)
class Login(BaseModel):
    email:str
    password:str
# class form_with_photo(BaseModel):
#     name: str = Form(...),
#     email: str = Form(...),
#     phone: str = Form(...),
#     country: str = Form(...),
#     state: str = Form(...),
#     gender: str = Form(...),
#     password: str = Form(...),
#     file: UploadFile = File(...)
class UserP(BaseModel):
    # id: int
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    phone_number:str = Form(...),
    department:str = Form(...),
    gender:str = Form(...),
    date_of_birth:date = Form(...),
    address: str = Form(...),
    country:str = Form(...),
    state: str = Form(...),
    city: str = Form(...),
    pincode: str = Form(...),
    password:str = Form(...),
    confirmPassword : str = Form(...)
    photo: UploadFile = File(...)

class ChangePassword(BaseModel):
    confirm_password: str
    current_password: str
    email: str
    new_password:str

class  EditProfile(BaseModel):
    first_name:str=Form(...)
    last_name:str=Form(...)
    phone_number:str = Form(...)
    address: str = Form(...)
    country:str = Form(...)
    state: str = Form(...)
    city: str = Form(...)
    pincode: str = Form(...)
    email:str=Form(...)

class UploadPhotos(BaseModel):
    email : str = Form(...)
    up_photo_1:UploadFile=File(...)
    up_photo_2: UploadFile = File(...)
    up_photo_3: UploadFile = File(...)
    up_photo_4: UploadFile = File(...)
    up_photo_5: UploadFile = File(...)