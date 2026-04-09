from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count 
from django.utils import timezone
from datetime import timedelta
from rest_framework.permissions import IsAuthenticated
   
from service.models import ServiceCategory,Doctor
from ..models import SiteInfo, FAQ, Package, GalleryImage,Appointment,Package, Source 
from device.models import Device
from device.serializers import DeviceReadSerializer
from blog.models import Blog
from blog.serializers import  BlogReadSerializer
from service.serializers import (
    ServiceCategoryReadSerializer,
    DoctorReadSerializer,
 )

 
from home.serializers import (
    SiteInfoWriteSerializer,
    FAQWriteSerializer,
    PackageReadSerializer,
    GalleryImageWriteSerializer,
    AppointmentReadSerializer,
    SourceReadSerializer
    )

 
# ─────────────────────────────────────────────
#  Helper: date range boundaries
# ─────────────────────────────────────────────

def _week_boundaries():
    today = timezone.now().date()
    start = today - timedelta(days=today.weekday())          # Monday
    end   = start + timedelta(days=6)                        # Sunday
    return start, end

def _month_boundaries():
    today = timezone.now().date()
    start = today.replace(day=1)
    # first day of next month – 1 day
    if today.month == 12:
        end = today.replace(year=today.year + 1, month=1, day=1) - timedelta(days=1)
    else:
        end = today.replace(month=today.month + 1, day=1) - timedelta(days=1)
    return start, end


# ─────────────────────────────────────────────
#  Core report builder
# ─────────────────────────────────────────────

def build_reports(appointments_qs):
    """
    Accepts an Appointment queryset and returns a dict with all report sections.
    Keeps DB queries lean — no N+1.
    """
    now       = timezone.now()
    week_start, week_end   = _week_boundaries()
    month_start, month_end = _month_boundaries()

    total = appointments_qs.count()

    # ── 1. Overview ──────────────────────────────────────────────────────────
    overview = {
        "total_count":     total,
        "services_count":  appointments_qs.filter(item_type="s").count(),
        "packages_count":  appointments_qs.filter(item_type="p").count(),
        "this_week":       appointments_qs.filter(
                               created_at__date__range=[week_start, week_end]
                           ).count(),
        "this_month":      appointments_qs.filter(
                               created_at__date__range=[month_start, month_end]
                           ).count(),
    }

    # ── 2. Period stats ───────────────────────────────────────────────────────
    def _period(start, end):
        qs = appointments_qs.filter(created_at__date__range=[start, end])
        return {
            "total":    qs.count(),
            "services": qs.filter(item_type="s").count(),
            "packages": qs.filter(item_type="p").count(),
        }

    # Last 8 weeks (for weekly trend chart)
    weekly_trend = []
    for i in range(7, -1, -1):
        w_start = week_start - timedelta(weeks=i)
        w_end   = w_start + timedelta(days=6)
        weekly_trend.append({
            "week_label": w_start.strftime("%d %b"),
            **_period(w_start, w_end),
        })

    # Last 6 months (for monthly trend chart)
    monthly_trend = []
    for i in range(5, -1, -1):
        # step back i months from current month-start
        m = month_start.month - i
        y = month_start.year
        while m <= 0:
            m += 12
            y -= 1
        import calendar
        last_day = calendar.monthrange(y, m)[1]
        m_start  = month_start.replace(year=y, month=m, day=1)
        m_end    = month_start.replace(year=y, month=m, day=last_day)
        monthly_trend.append({
            "month_label": m_start.strftime("%b %Y"),
            **_period(m_start, m_end),
        })

    period_stats = {
        "this_week":     _period(week_start, week_end),
        "this_month":    _period(month_start, month_end),
        "weekly_trend":  weekly_trend,
        "monthly_trend": monthly_trend,
    }

    # ── 3. Services breakdown ─────────────────────────────────────────────────
    services_qs = (
        appointments_qs
        .filter(item_type="s", service__isnull=False)
        .values("service__id", "service__name")
        .annotate(count=Count("id"))
        .order_by("-count")
    )
    services_breakdown = [
        {
            "service_id":   row["service__id"],
            "service_name": row["service__name"],
            "count":        row["count"],
            "percentage":   round(row["count"] / total * 100, 1) if total else 0,
        }
        for row in services_qs
    ]

    # ── 4. Packages breakdown ─────────────────────────────────────────────────
    packages_qs = (
        appointments_qs
        .filter(item_type="p", package__isnull=False)
        .values("package__id", "package__name")
        .annotate(count=Count("id"))
        .order_by("-count")
    )
    packages_breakdown = [
        {
            "package_id":   row["package__id"],
            "package_name": row["package__name"],
            "count":        row["count"],
            "percentage":   round(row["count"] / total * 100, 1) if total else 0,
        }
        for row in packages_qs
    ]

    # ── 5. Source breakdown ───────────────────────────────────────────────────
    sources_qs = (
        appointments_qs
        .filter(source__isnull=False)
        .values("source__id", "source__name")
        .annotate(count=Count("id"))
        .order_by("-count")
    )
    sources_breakdown = [
        {
            "source_id":   row["source__id"],
            "source_name": row["source__name"],
            "count":       row["count"],
            "percentage":  round(row["count"] / total * 100, 1) if total else 0,
        }
        for row in sources_qs
    ]

    # Source × period (this week / this month for top source)
    sources_by_period = []
    for row in sources_qs[:5]:          # top 5 only
        sid = row["source__id"]
        base = appointments_qs.filter(source__id=sid)
        sources_by_period.append({
            "source_name": row["source__name"],
            "this_week":   base.filter(created_at__date__range=[week_start, week_end]).count(),
            "this_month":  base.filter(created_at__date__range=[month_start, month_end]).count(),
            "total":       row["count"],
        })

    sources_report = {
        "breakdown":     sources_breakdown,
        "by_period":     sources_by_period,
        "no_source":     appointments_qs.filter(source__isnull=True).count(),
    }

    # ── 6. Campaign breakdown ─────────────────────────────────────────────────
    campaigns_qs = (
        appointments_qs
        .filter(campaign__isnull=False)
        .values("campaign__id", "campaign__name")
        .annotate(count=Count("id"))
        .order_by("-count")
    )
    campaigns_breakdown = [
        {
            "campaign_id":   row["campaign__id"],
            "campaign_name": row["campaign__name"],
            "count":         row["count"],
            "percentage":    round(row["count"] / total * 100, 1) if total else 0,
        }
        for row in campaigns_qs
    ]

    # Campaign × period (top 5)
    campaigns_by_period = []
    for row in campaigns_qs[:5]:
        cid = row["campaign__id"]
        base = appointments_qs.filter(campaign__id=cid)
        campaigns_by_period.append({
            "campaign_name": row["campaign__name"],
            "this_week":     base.filter(created_at__date__range=[week_start, week_end]).count(),
            "this_month":    base.filter(created_at__date__range=[month_start, month_end]).count(),
            "total":         row["count"],
        })

    campaigns_report = {
        "breakdown":    campaigns_breakdown,
        "by_period":    campaigns_by_period,
        "no_campaign":  appointments_qs.filter(campaign__isnull=True).count(),
    }

    # ── 7. Cross matrix: Campaign × Source (top combinations) ────────────────
    cross_qs = (
        appointments_qs
        .filter(campaign__isnull=False, source__isnull=False)
        .values("campaign__name", "source__name")
        .annotate(count=Count("id"))
        .order_by("-count")[:10]
    )
    cross_matrix = [
        {
            "campaign": row["campaign__name"],
            "source":   row["source__name"],
            "count":    row["count"],
        }
        for row in cross_qs
    ]

    # ── 8. Assemble ───────────────────────────────────────────────────────────
    return {
        "overview":            overview,
        "period_stats":        period_stats,
        "services_breakdown":  services_breakdown,
        "packages_breakdown":  packages_breakdown,
        "sources":             sources_report,
        "campaigns":           campaigns_report,
        "campaign_x_source":   cross_matrix,
    }




 
     





 

 

class DashboardAPIView(APIView):
    permission_classes = [IsAuthenticated]  
    def get(self, request):
        try:
            info_instance = SiteInfo.objects.first()
            categories = ServiceCategory.objects.all()
            faqs = FAQ.objects.all()
            packages = Package.objects.all()
            gallery = GalleryImage.objects.all()
            doctors=Doctor.objects.all()
            appointments=Appointment.objects.all()
            source=Source.objects.all()
            devices = Device.objects.all()
            blogs = Blog.objects.all()
            data = {
                "info": SiteInfoWriteSerializer(info_instance).data if info_instance else None,
                "categories":ServiceCategoryReadSerializer(categories, many=True).data,
                "doctors": DoctorReadSerializer(doctors, many=True,context={'request': request}).data,
                "faqs": FAQWriteSerializer(faqs, many=True).data,
                "packages": PackageReadSerializer(packages, many=True).data,
                "gallery": GalleryImageWriteSerializer(gallery, many=True,context={'request': request}).data,
                "appointment":AppointmentReadSerializer(appointments, many=True).data,
                "source":SourceReadSerializer(source, many=True).data,
                "devices": DeviceReadSerializer(devices, many=True,context={'request': request}).data,
                "blogs": BlogReadSerializer(blogs, many=True).data,
                "reports": build_reports(appointments),
            }

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
      