import { useState } from "react";
import { Form, Input, Button, Typography, Alert, Card } from "antd";
import { USERNAME, PASSWORD } from "@utils/constants";

import { LoginComponentProps } from "../types/types";

const LoginComponent = ({ onLoginSuccess }: LoginComponentProps) => {
  const [form] = Form.useForm();
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleSubmit = async () => {
    try {
      const { username, password } = await form.validateFields();

      if (username === USERNAME && password === PASSWORD) {
        onLoginSuccess?.(); // optional chaining
      } else {
        setErrorMsg("Invalid credentials");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div
      id="login-component"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#232b3e",
      }}>
      <Card
        style={{
          minWidth: 340,
          boxShadow: "0 2px 16px #0003",
          background: "#232b3e",
          border: "1px solid #3e4a6b",
          padding: 32,
        }}>
        <Typography.Title
          level={2}
          style={{
            textAlign: "center",
            marginBottom: 24,
            color: "#fff",
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: 2,
            textShadow: "0 1px 2px #0006",
          }}>
          Login
        </Typography.Title>

        <Form form={form} layout="vertical" autoComplete="off" onFinish={handleSubmit}>
          <Form.Item
            label={<span style={{ color: "#e0e0e0", fontWeight: 500 }}>Username</span>}
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}>
            <Input
              autoFocus
              style={{
                color: "rgba(0, 0, 0, 0.65)",
                border: "1px solid rgb(62, 74, 107)",
              }}
              placeholder="Enter your username"
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#e0e0e0", fontWeight: 500 }}>Password</span>}
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}>
            <Input.Password
              style={{
                //background: "#232b3e",
                color: "rgba(0, 0, 0, 0.65)",
                border: "1px solid rgb(62, 74, 107)",
              }}
              placeholder="Enter your password"
            />
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
              style={{
                fontWeight: 600,
                letterSpacing: 1,
                background: "linear-gradient(90deg, #2b3556 0%, #3e4a6b 100%)",
                border: "none",
                color: "#fff",
                boxShadow: "0 2px 8px #0002",
              }}
              data-testid="login-button">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginComponent;
