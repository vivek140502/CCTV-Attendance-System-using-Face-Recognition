# from fastapi import APIRouter,UploadFile,File
# from logic import *
# from models import *
# from datetime import date
# import numpy as np
# import cv2
# import face_recognition
# from typing import List
# router=APIRouter()
# # @router.post("/register/")
# # async def register(user:User):
# #     return create_user(user)
# @router.post("/login/",tags=['Login'])
# async def login_verify(login:Login):
#     return login_user(login)
#
# @router.post("/form_with_photo/")
# async def create_user_with_photo(first_name: str = Form(...),
#     last_name: str = Form(...),
#     email: str = Form(...),
#     phone_number:str = Form(...),
#     address: str = Form(...),
#     department : str = Form(...),
#     gender : str = Form(...),
#     date_of_birth : date = Form(...),
#     password : str = Form(...),
#     photo: UploadFile = File(),
#     isAdmin: str = Form(...),
#     country:str = Form(...),
#     state: str = Form(...),
#     city: str = Form(...),
#     pincode: str = Form(...)):
#     content = await photo.read()
#     hashed_password = pwd_context.hash(password)
#     if first_name == last_name:
#         raise HTTPException(status_code=400, detail="First Name and Last Name cannot be the same")
#
#     connect = get_database_connection()  # Assuming you have defined this function elsewhere
#     cursor = connect.cursor()
#     query = "SELECT * FROM registration_details WHERE email = %s"
#     value = (email,)
#     cursor.execute(query, value)
#     result = cursor.fetchone()
#     if result:
#         print('User already exists')
#         raise HTTPException(status_code=400, detail="Email already exists")
#     else:
#         insert_query = "INSERT INTO registration_details(first_name, last_name, email, phone_number, address, city, state, country, pincode, department, gender, date_of_birth, password, photo, is_admin) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
#         values = (first_name, last_name, email, phone_number, address, city, state, country, pincode, department, gender, date_of_birth, hashed_password, content, isAdmin)
#         cursor.execute(insert_query, values)
#         connect.commit()
#         connect.close()
#         return "User registered successfully"
#
#
#
# @router.post("/Delete/")
# async def del_user(email:str):
#     '''This Function is used for deleting an employee by Admin '''
#     return delete_user(email)
#
#
# @router.post("/Change_Password/")
# async def change_password(cp:ChangePassword):
#     '''This Function is used for changing the password of the employee'''
#     return change_passwd(cp)
#
#
# @router.post("/Edit_Profile/")
# async def edit_profile_post(first_name:str=Form(...),
#     last_name:str=Form(...),
#     phone_number:str = Form(...),
#     address: str = Form(...),
#     country:str = Form(...),
#     state: str = Form(...),
#     city: str = Form(...),
#     pincode: str = Form(...),
#     email:str=Form(...)):
#     '''This Function is used for editing profile of the employee '''
#     return edit_profile_post(first_name,last_name,phone_number,address,country,state,city,pincode,email)
#
#
# @router.get("/Edit_Profile_Get/")
# async def edit_profile_1(email:str):
#     '''This Function is used for fetching the employee's details from registration_details table using email '''
#     return edit_profile_get(email)
#
#
#
#
# @router.get("/upload_new/")
# async def upload_new():
#     '''This Function is used for fetching the employee's details from registration_details table using id '''
#     return Upload_New()
#
#
# @router.post("/upload_photos/")
# async def upload_photos(id:str=Form(...),first_name: str = Form(...),last_name: str= Form(...), photo1: UploadFile = File(...), photo2: UploadFile = File(...),
#                         photo3: UploadFile = File(...), photo4: UploadFile = File(...), photo5: UploadFile = File(...)):
#     ''' This Function is used for uploading the photos of the employee by the Admin '''
#     return Upload_Photos(id,first_name,last_name,photo1,photo2,photo3,photo4,photo5)
#
#
#
#
# @router.get("/counts")
# async def get_attendance_counts():
#     '''This Function is used for fetching the employee's stats for Admin for current date for admin dashboard'''
#     return Get_Attendance_Counts()
#
#
# @router.get("/employee/")
# async def get_employee_stats(email: str):
#     ''' This function is used for fetching the employee's stats for current date for employee dashboard'''
#     return Get_Employee_Stats(email)
#
#
# @router.get("/username/")
# async def get_username(email: str):
#     '''This function is used for retrieving the employee's fullname from the registration_details table'''
#     return Get_UserName(email)
#
#
# @router.get("/attendance/")
# async def get_attendance_details(name: str, date: str):
#     ''' This function is used to retrieve the attendance  of the employee using fullname and date from attendance table '''
#     return Get_Attendance_using_fullname(name,date)
#
#
# @router.get("/attendance_using_email/")
# async def get_attendance_details(email: str, date: str):
#     ''' This function is used to get the attendance of the Employee  using email and date from attendance table '''
#     return Get_Attendance_details_using_email(email,date)
#
#
#
#
#
#
# @router.get("/advance_name_search/")
# async def get_names():
#     '''This Function is used for getting al full names of the employees from the registration_details table in form of
#        the dictionary where key is the id of the employee and full name is the corresponding value  '''
#     return Get_Names_Dictionary()
#
#
#
# @router.get("/advance_name_search_using_list/")
# async def get_names():
#     '''This Function is used for getting al full names of the employees from the registration_details table in form of
#        the List  '''
#     return Get_Names_Using_List()
#
# @router.get("/Total_Working_Hours/")
# async def get_total_working_hours(email:str):
#     return Get_Total_Working_Hours(email)
#
# @router.get("/Total_Working_Hours_And_Minutes/")
# async def get_total_working_hours_and_minutes(email:str):
#     return Get_Total_Working_Hours_And_Minutes(email)
#
#
# @router.get("/Female_&_Male_Ratio/")
# async def female_and_female_ratio():
#     return Female_Male_Ratio()
#
# @router.get("/Departmnt_wise_clock_in_counts/")
# async def department_wise_clock_in():
#     return Department_Wise_Clock_In()
#
#
# @router.get("/Names_for_Outside_office/")
# async def get_names_outside_office():
#     return Get_Names_Outside_Office()
#
# @router.get("/Names_for_On_Leaves/")
# async def get_names_on_leaves():
#     return Get_Names_On_Leaves()
#
# @router.get("/Counts_of_clock_in/")
# async def get_clock_in(fullname:str):
#     return get_clock_ins_for_week(fullname)
#
# @router.post("/DATA_FOR_TESTNG/")
# async def data_for_testing():
#     return Data_For_Testing()
#
# @router.get("/clockIn/")
# async def recent_clock_In(email:str):
#     return clock_in(email)
#
# @router.get("/clockOut/")
# async def recent_clock_In(email:str):
#     return clock_out(email)

from fastapi import APIRouter,UploadFile,File
from logic import *
from models import *
from datetime import date
import numpy as np
import cv2
import face_recognition
from typing import List
router=APIRouter()
# @router.post("/register/")
# async def register(user:User):
#     return create_user(user)
@router.post("/login/",tags=["Login"])
async def login_verify(login:Login):
    return login_user(login)

@router.post("/registration_form/",tags=["Registration"])
async def create_user_with_photo(first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    phone_number:str = Form(...),
    address: str = Form(...),
    department : str = Form(...),
    gender : str = Form(...),
    date_of_birth : date = Form(...),
    password : str = Form(...),
    photo: UploadFile = File(),
    isAdmin: str = Form(...),
    country:str = Form(...),
    state: str = Form(...),
    city: str = Form(...),
    pincode: str = Form(...)):
    content = await photo.read()
    hashed_password = pwd_context.hash(password)
    if first_name == last_name:
        raise HTTPException(status_code=400, detail="First Name and Last Name cannot be the same")

    connect = get_database_connection()  # Assuming you have defined this function elsewhere
    cursor = connect.cursor()
    query = "SELECT * FROM registration_details WHERE email = %s"
    value = (email,)
    cursor.execute(query, value)
    result = cursor.fetchone()
    if result:
        print('User already exists')
        raise HTTPException(status_code=400, detail="Email already exists")
    else:
        insert_query = "INSERT INTO registration_details(first_name, last_name, email, phone_number, address, city, state, country, pincode, department, gender, date_of_birth, password, photo, is_admin) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        values = (first_name, last_name, email, phone_number, address, city, state, country, pincode, department, gender, date_of_birth, hashed_password, content, isAdmin)
        cursor.execute(insert_query, values)
        connect.commit()
        connect.close()
        return "User registered successfully"



@router.post("/Delete/",tags=["Delete User"])
async def del_user(email:str):
    '''This Function is used for deleting an employee by Admin '''
    return delete_user(email)


@router.post("/change_password/",tags=["Change Password"])
async def change_password(cp:ChangePassword):
    '''This Function is used for changing the password of the employee'''
    return change_passwd(cp)


@router.post("/edit_profile/",tags=["Edit Profile"])
async def edit_profile_post(first_name:str=Form(...),
    last_name:str=Form(...),
    phone_number:str = Form(...),
    address: str = Form(...),
    country:str = Form(...),
    state: str = Form(...),
    city: str = Form(...),
    pincode: str = Form(...),
    email:str=Form(...)):
    '''This Function is used for editing profile of the employee '''
    return edit_profile_post(first_name,last_name,phone_number,address,country,state,city,pincode,email)


@router.get("/edit_profile_get/",tags=["Edit Profile"])
async def edit_profile_g(email:str):
    '''This Function is used for fetching the employee's details from registration_details table using email '''
    return edit_profile_get(email)



@router.get("/upload_new/",tags=["Upload Photos"])
async def upload_new():
    '''This Function is used for fetching the employee's details from registration_details table using id '''
    return Upload_New()


@router.post("/upload_photos/",tags=["Upload Photos"])
async def upload_photos(id:str=Form(...),first_name: str = Form(...),last_name: str= Form(...), photo1: UploadFile = File(...), photo2: UploadFile = File(...),
                        photo3: UploadFile = File(...), photo4: UploadFile = File(...), photo5: UploadFile = File(...)):
    ''' This Function is used for uploading the photos of the employee by the Admin '''
    return Upload_Photos(id,first_name,last_name,photo1,photo2,photo3,photo4,photo5)




@router.get("/counts",tags=["Admin Dashboard"])
async def get_attendance_counts():
    '''This Function is used for fetching the employee's stats for Admin for current date for admin dashboard'''
    return Get_Attendance_Counts()


@router.get("/employee/",tags=["Employee Dashboard"])
async def get_employee_stats(email: str):
    ''' This function is used for fetching the employee's stats for current date for employee dashboard'''
    return Get_Employee_Stats(email)


@router.get("/username/",tags=["Fetching Usernames"])
async def get_username(email: str):
    '''This function is used for retrieving the employee's fullname from the registration_details table'''
    return Get_UserName(email)


@router.get("/attendance/",tags=["Admin Attendance/Reports"])
async def get_attendance_details(name: str, date: str):
    ''' This function is used to retrieve the attendance  of the employee using fullname and date from attendance table '''
    return Get_Attendance_using_fullname(name,date)


@router.get("/attendance_using_email/",tags=["Employee Attendance/Reports"])
async def get_attendance_details(email: str, date: str):
    ''' This function is used to get the attendance of the Employee  using email and date from attendance table '''
    return Get_Attendance_details_using_email(email,date)


# @router.get("/advance_name_search/",tags=["Admin Attendance/Reports"])
# async def get_names():
#     '''This Function is used for getting al full names of the employees from the registration_details table in form of
#        the dictionary where key is the id of the employee and full name is the corresponding value  '''
#     return Get_Names_Dictionary()



@router.get("/advance_name_search/",tags=["Admin Attendance/Reports"])
async def get_names():
    '''This Function is used for getting al full names of the employees from the registration_details table in form of
       the List  '''
    return Get_Names_Using_List()

@router.get("/total_working_hours/",tags=["Employee Dashboard"])
async def get_total_working_hours(email:str):
    return Get_Total_Working_Hours(email)

@router.get("/total_working_hours_minutes/",tags=["Employee Dashboard"])
async def get_total_working_hours_and_minutes(email:str):
    return Get_Total_Working_Hours_And_Minutes(email)


@router.get("/female_male_ratio/",tags=["Admin Dashboard"])
async def female_and_female_ratio():
    return Female_Male_Ratio()

@router.get("/department_clock_in_counts/",tags=["Admin Dashboard"])
async def department_wise_clock_in():
    return Department_Wise_Clock_In()


@router.get("/names_outside_office/",tags=["Admin Dashboard"])
async def get_names_outside_office():
    return Get_Names_Outside_Office()

@router.get("/names_on_leaves/",tags=["Admin Dashboard"])
async def get_names_on_leaves():
    return Get_Names_On_Leaves()

@router.get("/counts_clock_in/",tags=["Admin Dashboard"])
async def get_clock_in(fullname:str):
    return get_clock_ins_for_week(fullname)

@router.post("/DATA_FOR_TESTNG/",tags=["Testing"])
async def data_for_testing():
    return Data_For_Testing()

@router.get("/clockIn/",tags=["Employee Dashboard"])
async def recent_clock_In(email:str):
    return clock_in(email)

@router.get("/clockOut/",tags=["Employee Dashboard"])
async def recent_clock_In(email:str):
    return clock_out(email)