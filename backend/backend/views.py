import pymongo
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import random
import string
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from django.contrib.auth.hashers import make_password


MONGO_URI = "mongodb+srv://lochana:lochana@cluster0.38afr.mongodb.net/"
try:
    client = pymongo.MongoClient(MONGO_URI)
    db = client['Project']  # Database name
    collectionsignup = db['test']  # Signup data collection
    otp_collection = db['otp_storage']  # New collection for OTP storage
except Exception as e:
    raise ConnectionError(f"Failed to connect to MongoDB: {e}")

EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_HOST_USER = "lochana.t.ihub@snsgroups.com"  
EMAIL_HOST_PASSWORD = "zeuz ybit tjgt prus"  
EMAIL_USE_TLS = True


def generate_otp():
    """Generate a 6-digit OTP"""
    return ''.join(random.choices(string.digits, k=6))

def send_email_otp(to_email, otp):
    """Send OTP via email"""
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_HOST_USER
        msg['To'] = to_email
        msg['Subject'] = "Your OTP for Email Verification"

        body = f"""
        Your OTP for email verification is: {otp}
        
        This OTP will expire in 5 minutes.
        
        If you didn't request this OTP, please ignore this email.
        """

        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()
        server.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False

@csrf_exempt
def request_email_otp(request):
    """Handle email OTP generation and sending"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')

            if not email:
                return JsonResponse({"error": "Email is required."}, status=400)

            # Generate OTP
            otp = generate_otp()
            
            # Store OTP with expiration time (5 minutes from now)
            expiration_time = datetime.utcnow() + timedelta(minutes=5)
            
            # Update or insert OTP document
            otp_collection.update_one(
                {"email": email},
                {
                    "$set": {
                        "otp": otp,
                        "expiration_time": expiration_time
                    }
                },
                upsert=True
            )

            # Send OTP via email
            if send_email_otp(email, otp):
                return JsonResponse({"message": "OTP sent successfully"}, status=200)
            else:
                return JsonResponse({"error": "Failed to send OTP"}, status=500)

        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def verify_email_otp(request):
    """Handle email OTP verification"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            submitted_otp = data.get('otp')

            if not email or not submitted_otp:
                return JsonResponse({"error": "Email and OTP are required."}, status=400)

            # Find the stored OTP document
            otp_doc = otp_collection.find_one({"email": email})

            if not otp_doc:
                return JsonResponse({"error": "No OTP found for this email."}, status=400)

            stored_otp = otp_doc.get('otp')
            expiration_time = otp_doc.get('expiration_time')

            # Check if OTP has expired
            if datetime.utcnow() > expiration_time:
                return JsonResponse({"error": "OTP has expired."}, status=400)

            # Verify OTP
            if submitted_otp != stored_otp:
                return JsonResponse({"error": "Invalid OTP."}, status=400)

            # Delete the used OTP
            otp_collection.delete_one({"email": email})

            return JsonResponse({"message": "Email verified successfully"}, status=200)

        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            required_fields = ["firstName", "email", "password", "confirmPassword"]
            for field in required_fields:
                if not data.get(field):
                    return JsonResponse({"error": f"{field} is required."}, status=400)

            if data.get("password") != data.get("confirmPassword"):
                return JsonResponse({"error": "Passwords do not match."}, status=400)

            hashed_password = make_password(data.get("password"))

            user_data = {
                "first_name": data.get("firstName"),
                "last_name": data.get("lastName"),
                "email": data.get("email"),
                "phone": data.get("phone"),
                "password": hashed_password,
            }

            collectionsignup.insert_one(user_data)

            return JsonResponse({"message": "User signed up successfully!"}, status=201)
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method. Use POST."}, status=405)

@csrf_exempt
def login(request):
    # Existing login function remains the same
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            if not email or not password:
                return JsonResponse({"error": "Email and password are required."}, status=400)

            user = collectionsignup.find_one({"email": email})

            if not user:
                return JsonResponse({"error": "User not found or email is incorrect."}, status=404)

            if user.get("password") != password:
                return JsonResponse({"error": "Invalid password."}, status=401)

            response_data = {
                "message": "Login successful!",
                "user": {
                    "id": str(user.get("_id")),
                    "email": user.get("email"),
                    "first_name": user.get("first_name"),
                    "last_name": user.get("last_name"),
                },
            }

            return JsonResponse(response_data, status=200)

        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid request method. Use POST."}, status=405)


@csrf_exempt
def request_password_reset_otp(request):
    """Handle email OTP generation and sending"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')

            if not email:
                return JsonResponse({"error": "Email is required."}, status=400)

            # Generate OTP
            otp = generate_otp()
            
            # Store OTP with expiration time (5 minutes from now)
            expiration_time = datetime.utcnow() + timedelta(minutes=5)
            
            # Update or insert OTP document
            otp_collection.update_one(
                {"email": email},
                {
                    "$set": {
                        "otp": otp,
                        "expiration_time": expiration_time
                    }
                },
                upsert=True
            )

            # Send OTP via email
            if send_email_otp(email, otp):
                return JsonResponse({"message": "OTP sent successfully"}, status=200)
            else:
                return JsonResponse({"error": "Failed to send OTP"}, status=500)

        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def verify_password_reset_otp(request):
    """Handle email OTP verification"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            submitted_otp = data.get('otp')

            if not email or not submitted_otp:
                return JsonResponse({"error": "Email and OTP are required."}, status=400)

            # Find the stored OTP document
            otp_doc = otp_collection.find_one({"email": email})

            if not otp_doc:
                return JsonResponse({"error": "No OTP found for this email."}, status=400)

            stored_otp = otp_doc.get('otp')
            expiration_time = otp_doc.get('expiration_time')

            # Check if OTP has expired
            if datetime.utcnow() > expiration_time:
                return JsonResponse({"error": "OTP has expired."}, status=400)

            # Verify OTP
            if submitted_otp != stored_otp:
                return JsonResponse({"error": "Invalid OTP."}, status=400)

            # Delete the used OTP
            otp_collection.delete_one({"email": email})

            return JsonResponse({"message": "Email verified successfully"}, status=200)

        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def reset_password(request):
    """Handle password reset"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            new_password = data.get('newPassword')

            if not email or not new_password:
                return JsonResponse({"error": "Email and new password are required."}, status=400)

            # Update the password in the database
            result = collectionsignup.update_one(
                {"email": email},
                {"$set": {"password": new_password}}
            )

            if result.modified_count == 0:
                return JsonResponse({"error": "User not found."}, status=404)

            return JsonResponse({"message": "Password reset successfully"}, status=200)

        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)
