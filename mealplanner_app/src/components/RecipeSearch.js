import React, { useState, useMemo } from 'react';

/**
 * RecipeSearch component
 * - Lists & filters recipes using mock data.
 * - Shows filter controls for ingredients, cuisine, and tags.
 * - Displays cards with recipe info and themed action buttons.
 * - Integrates with app/theme and matches Dashboard's visual style.
 */
// PUBLIC_INTERFACE
function RecipeSearch() {
  // Mock recipe data
  const mockRecipes = [
    {
      id: 1,
      title: 'Spicy Chickpea Curry',
      cuisine: 'Indian',
      ingredients: ['Chickpeas', 'Tomato', 'Onion', 'Garlic', 'Spices'],
      tags: ['Vegan', 'Gluten-Free', 'Main'],
      image: '', // Could be a placeholder image or emoji
      instructions: 'Serve with rice or naan.',
    },
    {
      id: 2,
      title: 'Greek Salad',
      cuisine: 'Mediterranean',
      ingredients: ['Tomato', 'Cucumber', 'Feta', 'Olives'],
      tags: ['Vegetarian', 'Low-Carb', 'Salad'],
      image: '',
      instructions: 'Toss all ingredients and serve chilled.',
    },
    {
      id: 3,
      title: 'Beef Tacos',
      cuisine: 'Mexican',
      ingredients: ['Beef', 'Taco Shells', 'Lettuce', 'Cheddar'],
      tags: ['Quick', 'Main'],
      image: '',
      instructions: 'Fill shells and top with veggies & cheese.',
    },
    {
      id: 4,
      title: 'Avocado Toast',
      cuisine: 'American',
      ingredients: ['Bread', 'Avocado', 'Egg'],
      tags: ['Vegetarian', 'Breakfast'],
      image: '',
      instructions: 'Top toasted bread with smashed avocado and egg.',
    },
    {
      id: 5,
      title: 'Chicken Stir Fry',
      cuisine: 'Asian',
      ingredients: ['Chicken', 'Broccoli', 'Carrot', 'Soy Sauce', 'Ginger'],
      tags: ['High-Protein', 'Main', 'Dairy-Free'],
      image: '',
      instructions: 'Sauté in wok. Serve over rice.',
    },
    {
      id: 6,
      title: 'Quinoa Bowl',
      cuisine: 'American',
      ingredients: ['Quinoa', 'Black Beans', 'Corn', 'Avocado'],
      tags: ['Vegan', 'Gluten-Free', 'Bowl'],
      image: '',
      instructions: 'Mix all, season to taste.',
    },
  ];

  // Extract all unique ingredient, cuisine, and tag options
  const allIngredients = useMemo(() => {
    const ing = new Set();
    mockRecipes.forEach(r => r.ingredients.forEach(i => ing.add(i)));
    return Array.from(ing).sort();
  }, [mockRecipes]);
  const allCuisines = useMemo(() => {
    const cu = new Set();
    mockRecipes.forEach(r => cu.add(r.cuisine));
    return Array.from(cu).sort();
  }, [mockRecipes]);
  const allTags = useMemo(() => {
    const t = new Set();
    mockRecipes.forEach(r => r.tags.forEach(tag => t.add(tag)));
    return Array.from(t).sort();
  }, [mockRecipes]);

  // Filter State
  const [search, setSearch] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  // Filtering Logic
  const filteredRecipes = useMemo(() => {
    return mockRecipes.filter(recipe => {
      // Text search (title/ingredients)
      if (
        search &&
        !(
          recipe.title.toLowerCase().includes(search.toLowerCase()) ||
          recipe.ingredients.some(ing => ing.toLowerCase().includes(search.toLowerCase()))
        )
      ) {
        return false;
      }
      // Ingredients filter (must include ALL selected)
      if (selectedIngredients.length) {
        const recipeSet = new Set(recipe.ingredients);
        if (!selectedIngredients.every(i => recipeSet.has(i))) {
          return false;
        }
      }
      // Cuisine filter (exact match)
      if (selectedCuisine && recipe.cuisine !== selectedCuisine) {
        return false;
      }
      // Tags filter (must include ALL selected)
      if (selectedTags.length) {
        const tagSet = new Set(recipe.tags);
        if (!selectedTags.every(t => tagSet.has(t))) {
          return false;
        }
      }
      return true;
    });
  }, [search, selectedIngredients, selectedCuisine, selectedTags, mockRecipes]);

  // Handler for multi-select (ingredients, tags)
  function handleSelectedMulti(value, selectedValues, setSelectedFunc) {
    if (selectedValues.includes(value)) {
      setSelectedFunc(selectedValues.filter(v => v !== value));
    } else {
      setSelectedFunc([...selectedValues, value]);
    }
  }

  // Handler for schedule/add (here: just an alert)
  function handleAddSchedule(recipe) {
    // You would eventually open a modal or add to plan here
    window.alert(`Add or schedule "${recipe.title}" to your meal plan!`);
  }

  // Card recipe colors (for a "blended" look)
  const cardBg = "rgba(255,255,255,0.05)";
  const cardBorder = "1px solid var(--border-color)";
  const cardHover = "rgba(232,122,65,0.12)";

  return (
    <div style={{
      width: '100%',
      paddingTop: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 30
    }}>
      {/* Header */}
      <div>
        <div className="subtitle" style={{ color: "var(--kavia-orange)" }}>Recipes</div>
        <h1 className="title" style={{ fontSize: "2.2rem", color: "var(--primary)" }}>Discover Recipes</h1>
        <div className="description" style={{ maxWidth: 600 }}>
          Find meals by ingredient, cuisine, or dietary needs. Try adding some filters to narrow down your search.
        </div>
      </div>

      {/* Filter Controls */}
      <div style={{
        background: cardBg,
        border: cardBorder,
        borderRadius: 12,
        padding: 20,
        display: 'flex',
        gap: 18,
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {/* Text search */}
        <input
          type="text"
          placeholder="Search recipes…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: '1 1 170px',
            border: '1px solid var(--border-color)',
            borderRadius: 5,
            padding: '8px 12px',
            outline: 'none',
            background: 'var(--kavia-dark)',
            color: 'var(--text-color)',
            fontSize: '1rem',
            minWidth: 120,
            marginRight: 8
          }}
        />

        {/* Ingredients multi-select */}
        <div style={{ minWidth: 120 }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '.95rem' }}>Ingredients: </span>
          {allIngredients.map(ing => (
            <label
              key={ing}
              style={{
                margin: '0 4px',
                fontSize: '.97rem',
                color: selectedIngredients.includes(ing) ? 'var(--accent)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: selectedIngredients.includes(ing) ? 600 : 400,
                textDecoration: selectedIngredients.includes(ing) ? "underline" : "none"
              }}
            >
              <input
                type="checkbox"
                checked={selectedIngredients.includes(ing)}
                onChange={() =>
                  handleSelectedMulti(ing, selectedIngredients, setSelectedIngredients)
                }
                style={{ marginRight: 2, accentColor: 'var(--kavia-orange)' }}
              />
              {ing}
            </label>
          ))}
        </div>

        {/* Cuisine select */}
        <div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '.95rem' }}>Cuisine: </span>
          <select
            value={selectedCuisine}
            onChange={e => setSelectedCuisine(e.target.value)}
            style={{
              background: 'var(--kavia-dark)',
              color: 'var(--text-color)',
              border: '1px solid var(--border-color)',
              borderRadius: 4,
              padding: '6px 12px',
              fontSize: '1rem'
            }}
          >
            <option value="">All</option>
            {allCuisines.map(c => (
              <option value={c} key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Tags multi-select */}
        <div style={{ minWidth: 120 }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '.95rem' }}>Tags: </span>
          {allTags.map(tag => (
            <label
              key={tag}
              style={{
                margin: '0 4px',
                fontSize: '.97rem',
                color: selectedTags.includes(tag) ? 'var(--primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: selectedTags.includes(tag) ? 600 : 400,
                textDecoration: selectedTags.includes(tag) ? "underline" : "none"
              }}
            >
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() =>
                  handleSelectedMulti(tag, selectedTags, setSelectedTags)
                }
                style={{ marginRight: 2, accentColor: 'var(--primary)' }}
              />
              {tag}
            </label>
          ))}
        </div>

        {/* Reset Filters Button */}
        {(search || selectedCuisine || selectedIngredients.length || selectedTags.length) && (
          <button
            className="btn"
            style={{
              marginLeft: 10,
              padding: '6px 18px',
              background: 'var(--primary)',
              color: '#fff'
            }}
            onClick={() => {
              setSearch('');
              setSelectedCuisine('');
              setSelectedIngredients([]);
              setSelectedTags([]);
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Recipe Cards List */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 26,
        }}
      >
        {filteredRecipes.length === 0 ? (
          <div style={{ color: 'var(--kavia-orange)', fontSize: '1.17rem', gridColumn: '1/-1', textAlign: 'center', padding: 32 }}>
            No recipes found. Try a different filter!
          </div>
        ) : (
          filteredRecipes.map(recipe => (
            <div
              key={recipe.id}
              style={{
                background: cardBg,
                border: cardBorder,
                borderRadius: 13,
                minHeight: 180,
                boxShadow: '0 2px 10px 0 rgba(36,27,7, 0.03)',
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                transition: 'background .2s',
                cursor: 'pointer'
              }}
              tabIndex={0}
              aria-label={`Recipe: ${recipe.title}`}
              onMouseOver={e => e.currentTarget.style.background = cardHover}
              onMouseOut={e => e.currentTarget.style.background = cardBg}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 6 }}>
                {/* Optionally use recipe.image or fallback emoji/icon */}
                <div style={{
                  fontSize: '2.1rem'
                }}>
                  {recipe.image || '🍴'}
                </div>
                <div>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '1.18rem',
                    color: 'var(--primary)',
                  }}>{recipe.title}</div>
                  <div style={{
                    color: 'var(--accent)',
                    fontWeight: 500,
                    fontSize: '.97rem',
                    margin: '2px 0'
                  }}>{recipe.cuisine}</div>
                  <div style={{
                    margin: '8px 0 0 0',
                    color: 'var(--text-secondary)',
                    fontWeight: 400,
                    fontSize: '.97rem'
                  }}>
                    <span style={{ opacity:.77 }}>Ingredients:</span> {recipe.ingredients.join(', ')}
                  </div>
                  <div style={{
                    marginTop: 2,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 6
                  }}>
                    {recipe.tags.map(tag => (
                      <span key={tag}
                        style={{
                          fontSize: '.85rem',
                          background: 'var(--secondary)',
                          color: 'var(--accent)',
                          borderRadius: 5,
                          padding: '2.5px 8px',
                          fontWeight: 600,
                          marginTop: 3
                        }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              {/* Instructions, if desired */}
              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '.92rem',
                  margin: '10px 0 12px 0'
                }}
              >{recipe.instructions}</div>
              <button
                className="btn"
                style={{
                  background: 'var(--kavia-orange)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '1rem',
                  letterSpacing: '.01em',
                  borderRadius: 6,
                  padding: '9px 0',
                  marginTop: 4
                }}
                onClick={() => handleAddSchedule(recipe)}
                tabIndex={0}
              >
                Add / Schedule
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RecipeSearch;
