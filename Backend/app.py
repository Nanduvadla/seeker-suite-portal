from flask import Flask, jsonify, request
from flasgger import Swagger, swag_from
from flask_cors import CORS
import uuid

import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
CORS(app)

from flasgger import Swagger
swagger = Swagger(app)

# In-memory data
jobs = []
users = []
applications = []

# --- HOME ROUTE ---
@app.route("/", methods=["GET"])
def home():
    return {"message": "✅ Job Portal API is running. Visit /apidocs for documentation."}, 200


# --- JOBS ---
@app.route("/api/jobs/", methods=["GET"])
@swag_from(os.path.join(BASE_DIR, "swagger", "jobs_get.yml"))
def get_jobs():
    return jsonify(jobs), 200

@app.route("/api/jobs/", methods=["POST"])
@swag_from(os.path.join(BASE_DIR, "swagger", "jobs_post.yml"), methods=["POST"])
def create_job():
    job = request.json
    job["id"] = str(uuid.uuid4())
    job["isBookmarked"] = False
    jobs.append(job)
    return jsonify(job), 201

@app.route("/api/jobs/<job_id>/bookmark", methods=["PUT"])
@swag_from(os.path.join(BASE_DIR, "swagger", "jobs_put.yml"), methods=["PUT"])
def toggle_bookmark(job_id):
    for job in jobs:
        if job["id"] == job_id:
            job["isBookmarked"] = not job["isBookmarked"]
            return jsonify(job), 200
    return jsonify({"error": "Job not found"}), 404


# --- USERS ---
@app.route("/api/users/", methods=["GET", "POST"])
@swag_from(os.path.join(BASE_DIR, "swagger/users.yml"), methods=["GET", "POST"])
def users_route():
    if request.method == "GET":
        # Optional query filters
        username = request.args.get("username")
        email = request.args.get("email")
        filtered_users = [
            u for u in users if
            (not username or u["username"] == username) and
            (not email or u["email"] == email)
        ]
        return jsonify(filtered_users), 200

    elif request.method == "POST":
        data = request.json
        user = {
            "id": str(uuid.uuid4()),
            "username": data["username"],
            "email": data["email"],
            "password": data["password"]  # ⚠️ plain text for demo
        }
        users.append(user)
        return jsonify(user), 201


# --- APPLICATIONS ---
@app.route("/api/applications/", methods=["GET"])
@swag_from(os.path.join(BASE_DIR, "swagger", "applications_get.yml"))
def get_applications():
    return jsonify(applications), 200

@app.route("/api/applications/", methods=["POST"])
@swag_from(os.path.join(BASE_DIR, "swagger", "applications_post.yml"), methods=["POST"])
def create_application():
    app_data = request.json
    app_data["id"] = str(uuid.uuid4())
    app_data["status"] = "submitted"
    applications.append(app_data)
    return jsonify(app_data), 201

@app.route('/ping', methods=['GET'])
def ping():
    """
    A simple test endpoint
    ---
    tags:
      - Test
    responses:
      200:
        description: Pong response
        examples:
          application/json: { "message": "pong" }
    """
    return {"message": "pong"}, 200


if __name__ == "__main__":
   app.run(host="0.0.0.0", port=5000, debug=True)
