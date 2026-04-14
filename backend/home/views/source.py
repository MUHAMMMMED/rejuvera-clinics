from rest_framework.viewsets import ModelViewSet
from ..models import Source
from ..serializers import SourceWriteSerializer,SourceReadSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
 
 
class SourceViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated] 
    queryset = Source.objects.all()
    serializer_class = SourceWriteSerializer

    def get_serializer_class(self):
        if self.action in ('list', 'retrieve'):
            return SourceReadSerializer
        return SourceWriteSerializer

    # ── list ──────────────────────────────
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = SourceReadSerializer(queryset, many=True)
        return Response(serializer.data)

    # ── retrieve ─────────────────────────
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = SourceReadSerializer(instance)
        return Response(serializer.data)

    # ── create ───────────────────────────
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ── update ───────────────────────────
    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=True  
        )

        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)