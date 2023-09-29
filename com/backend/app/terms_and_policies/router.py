from terms_and_policies.viewsets import get_file_contentView, download_file_contentView
from django.urls import path


paths_terms_and_policies = [
    path('api/terms/', get_file_contentView, name='get_terms_and_policies'),
    path('api/terms/download/', download_file_contentView, name='download_terms_and_policies'),
]
