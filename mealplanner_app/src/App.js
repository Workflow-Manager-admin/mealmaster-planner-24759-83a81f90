import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import RecipeSearch from './components/RecipeSearch';
import MealCalendar from './components/MealCalendar';
import GroceryList from './components/GroceryList';
import NavBar from './components/NavBar';

// PUBLIC_INTERFACE
function App() {
  return (
    <Router>
      <div className="app">
        <NavBar />
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