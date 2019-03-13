from django.shortcuts import render
from django.http import HttpResponse

def index(request):
  data = "Account View"

  return render(request, "account/index.html", {"data": data})