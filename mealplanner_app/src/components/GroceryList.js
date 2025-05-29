import React, { useState, useMemo } from 'react';

// PUBLIC_INTERFACE
/**
 * GroceryList component
 * - Categorizes groceries by food group (Produce, Dairy, Pantry, etc).
 * - Populates items based on mock planned meals/recipes (simulate "meal plan to grocery list" flow).
 * - Supports item check-off, removal, full list regeneration, and inline editing of meal plan.
 * - Allows users to save/load multiple meal plans in memory, for demo purposes (no backend).
 * - Styled to fit KAVIA/MealMaster theme and matches overall app layout.
 */
function GroceryList() {
  // Mock meal plans (each day/meal -> recipe id)
  const defaultMealPlans = [
    {
      id: 1,
      name: "Week Plan Demo",
      plan: {
        Mon: { Breakfast: 4, Lunch: null, Dinner: 6 },
        Tue: { Breakfast: 1, Lunch: 2, Dinner: null },
        Wed: { Breakfast: null, Lunch: null, Dinner: 3 },
        Thu: { Breakfast: 5, Lunch: null, Dinner: null },
        Fri: { Breakfast: null, Lunch: null, Dinner: 3 },
        Sat: { Breakfast: null, Lunch: null, Dinner: null },
        Sun: { Breakfast: null, Lunch: null, Dinner: null },
      }
    },
    {
      id: 2,
      name: "Vegetarian Only",
      plan: {
        Mon: { Breakfast: 4, Lunch: 2, Dinner: null },
        Tue: { Breakfast: 1, Lunch: 2, Dinner: 6 },
        Wed: { Breakfast: 4, Lunch: 2, Dinner: 6 },
        Thu: { Breakfast: 4, Lunch: 2, Dinner: 6 },
        Fri: { Breakfast: 1, Lunch: 2, Dinner: null },
        Sat: { Breakfast: 4, Lunch: 2, Dinner: 6 },
        Sun: { Breakfast: null, Lunch: 2, Dinner: null },
      }
    }
  ];

  // Mock recipe catalog (in sync with Calendar/RecipeSearch)
  const mockRecipes = [
    {
      id: 1,
      title: 'Spicy Chickpea Curry',
      ingredients: [
        { name: 'Chickpeas', category: 'Pantry', quantity: '1 can' },
        { name: 'Tomato', category: 'Produce', quantity: '2' },
        { name: 'Onion', category: 'Produce', quantity: '1' },
        { name: 'Garlic', category: 'Produce', quantity: '2 cloves' },
        { name: 'Spices', category: 'Pantry', quantity: 'to taste' }
      ]
    },
    {
      id: 2,
      title: 'Greek Salad',
      ingredients: [
        { name: 'Tomato', category: 'Produce', quantity: '1' },
        { name: 'Cucumber', category: 'Produce', quantity: '1' },
        { name: 'Feta', category: 'Dairy', quantity: '50g' },
        { name: 'Olives', category: 'Pantry', quantity: '1/4 cup' }
      ]
    },
    {
      id: 3,
      title: 'Beef Tacos',
      ingredients: [
        { name: 'Beef', category: 'Meat', quantity: '200g' },
        { name: 'Taco Shells', category: 'Pantry', quantity: '6' },
        { name: 'Lettuce', category: 'Produce', quantity: '1/2 head' },
        { name: 'Cheddar', category: 'Dairy', quantity: '50g' }
      ]
    },
    {
      id: 4,
      title: 'Avocado Toast',
      ingredients: [
        { name: 'Bread', category: 'Bakery', quantity: '2 slices' },
        { name: 'Avocado', category: 'Produce', quantity: '1' },
        { name: 'Egg', category: 'Dairy', quantity: '1' }
      ]
    },
    {
      id: 5,
      title: 'Chicken Stir Fry',
      ingredients: [
        { name: 'Chicken', category: 'Meat', quantity: '200g' },
        { name: 'Broccoli', category: 'Produce', quantity: '1 cup' },
        { name: 'Carrot', category: 'Produce', quantity: '1' },
        { name: 'Soy Sauce', category: 'Pantry', quantity: '2 tbsp' },
        { name: 'Ginger', category: 'Produce', quantity: '1 stalk' }
      ]
    },
    {
      id: 6,
      title: 'Quinoa Bowl',
      ingredients: [
        { name: 'Quinoa', category: 'Pantry', quantity: '1 cup' },
        { name: 'Black Beans', category: 'Pantry', quantity: '1 can' },
        { name: 'Corn', category: 'Produce', quantity: '1/2 cup' },
        { name: 'Avocado', category: 'Produce', quantity: '1' }
      ]
    }
  ];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

  // ============= MEAL PLAN MANAGEMENT LOGIC =============
  const [savedMealPlans, setSavedMealPlans] = useState([...defaultMealPlans]);
  const [selectedPlanId, setSelectedPlanId] = useState(defaultMealPlans[0].id);
  const currentPlanData = useMemo(() => {
    return savedMealPlans.find(p => p.id === selectedPlanId) || defaultMealPlans[0];
  }, [selectedPlanId, savedMealPlans]);

  // For demo, allow editing the current meal plan inline (in session, not shared globally).
  const [editablePlan, setEditablePlan] = useState(JSON.parse(JSON.stringify(currentPlanData.plan)));

  // When meal plan changes (selection), synchronize editing buffer
  React.useEffect(() => {
    setEditablePlan(JSON.parse(JSON.stringify(currentPlanData.plan)));
  }, [selectedPlanId, currentPlanData.plan]);

  // Persistence (save), new plan, delete
  function handleSavePlan(name) {
    const newId = Math.max(...savedMealPlans.map(p => p.id)) + 1;
    setSavedMealPlans(prev => [...prev, { id: newId, name: name || `My Plan ${newId}`, plan: JSON.parse(JSON.stringify(editablePlan)) }]);
    setSelectedPlanId(newId);
  }
  function handleOverwriteCurrent() {
    setSavedMealPlans(prev =>
      prev.map(p =>
        p.id === selectedPlanId
          ? { ...p, plan: JSON.parse(JSON.stringify(editablePlan)) }
          : p
      )
    );
  }
  function handleDeleteCurrent() {
    if (savedMealPlans.length === 1) return; // Prevent deleting last
    const filtered = savedMealPlans.filter(p => p.id !== selectedPlanId);
    setSavedMealPlans(filtered);
    setSelectedPlanId(filtered[0].id);
  }

  // Inline editing of plan
  function handleAssignMeal(day, meal, recipeId) {
    setEditablePlan(prev => ({
      ...prev,
      [day]: { ...prev[day], [meal]: recipeId }
    }));
  }
  function handleClearMeal(day, meal) {
    setEditablePlan(prev => ({
      ...prev,
      [day]: { ...prev[day], [meal]: null }
    }));
  }
  // ============= END PLAN MANAGEMENT =============

  // ============= GROCERY LIST GENERATION ==========
  // Aggregate grocery list from planned meals - categorize and count ingredients
  const groceryList = useMemo(() => {
    // Collect all recipe IDs in current plan
    const usedRecipeIds = [];
    Object.entries(editablePlan).forEach(([day, meals]) =>
      Object.entries(meals).forEach(([meal, rid]) => { if (rid != null) usedRecipeIds.push(rid); })
    );
    // Flatten all ingredient objects and group by name+category -> dedupe with summed counts where possible
    const ingredientMap = {};
    usedRecipeIds.forEach(rid => {
      const recipe = mockRecipes.find(r => r.id === rid);
      if (!recipe) return;
      recipe.ingredients.forEach(ing => {
        const key = `${ing.name}|${ing.category}`;
        if (!ingredientMap[key]) {
          ingredientMap[key] = {
            ...ing,
            count: 1
          };
        } else {
          ingredientMap[key].count += 1; // just a rough count - could improve for real
        }
      });
    });
    return Object.values(ingredientMap).sort((a, b) => (a.category > b.category ? 1 : a.category < b.category ? -1 : a.name.localeCompare(b.name)));
  }, [editablePlan, mockRecipes]);

  // Group by category:
  function groupByCategory(items) {
    const map = {};
    items.forEach(item => {
      map[item.category] = map[item.category] || [];
      map[item.category].push(item);
    });
    return map;
  }
  const categorizedList = useMemo(() => groupByCategory(groceryList), [groceryList]);

  // ============= CHECK-OFF / REMOVAL STATE =============
  // Store checked/removed map in useState, but key state should persist per-groceryList content.
  const [checkedMap, setCheckedMap] = useState({});
  const [removedMap, setRemovedMap] = useState({});

  // Reset check/removed if groceryList changes identity
  React.useEffect(() => {
    setCheckedMap({});
    setRemovedMap({});
    // eslint-disable-next-line
  }, [JSON.stringify(groceryList)]);

  // PUBLIC_INTERFACE
  /** Toggle check-off for given ingredient item key (name|category) */
  function handleToggleChecked(key) {
    setCheckedMap(prev => ({ ...prev, [key]: !prev[key] }));
  }
  // PUBLIC_INTERFACE
  /** Mark an item as removed by key (name|category) */
  function handleRemoveItem(key) {
    setRemovedMap(prev => ({ ...prev, [key]: true }));
  }
  // PUBLIC_INTERFACE
  /** Regenerate grocery list - resets checked and removed state */
  function handleRegenerate() {
    setCheckedMap({});
    setRemovedMap({});
  }

  // ========== UI/STYLE THEME VARS =========
  const sectionBg = "rgba(255,255,255,0.04)";
  const borderColor = "var(--border-color)";
  const kaviaAccent = "var(--kavia-orange)";
  const catTitleStyle = {
    color: 'var(--primary)', fontWeight: 700, fontSize: '1.05rem',
    letterSpacing: '.5px', marginBottom: 3, marginTop: 22
  };

  // Quick helpers
  function getRecipeTitle(recipeId) {
    const rec = mockRecipes.find(r => r.id === recipeId);
    return rec ? rec.title : '';
  }

  // ===== In-place new meal plan name input ====
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
              border: `1px solid ${borderColor}`, borderRadius: 5,
              padding: "7px 13px", marginBottom: 16, width: "100%"
            }}
            maxLength={30}
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn" style={{ background: 'var(--primary)' }} onClick={() => setShowSaveDialog(false)}>Cancel</button>
            <button
              className="btn"
              style={{ background: kaviaAccent }}
              onClick={() => {
                handleSavePlan(newPlanName);
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

  // [Main return]
  return (
    <div style={{ paddingTop: 18 }}>
      {/* Header */}
      <div style={{ textAlign: 'left', marginBottom: 12 }}>
        <div className="subtitle" style={{ color: kaviaAccent }}>Grocery List</div>
        <h1 className="title" style={{ fontSize: "2.16rem", color: "var(--primary)" }}>
          Shopping Made Easy
        </h1>
        <div className="description" style={{ maxWidth: 620 }}>
          Instantly generate your categorized grocery list from any meal plan.
          Check off items as you shop, remove what you don't need, and regenerate as meal plans change.
        </div>
      </div>

      {/* PLAN MANAGEMENT BAR */}
      <div style={{
        display: "flex", flexDirection: "row", gap: 10,
        alignItems: "center", marginBottom: 28
      }}>
        <label style={{ color: kaviaAccent, fontWeight: 500, fontSize: '.99rem' }}>
          Meal Plan:
        </label>
        <select
          value={selectedPlanId}
          style={{
            border: `1px solid ${borderColor}`, borderRadius: 6, padding: "6px 18px",
            background: "var(--kavia-dark)", color: "var(--primary)", fontWeight: 600
          }}
          onChange={e => setSelectedPlanId(Number(e.target.value))}
        >
          {savedMealPlans.map(p =>
            <option value={p.id} key={p.id}>{p.name}</option>
          )}
        </select>
        <button
          className="btn"
          style={{ background: kaviaAccent, fontWeight: 600, fontSize: '.98rem', padding: '7px 13px' }}
          onClick={handleRegenerate}
        >
          Regenerate List
        </button>
        <button
          className="btn"
          style={{ background: 'var(--primary)' }}
          onClick={() => setShowSaveDialog(true)}
          title="Save as New Meal Plan"
        >
          Save as New
        </button>
        <button
          className="btn"
          style={{ background: 'var(--primary)' }}
          onClick={handleOverwriteCurrent}
          title="Overwrite Current Meal Plan"
        >
          Overwrite
        </button>
        <button
          className="btn"
          style={{ background: 'rgba(200,30,30,0.95)' }}
          onClick={handleDeleteCurrent}
          disabled={savedMealPlans.length === 1}
          title={savedMealPlans.length === 1 ? "Can't delete last plan" : "Delete this meal plan"}
        >
          Delete
        </button>
        {showSaveDialog && saveDialog()}
      </div>

      {/* Meal plan viewer/editor */}
      <div style={{
        background: sectionBg, border: `1px solid ${borderColor}`, borderRadius: 11,
        marginBottom: 24, boxShadow: "0 2px 12px rgba(33,50,30,0.07)",
        overflowX: "auto", maxWidth: 900
      }}>
        <div style={{ padding: "8px 10px" }}>
          <div style={{ fontWeight: 600, color: "var(--primary)", fontSize: ".97rem", marginBottom: 4 }}>
            Edit Meals for This Plan
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: `50px ${weekDays.map(() => "1fr").join(" ")}`,
            gap: 0,
            alignItems: "center"
          }}>
            <div />
            {weekDays.map(day =>
              <div key={day} style={{ color: 'var(--kavia-orange)', fontWeight: 700, textAlign: 'center', fontSize: ".99rem" }}>{day}</div>
            )}
            {mealTypes.map(meal => (
              <React.Fragment key={meal}>
                <div style={{ color: "var(--accent)", fontWeight: 500, textAlign: "right", fontSize: ".96rem", paddingRight: 3 }}>{meal}</div>
                {weekDays.map(day => {
                  const rid = editablePlan[day][meal];
                  return (
                    <div key={day + '-' + meal} style={{ textAlign: 'center', height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {rid ?
                        <span style={{ color: "var(--primary)", fontWeight: 500 }}>
                          {getRecipeTitle(rid)}
                          <button
                            className="btn"
                            style={{ background: 'var(--accent)', color: '#fff', padding: '0 8px', fontSize: ".95rem", marginLeft: 4 }}
                            onClick={() => handleClearMeal(day, meal)}
                            tabIndex={0}
                            aria-label="Clear meal"
                          >×</button>
                        </span>
                        :
                        <select
                          value=""
                          style={{
                            background: "var(--kavia-dark)", color: "var(--primary)", border: `1px solid ${kaviaAccent}`,
                            borderRadius: 6, fontWeight: 500, fontSize: '.93rem', padding: "4px 8px", minWidth: 80
                          }}
                          onChange={e => handleAssignMeal(day, meal, Number(e.target.value))}
                          aria-label={`Assign recipe to ${day} - ${meal}`}
                        >
                          <option value="">+ Add</option>
                          {mockRecipes.map(r => (
                            <option value={r.id} key={r.id}>{r.title}</option>
                          ))}
                        </select>
                      }
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* GROCERY LIST SECTION */}
      <div
        style={{
          background: sectionBg, border: `1px solid ${borderColor}`,
          borderRadius: 13, padding: "28px 24px", maxWidth: 780, margin: "0 auto",
          boxShadow: "0 2px 14px rgba(36,27,7,0.03)"
        }}
      >
        <div style={{ fontWeight: 600, color: kaviaAccent, fontSize: "1.16rem", marginBottom: 16, letterSpacing: ".3px" }}>
          Grocery List ({Object.values(groceryList).filter(i => !removedMap[`${i.name}|${i.category}`]).length} items)
        </div>
        {groceryList.length === 0 ? (
          <div style={{ color: "var(--text-secondary)", fontSize: "1.09rem", padding: 40 }}>
            No grocery items found – assign recipes to your meal plan to generate items!
          </div>
        ) : (
          Object.entries(categorizedList).map(([cat, items]) => (
            <div key={cat} style={{ marginBottom: 13 }}>
              <div style={catTitleStyle}>{cat}</div>
              <ul style={{
                padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7
              }}>
                {items.map(ing => {
                  const key = `${ing.name}|${ing.category}`;
                  if (removedMap[key]) return null;
                  return (
                    <li key={key} style={{
                      display: "flex", alignItems: "center", background: checkedMap[key] ? "rgba(232,122,65,0.12)" : "var(--secondary)",
                      borderRadius: 5, padding: "8px 10px", marginBottom: 2,
                      border: `1px solid ${borderColor}`,
                      opacity: checkedMap[key] ? 0.65 : 1,
                      textDecoration: checkedMap[key] ? "line-through" : "none"
                    }}>
                      <input
                        type="checkbox"
                        checked={!!checkedMap[key]}
                        onChange={() => handleToggleChecked(key)}
                        style={{ accentColor: kaviaAccent, marginRight: 10 }}
                        aria-label={`Mark "${ing.name}" as obtained`}
                      />
                      <span style={{ flex: 2, fontWeight: 600, color: "var(--kavia-dark)" }}>{ing.name}</span>
                      <span style={{ flex: 1, color: "var(--primary)", marginLeft: 6 }}>
                        {ing.quantity}{ing.count > 1 ? `  ×${ing.count}` : ""}
                      </span>
                      <button
                        className="btn"
                        style={{
                          background: "var(--kavia-orange)", color: "#fff", fontSize: ".97rem",
                          padding: "2px 10px", marginLeft: 8, borderRadius: 5
                        }}
                        onClick={() => handleRemoveItem(key)}
                        aria-label={`Remove ${ing.name}`}
                      >Remove</button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GroceryList;
