from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


User = get_user_model()


class AuthEndpointTests(APITestCase):
    def test_register_user(self):
        response = self.client.post(
            reverse("auth-register"),
            {
                "username": "newuser",
                "email": "newuser@example.com",
                "password": "StrongPass123!",
                "password2": "StrongPass123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["user"]["username"], "newuser")
        self.assertTrue(User.objects.filter(username="newuser").exists())

    def test_register_duplicate_username(self):
        User.objects.create_user(
            username="newuser",
            email="newuser@example.com",
            password="StrongPass123!",
        )

        response = self.client.post(
            reverse("auth-register"),
            {
                "username": "newuser",
                "email": "other@example.com",
                "password": "StrongPass123!",
                "password2": "StrongPass123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("username", response.data)

    def test_register_password_mismatch(self):
        response = self.client.post(
            reverse("auth-register"),
            {
                "username": "newuser",
                "email": "newuser@example.com",
                "password": "StrongPass123!",
                "password2": "DifferentPass123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password2", response.data)

    def test_register_weak_password(self):
        response = self.client.post(
            reverse("auth-register"),
            {
                "username": "newuser",
                "email": "newuser@example.com",
                "password": "123",
                "password2": "123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    def test_login_valid(self):
        User.objects.create_user(
            username="newuser",
            email="newuser@example.com",
            password="StrongPass123!",
        )

        response = self.client.post(
            reverse("auth-login"),
            {"username": "newuser", "password": "StrongPass123!"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertEqual(response.data["user"]["email"], "newuser@example.com")

    def test_login_invalid(self):
        User.objects.create_user(
            username="newuser",
            email="newuser@example.com",
            password="StrongPass123!",
        )

        response = self.client.post(
            reverse("auth-login"),
            {"username": "newuser", "password": "wrong"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_authenticated(self):
        user = User.objects.create_user(
            username="newuser",
            email="newuser@example.com",
            password="StrongPass123!",
        )
        self.client.force_authenticate(user=user)

        response = self.client.get(reverse("auth-me"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "newuser")

    def test_me_unauthenticated(self):
        response = self.client.get(reverse("auth-me"))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
