import re
from django.db import models
 


class ServiceCategory(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    count = models.IntegerField(default=0)

    def __str__(self):
        return self.name



 
 

def arabic_slugify(text):
    """
    تحويل النص العربي إلى slug آمن وجميل
    """
    if not text:
        return ""
    
    text = text.strip().lower()
    # استبدال المسافات والـ underscores بـ -
    text = re.sub(r'[\s_]+', '-', text)
    # السماح بالحروف العربية + أرقام + -
    text = re.sub(r'[^\w\-ء-ي0-9]', '', text)
    # إزالة الشرطات المتتالية
    text = re.sub(r'-+', '-', text)
    # إزالة الشرطات من البداية والنهاية
    text = text.strip('-')
    
    return text


class Service(models.Model):
    category = models.ForeignKey('ServiceCategory', on_delete=models.CASCADE, related_name='services')
    name = models.CharField(max_length=255)
    description = models.TextField()
    slug = models.SlugField(unique=True, blank=True, allow_unicode=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = arabic_slugify(self.name)
            slug = base_slug
            
            # Make sure the slug is unique
            counter = 1
            while Service.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            
            self.slug = slug
        
        super().save(*args, **kwargs)
 
 
class ServiceHero(models.Model):
    service = models.OneToOneField(Service, on_delete=models.CASCADE, related_name='hero')
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='gallery/', blank=True, null=True)  
    alt_text = models.CharField(max_length=255, help_text="وصف الصورة لتحسين SEO", blank=True)
    video_url = models.URLField(blank=True, null=True)  # ✅ لينك فيديو
    badge = models.CharField(max_length=100, blank=True, null=True)
    cta_text = models.CharField(max_length=100, default="احجزي استشارتك المجانية") 
 
    def __str__(self):
        return self.title

 

class ServiceTrust(models.Model):
    service = models.OneToOneField(
        Service,
        on_delete=models.CASCADE,
        related_name='trust'
    )
    experience_years = models.CharField(max_length=20, default="+10")    # +10
    success_operations = models.CharField(max_length=20, default="+500")  # +500
    doctors_count = models.CharField(max_length=20, default="+20")      # +20
    satisfaction_rate = models.CharField(max_length=20, default= "98%")   # 98%

    def __str__(self):
        return f"Trust - {self.service.name}"
 


 
class ServiceProblemSolution(models.Model):
    service = models.OneToOneField(Service, on_delete=models.CASCADE, related_name="problem_solution")
    
    # Problem fields
    problem_title = models.CharField(max_length=255)
    problem_description = models.TextField()
    problem_image = models.ImageField(upload_to="service/problem/",blank=True, null=True) # أو أي مكان تحب
    
    # Solution fields
    solution_title = models.CharField(max_length=255)
    solution_description = models.TextField()
    solution_image = models.ImageField(upload_to="service/solution/",blank=True, null=True)

    def __str__(self):
        return f"Problem & Solution for {self.service.name}"





 
 
class Feature(models.Model):
    service = models.OneToOneField(
         Service,
        on_delete=models.CASCADE,
        related_name='feature'
    )
    title = models.CharField(max_length=200,  default= 'خدمة نحت الجسم')
    subtitle = models.CharField(max_length=200,default='نقدم لك تجربة تجميلية استثنائية بأحدث التقنيات وأعلى معايير الجودة')
 
    # العنوان الرئيسي للميزة
    results_title = models.CharField(
        max_length=255, 
        default="نتائج فورية"
    )
  
    results_description = models.TextField(
      default="ترى الفرق مباشرة بعد الجلسة"
    )

    # الأمان
    safety_title = models.CharField(
        max_length=255, 
        default="آمن تماماً"
    )
    safety_description = models.TextField(
        default="تقنيات معتمدة دولياً"
    )

    # التعافي
    recovery_title = models.CharField(
        max_length=255, 
        default="تعافي سريع"
    )
    recovery_description = models.TextField(
        default="عودي لحياتك الطبيعية خلال أيام"
    )

    # الرعاية
    care_title = models.CharField(
        max_length=255, 
        default="رعاية شاملة"
    )
    care_description = models.TextField(
        default="متابعة مستمرة بعد الإجراء"
    )

    def __str__(self):
        return f"Feature - {self.service.name}"

 
class ProcessSteps(models.Model):
    service = models.OneToOneField(
        Service,
        on_delete=models.CASCADE,
        related_name='process_steps'
    )
    # بيانات الموديول العام
    title = models.CharField(max_length=200,  default="رحلة تحولك خطوة بخطوة")
    subtitle = models.CharField(max_length=200,default="نرافقك في كل مرحلة لضمان أفضل النتائج")
 

    # الخطوة 1: استشارة مجانية
    consultation_title = models.CharField(max_length=100, default="استشارة مجانية")
    consultation_description = models.TextField(default="تقييم شامل ووضع خطة مخصصة")
    consultation_duration = models.CharField(max_length=100, default="30-45 دقيقة")

    # الخطوة 2: تحضير مسبق
    preparation_title = models.CharField(max_length=100, default="تحضير مسبق")
    preparation_description = models.TextField(default="فحوصات طبية وتجهيز المنطقة")
    preparation_duration = models.CharField(max_length=100,default="15-30 دقيقة")
    # الخطوة 3: الإجراء
    procedure_title = models.CharField(max_length=100, default="الإجراء")
    procedure_description = models.TextField(default="نحت الجسم باستخدام أحدث التقنيات")
    procedure_duration = models.CharField(max_length=100, default="60-180 دقيقة")

    # الخطوة 4: متابعة ونتائج
    followup_title = models.CharField(max_length=100, default="متابعة ونتائج")
    followup_description = models.TextField(default="رعاية متكاملة ونتائج مذهلة")
    followup_duration = models.CharField(max_length=100,default="متابعة مستمرة")

    def __str__(self):
        return self.title


 
class BeforeAfterImage(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="before_after")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    before_image = models.ImageField(upload_to="before_after/")
    after_image = models.ImageField(upload_to="before_after/")
    
    def __str__(self):
        return self.title




class Doctor(models.Model):
    name = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to='doctor/')
    experience = models.CharField(max_length=100)
    instagram = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class ServiceDoctor(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='service_doctors')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)

 
 

class Review(models.Model):
    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    image = models.ImageField(upload_to='reviews/')


    def __str__(self):
        return f"Review for {self.service.name} - {self.id}"

class ServiceFAQ(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='faqs')
    question = models.TextField()
    answer = models.TextField()

  
from django.db.models.signals import post_save
from django.dispatch import receiver
import re

# ── Signal: إنشاء modules افتراضيًا عند إنشاء Service ──
@receiver(post_save, sender=Service)
def create_default_modules(sender, instance, created, **kwargs):
    if created:
        Feature.objects.get_or_create(service=instance)
        ProcessSteps.objects.get_or_create(service=instance)
        ServiceHero.objects.get_or_create(service=instance)
        ServiceTrust.objects.get_or_create(service=instance)
        ServiceProblemSolution.objects.get_or_create(service=instance)