from django.db import models


class Message(models.Model):
    # 联系表单提交的基础身份信息，邮箱是后续回复的主要渠道。
    name = models.CharField(max_length=100)
    email = models.EmailField()
    # 电话不是必填项，避免用户因为不想留电话而无法提交消息。
    phone = models.CharField(max_length=20, blank=True)
    content = models.TextField()
    # created_at 用于后台按时间倒序查看最新消息。
    created_at = models.DateTimeField(auto_now_add=True)
    # 后台人工处理消息后可标记已读，避免重复跟进。
    is_read = models.BooleanField(default=False)

    def __str__(self):
        # 管理后台对象标题包含姓名和日期，便于快速识别消息来源。
        return f"Message from {self.name} ({self.created_at.strftime('%Y-%m-%d')})"

    class Meta:
        # 最新消息优先展示，符合后台处理收件箱的习惯。
        ordering = ["-created_at"]
        verbose_name = "Contact Message"
        verbose_name_plural = "Contact Messages"
