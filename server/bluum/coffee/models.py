from model_utils.models import TimeStampedModel, SoftDeletableModel
from django.db import models
from django.contrib.postgres.fields import JSONField
from django.utils import timezone

# TODO: make these models SoftDeletableModel


class Roaster(TimeStampedModel):
    name = models.CharField(max_length=150)

    def __str__(self):
        return self.name


class Coffee(TimeStampedModel):
    name = models.CharField(max_length=300)
    roaster = models.ForeignKey(Roaster, null=True, on_delete=models.SET_NULL)
    regions = JSONField(null=True, blank=True)

    def __str__(self):
        return self.name

    def to_dict(self):
        return {
            'name': self.name,
            'created': self.created,
            'roaster': str(self.roaster),
            'regions': self.regions,
        }


class Brew(TimeStampedModel):
    coffee = models.ForeignKey(Coffee, null=True, on_delete=models.SET_NULL)
    brew_date = models.DateTimeField(default=timezone.now)
    rating = models.DecimalField(max_digits=4, decimal_places=2, null=True)

    def __str__(self):
        return self.brew_date
