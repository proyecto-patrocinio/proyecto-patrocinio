from  rest_framework.routers import  DefaultRouter
from Comment.api.viewsets import  CommentApiViewSet, FileViewSet

router_comment  =  DefaultRouter()

router_comment.register ( prefix='comment' ,   basename='comment' ,    viewset=CommentApiViewSet )
router_comment.register ( prefix='file' ,   basename='file' ,    viewset=FileViewSet )
