import React from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Auth.module.css';

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const onFinish = async (values) => {
    try {
      const response = await login(values.email, values.password);
      message.success('Login successful!');
      const isGov = ['police_admin', 'fire_admin', 'emergency_manager'].includes(response.role);
      navigate(isGov ? '/gov' : '/citizen');
    } catch (error) {
      message.error('Login failed');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1>Montgomery Emergency Platform</h1>
        <h2>Login</h2>
        <Spin spinning={loading}>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Invalid email format' },
              ]}
            >
              <Input placeholder="Email" size="large" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password placeholder="Password" size="large" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                Login
              </Button>
            </Form.Item>
          </Form>
        </Spin>
        <p>
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
