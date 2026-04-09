from .service_category import ServiceCategoryWriteSerializer,ServiceCategoryReadSerializer
from .service import ServiceWriteSerializer,ServiceReadSerializer,ServiceDetailsSerializer
from .service_hero import ServiceHeroWriteSerializer,ServiceHeroReadSerializer
from .process_step import ProcessStepsReadSerializer,ProcessStepsWriteSerializer
from .Feature import FeatureWriteSerializer
from .service_faq import ServiceFAQWriteSerializer,ServiceFAQReadSerializer
from .service_doctor import ServiceDoctorWriteSerializer,ServiceDoctorReadSerializer
from .doctor import DoctorWriteSerializer,DoctorReadSerializer
from .service_trust import ServiceTrustWriteSerializer
from .review import  ReviewWriteSerializer
from .service_problem_solution import ServiceProblemSolutionWriteSerializer
from .before_after import BeforeAfterImageWriteSerializer
__all__ = [

    "ServiceCategoryWriteSerializer",
    "ServiceCategoryReadSerializer",

    "ServiceWriteSerializer",
    "ServiceReadSerializer",
    "ServiceDetailsSerializer",

    "ServiceTrustWriteSerializer",
    "ProcessStepsReadSerializer",
    "ProcessStepsWriteSerializer",

    "ServiceHeroWriteSerializer", 
    "ServiceHeroReadSerializer",

    "FeatureWriteSerializer", 
    "FeatureReadSerializer",
 
    "ReviewWriteSerializer",

    "ServiceProblemSolutionWriteSerializer",
 

    "BeforeAfterImageWriteSerializer",
 
    "ServiceFAQWriteSerializer",
    "ServiceFAQReadSerializer",

    "ServiceDoctorWriteSerializer",
    "ServiceDoctorReadSerializer",

    "DoctorWriteSerializer",
    "DoctorReadSerializer",

    "ServiceOverviewReadSerializer",
   "ServiceOverviewWriteSerializer"



]

 