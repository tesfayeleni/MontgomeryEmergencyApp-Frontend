import React from 'react';
import { Card, Tag, Empty } from 'antd';
import styles from './SignalAlerts.module.css';

const SignalAlerts = ({ signals }) => {
  if (!signals || signals.length === 0) {
    return (
      <Card title="Active Signal Alerts">
        <Empty description="No active signals" />
      </Card>
    );
  }

  const getSeverityColor = (severity) => {
    const colors = { low: 'blue', medium: 'orange', high: 'red' };
    return colors[severity] || 'default';
  };

  return (
    <Card title={`Active Signal Alerts (${signals.length})`} className={styles.card}>
      <div className={styles.alertsList}>
        {signals.map((signal) => (
          <div key={signal.id} className={styles.alertItem}>
            <div className={styles.alertHeader}>
              <div>
                <h4>{signal.title}</h4>
                <Tag color={getSeverityColor(signal.severity)}>{signal.severity.toUpperCase()}</Tag>
                <span className={styles.zone}>{signal.zone_name}</span>
              </div>
              <span className={styles.type}>{signal.signal_type}</span>
            </div>
            {signal.description && (
              <p className={styles.description}>{signal.description}</p>
            )}
            {signal.source_link && (
              <a href={signal.source_link} target="_blank" rel="noopener noreferrer">
                View Source →
              </a>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SignalAlerts;
