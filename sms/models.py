from django.db import models
import os, binascii



def generateRandomCode():
    return binascii.b2a_hex(os.urandom(3)).decode("utf-8")

# Create your models here.
random_code = binascii.b2a_hex(os.urandom(3)).decode("utf-8")
class SMS(models.Model):


    receiver_areacode = models.CharField(max_length=5, choices=(("+61", "+61"),), default="+61")
    receiver_number = models.IntegerField()
    sender_areacode = models.CharField(max_length=5, choices=(("+61", "+61"),), default="+61")
    sender_number = models.IntegerField()
    scheduled_time = models.DateTimeField()
    content = models.TextField(max_length=130)
    cancellation_code = models.CharField(max_length=10, default=generateRandomCode)
    active = models.BooleanField(default=True)

