import React from "react";
import { NavLink, useLocation } from "react-router-dom";

// PUBLIC_INTERFACE
/**
 * NavBar - Top navigation bar for MealMaster Planner.
 * Displays navigation links styled with theme colors, highlights active route, and leaves space for auth/buttons.
 *
 * Refactored: Use NavLink for all nav routes with correct paths and "end" prop only for root dashboard. Ensures active styling for Dashboard only on "/" exactly.
 */
function NavBar() {
  const location = useLocation();
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
            aria-current={location.pathname === "/" ? "page" : undefined}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/recipes"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
            aria-current={location.pathname === "/recipes" ? "page" : undefined}
          >
            Recipes
          </NavLink>
          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
            aria-current={location.pathname === "/calendar" ? "page" : undefined}
          >
            Calendar
          </NavLink>
          <NavLink
            to="/grocery-list"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
            aria-current={location.pathname === "/grocery-list" ? "page" : undefined}
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
