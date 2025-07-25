// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './App.css';

import Dashboard from './Dashboard';
import PatientHistory from './PatientHistory';
import Header from './Header';

function App({ user, signOut }) {
  return (
    <Router>

<Header user={user} signOut={signOut} />

      <Routes>
        <Route path="/" element={<Dashboard user={user} signOut={signOut} />} />
        <Route path="/history" element={<PatientHistory user={user} signOut={signOut} />} />
      </Routes>
    </Router>
  );
}

export default withAuthenticator(App);
