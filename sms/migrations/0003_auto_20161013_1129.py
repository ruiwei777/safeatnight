# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-10-13 00:29
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sms', '0002_auto_20161009_2155'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sms',
            name='content',
            field=models.TextField(max_length=255),
        ),
    ]
