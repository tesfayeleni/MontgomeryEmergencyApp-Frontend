import React from 'react';
import { Card, Empty, Tag } from 'antd';
import styles from './PublicFeed.module.css';

const PublicFeed = ({ feed }) => {
  if (!feed || (!feed.alerts?.length && !feed.verified_reports?.length)) {
    return (
      <Card title="Public Safety Feed">
        <Empty description="No active alerts at this time" />
      </Card>
    );
  }

  const getSeverityColor = (severity) => {
    const colors = { low: 'blue', medium: 'orange', high: 'red' };
    return colors[severity] || 'default';
  };

  return (
    <Card title="Public Safety Feed" className={styles.card}>
      <div className={styles.feedContainer}>
        {/* News Alerts */}
        {feed.alerts && feed.alerts.length > 0 && (
          <div>
            <h3>⚠️ Active Safety Notices</h3>
            <div className={styles.itemsList}>
              {feed.alerts.map((alert, idx) => (
                <div key={idx} className={styles.feedItem}>
                  <div className={styles.itemHeader}>
                    <strong>{alert.title}</strong>
                    <Tag color="orange">⚠️ Safety Alert</Tag>
                  </div>
                  <p className={styles.zone}>{alert.zone_name}</p>
                  <p className={styles.timestamp}>
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verified Reports */}
        {feed.verified_reports && feed.verified_reports.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3>✓ Verified Community Reports</h3>
            <div className={styles.itemsList}>
              {feed.verified_reports.map((report, idx) => (
                <div key={idx} className={styles.feedItem}>
                  <div className={styles.itemHeader}>
                    <strong>{report.report_type.replace('_', ' ')}</strong>
                    <Tag color={getSeverityColor(report.severity)}>
                      {report.severity.toUpperCase()}
                    </Tag>
                  </div>
                  <p className={styles.timestamp}>
                    {new Date(report.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PublicFeed;
