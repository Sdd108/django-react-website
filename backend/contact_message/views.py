from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import MessageSerializer


@api_view(["POST"])
def create_message(request):
    # 使用 DRF serializer 做字段校验和模型保存，返回结构化字段错误给前端。
    serializer = MessageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        # 成功时只返回提示语，不暴露后台状态字段。
        return Response(
            {"message": "Thank you for your message. We'll get back to you soon."},
            status=status.HTTP_201_CREATED,
        )
    # 校验失败时保留 serializer.errors 的字段结构，前端可直接映射到表单。
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
