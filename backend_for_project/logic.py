import mysql.connector
from fastapi.responses import JSONResponse
#from logic import Register_user
from models import *
from fastapi import HTTPException,File, UploadFile, Form
from passlib.context import CryptContext
import base64
from fastapi import FastAPI
import face_recognition
import cv2
import numpy as np
import io
from datetime import datetime,timedelta
import calendar
from collections import Counter
import matplotlib.pyplot as plt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def get_database_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="master"
    )

# def create_user(user:User):
#     connect=get_database_connection()
#     cursor=connect.cursor()
#     query="INSERT INTO user_details(name, email,phone_number,address,department,gender,date_of_birth) VALUES (%s,%s,%s,%s,%s,%s,%s)"
#     val=  (user.name, user.email, user.phone_number,user.address,user.department,user.gender,user.date_of_birth)
#     cursor.execute(query,val)
#     connect.commit()
#     connect.close()
#     return 'User created successfully'
'''Method Name: create_user
Purpose:For Registration of User
Arguments:object of Class User
Return Type :'''
def create_user(user:User):
    hashed_password = pwd_context.hash(user.password)
    connect = get_database_connection()
    cursor = connect.cursor()
    query = "SELECT * FROM user_details WHERE email = %s"
    value=(user.email,)
    cursor.execute(query,value)
    result = cursor.fetchone()
    print(result)
    if result:
            print('user already exits')
            raise HTTPException(status_code=400, detail="Email already exists")
    else:
        insert_query = "INSERT INTO user_details(name, email,phone_number,address,department,gender,date_of_birth,password) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)"
        values = (user.name, user.email, user.phone_number,user.address,user.department,user.gender,user.date_of_birth,hashed_password)
        cursor.execute(insert_query,values)
        connect.commit()
        connect.close()
def login_user(login:Login):
    db=get_database_connection()
    cursor=db.cursor()
    query="""Select email,password from registration_details where email=%s AND is_admin="true" """
    query1="""Select email,password from registration_details where email=%s AND is_admin="false" """
    cursor.execute(query,(login.email,))
    data=cursor.fetchone()
    cursor.execute(query1, (login.email,))
    data1=cursor.fetchone()
    if  data and  pwd_context.verify(login.password, data[1]):
        query2="select first_name from registration_details where email=%s"
        value_1=(login.email,)
        cursor.execute(query2,value_1)
        fname_a=cursor.fetchone()
        return {'email':login.email,
                'first_name':fname_a[0],
            'message' : "Admin Login Successfully"}
    elif data1 and pwd_context.verify(login.password,data1[1]):
        query2="select first_name from registration_details where email=%s"
        value_1=(login.email,)
        cursor.execute(query2,value_1)
        fname_e=cursor.fetchone()
        return {
            'email':login.email,
            'first_name':fname_e[0],
            'message' : "Employee Login Successfully"}
    else:
        return "Employee does not Exists"


async def Create_User_With_Photo(first_name: str = Form(...),
                                 last_name: str = Form(...),
                                 email: str = Form(...),
                                 phone_number: str = Form(...),
                                 address: str = Form(...),
                                 department: str = Form(...),
                                 gender: str = Form(...),
                                 date_of_birth: date = Form(...),
                                 password: str = Form(...),
                                 photo: UploadFile = File(),
                                 isAdmin: str = Form(...),
                                 country: str = Form(...),
                                 state: str = Form(...),
                                 city: str = Form(...),
                                 pincode: str = Form(...)):
    content = await photo.read()
    hashed_password = pwd_context.hash(password)
    if first_name == last_name:
        raise HTTPException(status_code=400, detail="First Name and Last Name cannot be the same")

    connect = get_database_connection()  # Assuming you have defined this function elsewhere
    cursor = connect.cursor()
    query = "SELECT * FROM user_details WHERE email = %s"
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



def delete_user(email:str):
    conn=get_database_connection()
    cursor = conn.cursor()
    query = "UPDATE user_details SET is_active = 0 WHERE email = %s;"
    cursor.execute(query, (email,))
    conn.commit()
    conn.close()


def change_passwd(cp:ChangePassword):
    conn = get_database_connection()
    cursor = conn.cursor()
    hashed_password = pwd_context.hash(cp.new_password)
    query1="select password from registration_details where email=%s"
    value=(cp.email,)
    cursor.execute(query1,value)
    result=cursor.fetchone()
    if pwd_context.verify(cp.current_password,result[0]):
        query=("UPDATE registration_details set password=%s where email=%s ")
        values=(hashed_password,cp.email)
        cursor.execute(query,values)
        conn.commit()
        conn.close()
        return {'message':"password updated successfully"}
    else:
        return {'message':"Current password is incorrect "}
def edit_profile_get(email:str):
    conn=get_database_connection()
    cursor=conn.cursor()
    query="select first_name,last_name,phone_number,address,city,state,country,pincode from registration_details where email=%s"
    value=(email,)
    cursor.execute(query,value)
    result=cursor.fetchall()
    conn.close()
    result_1={
        'first_name':result[0][0],
        'last_name': result[0][1],
        'phone_number': result[0][2],
        'address': result[0][3],
        'city': result[0][4],
        'state': result[0][5],
        'country': result[0][6],
        'pincode': result[0][7]
        }
    return result_1


def edit_profile_post(first_name:str=Form(...),
    last_name:str=Form(...),
    phone_number:str = Form(...),
    address: str = Form(...),
    country:str = Form(...),
    state: str = Form(...),
    city: str = Form(...),
    pincode: str = Form(...),
    email:str=Form(...)):
    conn=get_database_connection()
    cursor=conn.cursor()
    query= "update registration_details set first_name=%s,last_name=%s,phone_number=%s,address=%s,city=%s,state=%s,country=%s,pincode=%s where email=%s"
    values=(first_name,last_name,phone_number,address,city,state,country,pincode,email)
    cursor.execute(query,values)
    conn.commit()
    conn.close()
    return "Profile Updated Successfully"

def Upload_New():
    db=get_database_connection()
    cursor=db.cursor(dictionary=True)  # Use a dictionary cursor
    query="select Employee_id,first_name,last_name from registration_details"
    cursor.execute(query)
    result=cursor.fetchall()
    db.close()
    return result


def encode_person(id:str):
    db=get_database_connection()
    cursor=db.cursor()
    query="select photo1,photo2,photo3,photo4,photo5 from upload_photos where Employee_id=%s"
    value=(id,)
    query_1="Select face_encodings_1,face_encodings_2,face_encodings_3,face_encodings_4,face_encodings_5 from face where id=%s"
    values=(id,)
    cursor.execute(query_1,values)
    result_1=cursor.fetchall()
    cursor.execute(query,value)
    result = cursor.fetchone()
    if len(result_1) == 0:  # Check if any result was fetched
        if result is None:
            return "Person not found"

        encodings = []
        for photo in result:
            # Convert the photo data to an image
            nparr = np.frombuffer(photo, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            # Compute the face encoding
            encoding = face_recognition.face_encodings(img)
            if encoding:
                encodings.append(encoding[0])

        if not encodings:
            return "No faces found in photos"

        # Convert the average encoding to a string of comma-separated floats

        cursor.execute(
            "INSERT INTO face (id, face_encodings_1,face_encodings_2,face_encodings_3,face_encodings_4,face_encodings_5) VALUES (%s,%s,%s,%s,%s,%s)",
            (id, encodings[0].tobytes(), encodings[1].tobytes(), encodings[2].tobytes(), encodings[3].tobytes(),
             encodings[4].tobytes())
        )

        # Commit the changes and close the connection
        db.commit()
        cursor.close()
        db.close()

        return "Encoding inserted successfully"
    else:
        if result is None:
            return "Person not found"

        encodings = []
        for photo in result:
            # Convert the photo data to an image
            nparr = np.frombuffer(photo, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            # Compute the face encoding
            encoding = face_recognition.face_encodings(img)
            if encoding:
                encodings.append(encoding[0])

        if not encodings:
            return "No faces found in photos"

        # Convert the average encoding to a string of comma-separated floats

        update_query = """
            UPDATE face 
            SET face_encodings_1 = %s, 
                face_encodings_2 = %s, 
                face_encodings_3 = %s, 
                face_encodings_4 = %s, 
                face_encodings_5 = %s 
            WHERE id = %s
        """

        # Execute the update query with the new values
        cursor.execute(update_query, (
            encodings[0].tobytes(),
            encodings[1].tobytes(),
            encodings[2].tobytes(),
            encodings[3].tobytes(),
            encodings[4].tobytes(),
            id
        ))

        # Commit the changes and close the connection
        db.commit()
        cursor.close()
        db.close()

        return "Encoding Updated Successfully"



def Upload_Photos(id:str=Form(...),first_name: str = Form(...),last_name: str= Form(...), photo1: UploadFile = File(...), photo2: UploadFile = File(...),
                        photo3: UploadFile = File(...), photo4: UploadFile = File(...), photo5: UploadFile = File(...)):
    try:
        conn = get_database_connection()
        with conn.cursor(dictionary=True) as cursor:
            cursor.execute("SELECT Employee_id FROM registration_details WHERE first_name = %s AND last_name = %s", (first_name, last_name))
            user = cursor.fetchone()
            if not user:
                return "User with first_name {} and last_name {} does not exist.".format(first_name,last_name)
            user_id = user["Employee_id"]

            cursor.execute("SELECT Employee_id FROM upload_photos WHERE Employee_id = %s", (user_id,))
            existing_entry = cursor.fetchone()
            if existing_entry:
                cursor.execute(
                    "UPDATE upload_photos SET photo1 = %s, photo2 = %s, photo3 = %s, photo4 = %s, photo5 = %s WHERE Employee_id = %s",
                    (photo1.file.read(),photo2.file.read(),photo3.file.read(),photo4.file.read(),photo5.file.read(), user_id))
                conn.commit()
                return encode_person(user_id)
            else:
                cursor.execute("INSERT INTO upload_photos (Employee_id, first_name,last_name,  photo1, photo2, photo3, photo4, photo5) VALUES (%s,%s,%s , %s, %s, %s, %s, %s)",
                           (user_id,first_name,last_name,photo1.file.read(), photo2.file.read(), photo3.file.read(), photo4.file.read(), photo5.file.read()))
                conn.commit()
                return encode_person(user_id)
    except Exception as e:
        return str(e)


def Get_Attendance_Counts():
    db = get_database_connection()
    cursor = db.cursor()

    cursor.execute("SELECT COUNT(*) FROM registration_details")
    total_entries = cursor.fetchone()[0]


    cursor.execute("SELECT distinct(id) FROM attendance where date=%s", (date.today(),))
    result=cursor.fetchall()
    c_in=0
    c_out=0
    n=len(result)
    for i in range(0,n):
        cursor.execute("SELECT type FROM attendance WHERE id = %s AND date = %s ORDER BY time DESC LIMIT 1",(result[i][0],date.today()))
        result_1=cursor.fetchone()[0]
        if result_1=='in':
            c_in=c_in+1
        else:
            c_out=c_out+1

    cursor.execute("SELECT COUNT(DISTINCT(id)) FROM attendance where date=%s",(date.today(),))
    a = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(DISTINCT(Employee_id)) FROM registration_details")
    b=cursor.fetchone()[0]
    total_leave_entries=b-a

    db.close()

    return {
        "total_employees": total_entries,
        "inside_office": c_in,
        "outside_office": c_out,
        "live_counts": total_leave_entries
    }




def Get_Total_Working_Hours(email: str):
    # Get today's date
    today = date.today()
    db = get_database_connection()
    cursor = db.cursor(dictionary=True)

    # Fetch clock-in and clock-out times for the specified email for today
    query = "SELECT type, time FROM attendance WHERE email = %s AND date = %s"
    cursor.execute(query, (email, today))
    rows = cursor.fetchall()

    total_working_hours = 0
    last_clock_in_time = None

    # Calculate total working hours for today and track clock-in time for calculating overtime
    for row in rows:
        entry_type = row["type"]
        entry_time = row["time"]

        if entry_type == "in":
            last_clock_in_time = entry_time
        elif entry_type == "out" and last_clock_in_time is not None:
            time_difference = entry_time - last_clock_in_time
            total_working_hours += time_difference.seconds / 3600  # Convert seconds to hours
            last_clock_in_time = None

    # Calculate total time for the day
    total_hours_today = total_working_hours

    # Calculate total time for the week
    first_day_of_week = today - timedelta(days=today.weekday())  # Monday of the current week
    last_day_of_week = first_day_of_week + timedelta(days=6)  # Sunday of the current week
    total_hours_week = calculate_total_hours_for_period(email, first_day_of_week, last_day_of_week)

    # Calculate total time for the month
    first_day_of_month = today.replace(day=1)
    last_day_of_month = today.replace(day=1, month=today.month % 12 + 1,
                                      year=today.year if today.month < 12 else today.year + 1) - timedelta(days=1)
    total_hours_month = calculate_total_hours_for_period(email, first_day_of_month, last_day_of_month)

    # Calculate overtime
    overtime = max(total_working_hours - 40, 0)

    # Close cursor and database connection
    cursor.close()
    db.close()

    return {
        "email": email,
        "today": {'hours': round(total_hours_today, 2),'totalHours':8.5},
        "thisWeek": {'hours': round(total_hours_week, 2),'totalHours':42.5},
        "thisMonth": {'hours': round(total_hours_month, 2),'totalHours':178.5},
        "overtime": round(overtime, 2)
    }

def calculate_total_hours_for_period(email, start_date, end_date):
    db = get_database_connection()
    cursor = db.cursor(dictionary=True)

    # Fetch clock-in and clock-out times for the specified email within the given period
    query = "SELECT type, time FROM attendance WHERE email = %s AND date BETWEEN %s AND %s"
    cursor.execute(query, (email, start_date, end_date))
    rows = cursor.fetchall()

    total_working_hours = 0
    last_clock_in_time = None

    # Calculate total working hours within the given period
    for row in rows:
        entry_type = row["type"]
        entry_time = row["time"]

        if entry_type == "in":
            last_clock_in_time = entry_time
        elif entry_type == "out" and last_clock_in_time is not None:
            time_difference = entry_time - last_clock_in_time
            total_working_hours += time_difference.seconds / 3600  # Convert seconds to hours
            last_clock_in_time = None

    # Close cursor and database connection
    cursor.close()
    db.close()

    return total_working_hours



def Get_UserName(email:str):
    db = get_database_connection()
    cursor = db.cursor()


    cursor.execute("SELECT first_name, last_name FROM registration_details WHERE email = %s", (email,))
    row = cursor.fetchone()
    if not row:
        return {"message": "User not found"}

    full_name = f"{row[0]} {row[1]}"
    db.close()
    return {"userName": full_name}




def Get_Attendance_details_using_email(email:str,date:str):
    db = get_database_connection()
    cursor = db.cursor()

    cursor.execute("SELECT time FROM attendance WHERE email = %s AND date = %s AND type = 'in'",
                   (email, date))
    rows = cursor.fetchall()
    cursor.execute("select Employee_id,first_name,last_name from registration_details where email=%s",(email,))
    row_1=cursor.fetchall()
    id=row_1[0][0]
    first_name=row_1[0][1]
    last_name=row_1[0][2]
    formatted_times = []
    for row in rows:
        total_seconds = row[0].total_seconds()
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        seconds = total_seconds % 60
        formatted_time = "{:02}:{:02}:{:02}".format(int(hours), int(minutes), int(seconds))
        formatted_times.append(formatted_time)

    cursor.execute("SELECT time FROM attendance WHERE email = %s AND date = %s AND type = 'out'",
                   (email, date))
    rows = cursor.fetchall()
    formatted_times_1 = []
    for row in rows:
        total_seconds = row[0].total_seconds()
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        seconds = total_seconds % 60
        formatted_time_1 = "{:02}:{:02}:{:02}".format(int(hours), int(minutes), int(seconds))
        formatted_times_1.append(formatted_time_1)

    db.close()
    return {'id':id,
            'first_name':first_name,
            'last_name':last_name,
            'attendance':{
        "clockIn": formatted_times,
            "clockOut": formatted_times_1}}


def Get_Attendance_using_fullname(name:str,date:str):
    db = get_database_connection()
    cursor = db.cursor()
    l=name.split(" ")
    fname=l[0]
    lname=l[1]
    cursor.execute("SELECT time FROM attendance WHERE first_name = %s AND last_name = %s AND date = %s AND type = 'in'",
                   (fname,lname, date))
    rows = cursor.fetchall()

    cursor.execute("select Employee_id,first_name,last_name from registration_details where first_name=%s and last_name=%s",(fname,lname))
    row_1=cursor.fetchall()
    id=row_1[0][0]
    first_name=row_1[0][1]
    last_name=row_1[0][2]
    formatted_times = []
    for row in rows:
        total_seconds = row[0].total_seconds()
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        seconds = total_seconds % 60
        formatted_time = "{:02}:{:02}:{:02}".format(int(hours), int(minutes), int(seconds))
        formatted_times.append(formatted_time)

    cursor.execute("SELECT time FROM attendance WHERE first_name = %s AND last_name = %s AND date = %s AND type = 'out'",
                   (fname,lname, date))
    rows = cursor.fetchall()
    formatted_times_1 = []
    for row in rows:
        total_seconds = row[0].total_seconds()
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        seconds = total_seconds % 60
        formatted_time_1 = "{:02}:{:02}:{:02}".format(int(hours), int(minutes), int(seconds))
        formatted_times_1.append(formatted_time_1)

    db.close()

    return {'id':id,
            'first_name':first_name,
            'last_name':last_name,
            'attendance':{
        "clockIn": formatted_times,
            "clockOut": formatted_times_1}}



def Get_Names_Using_List():
    db=get_database_connection()
    cursor=db.cursor()
    cursor.execute("select first_name from registration_details")
    result_1=cursor.fetchall()
    cursor.execute("select last_name from registration_details")
    result_2=cursor.fetchall()
    cursor.execute("select count(first_name) from registration_details")
    n=cursor.fetchone()
    print(n[0])
    d=[]
    j=1
    for i in range(0,n[0]):
        a=f"{result_1[i][0]} {result_2[i][0]}"
        d.append(a)
    return d


def Get_Names_Dictionary():
    db=get_database_connection()
    cursor=db.cursor()
    cursor.execute("select first_name from registration_details")
    result_1=cursor.fetchall()
    cursor.execute("select last_name from registration_details")
    result_2=cursor.fetchall()
    cursor.execute("select count(first_name) from registration_details")
    n=cursor.fetchone()
    print(n[0])
    d={}
    j=1
    for i in range(0,n[0]):
        d[j]=f"{result_1[i][0]}{result_2[i][0]}"
        j=j+1
    return d



def calculate_working_hours_for_month(today, working_hours_per_day=8.5):
    year = today.year
    month = today.month

    # Get the number of days in the given month
    num_days_in_month = calendar.monthrange(year, month)[1]

    # Initialize total working hours
    total_working_hours = 0

    # Loop through each day of the month
    for day in range(1, num_days_in_month + 1):
        # Create a datetime object for the current day
        current_day = datetime(year, month, day)

        # Check if it's a weekday (Monday to Friday)
        if current_day.weekday() < 5:  # Monday is 0, Friday is 4
            total_working_hours += working_hours_per_day

    return total_working_hours


def Get_Employee_Stats(email: str):
    db = get_database_connection()
    cursor = db.cursor()

    # Get the employee's ID using the email
    cursor.execute("SELECT Employee_id FROM registration_details WHERE email = %s", (email,))
    Employee_id = cursor.fetchone()
    if not Employee_id:
        return {"message": "Employee not found"}

    Employee_id = Employee_id[0]

    # Get the attendance entries for the employee
    cursor.execute("SELECT time, type FROM attendance WHERE id = %s and date=%s ORDER BY time",
                   (Employee_id, date.today()))
    rows = cursor.fetchall()
    if not rows:
        return "No data for today"

    total_working_hours = 0
    total_clocked_in = 0
    total_clocked_out = 0

    last_time = None
    last_type = None
    for row in rows:
        current_time = row[0]
        current_type = row[1]

        if last_time is not None and last_type == 'in' and current_type == 'out':
            # Calculate hours worked
            hours_worked = (current_time - last_time).seconds / 60
            total_working_hours += hours_worked

        if current_type == 'in':
            total_clocked_in += 1
        elif current_type == 'out':
            total_clocked_out += 1

        last_time = current_time
        last_type = current_type

    db.close()

    return {
        "email": email,
        "totalWorkingHours": int(total_working_hours),
        "totalClockedIn": total_clocked_in,
        "totalClockedOut": total_clocked_out
    }

def Get_Total_Working_Hours(email: str):
    # Get today's date
    today = date.today()
    db = get_database_connection()
    cursor = db.cursor(dictionary=True)

    # Fetch clock-in and clock-out times for the specified email for today
    query_today = "SELECT type, time FROM attendance WHERE email = %s AND date = %s"
    cursor.execute(query_today, (email, today))
    rows_today = cursor.fetchall()

    total_working_hours_today = 0
    last_clock_in_time_today = None

    # Calculate total working hours for today
    for row in rows_today:
        entry_type = row["type"]
        entry_time = row["time"]

        if entry_type == "in":
            last_clock_in_time_today = entry_time
        elif entry_type == "out" and last_clock_in_time_today is not None:
            time_difference = entry_time - last_clock_in_time_today
            total_working_hours_today += time_difference.seconds / 3600  # Convert seconds to hours
            last_clock_in_time_today = None

    # Calculate total time for today
    if total_working_hours_today > 8.5:
        overtime_minutes = (total_working_hours_today - 8.5) * 60  # Convert overtime hours to minutes
        overtime_hours = int(overtime_minutes // 60)
        overtime_minutes = int(overtime_minutes % 60)
        total_hours_today = 8.5
    else:
        overtime_hours = 0
        overtime_minutes = 0
        total_hours_today = total_working_hours_today

    # Fetch clock-in and clock-out times for the specified email for the entire week
    start_of_week = today - timedelta(days=today.weekday())  # Monday of the current week
    end_of_week = start_of_week + timedelta(days=6)  # Sunday of the current week
    query_week = "SELECT type, time FROM attendance WHERE email = %s AND date BETWEEN %s AND %s"
    cursor.execute(query_week, (email, start_of_week, end_of_week))
    rows_week = cursor.fetchall()

    total_working_hours_week = 0
    last_clock_in_time_week = None

    # Calculate total working hours for the week (excluding today)
    for row in rows_week:
        entry_type = row["type"]
        entry_time = row["time"]

        if entry_type == "in":
            last_clock_in_time_week = entry_time
        elif entry_type == "out" and last_clock_in_time_week is not None:
            time_difference = entry_time - last_clock_in_time_week
            total_working_hours_week += time_difference.seconds / 3600  # Convert seconds to hours
            last_clock_in_time_week = None

    # Calculate total time for the week
    if total_working_hours_week > 42.5:
        total_hours_week = 42.5
    else:
        total_hours_week = total_working_hours_week

    # Fetch clock-in and clock-out times for the specified email for the entire month
    first_day_of_month = today.replace(day=1)
    last_day_of_month = today.replace(day=1, month=today.month % 12 + 1,
                                      year=today.year if today.month < 12 else today.year + 1) - timedelta(days=1)
    query_month = "SELECT type, time FROM attendance WHERE email = %s AND date BETWEEN %s AND %s"
    cursor.execute(query_month, (email, first_day_of_month, last_day_of_month))
    rows_month = cursor.fetchall()

    total_working_hours_month = 0
    last_clock_in_time_month = None

    # Calculate total working hours for the month
    for row in rows_month:
        entry_type = row["type"]
        entry_time = row["time"]

        if entry_type == "in":
            last_clock_in_time_month = entry_time
        elif entry_type == "out" and last_clock_in_time_month is not None:
            time_difference = entry_time - last_clock_in_time_month
            total_working_hours_month += time_difference.seconds / 3600  # Convert seconds to hours
            last_clock_in_time_month = None

    # Calculate total time for the month
    if total_working_hours_month > total_working_hours_week:
        total_hours_month = total_working_hours_month
    else:
        total_hours_month = total_working_hours_week  # Assuming total hours for month same as week for now

    # Calculate overtime for the week
    overtime_week = max(total_working_hours_week - 40, 0)

    # Calculate total working hours for the month (assuming this function is defined elsewhere)
    total_working_month = calculate_working_hours_for_month(date.today())

    # Close cursor and database connection
    cursor.close()
    db.close()

    return {
        "email": email,
        "today": {'hours': round(total_hours_today, 2), 'totalHours': 8.5},
        "overtime": {'hours': overtime_hours, 'minutes': overtime_minutes},
        "thisWeek": {'hours': round(total_hours_week, 2), 'totalHours': 42.5},
        "thisMonth": {'hours': round(total_hours_month, 2), 'totalHours': total_working_month},
        "weekOvertime": {'hours': int(overtime_week), 'minutes': int((overtime_week - int(overtime_week)) * 60)}
    }






def calculate_working_hours_for_month(today, working_hours_per_day=8.5):
    year = today.year
    month = today.month

    # Get the number of days in the given month
    num_days_in_month = calendar.monthrange(year, month)[1]

    # Initialize total working hours
    total_working_hours = 0

    # Loop through each day of the month
    for day in range(1, num_days_in_month + 1):
        # Create a datetime object for the current day
        current_day = datetime(year, month, day)

        # Check if it's a weekday (Monday to Friday)
        if current_day.weekday() < 5:  # Monday is 0, Friday is 4
            total_working_hours += working_hours_per_day

    return total_working_hours

def Get_Total_Working_Hours_And_Minutes(email: str):
    # Get today's date
    today = date.today()
    db = get_database_connection()
    cursor = db.cursor(dictionary=True)

    # Fetch clock-in and clock-out times for the specified email for today
    query = "SELECT type, time FROM attendance WHERE email = %s AND date = %s"
    cursor.execute(query, (email, today))
    rows = cursor.fetchall()

    total_working_hours = 0
    last_clock_in_time = None

    # Calculate total working hours
    for row in rows:
        entry_type = row["type"]
        entry_time = row["time"]

        if entry_type == "in":
            last_clock_in_time = entry_time
        elif entry_type == "out" and last_clock_in_time is not None:
            time_difference = entry_time - last_clock_in_time
            total_working_hours += time_difference.seconds / 3600  # Convert seconds to hours
            last_clock_in_time = None


    total_working_hours=round(total_working_hours,2)
    total_working_minutes=(total_working_hours-(int(total_working_hours)))*60
    return {"remainingTime":f"{int(total_working_hours)}:{int(total_working_minutes)}"}




def Female_Male_Ratio():
    db=get_database_connection()
    cursor=db.cursor()
    cursor.execute("select count(Employee_id) from registration_details")
    result=cursor.fetchone()
    total=result[0]
    cursor.execute("select count(Employee_id) from registration_details where gender='Male'")
    result_1=cursor.fetchone()
    male=result_1[0]
    cursor.execute("select count(Employee_id) from registration_details where gender='Female'")
    result_2=cursor.fetchone()
    female=result_2[0]

    return{'maleClockedInCount':male,
           'femaleClockedInCount':female,
           'Total':total}



User

def Department_Wise_Clock_In():
    db=get_database_connection()
    cursor=db.cursor()
    cursor.execute("select distinct(id) from attendance where date=%s",(date.today(),))
    result=cursor.fetchall()
    cursor.execute("select distinct(department) from registration_details")
    result_2=cursor.fetchall()
    l1=[]
    m=len(result_2)
    for k in range(0,m):
        l1.append(result_2[k][0])

    n=len(result)
    l=[]
    d={}
    for i in range(0,n):
        cursor.execute("SELECT department,type FROM attendance WHERE id = %s AND date = %s ORDER BY time DESC LIMIT 1",(result[i][0],date.today()))
        result_1=cursor.fetchall()
        if result_1[0][1]=='in':
            l.append(result_1[0][0])

    occurrences = Counter(l)
    for department, count in occurrences.items():
        d[department]=count

    for j in l1:
        if j not in d.keys():
            d[j]=0

    names=[]
    counts=[]
    for i,j in d.items():
        names.append(i)
        counts.append(j)


    return{'department':{'name':names,
           'count':counts}}



#
def Get_Names_Outside_Office():
    db = get_database_connection()
    cursor = db.cursor()
    cursor.execute("SELECT distinct(id) FROM attendance WHERE date = %s", (date.today(),))
    result = cursor.fetchall()
    l = []
    for row in result:
        cursor.execute("SELECT type, first_name, last_name FROM attendance WHERE id = %s AND date = %s ORDER BY time DESC LIMIT 1", (row[0], date.today()))
        result_1 = cursor.fetchone()  # Use fetchone() instead of fetchall()
        if result_1 and result_1[0] == 'out':  # Check if result_1 is not None before accessing its elements
            name = f"{result_1[1]} {result_1[2]}"
            l.append(name)
    cursor.close()
    db.close()
    return {'names': l}


def Get_Names_On_Leaves():
    db = get_database_connection()
    cursor = db.cursor()
    cursor.execute("SELECT distinct(Employee_id) FROM registration_details")
    result = cursor.fetchall()
    l = []
    v=[]
    p=[]
    cursor.execute("select distinct(id) from attendance where date=%s",(date.today(),))
    result_1=cursor.fetchall()
    n=len(result)
    m=len(result_1)
    for i in range(0,n):
        l.append(result[i][0])
    for j in range(0,m):
        v.append(result_1[j][0])
    for k in l:
        if k not in v:
            cursor.execute("select first_name,last_name from registration_details where Employee_id=%s",(k,))
            result_2=cursor.fetchall()
            name=f"{result_2[0][0]} {result_2[0][1]}"
            p.append(name)

    return{'names':p}


def get_dates():
    today = datetime.today()

    # Calculate the start date of the current month
    start_of_month = today.replace(day=1)

    # Calculate the end date of the current month
    next_month = today.replace(day=28) + timedelta(days=4)
    end_of_month = next_month - timedelta(days=next_month.day)

    # Initialize an empty list to store the dates
    month_dates = []

    # Iterate over the days of the month
    current_date = start_of_month
    while current_date <= end_of_month:
        # Check if the current day is not Saturday (5) or Sunday (6)
        if current_date.weekday() < 5:  # Monday to Friday
            # Format the date in yyyy-mm-dd format and append to the list
            month_dates.append(current_date.strftime('%Y-%m-%d'))
        # Move to the next day
        current_date += timedelta(days=1)

    # Print the list of dates
    return month_dates




def get_dates_this_month():
    today = datetime.today()

    # Calculate the start date of the current month
    start_of_month = today.replace(day=1)

    # Calculate the end date of the current month
    next_month = today.replace(day=28) + timedelta(days=4)
    end_of_month = next_month - timedelta(days=next_month.day)

    # Initialize an empty list to store the dates
    month_dates = []

    # Iterate over the days of the month
    current_date = start_of_month
    while current_date <= end_of_month:
        # Check if the current day is not Saturday (5) or Sunday (6)
        if current_date.weekday() < 5:  # Monday to Friday
            # Format the date in yyyy-mm-dd format and append to the list
            month_dates.append(current_date.strftime('%Y-%m-%d'))
        # Move to the next day
        current_date += timedelta(days=1)

    return month_dates



def create_bar_graph(data, fullname,filename):

    keys = list(data.keys())
    values = list(data.values())

    plt.figure(figsize=(10, 6))  # Adjust figure size to accommodate all date labels

    plt.bar(keys, values, color='#00224D')
    plt.xlabel('Dates')
    plt.ylabel('Working Hours')
    plt.title(fullname)

    plt.xticks(keys, keys)  # Set tick labels explicitly to display all dates without rotation

    plt.tight_layout()  # Adjust layout to prevent clipping of labels
    #plt.show()
    plt.savefig(f"barplot_{filename}.png")
def get_clock_ins_for_week(fullname: str):
    db = get_database_connection()
    cursor = db.cursor()
    r = fullname.split(" ")
    fname = r[0]
    lname = r[1]
    d = {}
    date = get_dates()
    for i in date:
        cursor = db.cursor(dictionary=True)

        # Fetch clock-in and clock-out times for the specified email for today
        query = "SELECT type, time FROM attendance WHERE first_name = %s AND last_name=%s AND date = %s"
        cursor.execute(query, (fname,lname, i))
        rows = cursor.fetchall()

        total_working_hours = 0
        last_clock_in_time = None

        # Calculate total working hours
        for row in rows:
            entry_type = row["type"]
            entry_time = row["time"]

            if entry_type == "in":
                last_clock_in_time = entry_time
            elif entry_type == "out" and last_clock_in_time is not None:
                time_difference = entry_time - last_clock_in_time
                total_working_hours += time_difference.seconds / 3600  # Convert seconds to hours
                last_clock_in_time = None
        date_obj = datetime.strptime(i, "%Y-%m-%d")
        day_only = date_obj.day
        d[day_only]=total_working_hours
    # return d
    current_time = datetime.now()
    time_str = current_time.strftime('%H:%M')
    name=f"{fullname}_{time_str}"
    create_bar_graph(d,fullname,name)
    with open(f'barplot_{name}.png','rb') as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
    return {'image':encoded_string}


def Data_For_Testing():
    dates=get_dates_this_month()
    db=get_database_connection()
    cursor=db.cursor()
    for i in dates:
        cursor.execute(
            "INSERT INTO attendance (id, date, first_name, last_name, email, department, time, type, status) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
            ('12', i, 'Pavan', 'Mehta', 'pavanmehta.ecommerce@gmail.com', 'UI/UX','9:30:13', "in", "1"))
        db.commit()
        cursor.execute(
            "INSERT INTO attendance (id, date, first_name, last_name, email, department, time, type, status) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
            ('12', i, 'Pavan', 'Mehta', 'pavanmehta.ecommerce@gmail.com', 'UI/UX', '18:28:13', "out", "0"))
        db.commit()
    return "Data inserted successfully"


def clock_in(email:str):
    db = get_database_connection()
    cursor = db.cursor()
    cursor.execute("SELECT time FROM attendance WHERE email = %s AND date = %s and type='in' ORDER BY time DESC LIMIT 1",(email,date.today()))
    result=cursor.fetchone()
    total_seconds = result[0].total_seconds()
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60
    formatted_time_1 = "{:02}:{:02}:{:02}".format(int(hours), int(minutes), int(seconds))
    return {'clockTime':formatted_time_1}


def clock_out(email:str):
    db = get_database_connection()
    cursor = db.cursor()
    cursor.execute("SELECT time FROM attendance WHERE email = %s AND date = %s and type='out' ORDER BY time DESC LIMIT 1",(email,date.today()))
    result=cursor.fetchone()
    total_seconds = result[0].total_seconds()
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60
    formatted_time_1 = "{:02}:{:02}:{:02}".format(int(hours), int(minutes), int(seconds))
    return {'clockTime':formatted_time_1}



























    


