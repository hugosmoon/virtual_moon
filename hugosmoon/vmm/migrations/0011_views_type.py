# Generated by Django 3.0.2 on 2020-02-06 00:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vmm', '0010_auto_20200206_0244'),
    ]

    operations = [
        migrations.AddField(
            model_name='views',
            name='type',
            field=models.IntegerField(db_column='type', default=0),
        ),
    ]
