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
        print("\n===== CREATE SOURCE =====")
        print("Request data:", request.data)

        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            print("Created successfully:", serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print("Create serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ── update ───────────────────────────
    def update(self, request, *args, **kwargs):
        print("\n===== UPDATE SOURCE =====")
        print("Request data:", request.data)

        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=True  # ✅ مهم جدًا
        )

        if serializer.is_valid():
            self.perform_update(serializer)
            print("Updated successfully:", serializer.data)
            return Response(serializer.data)

        print("Update serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)