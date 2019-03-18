from django.shortcuts import render
from django.http import JsonResponse, HttpResponse

def login(request):
  return JsonResponse("login", safe=False)

def logout(request):
  return JsonResponse("logout", safe=False)

def register(request):
  return JsonResponse("register", safe=False)