import os
import uuid
from typing import Any
from datetime import datetime, timedelta

from flask import Flask, jsonify, request
from flask_cors import CORS
from flasgger import Swagger, swag_from
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash

from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
)

# ---------------------------
# Setup
# ---------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
CORS(app)
Swagger(app)

# Config
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'jobportal.db')}"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# JWT config
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

# DB init
db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)


# ---------------------------
# Models
# ---------------------------
class TimestampMixin:
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )


class User(db.Model, TimestampMixin):
    __tablename__ = "users"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    applications = db.relationship(
        "Application", back_populates="user", cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }


class Job(db.Model, TimestampMixin):
    __tablename__ = "jobs"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(200), nullable=False)
    company = db.Column(db.String(200), nullable=True)
    location = db.Column(db.String(200), nullable=True)
    description = db.Column(db.Text, nullable=True)
    is_bookmarked = db.Column(db.Boolean, default=False, nullable=False)

    applications = db.relationship(
        "Application", back_populates="job", cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "company": self.company,
            "location": self.location,
            "description": self.description,
            "isBookmarked": self.is_bookmarked,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }


class Application(db.Model, TimestampMixin):
    __tablename__ = "applications"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    status = db.Column(db.String(50), default="submitted", nullable=False)

    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    job_id = db.Column(db.String(36), db.ForeignKey("jobs.id"), nullable=False)

    user = db.relationship("User", back_populates="applications")
    job = db.relationship("Job", back_populates="applications")

    def to_dict(self):
        return {
            "id": self.id,
            "status": self.status,
            "userId": self.user_id,
            "jobId": self.job_id,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }


# ---------------------------
# Routes
# ---------------------------
@app.route("/", methods=["GET"])
def home():
    return {"message": "✅ Job Portal API is running. Visit /apidocs for docs."}, 200


# --- USERS ---
@app.route("/api/users/register", methods=["POST"])
@swag_from(os.path.join(BASE_DIR, "swagger", "users.yml"), methods=["GET", "POST"])
def register_user():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not all([username, email, password]):
        return jsonify({"error": "username, email, and password are required"}), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({"error": "username or email already exists"}), 409

    user = User(
        username=username, email=email, password_hash=generate_password_hash(password)
    )
    db.session.add(user)
    db.session.commit()

    return jsonify(user.to_dict()), 201


@app.route("/api/users/login", methods=["POST"])
@swag_from(os.path.join(BASE_DIR, "swagger", "users.yml"), methods=["GET", "POST"])
def login_user():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    identifier = data.get("identifier")  # email or username
    password = data.get("password")

    if not all([identifier, password]):
        return jsonify({"error": "identifier and password are required"}), 400

    # Debug prints
    print("Identifier received:", identifier)
    print("Password received:", password)

    # Query by email OR username
    user = User.query.filter((User.email == identifier) | (User.username == identifier)).first()
    if not user:
        print("No user found with this identifier")
        return jsonify({"error": "invalid identifier"}), 401

    # Check password
    if not check_password_hash(user.password_hash, password):
        print("Password mismatch for user:", user.username)
        return jsonify({"error": "invalid password"}), 401

    # Successful login
    access_token = create_access_token(identity=user.id)
    print("Login successful for user:", user.username)
    return jsonify({"token": access_token, "user": user.to_dict()}), 200


@app.route("/api/profile", methods=["GET"])
@swag_from(os.path.join(BASE_DIR, "swagger", "users.yml"), methods=["GET", "POST"])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "user not found"}), 404
    return jsonify(user.to_dict()), 200


# --- JOBS ---
@app.route("/api/jobs/", methods=["GET"])
@swag_from(os.path.join(BASE_DIR, "swagger", "jobs_get.yml"))
def get_jobs():
    jobs = Job.query.order_by(Job.created_at.desc()).all()
    return jsonify([j.to_dict() for j in jobs]), 200


@app.route("/api/jobs/", methods=["POST"])
@swag_from(os.path.join(BASE_DIR, "swagger", "jobs_post.yml"), methods=["POST"])
@jwt_required()
def create_job():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    title = data.get("title")
    if not title:
        return jsonify({"error": "title is required"}), 400

    job = Job(
        title=title,
        company=data.get("company"),
        location=data.get("location"),
        description=data.get("description"),
    )
    db.session.add(job)
    db.session.commit()
    return jsonify(job.to_dict()), 201


@app.route("/api/jobs/<job_id>/bookmark", methods=["PUT"])
@swag_from(os.path.join(BASE_DIR, "swagger", "jobs_put.yml"), methods=["PUT"])
@jwt_required()
def toggle_bookmark(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    job.is_bookmarked = not job.is_bookmarked
    db.session.commit()
    return jsonify(job.to_dict()), 200


# --- APPLICATIONS ---
@app.route("/api/applications/", methods=["GET"])
@swag_from(os.path.join(BASE_DIR, "swagger", "applications_get.yml"))
@jwt_required()
def get_applications():
    apps = Application.query.order_by(Application.created_at.desc()).all()
    return jsonify([a.to_dict() for a in apps]), 200


@app.route("/api/applications/", methods=["POST"])
@swag_from(os.path.join(BASE_DIR, "swagger", "applications_post.yml"), methods=["POST"])
@jwt_required()
def create_application():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    user_id = data.get("userId")
    job_id = data.get("jobId")

    if not all([user_id, job_id]):
        return jsonify({"error": "userId and jobId are required"}), 400

    user = User.query.get(user_id)
    job = Job.query.get(job_id)
    if not user or not job:
        return jsonify({"error": "Invalid userId or jobId"}), 400

    app_row = Application(
        user_id=user_id, job_id=job_id, status=data.get("status", "submitted")
    )
    db.session.add(app_row)
    db.session.commit()
    return jsonify(app_row.to_dict()), 201


# --- UTIL ---
@app.route("/ping", methods=["GET"])
def ping():
    return {"message": "pong"}, 200


# ---------------------------
# Run
# ---------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
