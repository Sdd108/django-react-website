'''
Author: “Zhipeng “zhipengmail@qq.com”
Date: 2024-12-19 16:53:56
LastEditors: “Zhipeng “zhipengmail@qq.com”
LastEditTime: 2024-12-19 20:09:00
FilePath: /django-react-website/backend/api/serializers.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''
from rest_framework import serializers
from articles.models import Article

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'
