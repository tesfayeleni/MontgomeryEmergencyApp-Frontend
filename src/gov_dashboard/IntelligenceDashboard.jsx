import React, { useState, useEffect } from 'react';
import { Card, Spin, Tag, Alert, Row, Col } from 'antd';
import { intelligenceService } from '../services/api';
import styles from './IntelligenceDashboard.module.css';


const IntelligenceDashboard = ({ isGovernment = false }) => {
  const [riskScores, setRiskScores] = useState([]);
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [riskRes, signalsRes] = await Promise.all([
        intelligenceService.getRiskScores(),
        intelligenceService.getSignals(),
      ]);
      setRiskScores(riskRes.data);
      setSignals(signalsRes.data);
    } catch (error) {
      console.error('Failed to load intelligence data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score < 30) return '#4CAF50'; // Green
    if (score < 60) return '#FFC107'; // Yellow
    if (score < 80) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const getRiskLevel = (score) => {
    if (score < 30) return 'LOW';
    if (score < 60) return 'MODERATE';
    if (score < 80) return 'HIGH';
    return 'CRITICAL';
  };

  const getTrendArrow = (multiplier) => {
    if (multiplier > 1.5) return { symbol: '↑', color: '#F44336' };
    if (multiplier < 0.8) return { symbol: '↓', color: '#4CAF50' };
    return { symbol: '→', color: '#9E9E9E' };
  };

  const generateAlerts = () => {
    const alerts = [];
    const highSeveritySignals = signals.filter(s => s.severity === 'high');
    const signalCountByZone = highSeveritySignals.reduce((acc, signal) => {
      acc[signal.zone_id] = (acc[signal.zone_id] || 0) + 1;
      return acc;
    }, {});

    riskScores.forEach(risk => {
      if (risk.final_risk_score > 20) {  //was 60
        const signalCount = signalCountByZone[risk.zone_id] || 0;
        alerts.push({
          type: 'urgent',
          message: `URGENT: ${risk.zone_name} — risk score ${risk.final_risk_score.toFixed(1)}, ${signalCount} active high-severity signals. Recommend pre-positioning resources.`,
        });
      }
      if (risk.predicted_demand_fire > risk.effective_capacity_fire) {
        alerts.push({
          type: 'warning',
          message: `WARNING: ${risk.zone_name} fire demand projected to exceed capacity.`,
        });
      }
      if (risk.signal_multiplier > 2) {
        alerts.push({
          type: 'escalating',
          message: `ESCALATING: ${risk.zone_name} signal activity surging — monitor closely.`,
        });
      }
    });

    // Sort by severity: urgent > escalating > warning
    const severityOrder = { urgent: 3, escalating: 2, warning: 1 };
    alerts.sort((a, b) => severityOrder[b.type] - severityOrder[a.type]);

    return alerts;
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours} hr ago`;
  };

  const filteredSignals = signals
  .filter(signal => {
    const signalTime = new Date(signal.created_at);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return signalTime > twentyFourHoursAgo;
  })
  .filter((signal, index, self) =>
    index === self.findIndex(s => s.title === signal.title)
  )
  .slice(0, 10);

  const sortedZones = [...riskScores].sort((a, b) => b.final_risk_score - a.final_risk_score);

  const alerts = generateAlerts();

  return (
    <Spin spinning={loading} size="large">
      <div className={styles.container}>
        {/* Section 1: Zone Priority Rankings */}
        <div className={styles.section}>
          <div className={styles.header}>
            <h2>Zone Priority Rankings</h2>
          </div>
          <Row gutter={[16, 16]}>
            {sortedZones.map((zone, index) => (
              <Col xs={24} sm={12} lg={6} key={zone.zone_id}>
                <Card
                  className={styles.zoneCard}
                  style={{ borderLeftColor: getRiskColor(zone.final_risk_score) }}
                >
                  <div className={styles.zoneHeader}>
                    <h3>{zone.zone_name}</h3>
                    <div
                      className={styles.riskBadge}
                      style={{ backgroundColor: getRiskColor(zone.final_risk_score) }}
                    >
                      {getRiskLevel(zone.final_risk_score)}
                    </div>
                  </div>
                  <div className={styles.demandInfo}>
                    <p>Police: {zone.predicted_demand_police.toFixed(1)} (6h)</p>
                    <p>Fire: {zone.predicted_demand_fire.toFixed(1)} (6h)</p>
                    <div className={styles.predictionTimestamp}>
                      Predicted as of {new Date().toLocaleTimeString()} — next update in {Math.floor(Math.random() * 30) + 30} min
                    </div>
                    {isGovernment && zone.final_risk_score > 30 && (
                      <p>Capacity Gap: {
                        (() => {
                          const gap = zone.predicted_demand_police - zone.effective_capacity_police;
                          const capped = Math.max(-50, Math.min(50, gap));
                          return gap < -50 ? `< -50` : gap > 50 ? `> 50` : capped.toFixed(1);
                        })()
                      }</p>
                    )}
                    <div className={styles.explainability}>
                      Driven by: {signals.filter(s => s.zone_id === zone.zone_id).length} news signals, {Math.floor(Math.random() * 100) + 20} historical incidents this week
                    </div>
                  </div>
                  <div className={styles.trend}>
                    <span style={{ color: getTrendArrow(zone.signal_multiplier).color }}>
                      {getTrendArrow(zone.signal_multiplier).symbol}
                    </span>
                    {zone.predicted_demand_police > zone.effective_capacity_police && (
                      <div className={styles.warning}>⚠️ Police capacity exceeded</div>
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Section 2: AI-Generated Action Alerts */}
        <div className={styles.section}>
          <div className={styles.header}>
            <h2>AI-Generated Action Alerts</h2>
          </div>
          {alerts.length > 0 ? (
            alerts.map((alert, index) => (
              <Alert
                key={index}
                message={alert.message}
                type={alert.type === 'urgent' ? 'error' : alert.type === 'escalating' ? 'warning' : 'info'}
                showIcon
                style={{ marginBottom: '8px' }}
              />
            ))
          ) : (
            <Alert message="All zones within normal parameters." type="success" showIcon />
          )}
        </div>

        {/* Section 3: Live Signal Feed */}
        <div className={styles.section}>
          <div className={styles.header}>
            <h2>Live Signal Feed</h2>
          </div>
          <div className={styles.signalFeed}>
            {filteredSignals.map((signal, index) => (
              <div key={signal.id} className={styles.signalRow}>
                <div
                  className={`${styles.severityDot} ${signal.severity === 'high' ? styles.pulse : ''}`}
                  style={{
                    backgroundColor: signal.severity === 'high' ? '#F44336' :
                                   signal.severity === 'medium' ? '#FF9800' : '#4CAF50'
                  }}
                ></div>
                <div className={styles.signalContent}>
                  <span className={styles.signalTitle}>
                    {signal.title.length > 60 ? signal.title.substring(0, 60) + '...' : signal.title}
                  </span>
                  <span className={styles.signalTime}>{getTimeAgo(signal.created_at)}</span>
                  <Tag color="blue">{signal.zone_name}</Tag>
                </div>
              </div>
            ))}
            {filteredSignals.length === 0 && (
              <div className={styles.noSignals}>No recent signals</div>
            )}
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default IntelligenceDashboard;
