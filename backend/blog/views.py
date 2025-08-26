from django.shortcuts import render
from rest_framework import generics, status
from .models import Blog, Category,Comment
from .serializers import BlogSerializer, CategorySerializer, CommentSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.decorators import api_view



# Create your views here.
#Creates a GET endpoint that returns a list of all published blogs
class BlogListAPIView(generics.ListAPIView):
	serializer_class = BlogSerializer
    
	#To list blogs associated with the selected category
	def get_queryset(self):
          print("ENTERED")
          queryset = Blog.objects.filter(is_published=True).order_by('-created_at') #newest blogs first
          categoryname = self.request.query_params.get('category') #extracts the value of the category parameter from the URL query string of the incoming HTTP request like /api/blogs/?category=Health returning 'Health'.
          print("category name: ", self.request, categoryname)
          if categoryname:
               queryset = queryset.filter(category=categoryname)  # if category is a ForeignKey to Category model, it would b category__name=
          
          # Search filter
          search_query = self.request.query_params.get('search')
          if search_query:
              queryset = queryset.filter(
                   Q(title__icontains=search_query) | Q(content__icontains=search_query)
              )

          return queryset


#Creates a GET endpoint to fetch one blog post by its slug
class BlogDetailAPIView(generics.RetrieveAPIView):
     print("Entered in Details page")
     queryset = Blog.objects.filter(is_published=True)
     serializer_class = BlogSerializer
     lookup_field = 'slug' #to use the slug from the URL

#API to get the 2 related blogs of the current blog, creating a Function Based View n not Class Based since it is a small n quick "utility" view
@api_view(['GET'])
def related_blogs(request, slug):
     try:
        blog = Blog.objects.get(slug=slug)
     except Blog.DoesNotExist:
        return Response({"error": "Blog not found"}, status=404)

     related = Blog.objects.filter(category=blog.category).exclude(slug=slug)[:2]
     serializer = BlogSerializer(related, many=True)
     return Response(serializer.data)
    

class BlogCategoryListAPIView(generics.ListAPIView):
     print("Entered in the categories class")
     serializer_class = CategorySerializer
     queryset = Category.objects.order_by('order')


class BlogCommentsView(APIView): #APIView => flexible method-based custom logic
    def get(self, request, slug):
        blog = Blog.objects.get(slug=slug)   # Returns all top-level comments (i.e., parent=None) for a given blog, means not replies.
        comments = Comment.objects.filter(blog=blog, parent=None).order_by('-created_at')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)   
    def post(self, request, slug):
        blog = Blog.objects.get(slug=slug)
        name = request.data.get('name')
        text = request.data.get('text')
        parent_id = request.data.get('parent')
        comment = Comment(blog=blog, name=name, text=text)
        if parent_id:
            parent_comment = Comment.objects.get(id=parent_id)
            comment.parent = parent_comment
        comment.save()
        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)