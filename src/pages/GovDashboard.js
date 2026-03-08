import React from 'react';
import { Layout, Button } from 'antd';
import IntelligenceDashboard from '../gov_dashboard/IntelligenceDashboard';
import ResourceRecommendation from '../gov_dashboard/ResourceRecommendation';
import { useAuth } from '../contexts/AuthContext';
import styles from './GovDashboard.module.css';

const { Header, Content } = Layout;

const GovDashboard = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <Layout className={styles.container}>
      <Header className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <h1>Montgomery Emergency Intelligence Platform</h1>
            <p>Government Operations Dashboard</p>
          </div>
          <Button type="primary" danger onClick={handleLogout} style={{ flexShrink: 0 }}>
            Logout
          </Button>
        </div>
      </Header>

      <Content className={styles.content}>
        <IntelligenceDashboard isGovernment={true} />
        <ResourceRecommendation />
      </Content>
    </Layout>
  );
};

export default GovDashboard;