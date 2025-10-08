import { useState } from "react";
import { Form, Input, Button, Typography, Alert, Card } from "antd";
import { mockLogin } from "@utils/mockLogin";

import { LoginComponentProps } from "../types/types";

const LoginComponent = ({ onLoginSuccess }: LoginComponentProps) => {
  const [form] = Form.useForm();
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleSubmit = async () => {
    try {
      const { username, password } = await form.validateFields();

      const user = await mockLogin(username, password);
      if (user) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", user.role);
        onLoginSuccess?.(user);
      } else {
        setErrorMsg("Invalid credentials");
      }
    } catch (err) {
      console.warn("Form validation failed", err);
    }
  };

  return (
    <div className="login-container" id="login-component">
      <Card className="login-card">
        <Typography.Title level={2} className="login-title">
          Login
        </Typography.Title>

        <Form form={form} layout="vertical" autoComplete="off" onFinish={handleSubmit}>
          <Form.Item
            label={<span className="login-form-label">Username</span>}
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}>
            <Input placeholder="Enter your username" autoFocus />
          </Form.Item>

          <Form.Item
            label={<span className="login-form-label">Password</span>}
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}>
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          {errorMsg && (
            <Form.Item>
              <Alert message={errorMsg} type="error" showIcon />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              data-testid="login-button"
              style={{
                fontWeight: 600,
                letterSpacing: 1,
                background: "linear-gradient(90deg, #2b3556 0%, #3e4a6b 100%)",
                border: "none",
                color: "#fff",
                boxShadow: "0 2px 8px #0002",
              }}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginComponent;
