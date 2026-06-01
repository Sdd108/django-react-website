from rest_framework import serializers
from .models import Message


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        # 联系表单只允许客户端提交这些字段，created_at/is_read 由服务端维护。
        model = Message
        fields = ["name", "email", "phone", "content"]
