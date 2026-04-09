from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
 
 
from ..models import Source, Campaign
from ..serializers import CampaignWriteSerializer, CampaignReadSerializer


class CampaignViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated] 
    queryset = Campaign.objects.all()
    serializer_class = CampaignWriteSerializer

    def get_serializer_class(self):
        if self.action in ('list', 'retrieve'):
            return CampaignReadSerializer
        return CampaignWriteSerializer

    # ── list ──────────────────────────────
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = CampaignReadSerializer(queryset, many=True)
        return Response(serializer.data)

    # ── retrieve ─────────────────────────
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = CampaignReadSerializer(instance)
        return Response(serializer.data)

    # ── create ───────────────────────────
    def create(self, request, *args, **kwargs):
        print("\n===== CREATE CAMPAIGN =====")
        print("Request data:", request.data)

        resource_id = request.data.get('resource_id')

        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            campaign = serializer.save()

            print("Created Campaign:", campaign.id)

            # ✅ ربطه بالـ Source
            if resource_id:
                try:
                    source = Source.objects.get(id=resource_id)
                    source.campaign.add(campaign)
                    print(f"Linked Campaign {campaign.id} to Source {source.id}")
                except Source.DoesNotExist:
                    print("❌ Source not found")

            return Response(
                CampaignReadSerializer(campaign).data,
                status=status.HTTP_201_CREATED
            )

        print("Create serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ── update ───────────────────────────
    def update(self, request, *args, **kwargs):
        print("\n===== UPDATE CAMPAIGN =====")
        print("Request data:", request.data)

        instance = self.get_object()
        resource_id = request.data.get('resource_id')

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            campaign = serializer.save()

            # ✅ تحديث الربط
            if resource_id:
                try:
                    source = Source.objects.get(id=resource_id)
                    source.campaign.add(campaign)
                    print(f"Updated link Campaign {campaign.id} → Source {source.id}")
                except Source.DoesNotExist:
                    print("❌ Source not found")

            return Response(CampaignReadSerializer(campaign).data)

        print("Update serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)