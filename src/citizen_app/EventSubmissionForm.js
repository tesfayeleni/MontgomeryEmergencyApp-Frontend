import React, { useState } from 'react';
import { Card, Form, Input, Button, DatePicker, InputNumber, message, Spin } from 'antd';
import { citizenService } from '../services/api';
import dayjs from 'dayjs';
import styles from './EventSubmissionForm.module.css';

const EventSubmissionForm = () => {
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
    if (!location) {
      message.error('Please set your event location first');
      return;
    }

    try {
      setLoading(true);
      await citizenService.submitEvent({
        title: values.title,
        latitude: location.latitude,
        longitude: location.longitude,
        event_date: values.event_date.toISOString(),
        expected_attendance: values.expected_attendance,
        description: values.description || '',
      });
      message.success('Event submitted successfully!');
      form.resetFields();
      setLocation(null);
    } catch (error) {
      message.error('Failed to submit event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Submit Public Event Notice" className={styles.card}>
      <Spin spinning={loading}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <div className={styles.infoBox}>
            <p>Help us prepare for large gatherings. Submit details about any public events in your area.</p>
          </div>

          <div className={styles.locationBox}>
            <Button type="primary" onClick={handleGetLocation} block>
              📍 Set Event Location
            </Button>
            {location && (
              <div className={styles.locationInfo}>
                Location set: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </div>
            )}
          </div>

          <Form.Item
            label="Event Title"
            name="title"
            rules={[{ required: true, message: 'Please enter event title' }]}
          >
            <Input placeholder="e.g., Community Festival, Music Concert" />
          </Form.Item>

          <Form.Item
            label="Event Date & Time"
            name="event_date"
            rules={[{ required: true, message: 'Please select date and time' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>

          <Form.Item
            label="Expected Attendance"
            name="expected_attendance"
            rules={[{ required: true, message: 'Please estimate attendance' }]}
          >
            <InputNumber min={0} max={100000} placeholder="Number of people" />
          </Form.Item>

          <Form.Item
            label="Description (Optional)"
            name="description"
          >
            <Input.TextArea
              rows={3}
              placeholder="Any additional details about the event..."
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Submit Event Notice
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};

export default EventSubmissionForm;
