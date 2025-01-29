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
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password, check_password
from bson.objectid import ObjectId
from django.core.paginator import Paginator


MONGO_URI = "mongodb+srv://lochana:lochana@cluster0.38afr.mongodb.net/"
try:
    client = pymongo.MongoClient(MONGO_URI)
    db = client['Project']
    collectionsignup = db['test'] 
    otp_collection = db['otp_storage']  
    post_collection = db['post']
    friends_collection = db['friends']
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


# @csrf_exempt  
# def get_posts(request):
#     if request.method != 'GET':
#         return JsonResponse({'error': 'Only GET requests are allowed'}, status=405)

#     if not request.user.is_authenticated:
#         return JsonResponse({'error': 'User is not authenticated'}, status=401)

#     try:
#         my_user = get_user_model().objects.get(username=request.user.username)
#     except get_user_model().DoesNotExist:
#         return JsonResponse({'error': 'User does not exist'}, status=404)

#     posts = list(post_collection.find().sort('created_at', -1))

#     page_number = request.GET.get('page', 1) 
#     paginator = Paginator(posts, 10) 
#     page_obj = paginator.get_page(page_number)

#     data = []
#     for post in page_obj:
#         new_post = {
#             'id': str(post['_id']),  
#             'content': post.get('content', ''),
#             'likes': post.get('likes', []), 
#             'created_at': post.get('created_at', ''),  
#             'liked': my_user.username in post.get('likes', [])  
#         }
#         data.append(new_post)

#     return JsonResponse({
#         'data': data,
#         'page': page_obj.number,
#         'has_next': page_obj.has_next(),
#         'has_previous': page_obj.has_previous(),
#         'total_pages': paginator.num_pages,
#         'total_items': paginator.count
#     })

@csrf_exempt
def request_email_otp(request):
    """Handle email OTP generation and sending"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')

            if not email:
                return JsonResponse({"error": "Email is required."}, status=400)

            otp = generate_otp()
            
            expiration_time = datetime.now() + timedelta(minutes=5)
            
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

            otp_doc = otp_collection.find_one({"email": email})

            if not otp_doc:
                return JsonResponse({"error": "No OTP found for this email."}, status=400)

            stored_otp = otp_doc.get('otp')
            expiration_time = otp_doc.get('expiration_time')

            if datetime.now() > expiration_time:
                return JsonResponse({"error": "OTP has expired."}, status=400)

            
            if submitted_otp != stored_otp:
                return JsonResponse({"error": "Invalid OTP."}, status=400)

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

            required_fields = ["name", "email", "password", "confirmPassword", "username"]
            for field in required_fields:
                if not data.get(field):
                    return JsonResponse({"error": f"{field} is required."}, status=400)

            if data.get("password") != data.get("confirmPassword"):
                return JsonResponse({"error": "Passwords do not match."}, status=400)

            
            username = data.get("username")
            email = data.get("email")

            if collectionsignup.find_one({"email": email}):
                return JsonResponse({"error": "Email has already been used."}, status=400)

            if collectionsignup.find_one({"username": username}):
                return JsonResponse({"error": "Username has already been used."}, status=400)

            hashed_password = make_password(data.get("password"))
            collectionsignup.insert_one({
                "name": data.get("name"),
                "email": email,
                "username": username,
                "password": hashed_password
            })

            return JsonResponse({"message": "User signed up successfully!"}, status=201)
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method. Use POST."}, status=405)

@csrf_exempt
def login(request):
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
        
            if user.get("is_locked"):
                lock_time = user.get("lock_time")
                if lock_time and datetime.now() > lock_time + timedelta(minutes=5):
                    collectionsignup.update_one({"email": email}, {"$set": {"is_locked": False, "failed_attempts": 0}})
                else:
                    return JsonResponse({"error": "Account is locked due to too many failed login attempts. Try again later."}, status=403)
                
            hashed_password = user["password"]

            if not check_password(password, hashed_password):

                failed_attempts = user.get("failed_attempts", 0) + 1
                if failed_attempts >= 5:
                    collectionsignup.update_one({"email": email}, {"$set": {"is_locked": True, "lock_time": datetime.now()}})
                    return JsonResponse({"error": "Account is locked due to too many failed login attempts. Try again later."}, status=403)
                else:
                    collectionsignup.update_one({"email": email}, {"$set": {"failed_attempts": failed_attempts}})
                    return JsonResponse({"error": "Incorrect password."}, status=401)

            collectionsignup.update_one({"email": email}, {"$set": {"failed_attempts": 0}})

            response_data = {
                "message": "Login successful!",
                "user": {
                    "id": str(user.get("_id")),
                    "email": user.get("email"),
                    "name": user.get("name"),
                    "username": user.get("username"),
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

            otp = generate_otp()
            
            expiration_time = datetime.now() + timedelta(minutes=5)
            
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

            otp_doc = otp_collection.find_one({"email": email})

            if not otp_doc:
                return JsonResponse({"error": "No OTP found for this email."}, status=400)

            stored_otp = otp_doc.get('otp')
            expiration_time = otp_doc.get('expiration_time')

            if datetime.now() > expiration_time:
                return JsonResponse({"error": "OTP has expired."}, status=400)

            if submitted_otp != stored_otp:
                return JsonResponse({"error": "Invalid OTP."}, status=400)

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

@csrf_exempt
def create_post(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            required_fields = ["text","username"]
            for field in required_fields:
                if not data.get(field):
                    return JsonResponse({"error": f"{field} is required."}, status=400)
                
            post_data = {
                "text": data.get("text"),
                "image": data.get("image"),
                "username": data.get("username"),
                "created_at": datetime.now()
            }

            post_collection.insert_one(post_data)

            return JsonResponse({"message": "Post created successfully!"}, status=201)
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def get_posts(request):
    if request.method == 'GET':

        try:
            posts = list(post_collection.find())

            for post in posts:
                post['_id'] = str(post['_id'])

            # print(post)

            # if post.get('username'):
            #     print(post.get('username'))

            return JsonResponse({"posts": posts }, status=200)
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method. Use GET."}, status=405)

@csrf_exempt
def delete_post(request):
    if request.method == 'POST':
        try:
            print("Raw request body:", request.body)  # Debug log
            data = json.loads(request.body)
            print("Parsed data:", data)  # Debug log
            post_id = data.get("id")
            print("Extracted post_id:", post_id)  # Debug log

            if not post_id:
                return JsonResponse({"error": "Post ID is required."}, status=400)

            result = post_collection.delete_one({"_id": ObjectId(post_id)})

            if result.deleted_count == 0:
                return JsonResponse({"error": "Post not found."}, status=404)

            return JsonResponse({"message": "Post deleted successfully"}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid request method. Use POST."}, status=405)

@csrf_exempt
def profile(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username= data.get("username")

            if not username:
                return JsonResponse({"error": "username is required."}, status=400)

            user = collectionsignup.find_one({"username": username}, {"password": 0, "failed_attempts": 0, "is_locked": 0, "lock_time": 0})

            user['_id'] = str(user['_id'])

            if not user:
                return JsonResponse({"error": "User not found."}, status=404)

            posts = list(post_collection.find({"username": username}))
        
            for post in posts:
                post['_id'] = str(post['_id'])

            response_data = {
                "user": user,
                "post": posts,
                
            }

            return JsonResponse(response_data, status=200)

        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid request method. Use POST."}, status=405)

@csrf_exempt
def friend_request(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get("username")
            friend_username = data.get("friend_username")

            if not username or not friend_username:
                return JsonResponse({"error": "Username and friend's username are required."}, status=400)
            
            user = collectionsignup.find_one({"username": username})
            friend = collectionsignup.find_one({"username": friend_username})

            if not user:
                return JsonResponse({"error": "User not found."}, status=404)
            if not friend:
                return JsonResponse({"error": "Friend not found."}, status=404)
            
            result = collectionsignup.update_one(
                {"username": friend_username},
                {"$addToSet": {"friend_request": username}},
                # {"$set": {"friends": ""}},
            )

            if result.modified_count == 0:
                return JsonResponse({"error": "User not found."}, status=404)
            
            return JsonResponse({"message": "Friend request sent successfully"}, status=200)
        
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)
    
@csrf_exempt
def accept_friend_request(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get("username")
            friend_username = data.get("friend_username")

            if not username or not friend_username:
                return JsonResponse({"error": "Username and friend's username are required."}, status=400)
            
            user = collectionsignup.find_one({"username": username})
            friend = collectionsignup.find_one({"username": friend_username})

            if not user:
                return JsonResponse({"error": "User not found."}, status=404)
            if not friend:
                return JsonResponse({"error": "Friend not found."}, status=404)
            
            
            result = collectionsignup.update_one(
                {"username": friend_username},
                {"$addToSet": {"friends": username}},
                # {"$set": {"friend_request": ""}},
            )

            if result.modified_count == 0:
                return JsonResponse({"error": "User not found."}, status=404)
            
            return JsonResponse({"message": "Friend request accepted successfully"}, status=200)
        
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)
    
@csrf_exempt
def reject_friend_request(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get("username")
            friend_username = data.get("friend_username")

            if not username or not friend_username:
                return JsonResponse({"error": "Username and friend's username are required."}, status=400)
            
            user = collectionsignup.find_one({"username": username})
            friend = collectionsignup.find_one({"username": friend_username})

            if not user:
                return JsonResponse({"error": "User not found."}, status=404)
            if not friend:
                return JsonResponse({"error": "Friend not found."}, status=404)
            
            
            result = collectionsignup.update_one(
                {"username": username},
                {"$pull": {"friend_request": friend_username}},
                # {"$addToSet": {"friend_request": ""}}
            )

            if result.modified_count == 0:
                return JsonResponse({"error": "User not found."}, status=404)
            
            return JsonResponse({"message": "Friend request rejected successfully"}, status=200)
        
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
        
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)
    
@csrf_exempt
def get_friends(request):
    if request.method == 'GET':
        try:
            friends = list(collectionsignup.find({"friends": {"$ne": None}}, {"_id": 0, "password": 0, "failed_attempts": 0, "is_locked": 0, "lock_time": 0}))
            return JsonResponse({"friends": friends}, status=200)
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
        
        
@csrf_exempt
def search_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get("username")

            if not username:
                return JsonResponse({"error": "username is required."}, status=400)

            user = collectionsignup.find_one({"username": username}, {"_id": 0, "email": 0, "password": 0, "failed_attempts": 0, "is_locked": 0, "lock_time": 0})

            if not user:
                return JsonResponse({"error": "User not found."}, status=404)

            return JsonResponse({"user": user}, status=200)

        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)


