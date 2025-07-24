import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://3l0dyz6m34.execute-api.us-east-1.amazonaws.com/prod/telemetry'; // Replace with your GET API URL

function App() {
  const [telemetry, setTelemetry] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        const data = res.data;

        setTelemetry(data);

        // Filter for alerts (CRITICAL or INACTIVE)
        const filtered = data.filter(d => d.status !== 'OK');
        setAlerts(filtered);
      })
      .catch(err => {
        console.error('Error fetching telemetry:', err);
      });
  }, []);

  const uniquePatientIds = new Set(telemetry.map(d => d.patient_id));
  const totalPatients = uniquePatientIds.size;
  const criticalAlerts = alerts.length;

  return (
    <div className="App">
      <h1>📈 Patient Monitoring Dashboard</h1>

      <div className="summary-cards">
        <div className="card">
          <h3>🧍 Active Patients</h3>
          <p>{totalPatients}</p>
        </div>
        <div className="card">
          <h3>🚨 Critical Alerts</h3>
          <p>{criticalAlerts}</p>
        </div>
      </div>

      <h2>🚨 Recent Alerts</h2>
      <table>
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Status</th>
            <th>Heart Rate</th>
            <th>SpO2</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert, index) => (
            <tr key={index}>
              <td>{alert.patient_id}</td>
              <td>{alert.status}</td>
              <td>{alert.heart_rate}</td>
              <td>{alert.oxygen_saturation}</td>
              <td>{alert.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>📋 Recent Telemetry</h2>
      <table>
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Heart Rate</th>
            <th>SpO2</th>
            <th>Movement</th>
            <th>Status</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {telemetry.map((entry, index) => (
            <tr key={index}>
              <td>{entry.patient_id}</td>
              <td>{entry.heart_rate}</td>
              <td>{entry.oxygen_saturation}</td>
              <td>{entry.movement}</td>
              <td>{entry.status}</td>
              <td>{entry.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
