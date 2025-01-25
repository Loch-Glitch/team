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

]
