import React, { useState, useEffect } from 'react';
import { Card, Button, Tag, Spin, Alert } from 'antd';
import { intelligenceService } from '../services/api';
import styles from './ResourceRecommendation.module.css';

const ResourceRecommendation = () => {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRecommendation();
    const interval = setInterval(loadRecommendation, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const loadRecommendation = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await intelligenceService.getResourceRecommendations();
      setRecommendation(response.data);
    } catch (error) {
      console.error('Failed to load resource recommendation:', error);
      setError('Failed to load recommendation');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (zoneName) => {
    // Simple mapping - in a real app this would come from the API
    const zoneColors = {
      'Downtown': '#F44336', // Red - high risk
      'Eastside': '#FF9800', // Orange - medium risk
      'Westside': '#FFC107', // Yellow - medium risk
      'Northside': '#4CAF50', // Green - low risk
    };
    return zoneColors[zoneName] || '#9E9E9E';
  };

  const getConfidenceColor = (confidence) => {
    return confidence === 'high' ? '#4CAF50' : '#FFC107';
  };

  if (loading && !recommendation) {
    return (
      <div className={styles.section}>
        <div className={styles.header}>
          <h2>⚡ Resource Recommendation</h2>
        </div>
        <Card className={styles.card}>
          <Spin size="large" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.section}>
        <div className={styles.header}>
          <h2>⚡ Resource Recommendation</h2>
        </div>
        <Card className={styles.card}>
          <Alert message={error} type="error" showIcon />
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2>⚡ Resource Recommendation</h2>
      </div>

      <Card className={styles.card}>
        {recommendation && recommendation.receiving_zone ? (
          <div
            className={styles.recommendationCard}
            style={{ borderLeftColor: getRiskColor(recommendation.receiving_zone) }}
          >
            <div className={styles.recommendationText}>
              Move <span className={styles.units}>{recommendation.units_to_move}</span> {recommendation.unit_type} units from{' '}
              <span className={styles.donorZone} style={{ color: '#4CAF50' }}>
                {recommendation.donor_zone}
              </span>{' '}
              →{' '}
              <span className={styles.receivingZone} style={{ color: '#F44336' }}>
                {recommendation.receiving_zone}
              </span>
            </div>

            <div className={styles.reasoning}>
              {recommendation.reasoning}
            </div>

            <div className={styles.confidenceSection}>
              <Tag color={getConfidenceColor(recommendation.confidence)}>
                {recommendation.confidence.toUpperCase()} CONFIDENCE
              </Tag>
            </div>
          </div>
        ) : (
          <Alert
            message={recommendation?.message || "All zones currently balanced — no reallocation needed"}
            type="success"
            showIcon
          />
        )}

        <div className={styles.actions}>
          <Button onClick={loadRecommendation} loading={loading} size="small">
            Recalculate
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ResourceRecommendation;