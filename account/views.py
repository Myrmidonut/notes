from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

def signin(request):
  username = request.POST["username"]
  password = request.POST["password"]

  user = authenticate(request, username=username, password=password)

  if user is not None:
    login(request, user)

    return JsonResponse({"user": request.user.username}, safe=False)
  else:
    return JsonResponse({"error": "Login failed."}, safe=False)

def signout(request):
  logout(request)

  return JsonResponse({"status": "Logout successful."}, safe=False)

def signup(request):
  username = request.POST["username"]
  password = request.POST["password"]

  user = User.objects.create_user(username, password)

  print(user)

  return JsonResponse("register", safe=False)