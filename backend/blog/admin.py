from django.contrib import admin
from .models import Blog, BlogImage, Category

# Register your models here.
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('category', 'order')  # Customize columns shown in admin list view
    ordering = ('order',)

#To allow image upload inside the blog admin page
class BlogImageInline(admin.TabularInline):  # creates an inline admin class for the BlogImage model.
    model = BlogImage
    extra = 1

class BlogAdmin(admin.ModelAdmin): #creates a custom admin class for the Blog model.
    inlines = [BlogImageInline]

admin.site.register(Blog, BlogAdmin) #to register the models with admin site using custom BlogAdmin configuration
admin.site.register(BlogImage) #registers the BlogImage model separately so can also view/edit all images independently from the blog admin page (optional)
admin.site.register(Category, CategoryAdmin)