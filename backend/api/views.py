from django.shortcuts import render
from django.db import IntegrityError

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from pathlib import Path

from .models import User

import subprocess

DIR = Path(__file__).resolve().parent.parent.parent

# Create your views here.
@api_view(['POST'])
def signup(request):
    try:
        username = request.data['username']
        password = request.data['password']
        output = subprocess.run([str(DIR) + '/blockchain/bisce.sh', 'signup', username, password], capture_output=True, check=True)
        user = User.objects.create_user(username=username, password=password)
        return Response({"message": "User created successfully", "user_id": user.id}, status=status.HTTP_201_CREATED)
    except IntegrityError:
        return Response({"message": "Username already exists."}, status=status.HTTP_409_CONFLICT)
    except KeyError:
        return Response({"message": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)
    except json.JSONDecodeError:
        return Response({"message": "Invalid JSON format."}, status=status.HTTP_400_BAD_REQUEST)
    except subprocess.CalledProcessError as e:
        return Response({"message": "Failed to signup in BISCE: " + e.stderr}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    path("clientAccountBalance/", views.getClientAccountBalance),
    path("clientAccountID/", views.getClientAccountID),
    path("clientAccountUsedBalance/", views.getClientAccountUsedBalance),
    path("totalSupply/", views.getTotalSupply),
    path("mint/", views.mint),
    path("burn/", views.burn),
    path("transfer/": views.transfer),
    path("balanceOf/": views.getBalanceOf),
    path("approve/": views.approve,
    path("allowance/": views.getAllowance),
    path("transferFrom/": views.transferFrom),
    path("use/": views.use),
    path("useFrom/": views.useFrom),
    path("usedBalanceOf/": views.getUsedBalanceOf)
