from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import MessageSerializer

@api_view(['POST'])
def create_message(request):
    serializer = MessageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Thank you for your message. We'll get back to you soon."},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 