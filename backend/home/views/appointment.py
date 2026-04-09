from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from service.models import Service
from ..models import  Package, Appointment, Service, Package, Source, Campaign
 
class NewAppointmentView(APIView):

    def post(self, request):
        data = request.data
        print("Received appointment data:", data)

        name       = data.get('name', '').strip()
        phone      = data.get('phone', '').strip()
        item_type  = data.get('item_type', 's')
        service_id = data.get('service_id')
        package_id = data.get('package_id')
        source_val = data.get('source', '')
        camp_val   = data.get('campaign', '')

        # Validation أساسي
        if not name or not phone:
            return Response(
                {'error': 'الاسم ورقم الجوال مطلوبان'},
                status=status.HTTP_400_BAD_REQUEST
            )

        service = None
        package = None

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
                {'error': 'item_type غير صحيح، يجب أن يكون s أو p'},
                status=status.HTTP_400_BAD_REQUEST
            )

        source   = Source.objects.filter(name=source_val).first()   if source_val else None
        campaign = Campaign.objects.filter(name=camp_val).first()   if camp_val   else None

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
            {'success': True, 'appointment_id': appointment.id},
            status=status.HTTP_201_CREATED
        )
    



 