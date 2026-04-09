from .faq import FAQWriteSerializer, FAQReadSerializer
from .gallery_image import GalleryImageWriteSerializer, GalleryImageReadSerializer
from .package import (
    PackageWriteSerializer,
    PackageReadSerializer,
    PackageFeatureWriteSerializer,
    PackageFeatureReadSerializer
)
from .site_Info import SiteInfoWriteSerializer, SiteInfoReadSerializer
from .appointment import AppointmentReadSerializer,AppointmentWriteSerializer

from .tracked import SourceReadSerializer,SourceWriteSerializer,CampaignWriteSerializer,CampaignReadSerializer
__all__ = [
    "FAQWriteSerializer",
    "FAQReadSerializer",

    "GalleryImageWriteSerializer",
    "GalleryImageReadSerializer",

    "PackageWriteSerializer",
    "PackageReadSerializer",

    "PackageFeatureWriteSerializer",
    "PackageFeatureReadSerializer",

    "SiteInfoWriteSerializer",
    "SiteInfoReadSerializer",
 
   "AppointmentReadSerializer",
    "AppointmentWriteSerializer",

    "SourceReadSerializer",
    "SourceWriteSerializer",
    "CampaignWriteSerializer",
    "CampaignReadSerializer"

]