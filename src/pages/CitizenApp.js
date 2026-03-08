import React, { useState, useEffect } from 'react';
import { Layout, Tabs, Spin, message, Button } from 'antd';
//import RiskMapSimplified from '../citizen_app/RiskMapSimplified';
import CitizenReportForm from '../citizen_app/CitizenReportForm';
import PublicFeed from '../citizen_app/PublicFeed';
import EventSubmissionForm from '../citizen_app/EventSubmissionForm';
//import IntelligenceDashboard from '../gov_dashboard/IntelligenceDashboard';
import { useAuth } from '../contexts/AuthContext';
import { citizenService } from '../services/api';
import styles from './CitizenApp.module.css';

const { Header, Content } = Layout;

const CitizenApp = () => {
  const { user, logout } = useAuth();
  const [publicFeed, setPublicFeed] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  useEffect(() => {
    loadPublicFeed();
    const interval = setInterval(loadPublicFeed, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const loadPublicFeed = async () => {
    try {
      setLoading(true);
      const response = await citizenService.getPublicFeed();
      setPublicFeed(response.data);
    } catch (error) {
      message.error('Failed to load feed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      key: '1',
      label: '📰 Public Feed',
      children: <PublicFeed feed={publicFeed} />,
    },
    {
      key: '2',
      label: '📝 Report Issue',
      children: <CitizenReportForm onSubmit={loadPublicFeed} />,
    },
  ];

  // Add event tab only for event organizers
  if (user?.role === 'event_organizer') {
    tabs.push({
      key: '4',
      label: '🎉 Submit Event',
      children: <EventSubmissionForm />,
    });
  }

  return (
    <Layout className={styles.container}>
      <Header className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <h1>Montgomery Safety Center</h1>
            <p>Your Community's Real-Time Safety Information</p>
          </div>
          <Button type="primary" danger onClick={handleLogout} style={{ flexShrink: 0 }}>
            Logout
          </Button>
        </div>
      </Header>
      
      <Content className={styles.content}>
        <Spin spinning={loading} size="large">
          <Tabs defaultActiveKey="1" items={tabs} />
        </Spin>
      </Content>
    </Layout>
  );
};

export default CitizenApp;
