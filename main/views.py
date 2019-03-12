from django.shortcuts import render
from django.http import HttpResponse

def index(request):
  data = "Main View"

  return render(request, "main/index.html", {"data": data})