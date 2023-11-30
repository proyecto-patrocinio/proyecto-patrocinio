import os
from rest_framework.test import APITestCase, APIRequestFactory
from datetime import datetime as dt, timedelta
from rest_framework.test import force_authenticate
from django.urls import reverse
from django.contrib.auth.models import User
from Comment.models import Comment, File
from Comment.api.viewsets import CommentApiViewSet, FileViewSet
from Consultation.models import Consultation
from rest_framework import status
from django.urls import reverse
from Clients.test.utils import load_dummy_client, setUpSuperUser
from Board.models import Board
from Panel.models import Panel
from Clients.models import Client


class CommentViewSetTestCase(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = CommentApiViewSet.as_view({'get': 'retrieve', 'post': 'create', 'put': 'update', 'delete': 'destroy'})
        self.url = reverse('comment-list')
        setUpSuperUser(self)
        load_dummy_client(self)
        self.consultant = Client.objects.get(pk=1)
        self.board = Board.objects.create(title='Test Board')
        self.panel = Panel.objects.create(title="dummy_panel", board=self.board)
        self.consultation = Consultation.objects.create(
            availability_state="ASSIGNED", progress_state="TODO", time_stamp=dt.now(),
            description="dummy", client=self.consultant, opponent="dummy", tag="dummy"
        )
        self.comment = Comment.objects.create(
            text='Test Comment',
            consultation=self.consultation,
            user=self.user
        )

    def test_create_comment(self):
        data = {
            'text': 'dummy',
            'consultation': self.consultation.id,
            'user': self.user.id
        }

        self.client.force_login(self.user)
        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Comment.objects.filter(text=data['text']).exists())

    def test_create_comment_faild(self):
        data = {
            'text': 'dummy',
            'consultation': self.consultation.id,
            'user': self.user.id
        }

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_comment(self):
        data = {
            'text': 'Updated Test Comment',
        }

        self.client.force_login(self.user)
        response = self.client.patch(reverse('comment-detail', args=[self.comment.id]), data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['text'], 'Updated Test Comment')

    def test_delete_comment(self):
        self.client.force_login(self.user)
        response = self.client.delete(reverse('comment-detail', args=[self.comment.id]))

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Comment.objects.filter(text='Test Comment').exists())

    def test_list_comments(self):
        self.client.force_login(self.user)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

class FileViewSetTestCase(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = FileViewSet.as_view({'get': 'retrieve', 'post': 'create', 'put': 'update', 'delete': 'destroy'})
        self.url = reverse('file-list')
        setUpSuperUser(self)
        load_dummy_client(self)
        self.consultant = Client.objects.get(pk=1)
        self.board = Board.objects.create(title='Test Board')
        self.panel = Panel.objects.create(title="dummy_panel", board=self.board)
        self.consultation = Consultation.objects.create(
            availability_state="ASSIGNED", progress_state="TODO", time_stamp=dt.now(),
            description="dummy", client=self.consultant, opponent="dummy", tag="dummy"
        )
        self.comment = Comment.objects.create(
            text='Test Comment',
            consultation=self.consultation,
            user=self.user
        )
        self.file = File.objects.create(
            comment=self.comment,
            filename='test_file.txt'
        )
        self.url = reverse('file-list')

    def test_create_file(self):
        with open('Comment/test/resources/comment_01.txt', 'rb') as file_content:
            data = {
                'comment': self.comment.id,
                'uploadedFile': file_content,
                'filename': 'comment_01.txt'
            }

            request = self.factory.post(self.url, data=data, format='multipart')
            force_authenticate(request, user=self.user)
            response = self.view(request)

            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertTrue(File.objects.filter(filename='comment_01.txt').exists())

    def test_delete_file(self):
        self.client.force_login(self.user)
        response = self.client.delete(reverse('file-detail', args=[self.file.id]))

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(File.objects.filter(filename='test_file.txt').exists())
