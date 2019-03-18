from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, login

def signin(request):
  username = request.POST["username"]
  password = request.POST["password"]

  user = authenticate(request, username=username, password=password)

  if user is not None:
    login(request, user)

    return JsonResponse("logged in", safe=False)
  else:
    return JsonResponse("not logged in", safe=False)

def signout(request):
  return JsonResponse("logout", safe=False)

def signup(request):
  return JsonResponse("register", safe=False)