from django.urls import path
from .views import *
from . import views

urlpatterns = [
    path('api/signup/', signup, name='signup'),
    path('api/login/', login, name='login'),
    path('api/request-email-otp/', views.request_email_otp, name='request_email_otp'),
    path('api/verify-email-otp/', views.verify_email_otp, name='verify_email_otp'),
    path('api/request-password-reset-otp/', views.request_password_reset_otp, name='request_password_reset_otp'),  # Added trailing slash
    path('api/verify-password-reset-otp/', views.verify_password_reset_otp, name='verify_password_reset_otp'),
    path('api/reset-password/', views.reset_password, name='reset_password'), 
    path('api/create-post/', views.create_post, name='create_post'),
    path('api/get-posts/', views.get_posts, name='get_posts'),
    path('api/delete-post/', views.delete_post, name='delete_post'),
    path('api/reset-password/', views.reset_password, name='reset_password'),
    path('api/profile/', views.profile, name="profile"),
    # path('api/friend-request/', views.friend_request, name="friend_request"),
    # path('api/accept-friend-request/', views.accept_friend_request, name="accept_friend_request"),
    # path('api/reject-friend-request/', views.reject_friend_request, name="reject_friend_request"),
    # path('api/get-friends/', views.get_friends, name="get_friends"),
    path("api/unfollow-user/",views.unfollow_user,name="unfollow"),
    path("api/accept-friend-request/",views.accept_friend_request,name="accept_friend_request"),
    path("api/send-friend-request/",views.send_friend_request,name="send_friend_request"),
    path("api/search-user/",views.search_user,name="search_user"),
]
