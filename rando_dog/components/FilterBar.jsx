import React from "react";

function FilterBar({ filters, removeFilter }) {
  return (
    <div className="filter-bar">
      <h3>Active Filters</h3>
      {filters.length === 0 && <p>No filters applied</p>}
      {filters.map((filter, index) => (
        <button
          key={index}
          className="filter-button"
          onClick={() => removeFilter(index)}
        >
          {filter.value} ✕
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
