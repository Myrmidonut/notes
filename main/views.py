from django.shortcuts import render
from django.http import HttpResponse

# ROUTES:

def index(request):
  return render(request, "main/index.html")