import { Form, Input, Button, message } from "antd";
import { useState } from "react";
import axios from "axios";

const { TextArea } = Input;

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  content: string;
}

const Contact = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: ContactForm) => {
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/contact/`,
        values
      );
      message.success("Message sent successfully!");
      form.resetFields();
    } catch (error) {
      console.error("Error details:", error);
      message.error(
        (error as any).response?.data?.message ||
          "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Contact Me</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-6 p-8 rounded-lg shadow-sm"
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input size="large" placeholder="Your name" className="max-w-md" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input size="large" placeholder="Your email" className="max-w-md" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[
            {
              pattern: /^\d{10,}$/,
              message: "Please enter a valid phone number",
            },
          ]}
        >
          <Input
            size="large"
            placeholder="Your phone number (optional)"
            className="max-w-md"
          />
        </Form.Item>

        <Form.Item
          name="content"
          label="Message"
          rules={[{ required: true, message: "Please enter your message" }]}
        >
          <TextArea
            rows={6}
            placeholder="What would you like to say?"
            maxLength={1000}
            showCount
            className="resize-none"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="w-full md:w-auto px-8"
            loading={loading}
          >
            Send Message
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Contact;
