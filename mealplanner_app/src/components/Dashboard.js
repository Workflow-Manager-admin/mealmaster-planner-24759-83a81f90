import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
/**
 * Dashboard component
 * Shows the user's current meal plan summary using saved plans from localStorage.
 * Lets users quickly switch plans or jump to edit/grocery list, and shows upcoming meals.
 */
function Dashboard() {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

  // Recipes must match mock IDs as used in MealCalendar/GroceryList
  const mockRecipes = [
    { id: 1, title: 'Avocado Toast' },
    { id: 2, title: 'Chicken Stir Fry' },
    { id: 3, title: 'Beef Tacos' },
    { id: 4, title: 'Quinoa Bowl' },
    { id: 5, title: 'Greek Salad' },
    { id: 6, title: 'Spicy Chickpea Curry' }
  ];

  // -- Plan management logic, parallel to MealCalendar --
  function getStoredPlans() {
    try {
      return JSON.parse(localStorage.getItem('mm_mealplans')) || [];
    } catch { return []; }
  }
  function storePlans(plans) {
    localStorage.setItem('mm_mealplans', JSON.stringify(plans));
  }
  // Default if none stored yet
  const defaultPlan = {
    id: 1,
    name: "Weekly Demo Plan",
    plan: {
      Mon: { Breakfast: 1, Lunch: null, Dinner: 6 },
      Tue: { Breakfast: 4, Lunch: 5, Dinner: null },
      Wed: { Breakfast: null, Lunch: null, Dinner: 2 },
      Thu: { Breakfast: 5, Lunch: null, Dinner: null },
      Fri: { Breakfast: null, Lunch: null, Dinner: 3 },
      Sat: { Breakfast: null, Lunch: null, Dinner: null },
      Sun: { Breakfast: null, Lunch: null, Dinner: null }
    }
  };

  const [savedPlans, setSavedPlans] = useState(() => {
    const plans = getStoredPlans();
    return plans.length ? plans : [defaultPlan];
  });
  const [selectedPlanId, setSelectedPlanId] = useState(() => savedPlans[0]?.id || 1);

  // Update when storage changes (or after editing in other tabs/views)
  useEffect(() => {
    const sync = () => {
      const plans = getStoredPlans();
      setSavedPlans(plans.length ? plans : [defaultPlan]);
      if (!plans.find(p => p.id === selectedPlanId)) {
        setSelectedPlanId(plans.length ? plans[0].id : 1);
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
    // eslint-disable-next-line
  }, [selectedPlanId]);

  // Find current plan object
  const currentPlanObj = savedPlans.find(p => p.id === selectedPlanId) || defaultPlan;
  const mealPlan = currentPlanObj.plan;

  // Compose grid for UI
  function getRecipeTitle(recipeId) {
    const rec = mockRecipes.find(r => r.id === recipeId);
    return rec ? rec.title : '';
  }

  // Compose a summary of upcoming meals: today (pick first set day) and next three meals in order
  function getUpcomingMeals() {
    // Find the next (up to 4) non-empty meal slots from today (Mon..Sun). For demo, always start at "today" = Monday (better: use real date).
    const flat = [];
    for (let d = 0; d < weekDays.length; d++) {
      const day = weekDays[d];
      for (let mt = 0; mt < mealTypes.length; mt++) {
        const label = `${day}, ${mealTypes[mt]}`;
        const rid = mealPlan[day][mealTypes[mt]];
        if (rid) flat.push({ when: label, meal: getRecipeTitle(rid) });
      }
    }
    return flat.slice(0, 4);
  }
  const upcomingMeals = getUpcomingMeals();

  // Quick links config: { label, route, color }
  const quickLinks = [
    { label: 'Edit Meal Plan', route: '/calendar', color: 'var(--primary)' },
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
          Your plan at a glance. Save, load, or edit meal plans from the calendar.
        </p>
      </div>

      {/* Plan selection bar */}
      <div style={{
        display: "flex", flexDirection: "row", gap: 10,
        alignItems: "center", marginBottom: 7, marginLeft: 3
      }}>
        <label style={{ color: 'var(--kavia-orange)', fontWeight: 500, fontSize: '.99rem' }}>
          Meal Plan:
        </label>
        <select
          value={selectedPlanId}
          style={{
            border: `1px solid var(--border-color)`, borderRadius: 6, padding: "6px 18px",
            background: "var(--kavia-dark)", color: "var(--primary)", fontWeight: 600
          }}
          onChange={e => setSelectedPlanId(Number(e.target.value))}
        >
          {savedPlans.map(p =>
            <option value={p.id} key={p.id}>{p.name}</option>
          )}
        </select>
        <a
          href="/calendar"
          className="btn"
          style={{
            background: 'var(--primary)', color: '#fff',
            fontSize: '.98rem', fontWeight: 600, marginLeft: 8, padding: '7px 14px', textDecoration: 'none'
          }}
        >
          Manage Plans
        </a>
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
        {weekDays.map(day => (
          <div
            key={day}
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
              {day}
            </div>
            <div style={{ flex: 1, padding: '7px 6px', fontWeight: 400 }}>
              {mealPlan[day]?.Breakfast ? getRecipeTitle(mealPlan[day].Breakfast) : <span style={{ color: 'var(--text-secondary)' }}>—</span>}
            </div>
            <div style={{ flex: 1, padding: '7px 6px', fontWeight: 400 }}>
              {mealPlan[day]?.Lunch ? getRecipeTitle(mealPlan[day].Lunch) : <span style={{ color: 'var(--text-secondary)' }}>—</span>}
            </div>
            <div style={{ flex: 1, padding: '7px 6px', fontWeight: 400 }}>
              {mealPlan[day]?.Dinner ? getRecipeTitle(mealPlan[day].Dinner) : <span style={{ color: 'var(--text-secondary)' }}>—</span>}
            </div>
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
          {upcomingMeals.length
            ? upcomingMeals.map((um, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 0',
                  borderBottom: idx === upcomingMeals.length - 1 ? 'none' : '1px solid var(--border-color)'
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
            ))
            : <div style={{ color: 'var(--text-secondary)', fontSize: '1.03rem', margin: '6px 0' }}>
              No meals planned yet.
            </div>
          }
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
