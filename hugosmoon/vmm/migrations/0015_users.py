# Generated by Django 3.0.2 on 2020-02-16 02:43

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('vmm', '0014_auto_20200209_1610'),
    ]

    operations = [
        migrations.CreateModel(
            name='users',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('usertype', models.IntegerField(db_column='usertype', default=1)),
                ('username', models.CharField(db_column='username', max_length=255)),
                ('password', models.CharField(db_column='password', max_length=255)),
                ('createtime', models.DateTimeField(db_column='createtime', default=django.utils.timezone.now)),
                ('updatetime', models.DateTimeField(db_column='updatetime', default=django.utils.timezone.now)),
                ('isdelete', models.BooleanField(db_column='is_delete', default=False)),
            ],
        ),
    ]
