import React, { useState } from 'react';
import { Form, Input, Button, Select, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Auth.module.css';

const { Option } = Select;

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [role, setRole] = useState('resident');

  const onFinish = async (values) => {
    try {
      await register(values.name, values.email, values.password, role);
      message.success('Registration successful!');
      navigate(localStorage.getItem('user_role') === 'resident' ? '/citizen' : '/gov');
    } catch (error) {
      message.error('Registration failed');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1>Register</h1>
        <Spin spinning={loading}>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input placeholder="Full Name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Invalid email format' },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item label="Role">
              <Select value={role} onChange={setRole}>
                <Option value="resident">Resident</Option>
                <Option value="business_owner">Business Owner</Option>
                <Option value="event_organizer">Event Organizer</Option>
                <Option value="police_admin">Police Admin (if authorized)</Option>
                <Option value="fire_admin">Fire Admin (if authorized)</Option>
                <Option value="emergency_manager">Emergency Manager (if authorized)</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Register
              </Button>
            </Form.Item>
          </Form>
        </Spin>
        <p>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
