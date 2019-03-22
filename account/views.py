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

    return JsonResponse({"username": request.user.username}, safe=False)
  else:
    return JsonResponse({"error": "Login failed."}, safe=False)

def signout(request):
  logout(request)

  return JsonResponse({"status": "Logout successful."}, safe=False)

def signup(request):
  if (request.POST["username"] and request.POST["password"]):
    username = request.POST["username"]
    password = request.POST["password"]

    user = authenticate(request, username=username, password=password)

    if user is not None:
      login(request, user)

      return JsonResponse({"username": request.user.username}, safe=False)
    else:
      newUser = User.objects.create_user(username, "", password)

      if newUser is not None:
        login(request, newUser)

        return JsonResponse({"username": request.user.username}, safe=False)
  else:
    return JsonResponse({"status": "missing details"})