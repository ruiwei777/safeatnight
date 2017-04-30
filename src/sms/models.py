from django.db import models
import os, binascii

from .utils import encrypt, decrypt



def generateRandomCode():
    return binascii.b2a_hex(os.urandom(3)).decode("utf-8")

# Create your models here.
random_code = binascii.b2a_hex(os.urandom(3)).decode("utf-8")
class SMS(models.Model):


    receiver_areacode = models.CharField(max_length=5, choices=(("+61", "+61"),), default="+61")
    receiver_number = models.CharField(max_length=20)
    sender_areacode = models.CharField(max_length=5, choices=(("+61", "+61"),), default="+61")
    sender_number = models.CharField(max_length=20)
    scheduled_time = models.DateTimeField()
    content = models.TextField(max_length=255)
    cancellation_code = models.CharField(max_length=10, default=generateRandomCode)
    active = models.BooleanField(default=True)
    #
    # def save(self, *args, **kwargs):
    #     if not self.pk:
    #     # encrypt_field_value_here
    #         receiver_number = encrypt(receiver_number)
    #     super(SMS, self).save(*args, **kwargs)
