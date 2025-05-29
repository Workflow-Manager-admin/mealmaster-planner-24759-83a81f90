import React from "react";
import { NavLink } from "react-router-dom";

// PUBLIC_INTERFACE
/**
 * NavBar - Top navigation bar for MealMaster Planner.
 * Displays navigation links styled with theme colors, highlights active route, and leaves space for auth/buttons.
 */
function NavBar() {
  return (
    <nav className="navbar">
      <div className="container nav-container">
        <div className="logo">
          <span className="logo-symbol">*</span> MealMaster Planner
        </div>
        <div className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/recipes"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            Recipes
          </NavLink>
          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            Calendar
          </NavLink>
          <NavLink
            to="/grocery-list"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            Grocery List
          </NavLink>
          {/* Placeholder for future user auth/buttons */}
          <div className="nav-auth-placeholder"></div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
