from Panel.models import Panel
from rest_framework import serializers

  
class PanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Panel
        fields = ('title', 'id', 'board')