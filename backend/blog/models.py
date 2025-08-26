from django.db import models
from ckeditor.fields import RichTextField

# Create your models here.
class Category(models.Model):
    category = models.CharField(max_length=200, unique=True)
    order = models.PositiveIntegerField()
    def __str__(self):
        return self.category

class Blog(models.Model):   #creating a table named Blog
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)  # For SEO-friendly URLs, unique URL-friendly version of title (e.g., heart-health-tips)
    author = models.CharField(max_length=100)
    auth_designation = models.CharField(max_length=100, null=True, blank=True)
    auth_about = models.TextField(null=True, blank=True)
    content = RichTextField()  #for html text editor
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='category_blogs', null=True, blank=True) 
    # {null=True, blank=True} removes the non-null constraint of the column
    def __str__(self):
        return self.title
    

#Instead of putting multiple ImageFields in the Blog model (which is messy), we’ll Create a new model called BlogImage
class BlogImage(models.Model):
    blog = models.ForeignKey(Blog, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True) #can b blank or null

    def __str__(self):
        return f"Image for: {self.blog.title}"
    

class Comment(models.Model):
    blog = models.ForeignKey(Blog, related_name='comments', on_delete=models.CASCADE)  #related_name is used to create a reverse relationship
    name = models.CharField(max_length=100)
    text = models.TextField()
    parent = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)  #self-referential so comments can have nested replies.
    created_at = models.DateTimeField(auto_now_add=True)




