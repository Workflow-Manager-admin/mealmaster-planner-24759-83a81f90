import React, { useState } from 'react';

/**
 * MealCalendar – Interactive week-view component for assigning recipes to days
 * Modern design, themed colors; assignment via dropdown menus; mock data for recipes and plans.
 * Drag-and-drop functionality could later be added (noted in code).
 */
// PUBLIC_INTERFACE
function MealCalendar() {
  // Week days/meal slots
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

  // Mock recipes list
  const mockRecipes = [
    { id: 1, title: 'Avocado Toast' },
    { id: 2, title: 'Chicken Stir Fry' },
    { id: 3, title: 'Beef Tacos' },
    { id: 4, title: 'Quinoa Bowl' },
    { id: 5, title: 'Greek Salad' },
    { id: 6, title: 'Spicy Chickpea Curry' }
  ];

  // Initial mock meal plan state structure: { Mon: {Breakfast: recipe_id,...}, ... }
  const emptyPlan = {};
  weekDays.forEach(day => {
    emptyPlan[day] = {};
    mealTypes.forEach(meal => {
      emptyPlan[day][meal] = null;
    });
  });

  // Demo: slightly pre-populated mock (could come from storage/API)
  const initialPlan = {
    ...emptyPlan,
    'Mon': { Breakfast: 1, Lunch: null, Dinner: 6 },
    'Tue': { Breakfast: 4, Lunch: 5, Dinner: null },
    'Wed': { Breakfast: null, Lunch: null, Dinner: 2 },
    'Thu': { Breakfast: 5, Lunch: null, Dinner: null },
    'Fri': { Breakfast: null, Lunch: null, Dinner: 3 },
    'Sat': { Breakfast: null, Lunch: null, Dinner: null },
    'Sun': { Breakfast: null, Lunch: null, Dinner: null }
  };

  const [mealPlan, setMealPlan] = useState(initialPlan);

  // Handler for assigning a recipe to a particular day and meal
  function handleAssign(day, meal, recipeId) {
    setMealPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: recipeId
      }
    }));
  }

  // Handler to clear a meal assignment
  function handleClear(day, meal) {
    setMealPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: null
      }
    }));
  }

  // Useful for getting recipe title by ID
  function getRecipeTitle(recipeId) {
    const rec = mockRecipes.find(r => r.id === recipeId);
    return rec ? rec.title : '';
  }

  // (Optional Future) – Place for drag & drop integration:
  // Would wrap each meal cell with droppable logic, move assignments by drag-handle.

  // Theme tokens
  const gridBg = "rgba(255,255,255,0.03)";
  const cellBorder = "1px solid var(--border-color)";
  const cellHighlight = "rgba(232,122,65,0.16)";

  // Responsive max grid width: 100% on mobile, 750px on desktop
  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{ marginBottom: 18, textAlign: 'left' }}>
        <div className="subtitle" style={{ color: 'var(--primary)' }}>Meal Calendar</div>
        <h1 className="title" style={{ fontSize: "2.1rem", color: "var(--primary)" }}>
          Weekly Meal Planning
        </h1>
        <div className="description" style={{ maxWidth: 600 }}>
          Assign recipes to days and meals. (Drag-and-drop will be supported in future!)
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
                const assignedId = mealPlan[day][meal];
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
                    // future place for draggable/droppable props
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
        Assign recipes to any meal or day. Drag-and-drop will be enabled in a future update!
      </div>
    </div>
  );
}

export default MealCalendar;
