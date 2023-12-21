from rest_framework.test import APITestCase, APIRequestFactory
from rest_framework.test import APIRequestFactory
from rest_framework import status
from django.contrib.auth.models import User, Permission
from django.urls import reverse
from rest_framework.test import force_authenticate

from Board.models import Board
from BoardUser.models import BoardUser
from BoardUser.api.serializers import BoardUserSerializer
from BoardUser.api.views import BoardUserViewSet
from Clients.test.utils import setUpSuperUser


class BoardUserPermissionTest(APITestCase):

    def setUp(self):
        """Set up the request factory and viewset for each test."""
        self.factory = APIRequestFactory()
        self.viewset = BoardUserViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update', 'delete': 'destroy'})
        self.url = reverse('board_user-list')
        setUpSuperUser(self)
        self.board = Board.objects.create(title='Test Board')

    def test_board_user_creation(self):
        """Test that a BoardUser instance can be created successfully."""
        board_user = BoardUser.objects.create(user=self.user, board=self.board)
        self.assertTrue(isinstance(board_user, BoardUser))
        self.assertEqual(board_user.user, self.user)
        self.assertEqual(board_user.board, self.board)

    def test_board_user_uniqueness(self):
        """Test that two instances with the same user and board cannot be created."""
        BoardUser.objects.create(user=self.user, board=self.board)
        with self.assertRaises(Exception):
            BoardUser.objects.create(user=self.user, board=self.board)

    def test_board_user_str_representation(self):
        """Test the string representation of the BoardUser object."""
        board_user = BoardUser.objects.create(user=self.user, board=self.board)
        expected_str = f'{self.user}/{self.board}'
        self.assertEqual(str(board_user), expected_str)

    def test_unauthenticated_user_cannot_access_board_users(self):
        """Test that an unauthenticated user cannot access the board users endpoint."""
        request = self.factory.get('/boardusers/')
        response = self.viewset(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authenticated_user_can_list_board_users(self):
        """Test that an authenticated user can list board users."""
        request = self.factory.get('/boardusers/')
        request.user = self.user
        response = self.viewset(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticated_user_can_create_board_user(self):
        """Test that an authenticated user can create a board user."""
        request_data = {'user': self.user.id, 'board': self.board.id}
        request = self.factory.post('/boardusers/', request_data)
        request.user = self.user
        response = self.viewset(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_authenticated_user_cannot_delete_board_user(self):
        """Test that an authenticated user cannot delete a board user."""
        request = self.factory.delete('/boardusers/1/')
        response = self.viewset(request, pk=1)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
