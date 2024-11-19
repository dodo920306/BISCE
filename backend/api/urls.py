from django.urls import path
from . import views

urlpatterns = [
    path('token/', views.TokenObtainPairView.as_view()),
    path('token/refresh/', views.TokenRefreshView.as_view()),
    path('signup/', views.signup),
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
]
