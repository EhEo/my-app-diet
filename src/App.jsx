import React from 'react';
import './App.css';
import MounjaroTracker from './components/MounjaroTracker';
import MealLog from './components/MealLog';
import WeightOCR from './components/WeightOCR';
import Dashboard from './components/Dashboard';
import { motion } from 'framer-motion';

function App() {
  return (
    <div className="app-container">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="header"
      >
        <div>
          <p style={{ fontSize: '0.85rem', color: '#7F8C8D', fontWeight: '600' }}>Smart Care</p>
          <h1>Mounjaro Diet</h1>
        </div>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#007A33', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
          M
        </div>
      </motion.header>

      <main>
        <MounjaroTracker />
        <Dashboard />
        <MealLog />
        <WeightOCR />
      </main>

      <footer style={{ textAlign: 'center', padding: '20px 0', color: '#BDC3C7', fontSize: '0.75rem' }}>
        &copy; 2026 Mounjaro Smart Diet Manager. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
