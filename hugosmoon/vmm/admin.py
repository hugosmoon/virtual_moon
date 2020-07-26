from django.contrib import admin
from vmm.models import Load_models_conf,folder,com_model,views,display_views,users

admin.site.register(Load_models_conf)
admin.site.register(folder)
admin.site.register(com_model)
admin.site.register(views)
admin.site.register(display_views)
admin.site.register(users)

# Register your models here.
