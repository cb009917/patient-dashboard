// PatientHistory.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const API_URL = 'https://3l0dyz6m34.execute-api.us-east-1.amazonaws.com/prod/telemetry';

function PatientHistory({ signOut }) {
  const [data, setData] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        setData(res.data);
        setAlerts(res.data.filter(d => d.status !== 'OK'));
      })
      .catch(err => console.error('API error:', err));
  }, []);

  useEffect(() => {
    if (patientId) {
      const patientData = data
        .filter(d => d.patient_id === patientId)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setFiltered(patientData);
    } else {
      setFiltered([]);
    }
  }, [patientId, data]);

  const uniquePatientIds = [...new Set(data.map(d => d.patient_id))];
  const avgHR = filtered.length ? (filtered.reduce((sum, d) => sum + d.heart_rate, 0) / filtered.length).toFixed(1) : '—';
  const avgSpO2 = filtered.length ? (filtered.reduce((sum, d) => sum + d.oxygen_saturation, 0) / filtered.length).toFixed(1) : '—';
  const latestAlert = alerts.filter(d => d.patient_id === patientId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

  const hrChart = {
    labels: filtered.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [{
      label: 'Heart Rate',
      data: filtered.map(d => d.heart_rate),
      borderColor: '#e63946',
      backgroundColor: 'rgba(230, 57, 70, 0.2)',
      tension: 0.3
    }]
  };

  const spo2Chart = {
    labels: filtered.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [{
      label: 'SpO2',
      data: filtered.map(d => d.oxygen_saturation),
      borderColor: '#1d3557',
      backgroundColor: 'rgba(29, 53, 87, 0.2)',
      tension: 0.3
    }]
  };

  return (
    <div className="App">
      <div className="header">
        <h1>📊 Patient History</h1>
        <button className="signout-btn" onClick={signOut}>Sign Out</button>
      </div>

      <div className="filters" style={{ margin: '1rem 0' }}>
        <label>Select Patient: </label>
        <select value={patientId} onChange={e => setPatientId(e.target.value)}>
          <option value="">-- Choose --</option>
          {uniquePatientIds.map(id => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
      </div>

      {patientId && (
        <>
          <div className="card-row">
            <div className="card"><strong>Avg HR:</strong> {avgHR} bpm</div>
            <div className="card"><strong>Avg SpO2:</strong> {avgSpO2} %</div>
            <div className="card"><strong>Last Alert:</strong> {latestAlert?.timestamp || '—'}</div>
          </div>

          <h3>📈 Heart Rate Trend</h3>
          <Line data={hrChart} />

          <h3>💙 SpO2 Trend</h3>
          <Line data={spo2Chart} />
        </>
      )}
    </div>
  );
}

export default PatientHistory;
