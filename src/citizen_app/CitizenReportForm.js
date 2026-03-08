import React, { useState } from 'react';
import { Card, Form, Input, Select, Button, message, Upload, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { citizenService } from '../services/api';
import styles from './CitizenReportForm.module.css';



const CitizenReportForm = ({ onSubmit, userRole }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          message.success(`Location set: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        },
        () => {
          message.error('Unable to get location');
        }
      );
    } else {
      message.error('Geolocation not supported');
    }
  };

  const onFinish = async (values) => {
    await citizenService.submitReport({
      report_type: values.report_type,
      latitude: 32.3792,   // Montgomery city center default
      longitude: -86.3077,
      severity: values.severity,
      description: `[${values.address}] ${values.description}`,
      photo_url: values.photo_url || null,
    });

    try {
      setLoading(true);
      await citizenService.submitReport({
        report_type: values.report_type,
        latitude: location.latitude,
        longitude: location.longitude,
        severity: values.severity,
        description: values.description,
        photo_url: values.photo_url || null,
      });
      message.success('Thank you for your report!');
      form.resetFields();
      setLocation(null);
      if (onSubmit) onSubmit();
    } catch (error) {
      message.error('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Report a Non-Emergency Concern" className={styles.card}>
      <Spin spinning={loading}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          // <div className={styles.locationBox}>
          //   <Button type="primary" onClick={handleGetLocation} block>
          //     📍 Get Current Location
          //   </Button>
          //   {location && (
          //     <div className={styles.locationInfo}>
          //       Location set: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          //     </div>
          //   )}
          // </div>
          <Form.Item
            label="Location / Address"
            name="address"
            rules={[{ required: true, message: 'Please enter your address or nearest intersection' }]}
          >
            <Input placeholder="e.g. 3000 Rosa L Parks Ave, Westside" />
          </Form.Item>

          <Form.Item
            label="Report Type"
            name="report_type"
            rules={[{ required: true, message: 'Please select a report type' }]}
          >
            <Select placeholder="Select issue type">
              <Select.Option value="crowding">Crowding / High Traffic</Select.Option>
              <Select.Option value="hazard">Hazard or Obstruction</Select.Option>
              {(userRole === 'business_owner' || userRole === 'event_organizer') && (
                <Select.Option value="property_damage">Property Damage</Select.Option>
              )}
              {(userRole === 'business_owner' || userRole === 'event_organizer') && (
                <Select.Option value="business_security">Business Security Concern</Select.Option>
              )}
              {(userRole === 'business_owner' || userRole === 'event_organizer') && (
                <Select.Option value="infrastructure">Infrastructure Issue</Select.Option>
              )}
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Severity"
            name="severity"
            initialValue="low"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="low">Low</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="high">High</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: 'Please describe the issue' },
              { min: 10, message: 'Description too short' },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Describe what you're seeing..."
            />
          </Form.Item>

          <Form.Item label="Photo (Optional)" name="photo_url">
            <Input placeholder="Photo URL (optional)" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Submit Report
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};

export default CitizenReportForm;
