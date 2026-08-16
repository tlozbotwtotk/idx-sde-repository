import React, { useEffect, useState } from "react";

const INITIAL_FILTERS = {
  city: "",
  zipcode: "",
  minPrice: "",
  maxPrice: "",
  beds: "",
  baths: "",
};

const FILTER_ROWS = [
  {
    key: "city",
    label: "City",
    type: "text",
    placeholder: "Enter city",
  },
  {
    key: "zipcode",
    label: "ZIP Code",
    type: "text",
    placeholder: "Enter ZIP",
  },
  {
    key: "minPrice",
    label: "Min Price",
    type: "number",
    placeholder: "Minimum price",
  },
  {
    key: "maxPrice",
    label: "Max Price",
    type: "number",
    placeholder: "Maximum price",
  },
  {
    key: "beds",
    label: "Beds",
    type: "select",
    options: ["1", "2", "3", "4", "5"],
  },
  {
    key: "baths",
    label: "Baths",
    type: "select",
    options: ["1", "2", "3", "4"],
  },
];

function PropertyFilters({
  onSearch,
  savedFilters = {},
}) {
  const [filters, setFilters] = useState({
    ...INITIAL_FILTERS,
    ...savedFilters,
  });

  useEffect(() => {
    setFilters({
      ...INITIAL_FILTERS,
      ...savedFilters,
    });
  }, [savedFilters]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanFilters = {};

    Object.entries(filters).forEach(
      ([key, value]) => {
        if (
          typeof value === "string" &&
          value.trim() !== ""
        ) {
          cleanFilters[key] = value.trim();
        }
      }
    );

    onSearch(cleanFilters);
  };

  const handleClear = () => {
    setFilters(INITIAL_FILTERS);
    onSearch({});
  };

  const boxStyle = {
    width: "420px",
    boxSizing: "border-box",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    backgroundColor: "#fff",
  };

  const rowContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "11px",
  };

  const rowStyle = {
    display: "grid",
    gridTemplateColumns: "100px 1fr",
    alignItems: "center",
    gap: "10px",
    minHeight: "32px",
  };

  const labelStyle = {
    fontSize: "14px",
    fontWeight: "500",
  };

  const inputStyle = {
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    padding: "7px 10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    lineHeight: "18px",
    backgroundColor: "#fff",
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div style={boxStyle}>
          <h3
            style={{
              marginTop: 0,
              marginBottom: "16px",
              fontSize: "18px",
            }}
          >
            Filter Options
          </h3>

          <div style={rowContainerStyle}>
            {FILTER_ROWS.map((filter) => (
              <div
                key={filter.key}
                style={rowStyle}
              >
                <label
                  htmlFor={filter.key}
                  style={labelStyle}
                >
                  {filter.label}
                </label>

                {filter.type === "select" ? (
                  <select
                    id={filter.key}
                    name={filter.key}
                    value={filters[filter.key]}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="">Any</option>

                    {filter.options.map(
                      (option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}+
                        </option>
                      )
                    )}
                  </select>
                ) : (
                  <input
                    id={filter.key}
                    type={filter.type}
                    name={filter.key}
                    value={filters[filter.key]}
                    onChange={handleChange}
                    placeholder={
                      filter.placeholder
                    }
                    style={inputStyle}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          marginTop: "16px",
        }}
      >
        <button type="submit">
          Search
        </button>

        <button
          type="button"
          onClick={handleClear}
        >
          Clear Filters
        </button>
      </div>
    </form>
  );
}

export default PropertyFilters;