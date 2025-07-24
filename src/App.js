import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './App.css';

import Header from './Header';
import Dashboard from './Dashboard';

function App({ signOut, user }) {
  return (
    <>
      <Header user={user} signOut={signOut} />
      <Dashboard />
    </>
  );
}

export default withAuthenticator(App);
