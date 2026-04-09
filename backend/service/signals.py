from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Service, Feature, ProcessSteps, ServiceHero, ServiceTrust, ServiceProblemSolution


@receiver(post_save, sender=Service)
def create_default_modules(sender, instance, created, **kwargs):
    if created:
        Feature.objects.get_or_create(service=instance)
        ProcessSteps.objects.get_or_create(service=instance)
        ServiceHero.objects.get_or_create(service=instance)
        ServiceTrust.objects.get_or_create(service=instance)
        ServiceProblemSolution.objects.get_or_create(service=instance)