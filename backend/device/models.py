import re
import uuid
from django.db import models
from service.models import Service


def arabic_slugify(text):
    """
    إنشاء slug يدعم الحروف العربية.
    يستبدل المسافات بـ '-' ويحذف الرموز غير المرغوب فيها.
    """
    text = text.strip().lower()
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'[^\w\-ء-ي0-9]', '', text)
    return text


class Device(models.Model):

    name = models.CharField(max_length=255, verbose_name="اسم الجهاز")
    slug = models.SlugField(unique=True, blank=True, allow_unicode=True)

    summary = models.TextField(verbose_name="ملخص")

    content = models.TextField(verbose_name="المحتوى (HTML)", blank=True, null=True)
    image = models.ImageField(upload_to="device/")

    technology = models.CharField(max_length=255, verbose_name="التقنية المستخدمة")
    treatments = models.PositiveIntegerField(verbose_name="عدد العلاجات", default=0)

    is_new = models.BooleanField(default=False, verbose_name="جديد")

    related_services = models.ManyToManyField(Service, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.pk:
            # Use a temporary unique slug to pass the UNIQUE constraint on first INSERT
            self.slug = str(uuid.uuid4())
            super().save(*args, **kwargs)  # INSERT → self.pk is now set

            # Now set the real slug and UPDATE
            self.slug = f"{arabic_slugify(self.name)}-{self.pk}"
            self.__class__.objects.filter(pk=self.pk).update(slug=self.slug)
        else:
            # Existing object: regenerate slug only if it's missing
            if not self.slug:
                self.slug = f"{arabic_slugify(self.name)}-{self.pk}"
            super().save(*args, **kwargs)