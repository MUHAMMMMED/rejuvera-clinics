from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from service.models import Service
from ..models import (
    Package,
    Appointment,
    Service,
    Source,
    Campaign
)


class NewAppointmentView(APIView):

    def post(self, request):
        data = request.data

        name       = data.get('name', '').strip()
        phone      = data.get('phone', '').strip()
        item_type  = data.get('item_type', 's')
        service_id = data.get('service_id')
        package_id = data.get('package_id')
        source_val = data.get('source', '').strip()
        camp_val   = data.get('campaign', '').strip()

        # --------------------
        # Validation
        # --------------------
        if not name or not phone:
            return Response(
                {'error': 'الاسم ورقم الجوال مطلوبان'},
                status=status.HTTP_400_BAD_REQUEST
            )

        service = None
        package = None

        # --------------------
        # Service flow
        # --------------------
        if item_type == 's':
            if not service_id:
                return Response(
                    {'error': 'service_id مطلوب'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                service = Service.objects.get(id=service_id)
            except Service.DoesNotExist:
                return Response(
                    {'error': 'الخدمة غير موجودة'},
                    status=status.HTTP_404_NOT_FOUND
                )

        # --------------------
        # Package flow
        # --------------------
        elif item_type == 'p':
            if not package_id:
                return Response(
                    {'error': 'package_id مطلوب'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                package = Package.objects.get(id=package_id)
            except Package.DoesNotExist:
                return Response(
                    {'error': 'الباقة غير موجودة'},
                    status=status.HTTP_404_NOT_FOUND
                )

        else:
            return Response(
                {'error': 'item_type غير صحيح (s أو p فقط)'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # --------------------
        # Source + Campaign (AUTO CREATE)
        # --------------------
        source = None
        campaign = None

        if source_val:
            source, _ = Source.objects.get_or_create(
                name=source_val
            )

        if camp_val:
            campaign, _ = Campaign.objects.get_or_create(
                name=camp_val
            )

            # ربط campaign مع source (ManyToMany)
            if source:
                source.campaign.add(campaign)

        # --------------------
        # Create appointment
        # --------------------
        appointment = Appointment.objects.create(
            name=name,
            phone=phone,
            item_type=item_type,
            service=service,
            package=package,
            source=source,
            campaign=campaign,
        )

        return Response(
            {
                'success': True,
                'appointment_id': appointment.id
            },
            status=status.HTTP_201_CREATED
        )