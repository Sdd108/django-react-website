from django.contrib import admin
from .models import Message


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    # 后台列表展示联系人、内容状态和提交时间，方便批量处理。
    list_display = ("name", "email", "phone", "created_at", "is_read")
    # 按是否已读和提交时间筛选，模拟简单收件箱工作流。
    list_filter = ("is_read", "created_at")
    search_fields = ("name", "email", "content")
    # 提交时间由系统记录，不允许后台手动改写。
    readonly_fields = ("created_at",)

    def mark_as_read(self, request, queryset):
        # 批量操作只更新状态位，不修改消息正文或联系信息。
        queryset.update(is_read=True)

    mark_as_read.short_description = "Mark selected messages as read"

    # 在 Django admin 动作菜单中暴露“标记已读”操作。
    actions = ["mark_as_read"]
