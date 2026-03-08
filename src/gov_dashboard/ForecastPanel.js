import React from 'react';
import { Card, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import styles from './ForecastPanel.module.css';

const ForecastPanel = ({ forecasts }) => {
  const data = forecasts.map((f) => ({
    name: f.zone_name,
    police: f.predicted_police,
    fire: f.predicted_fire,
  }));

  return (
    <Card title="6-Hour Demand Forecast" className={styles.card}>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="police" fill="#8884d8" name="Police Demand" />
            <Bar dataKey="fire" fill="#ff7300" name="Fire Demand" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              <th>Zone</th>
              <th>Police Pred.</th>
              <th>Fire Pred.</th>
            </tr>
          </thead>
          <tbody>
            {forecasts.map((f) => (
              <tr key={f.zone_id}>
                <td>{f.zone_name}</td>
                <td>{f.predicted_police.toFixed(1)}</td>
                <td>{f.predicted_fire.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ForecastPanel;
