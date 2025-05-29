import React, { useState } from 'react';

// PUBLIC_INTERFACE
/**
 * Dashboard component
 * Shows user's weekly meal plan summary (mock data), upcoming meals, and quick links to core app functions.
 * Modern KAVIA colors, minimal grid style, full fit with App layout and theme.
 */
function Dashboard() {
  // Mock week meal plan data
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mockMealPlan = [
    { day: 'Mon', breakfast: 'Oatmeal', lunch: 'Chicken Salad', dinner: 'Pasta Primavera' },
    { day: 'Tue', breakfast: 'Greek Yogurt', lunch: 'Veggie Wrap', dinner: 'Salmon & Rice' },
    { day: 'Wed', breakfast: 'Pancakes', lunch: 'Turkey Sandwich', dinner: 'Stir Fry' },
    { day: 'Thu', breakfast: 'Avocado Toast', lunch: 'Grilled Cheese', dinner: 'Chicken Curry' },
    { day: 'Fri', breakfast: 'Smoothie', lunch: 'Quinoa Bowl', dinner: 'Tacos' },
    { day: 'Sat', breakfast: 'Eggs & Toast', lunch: 'Caesar Salad', dinner: 'Pizza' },
    { day: 'Sun', breakfast: 'Bagel', lunch: 'Soup', dinner: 'Roast Chicken' }
  ];

  // Mock upcoming meals list
  const mockUpcomingMeals = [
    { when: 'Today, Dinner', meal: 'Pasta Primavera' },
    { when: 'Tomorrow, Breakfast', meal: 'Greek Yogurt' },
    { when: 'Tomorrow, Lunch', meal: 'Veggie Wrap' },
    { when: 'Tomorrow, Dinner', meal: 'Salmon & Rice' }
  ];

  // Quick links config: { label, route, color }
  const quickLinks = [
    { label: 'Create Meal Plan', route: '/calendar', color: 'var(--primary)' },
    { label: 'Add Recipe', route: '/recipes', color: 'var(--accent)' },
    { label: 'View Grocery List', route: '/grocery-list', color: 'var(--kavia-orange)' },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 32,
      alignItems: 'stretch',
      paddingTop: 24
    }}>
      {/* Dashboard title header */}
      <div style={{ textAlign: 'left', paddingBottom: 8 }}>
        <div className="subtitle" style={{ color: 'var(--primary)' }}>Dashboard</div>
        <h1 className="title" style={{ fontSize: '2.3rem', margin: 0, color: 'var(--primary)' }}>
          Weekly Meal Plan
        </h1>
        <p className="description" style={{ marginBottom: 0 }}>
          Your plan at a glance. Edit by going to the meal calendar or recipes.
        </p>
      </div>

      {/* Week meal plan summary grid */}
      <div
        style={{
          background: 'var(--kavia-dark)',
          borderRadius: 12,
          border: '1px solid var(--border-color)',
          padding: '24px 24px 14px 24px',
          boxShadow: '0 2px 8px rgba(33,50,30,0.09)',
        }}
      >
        <div style={{
          display: 'flex',
          gap: 0,
          borderBottom: '1px solid var(--border-color)',
          marginBottom: 12,
          fontWeight: 600,
          fontSize: '1.07rem',
          color: 'var(--text-secondary)',
        }}>
          {['', 'Breakfast', 'Lunch', 'Dinner'].map((header, i) => (
            <div
              key={header}
              style={{
                flex: i === 0 ? '0 0 80px' : 1,
                padding: '4px 6px',
                textAlign: 'center'
              }}
            >
              {header}
            </div>
          ))}
        </div>
        {mockMealPlan.map(row => (
          <div
            key={row.day}
            style={{
              display: 'flex',
              alignItems: 'stretch',
              borderBottom: '1px solid var(--border-color)',
              fontSize: '1rem',
              color: 'var(--text-color)'
            }}
          >
            <div style={{
              flex: '0 0 80px',
              padding: '7px 6px',
              fontWeight: 500,
              color: 'var(--accent)'
            }}>
              {row.day}
            </div>
            <div style={{ flex: 1, padding: '7px 6px', fontWeight: 400 }}>{row.breakfast}</div>
            <div style={{ flex: 1, padding: '7px 6px', fontWeight: 400 }}>{row.lunch}</div>
            <div style={{ flex: 1, padding: '7px 6px', fontWeight: 400 }}>{row.dinner}</div>
          </div>
        ))}
      </div>

      {/* Upcoming Meals and Quick Links section */}
      <div
        style={{
          display: 'flex',
          gap: 32,
          flexWrap: 'wrap',
          justifyContent: 'stretch'
        }}
      >
        {/* Upcoming Meals */}
        <div
          style={{
            flex: '1 1 260px',
            background: 'var(--kavia-dark)',
            borderRadius: 10,
            border: '1px solid var(--border-color)',
            minWidth: 220,
            padding: 20,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              fontWeight: 600,
              color: 'var(--primary)',
              fontSize: '1.14rem',
              marginBottom: 10,
              letterSpacing: '.2px',
            }}
          >
            Upcoming Meals
          </div>
          {mockUpcomingMeals.map((um, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 0',
                borderBottom: idx === mockUpcomingMeals.length - 1 ? 'none' : '1px solid var(--border-color)'
              }}>
              <span style={{
                color: 'var(--accent)',
                fontWeight: 500,
                fontSize: '.98rem',
                minWidth: 110
              }}>{um.when}</span>
              <span style={{
                color: 'var(--text-secondary)',
                fontWeight: 400
              }}>{um.meal}</span>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div
          style={{
            flex: '1 1 260px',
            background: 'var(--secondary)',
            borderRadius: 10,
            border: '1px solid var(--border-color)',
            minWidth: 220,
            padding: 20,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: 'var(--kavia-orange)',
              fontSize: '1.14rem',
              marginBottom: 10,
            }}
          >
            Quick Links
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {quickLinks.map((ql, i) => (
              <a
                key={ql.label}
                href={ql.route}
                style={{
                  display: 'block',
                  borderRadius: 6,
                  padding: '12px 0',
                  background: ql.color,
                  color: '#fff',
                  textAlign: 'center',
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontSize: '1.06rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  letterSpacing: '.01em',
                  outline: 'none',
                  // hover effect (handled inline for now)
                  transition: 'background 0.17s'
                }}
                onMouseOver={e => e.target.style.background = '#FF9800'}
                onMouseOut={e => e.target.style.background = ql.color}
                tabIndex={0}
              >
                {ql.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
