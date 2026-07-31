import React, { useEffect, useState } from "react";
import { fetchProperties } from "../api/client";
import PropertyFilters from "../components/PropertyFilters";
import "../App.css";

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadProperties();
  }, [filters]);

  async function loadProperties() {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchProperties({
        ...filters,
        limit: 20,
        offset: 0,
      });

      setProperties(data.results);
      setTotal(data.total);

    } catch (err) {
      console.error(err);
      setError("Failed to load properties. Please try again.");

    } finally {
      setLoading(false);
    }
  }

  function handleSearch(newFilters) {
    setFilters(newFilters);
  }

  if (loading) {
    return (
      <div className="loading">
        Loading properties...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        {error}
      </div>
    );
  }

  return (
    <div className="listings-page">
      <h1>Property Listings</h1>

      <PropertyFilters onSearch={handleSearch} />

      <p>
        Showing {properties.length} of {total} properties
      </p>

      {properties.length === 0 ? (
        <div className="no-results">
          No properties found. Try adjusting your filters.
        </div>
      ) : (
        <div className="property-grid">
          {properties.map((property) => (
            <PropertyCard
              key={property.L_ListingID}
              property={property}
            />
          ))}
        </div>
      )}
    </div>
  );
}


function PropertyCard({ property }) {
  const photo = getFirstPhoto(property.L_Photos);

  return (
    <div className="property-card">

      <div className="property-image">
        {photo ? (
          <img
            src={photo}
            alt={property.L_Address}
          />
        ) : (
          <div className="no-image">
            No image available
          </div>
        )}
      </div>


      <div className="property-info">

        <div className="price">
          ${property.L_SystemPrice?.toLocaleString()}
        </div>

        <div className="address">
          {property.L_Address}
        </div>

        <div className="city">
          {property.L_City}, {property.L_State}
        </div>

        <div className="property-details">
          <span>
            {property.L_Keyword2} beds
          </span>

          <span>•</span>

          <span>
            {property.LM_Dec_3} baths
          </span>

          <span>•</span>

          <span>
            {property.LM_Int2_3?.toLocaleString()} sqft
          </span>
        </div>

      </div>

    </div>
  );
}


function getFirstPhoto(photoData) {
  if (!photoData) {
    return null;
  }

  try {
    const photos = JSON.parse(photoData);

    if (Array.isArray(photos) && photos.length > 0) {
      return photos[0];
    }

    return null;

  } catch (error) {
    console.error("Invalid L_Photos JSON:", error);
    return null;
  }
}


export default ListingsPage;