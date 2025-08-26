from rest_framework import serializers
from .models import Blog, BlogImage, Category, Comment

#A serializer for the BlogImage model
class BlogImageSerializer(serializers.ModelSerializer): 
	class Meta:
		model = BlogImage
		fields = ['id', 'image']  #the api returns these fields

#Serializer for the Blog model			
class BlogSerializer(serializers.ModelSerializer): #includes blog fields + nested images
	images = BlogImageSerializer(many=True, read_only=True)
	category = serializers.CharField(source='category.category')  # name is shown instead of ID(in db, id is stored as foreign key but displaying name in the frontend)
	class Meta:
		model = Blog
		fields = ['id', 'title', 'slug', 'author', 'auth_designation', 'auth_about', 'content', 'created_at', 'updated_at', 'is_published', 'images', 'category']

# serializer for Category model
class CategorySerializer(serializers.ModelSerializer):
	category_blogs = BlogSerializer(many=True, read_only=True)
	class Meta:
		model = Category
		fields = ['id', 'category', 'order', 'category_blogs']


#For nested replies
class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'name', 'text', 'created_at']


class CommentSerializer(serializers.ModelSerializer):
    replies = ReplySerializer(many=True, read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'name', 'text', 'created_at', 'replies']
