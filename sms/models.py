from django.db import models



# Create your models here.

class SMS(models.Model):
    receiver_areacode = models.CharField(max_length=5, choices=(("+61", "+61"),), default="+61")
    receiver_number = models.IntegerField()
    sender_areacode = models.CharField(max_length=5, choices=(("+61", "+61"),), default="+61")
    sender_number = models.IntegerField()
    scheduled_time = models.DateTimeField()
    content = models.TextField(max_length=130)
    cancellation_code = models.CharField(max_length=5)
    active = models.BooleanField(default=True)
