import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import RecipeSearch from './components/RecipeSearch';
import MealCalendar from './components/MealCalendar';
import GroceryList from './components/GroceryList';

// PUBLIC_INTERFACE
function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <div className="logo">
                <span className="logo-symbol">*</span> MealMaster Planner
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <Link to="/" className="btn" style={{ textDecoration: 'none' }}>Dashboard</Link>
                <Link to="/recipes" className="btn" style={{ textDecoration: 'none' }}>Recipes</Link>
                <Link to="/calendar" className="btn" style={{ textDecoration: 'none' }}>Calendar</Link>
                <Link to="/grocery-list" className="btn" style={{ textDecoration: 'none' }}>Grocery List</Link>
              </div>
            </div>
          </div>
        </nav>
        <main>
          <div className="container" style={{ paddingTop: 120 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/recipes" element={<RecipeSearch />} />
              <Route path="/calendar" element={<MealCalendar />} />
              <Route path="/grocery-list" element={<GroceryList />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;