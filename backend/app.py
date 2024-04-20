from flask import Flask, request, jsonify, make_response
from flask_restful import Api, Resource
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Suppress tensorflow warnings

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

from transformers import pipeline
import jwt
import psycopg2
import hashlib

app = Flask(__name__)
CORS(app, supports_credentials = True)
api = Api(app)


# Load environment variables
load_dotenv()

db_url = os.getenv("SECRET_KEY")




# Load the summarization pipeline

summarization_pipeline = pipeline("summarization", model="Falconsai/medical_summarization")

# Connect to the database

def connect_to_db():
    try:
        conn = psycopg2.connect(db_url)
        return conn
    except Exception as e:
        print(e)
        return None

class PatientRegisterResource(Resource):
    def post(self):
        conn = connect_to_db()
        if conn is None:
            return make_response(jsonify({"error": "Failed to connect to the database"}), 500)

        cursor = conn.cursor()

        data = request.get_json()
        name = data.get("name")
        age = data.get("age")
        email = data.get("email")
        blood_group = data.get("blood_group")
        weight = data.get("weight")
        height = data.get("height")
        password = data.get("password")
        phone_number = data.get("phone_number")
        gender = data.get("gender")

        # Email clash check
        cursor.execute("SELECT * FROM patients WHERE email = %s", (email,))
        if cursor.fetchone() is not None:
            return make_response(jsonify({"error": "Email already exists"}), 400)



        pass_hash = hashlib.sha256(password.encode()).hexdigest()

        cursor.execute("""
            INSERT INTO patients (name, age, email, blood_group, weight, height, pass_hash, phone_number, gender)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING patient_id
        """, (name, age, email, blood_group, weight, height, pass_hash, phone_number, gender))
        UID = cursor.fetchone()[0]

        conn.commit()
        cursor.close()
        conn.close()

        return make_response(jsonify({"message": "Patient created successfully", "uid": UID}), 201)

class PatientLoginResource(Resource):
    def post(self):
        conn = connect_to_db()
        if conn is None:
            return make_response(jsonify({"error": "Failed to connect to the database"}), 500)

        cursor = conn.cursor()

        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        pass_hash = hashlib.sha256(password.encode()).hexdigest()

        cursor.execute("SELECT * FROM patients WHERE email = %s AND pass_hash = %s", (email, pass_hash))
        patient = cursor.fetchone()

        if patient is None:
            return make_response(jsonify({"error": "Invalid email or password"}), 401)

        # return uid with a patient logged in successfully message

        return make_response(jsonify({"message": "Patient logged in successfully", "patient_id": patient[0]}), 200)

class PatientDetailsResource(Resource):
    def get(self):
        conn = connect_to_db()
        if conn is None:
            return make_response(jsonify({"error": "Failed to connect to the database"}), 500)

        cursor = conn.cursor()

        patient_id = request.args.get("patient_id")

        cursor.execute("SELECT * FROM patients WHERE patient_id = %s", (patient_id, ))
        patient = cursor.fetchone()

        if patient is None:
            return make_response(jsonify({"error": "Invalid patient id"}), 401)

        # return all the patient details

        patient_details = {
            "patient_id": patient[0],
            "name": patient[1],
            "age": patient[2],
            "email": patient[3],
            "blood_group": patient[4],
            "weight": patient[5],
            "height": patient[6],
            "phone_number": patient[8],
            "gender": patient[9]
        }

        # return as a response

        return make_response(jsonify(patient_details), 200)

    def put(self):
        conn = connect_to_db()
        if conn is None:
            return make_response(jsonify({"error": "Failed to connect to the database"}), 500)

        cursor = conn.cursor()
        data = request.get_json()
        patient_id = data.get("patient_id")
        name = data.get("name")
        age = data.get("age")
        blood_group = data.get("blood_group")
        weight = data.get("weight")
        height = data.get("height")
        phone_number = data.get("phone_number")
        gender = data.get("gender")

        cursor.execute("SELECT * FROM patients WHERE patient_id = %s", (patient_id, ))
        patient = cursor.fetchone()

        if patient is None:
            return make_response(jsonify({"error": "Invalid patient id"}), 401)

        # return all the patient details

        cursor.execute("UPDATE patients SET name = %s, age = %s, blood_group = %s, weight = %s, height = %s, phone_number = %s, gender = %s WHERE patient_id = %s", (name, age, blood_group, weight, height, phone_number, gender, int(patient_id)))
        conn.commit()
        cursor.close()
        conn.close()

        # return as a response

        return make_response(jsonify({"message": "Patient details updated successfully", "patient_id": patient_id}), 200)

class DoctorRegisterResource(Resource):
    def post(self):
        conn = connect_to_db()
        if conn is None:
            return make_response(jsonify({"error": "Failed to connect to the database"}), 500)

        cursor = conn.cursor()

        data = request.get_json()
        name = data.get("name")
        email = data.get("email")
        specialization = data.get("specialization")
        password = data.get("password")
        phone_number = data.get("phone_number")

        # Email clash check
        cursor.execute("SELECT * FROM doctors WHERE email = %s", (email,))
        if cursor.fetchone() is not None:
            return make_response(jsonify({"error": "Email already exists"}), 400)

        pass_hash = hashlib.sha256(password.encode()).hexdigest()

        cursor.execute("""
            INSERT INTO doctors (name, email, specialization, pass_hash, phone_number)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING doctor_id
        """, (name, email, specialization, pass_hash, phone_number))
        UID = cursor.fetchone()[0]

        conn.commit()
        cursor.close()
        conn.close()

        return make_response(jsonify({"message": "Doctor created successfully", "uid": UID}), 201)

class DoctorLoginResource(Resource):
    def post(self):
        conn = connect_to_db()
        if conn is None:
            return make_response(jsonify({"error": "Failed to connect to the database"}), 500)

        cursor = conn.cursor()

        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        pass_hash = hashlib.sha256(password.encode()).hexdigest()

        cursor.execute("SELECT * FROM doctors WHERE email = %s AND pass_hash = %s", (email, pass_hash))
        doctor = cursor.fetchone()

        if doctor is None:
            return make_response(jsonify({"error": "Invalid email or password"}), 401)


        # return doctor id and logged in successfully message

        return make_response(jsonify({"message": "Doctor logged in successfully", "doctor_id": doctor[0]}), 200)

class DoctorDetailsResource(Resource):
    def get(self):
        conn = connect_to_db()
        if conn is None:
            return make_response(jsonify({"error": "Failed to connect to the database"}), 500)

        cursor = conn.cursor()

        doctor_id = request.args.get("doctor_id")

        cursor.execute("SELECT * FROM doctors WHERE doctor_id = %s", (doctor_id, ))
        doctor = cursor.fetchone()

        if doctor is None:
            return make_response(jsonify({"error": "Invalid doctor id"}), 401)

        # return all the doctor details

        doctor_details = {
            "doctor_id": doctor[0],
            "name": doctor[1],
            "email": doctor[2],
            "specialization": doctor[3],
            "phone_number": doctor[5]
        }

        # return as a response

        return make_response(jsonify(doctor_details), 200)
    
    def put(self):
        conn = connect_to_db()
        if conn is None:
            return make_response(jsonify({"error": "Failed to connect to the database"}), 500)

        cursor = conn.cursor()
        data = request.get_json()
        doctor_id = data.get("doctor_id")
        name = data.get("name")
        specialization = data.get("specialization")
        phone_number = data.get("phone_number")

        cursor.execute("SELECT * FROM doctors WHERE doctor_id = %s", (doctor_id, ))
        doctor = cursor.fetchone()

        if doctor is None:
            return make_response(jsonify({"error": "Invalid doctor id"}), 401)

        # return all the doctor details

        cursor.execute("UPDATE doctors SET name = %s, specialization = %s, phone_number = %s WHERE doctor_id = %s", (name, specialization, phone_number, int(doctor_id)))
        conn.commit()
        cursor.close()
        conn.close()

        # return as a response

        return make_response(jsonify({"message": "Doctor details updated successfully", "doctor_id": doctor_id}), 200)

class SummaryResource(Resource):
    def post(self):
        data = request.get_json()
        text = data.get("text")
        try:
            summary = summarization_pipeline(text, max_length=150, min_length=30, do_sample=False)
        except Exception as e:
            return make_response(jsonify({"error": "Failed to summarize the text"}), 500)

        return make_response(jsonify({"summary": summary[0]["summary_text"].capitalize()}), 200)


api.add_resource(PatientRegisterResource, "/patient/register")
api.add_resource(PatientLoginResource, "/patient/login")
api.add_resource(PatientDetailsResource, "/patient")
api.add_resource(DoctorRegisterResource, "/doctor/register")
api.add_resource(DoctorLoginResource, "/doctor/login")
api.add_resource(DoctorDetailsResource, "/doctor")
api.add_resource(SummaryResource, "/summary")

if __name__ == "__main__":
    app.run(debug = True)
