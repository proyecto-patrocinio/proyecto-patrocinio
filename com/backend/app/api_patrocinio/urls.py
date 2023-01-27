"""api_patrocinio URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
<<<<<<< HEAD
from Clients.views import proof
from .router import router


urlpatterns = [
    path('admin/', admin.site.urls),
    path('clients/',include('Clients.urls')),
    path('api/', include(router.urls))
=======
from locality.api.router import router_locality

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router_locality.urls)), 
>>>>>>> 7a3e67a803c1c0f2d061f143d818fb4d87f411a6
]
