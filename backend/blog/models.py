import re
import uuid
from django.db import models
from service.models import Service


def arabic_slugify(text):
  
    text = text.strip().lower()
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'[^\w\-ء-ي0-9]', '', text)
    return text


class Blog(models.Model):
    title = models.CharField(max_length=255, verbose_name="العنوان")
    slug = models.SlugField(unique=True, blank=True, allow_unicode=True)
    summary = models.TextField(verbose_name="الملخص")
    content = models.TextField(verbose_name="المحتوى (HTML)", blank=True, null=True)

    related_services = models.ManyToManyField(Service, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.pk:
            # Set a temporary unique slug to avoid UNIQUE constraint on first INSERT
            self.slug = str(uuid.uuid4())
            super().save(*args, **kwargs)  # INSERT → self.pk is now set

            # Update slug to the real value using queryset (avoids force_insert conflict)
            self.slug = f"{arabic_slugify(self.title)}-{self.pk}"
            self.__class__.objects.filter(pk=self.pk).update(slug=self.slug)
        else:
            # Existing object: regenerate slug only if it's missing
            if not self.slug:
                self.slug = f"{arabic_slugify(self.title)}-{self.pk}"
            super().save(*args, **kwargs)