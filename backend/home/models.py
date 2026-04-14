from django.db import models
from service.models import Service 

class SiteInfo(models.Model):
    id = models.PositiveSmallIntegerField(primary_key=True, default=1, editable=False)
    site_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    whatsapp = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)

    address = models.TextField(blank=True, null=True)

    instagram = models.URLField(blank=True, null=True)
    tiktok = models.URLField(blank=True, null=True)
    facebook = models.URLField(blank=True, null=True)
    youtube = models.URLField(blank=True, null=True)


    latitude = models.DecimalField(max_digits=12, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=12, decimal_places=6, blank=True, null=True)


    working_hours = models.TextField(help_text="مثال: من السبت للخميس 9 صباحاً - 10 مساءً", blank=True)

    def __str__(self):
        return self.site_name

    def save(self, *args, **kwargs):
        self.pk = 1  # Singleton
        super().save(*args, **kwargs)





class Package(models.Model):
    name = models.CharField(max_length=255)
    price = models.CharField(max_length=100)
    popular = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class PackageFeature(models.Model):
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='features')
    feature = models.TextField()

    def __str__(self):
        return self.feature
     
 
class GalleryImage(models.Model):
    image = models.ImageField(upload_to='gallery/')
    alt_text = models.CharField(max_length=255, help_text="وصف الصورة لتحسين SEO", blank=True)

    def __str__(self):
        return self.alt_text if self.alt_text else self.image.name
    

class FAQ(models.Model):
    question = models.TextField()
    answer = models.TextField()

    def __str__(self):
        return self.question

 
 
class Campaign(models.Model):
    name = models.CharField(max_length=100, unique=True )  
    def __str__(self):
        return self.name

class Source(models.Model):
    name = models.CharField(max_length=100, unique=True ) 
    campaign=models.ManyToManyField(Campaign, blank=True) 

    def __str__(self):
        return self.name


       
  

class Appointment(models.Model):
    # Item type choices
    ITEM_TYPE_CHOICES = [
        ('s', 's - service'),
        ('p', 'p - package'),
    ]
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    item_type = models.CharField(max_length=1, choices=ITEM_TYPE_CHOICES)
    service = models.ForeignKey(Service, null=True, blank=True, on_delete=models.SET_NULL, related_name='appointments')
    package = models.ForeignKey(Package, null=True, blank=True, on_delete=models.SET_NULL, related_name='appointments')
    created_at = models.DateTimeField(auto_now_add=True)
    source = models.ForeignKey(Source, on_delete=models.SET_NULL, null=True, blank=True)
    campaign = models.ForeignKey(Campaign, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        item_name = self.service.name if self.item_type == 's' and self.service else \
                    self.package.name if self.item_type == 'p' and self.package else "undefined"
        return f"{self.name} - {item_name}  "


 