# Generated by Django 3.0.2 on 2020-02-04 09:41

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('vmm', '0006_load_models_conf_model_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='views',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('view_name', models.CharField(db_column='view_name', max_length=255)),
                ('createtime', models.DateTimeField(db_column='f_createtime', default=django.utils.timezone.now)),
                ('isdelete', models.BooleanField(db_column='is_delete', default=False)),
            ],
        ),
        migrations.RemoveField(
            model_name='load_models_conf',
            name='model_index',
        ),
        migrations.RemoveField(
            model_name='load_models_conf',
            name='model_name',
        ),
        migrations.RemoveField(
            model_name='load_models_conf',
            name='model_url',
        ),
        migrations.RemoveField(
            model_name='load_models_conf',
            name='view_name',
        ),
        migrations.AddField(
            model_name='load_models_conf',
            name='view_id',
            field=models.IntegerField(db_column='view_id', default=0),
        ),
    ]
