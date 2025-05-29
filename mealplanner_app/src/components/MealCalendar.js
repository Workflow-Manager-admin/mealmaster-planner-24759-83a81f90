import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
/**
 * MealCalendar – Interactive week-view component for assigning recipes to days.
 * Now supports meal plan management with localStorage for save/load/overwrite/delete.
 */
function MealCalendar() {
  // Week days/meal slots
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

  // Recipes catalogue - persists across the app (mock data)
  const mockRecipes = [
    { id: 1, title: 'Avocado Toast' },
    { id: 2, title: 'Chicken Stir Fry' },
    { id: 3, title: 'Beef Tacos' },
    { id: 4, title: 'Quinoa Bowl' },
    { id: 5, title: 'Greek Salad' },
    { id: 6, title: 'Spicy Chickpea Curry' }
  ];

  // Util: Constructs an empty meal plan shape
  const blankMealPlan = () => {
    const plan = {};
    weekDays.forEach(day => {
      plan[day] = {};
      mealTypes.forEach(meal => { plan[day][meal] = null; });
    });
    return plan;
  };

  // -- Plan persistence & edit state --
  function getStoredPlans() {
    try {
      return JSON.parse(localStorage.getItem('mm_mealplans')) || [];
    } catch { return []; }
  }
  function storePlans(plans) {
    localStorage.setItem('mm_mealplans', JSON.stringify(plans));
  }
  // Slightly pre-populated default plan
  const defaultPlan = {
    id: 1,
    name: "Weekly Demo Plan",
    plan: {
      ...blankMealPlan(),
      Mon: { Breakfast: 1, Lunch: null, Dinner: 6 },
      Tue: { Breakfast: 4, Lunch: 5, Dinner: null },
      Wed: { Breakfast: null, Lunch: null, Dinner: 2 },
      Thu: { Breakfast: 5, Lunch: null, Dinner: null },
      Fri: { Breakfast: null, Lunch: null, Dinner: 3 },
      Sat: { Breakfast: null, Lunch: null, Dinner: null },
      Sun: { Breakfast: null, Lunch: null, Dinner: null }
    }
  };

  // Load from storage or use default
  const [savedPlans, setSavedPlans] = useState(() => {
    const plans = getStoredPlans();
    return plans.length ? plans : [defaultPlan];
  });
  const [selectedPlanId, setSelectedPlanId] = useState(() => savedPlans[0]?.id || 1);

  // Find selected plan data, buffer changes for editing
  const currentPlanObj = savedPlans.find(p => p.id === selectedPlanId) || defaultPlan;
  const [editPlan, setEditPlan] = useState(JSON.parse(JSON.stringify(currentPlanObj.plan)));

  // Sync edit buffer when plan changes
  useEffect(() => {
    setEditPlan(JSON.parse(JSON.stringify(currentPlanObj.plan)));
  }, [selectedPlanId, savedPlans]);

  // Save plan changes to selected plan
  function handleOverwritePlan() {
    const newPlans = savedPlans.map(p =>
      p.id === selectedPlanId ? { ...p, plan: JSON.parse(JSON.stringify(editPlan)) } : p
    );
    setSavedPlans(newPlans);
    storePlans(newPlans);
  }
  // Save as new
  function handleSaveAsNew(name) {
    const newId = Math.max(0, ...savedPlans.map(p => p.id)) + 1;
    const copy = {
      id: newId,
      name: name || `Meal Plan ${newId}`,
      plan: JSON.parse(JSON.stringify(editPlan))
    };
    const newPlans = [...savedPlans, copy];
    setSavedPlans(newPlans);
    setSelectedPlanId(newId);
    storePlans(newPlans);
  }
  // Delete current plan
  function handleDeletePlan() {
    if (savedPlans.length <= 1) return;
    const _plans = savedPlans.filter(p => p.id !== selectedPlanId);
    setSavedPlans(_plans);
    setSelectedPlanId(_plans[0].id);
    storePlans(_plans);
  }

  // Assign or clear meals
  function handleAssign(day, meal, recipeId) {
    setEditPlan(prev => ({
      ...prev,
      [day]: { ...prev[day], [meal]: recipeId }
    }));
  }
  function handleClear(day, meal) {
    setEditPlan(prev => ({
      ...prev,
      [day]: { ...prev[day], [meal]: null }
    }));
  }

  // For UX: Plan renaming dialog
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  function saveDialog() {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.18)', zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{
          background: 'var(--secondary)', color: 'var(--kavia-dark)',
          borderRadius: 10, padding: 32, minWidth: 260, boxShadow: '0 2px 20px #0002'
        }}>
          <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 14 }}>Save Meal Plan</div>
          <input
            type="text" value={newPlanName}
            onChange={e => setNewPlanName(e.target.value)}
            placeholder="Enter plan name…" autoFocus
            style={{
              border: `1px solid var(--border-color)`, borderRadius: 5,
              padding: "7px 13px", marginBottom: 16, width: "100%"
            }}
            maxLength={30}
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn" style={{ background: 'var(--primary)' }} onClick={() => setShowSaveDialog(false)}>Cancel</button>
            <button
              className="btn"
              style={{ background: 'var(--kavia-orange)' }}
              onClick={() => {
                handleSaveAsNew(newPlanName);
                setShowSaveDialog(false);
                setNewPlanName('');
              }}
              disabled={!newPlanName.trim()}
            >Save</button>
          </div>
        </div>
      </div>
    );
  }

  function getRecipeTitle(recipeId) {
    const rec = mockRecipes.find(r => r.id === recipeId);
    return rec ? rec.title : '';
  }

  // --- RENDER ---
  const gridBg = "rgba(255,255,255,0.03)";
  const cellBorder = "1px solid var(--border-color)";

  return (
    <div style={{ paddingTop: 24 }}>
      {/* Controls: Save/load/edit bar */}
      <div style={{
        display: "flex", flexDirection: "row", gap: 12,
        alignItems: "center", marginBottom: 18
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
        <button
          className="btn"
          style={{ background: 'var(--kavia-orange)', fontWeight: 600, fontSize: '.98rem', padding: '7px 13px' }}
          onClick={() => setShowSaveDialog(true)}
        >
          Save as New
        </button>
        <button
          className="btn"
          style={{ background: 'var(--primary)' }}
          onClick={handleOverwritePlan}
        >Overwrite</button>
        <button
          className="btn"
          style={{ background: 'rgba(200,30,30,0.95)' }}
          onClick={handleDeletePlan}
          disabled={savedPlans.length === 1}
          title={savedPlans.length === 1 ? "Can't delete last plan" : "Delete this meal plan"}
        >
          Delete
        </button>
        {showSaveDialog && saveDialog()}
      </div>

      {/* Header info */}
      <div style={{ marginBottom: 18, textAlign: 'left' }}>
        <div className="subtitle" style={{ color: 'var(--primary)' }}>Meal Calendar</div>
        <h1 className="title" style={{ fontSize: "2.1rem", color: "var(--primary)" }}>
          Weekly Meal Planning
        </h1>
        <div className="description" style={{ maxWidth: 600 }}>
          Assign recipes to days and meals. All changes are saved to your selected or newly saved plan.
        </div>
      </div>

      <div
        style={{
          overflow: 'auto',
          background: gridBg,
          border: '1px solid var(--border-color)',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(12,12,12,0.1)',
          maxWidth: 900,
          margin: '0 auto',
          padding: 8,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `110px repeat(${weekDays.length}, 1fr)`,
            gap: 0,
            alignItems: 'center'
          }}
        >
          {/* Header Row: days */}
          <div style={{
            background: 'none',
            border: 'none',
            fontWeight: 600,
            fontSize: '1.05rem',
            color: 'var(--kavia-orange)',
            padding: '12px 8px',
            minWidth: 100,
          }}>
            {/* Left Top Cell empty */}
          </div>
          {weekDays.map(day => (
            <div
              key={day}
              style={{
                background: 'none',
                color: 'var(--primary)',
                fontWeight: 700,
                borderBottom: cellBorder,
                textAlign: 'center',
                fontSize: '1.06rem',
                padding: '12px 0'
              }}
            >
              {day}
            </div>
          ))}

          {/* Rows: One per meal type */}
          {mealTypes.map(meal => (
            <React.Fragment key={meal}>
              {/* Meal label (row header) */}
              <div
                style={{
                  padding: '16px 8px',
                  background: 'none',
                  color: 'var(--accent)',
                  fontWeight: 600,
                  borderRight: cellBorder,
                  fontSize: '1.08rem',
                  textAlign: 'right'
                }}
              >
                {meal}
              </div>
              {weekDays.map(day => {
                const assignedId = editPlan[day][meal];
                return (
                  <div
                    key={day + '-' + meal}
                    style={{
                      background: 'var(--secondary)',
                      borderLeft: cellBorder,
                      borderBottom: cellBorder,
                      minHeight: 66,
                      padding: 0,
                      display: 'flex',
                      alignItems: 'stretch',
                      justifyContent: 'center',
                      position: 'relative',
                      cursor: 'default',
                      transition: 'background .13s'
                    }}
                  >
                    <div style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      padding: '7px 4px'
                    }}>
                      {assignedId ? (
                        <div style={{ display: "flex", flexDirection: 'row', alignItems: "center", gap: 8, width: "100%", justifyContent: "space-between" }}>
                          <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1rem' }}>
                            {getRecipeTitle(assignedId)}
                          </span>
                          <button
                            className="btn"
                            style={{
                              background: 'var(--kavia-orange)',
                              color: "#fff",
                              fontWeight: 600,
                              padding: '3px 13px',
                              borderRadius: 4,
                              fontSize: '.94rem',
                              lineHeight: 1.2,
                              marginLeft: 7
                            }}
                            onClick={() => handleClear(day, meal)}
                            aria-label="Clear meal"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <>
                          <select
                            value=""
                            style={{
                              background: 'var(--kavia-dark)',
                              color: 'var(--primary)',
                              border: '1px solid var(--kavia-orange)',
                              borderRadius: 6,
                              fontWeight: 500,
                              fontSize: '.99rem',
                              padding: '7px 8px',
                              minWidth: 100,
                              outline: 'none',
                              marginBottom: 2,
                              cursor: 'pointer'
                            }}
                            onChange={e => handleAssign(day, meal, Number(e.target.value))}
                            aria-label={`Assign recipe to ${day} - ${meal}`}
                          >
                            <option value="">+ Assign Recipe</option>
                            {mockRecipes.map(r => (
                              <option value={r.id} key={r.id}>{r.title}</option>
                            ))}
                          </select>
                          <div style={{
                            marginTop: 3,
                            fontSize: '.85rem',
                            color: 'var(--text-secondary)'
                          }}>
                            No meal planned
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* Legend and note */}
      <div style={{
        color: "var(--text-secondary)",
        marginTop: 15,
        fontSize: '.99rem',
        textAlign: 'left'
      }}>
        <span style={{ color: 'var(--accent)', fontWeight: 500 }}>Tip:</span>{" "}
        Save and manage different weekly meal plans. All plans are stored locally to your device.
      </div>
    </div>
  );
}

export default MealCalendar;
