from Panel.models import Panel
from rest_framework import serializers
from Card.api.serializers import CardSerializer


class PanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Panel
        fields = ('title', 'id', 'board')


class PanelWithNumberCardsSerializer(serializers.ModelSerializer):
    number_cards = serializers.IntegerField()

    class Meta:
        model = Panel
        fields = '__all__'


class PanelFullSerializer(serializers.ModelSerializer):
    cards = CardSerializer(many=True, read_only=True)

    class Meta:
        model = Panel
        fields = ('title', 'id', 'board', 'cards')
        read_only_fields = ('cards',)
