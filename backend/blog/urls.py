from django.urls import path
from .views import BlogListAPIView, BlogDetailAPIView, BlogCategoryListAPIView, BlogCommentsView
from . import views

urlpatterns = [
path('blogs/categories/', BlogCategoryListAPIView.as_view(), name='blog-categories'), #move this first else it will confuse with the slug url
path('blogs/', BlogListAPIView.as_view(), name='blog-list'), #also used for filtering based on categories(query param filtering)
path('blog/<slug:slug>/', BlogDetailAPIView.as_view(), name='blog-detail'), 
path('blog/<slug:slug>/related/', views.related_blogs, name='related-blogs'),
path('blog/<slug:slug>/comments/', BlogCommentsView.as_view(), name='blog-comments'),

]