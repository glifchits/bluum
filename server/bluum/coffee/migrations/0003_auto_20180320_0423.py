# Generated by Django 2.0.3 on 2018-03-20 04:23

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('coffee', '0002_brew_rating'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='coffee',
            name='region',
        ),
        migrations.AddField(
            model_name='brew',
            name='coffee',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='coffee.Coffee'),
        ),
        migrations.AddField(
            model_name='coffee',
            name='regions',
            field=django.contrib.postgres.fields.jsonb.JSONField(default=None),
            preserve_default=False,
        ),
    ]
