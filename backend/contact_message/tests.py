from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Message


class MessageModelTests(TestCase):
    def setUp(self):
        # 模型测试复用一条完整消息，覆盖字段保存和字符串展示。
        self.message = Message.objects.create(
            name="Test User",
            email="test@example.com",
            phone="+1234567890",
            content="This is a test message.",
        )

    def test_message_creation(self):
        """Test that a Message instance is created correctly"""
        self.assertIsInstance(self.message, Message)
        self.assertEqual(
            str(self.message),
            f"Message from Test User ({self.message.created_at.strftime('%Y-%m-%d')})",
        )

    def test_message_fields(self):
        """Test that message fields store values correctly"""
        self.assertEqual(self.message.name, "Test User")
        self.assertEqual(self.message.email, "test@example.com")
        self.assertEqual(self.message.phone, "+1234567890")
        self.assertEqual(self.message.content, "This is a test message.")
        self.assertFalse(self.message.is_read)

    def test_message_ordering(self):
        """Test that messages are ordered by created_at descending"""
        older = Message.objects.create(
            name="Old Message", email="old@example.com", content="Older"
        )
        messages = list(Message.objects.all())
        # 新消息应排在第一位，匹配后台收件箱处理顺序。
        self.assertEqual(messages[0], older)
        self.assertEqual(messages[1], self.message)

    def test_phone_is_optional(self):
        """Test that phone field is optional"""
        msg = Message.objects.create(
            name="No Phone", email="nophone@example.com", content="No phone provided"
        )
        self.assertEqual(msg.phone, "")
        self.assertIsNotNone(msg.id)


class MessageAPITests(APITestCase):
    def test_post_message_success(self):
        """Test posting a valid contact message"""
        # 完整 payload 应创建一条数据库记录，并返回成功提示。
        url = reverse("create_message")
        data = {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+1234567890",
            "content": "Hello, I have a question.",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("message", response.data)
        self.assertEqual(Message.objects.count(), 1)

    def test_post_message_phone_optional(self):
        """Test posting without phone (optional field) succeeds"""
        # 电话是可选字段，不传时仍应成功创建消息。
        url = reverse("create_message")
        data = {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "content": "Just saying hi.",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Message.objects.count(), 1)

    def test_post_message_missing_name(self):
        """Test posting without name returns validation error"""
        # 缺少姓名时应返回字段级错误，避免保存不可联系的消息。
        url = reverse("create_message")
        data = {
            "email": "test@example.com",
            "content": "Missing name.",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)

    def test_post_message_missing_email(self):
        """Test posting without email returns validation error"""
        url = reverse("create_message")
        data = {
            "name": "Test User",
            "content": "Missing email.",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_post_message_invalid_email(self):
        """Test posting with an invalid email returns validation error"""
        url = reverse("create_message")
        data = {
            "name": "Test User",
            "email": "not-an-email",
            "content": "Bad email address.",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_post_message_missing_content(self):
        """Test posting without content returns validation error"""
        url = reverse("create_message")
        data = {
            "name": "Test User",
            "email": "test@example.com",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("content", response.data)
