from  rest_framework.routers import  DefaultRouter
from Comment.api.viewsets import  CommentApiViewSet

router_comment  =  DefaultRouter()

router_comment.register ( prefix='comment' ,   basename='comment' ,    viewset=CommentApiViewSet )