from django.db import models
from user.models import *
# from board.models import *

class BoardUser(models.Model):
    id = models.IntegerField(primary_key=True)  
    user_id  = models.ForeignKey(User, on_delete=models.DO_NOTHING)
   # board_id =  models.ForeignKey(Board, on_delete=models.DO_NOTHING)
    

    
    def __str__(self) -> str:
        return f'{self.id, self.user_id, self.user}'    

 

