import React, { useEffect, useState } from "react";
import { fetchProperties } from "../api/client";
import PropertyFilters from "../components/PropertyFilters";
import Pagination from "../components/Pagination";
import "../App.css";

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const totalPages = Math.ceil(total / itemsPerPage);

  useEffect(() => {
    loadProperties();
  }, [filters, currentPage]);

  async function loadProperties() {
    try {
      setLoading(true);
      setError(null);

      const offset = (currentPage - 1) * itemsPerPage;

      const data = await fetchProperties({
        ...filters,
        limit: itemsPerPage,
        offset: offset,
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
    setCurrentPage(1);
  }

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  }

  const startResult =
    total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endResult = Math.min(currentPage * itemsPerPage, total);

  return (
    <div>
      <h1>Property Listings</h1>

      <PropertyFilters
        onSearch={handleSearch}
      />

      {loading ? (
        <div>Loading properties...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          <p>
            Showing {startResult}-{endResult} of {total} properties
          </p>

          {properties.length === 0 ? (
            <div className="no-results">
              No properties found. Try adjusting your filters.
            </div>
          ) : (
            <>
              <div className="property-grid">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.L_ListingID}
                    property={property}
                  />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

function PropertyCard({ property }) {
  const photo = getFirstPhoto(property.L_Photos);

  return (
    <div className="property-card">
      {photo ? (
        <img
          src={photo}
          alt={property.L_Address}
          className="property-image"
        />
      ) : (
        <div className="property-image-placeholder">
          No image available
        </div>
      )}

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
          <span>{property.L_Keyword2} beds</span>

          <span>•</span>

          <span>{property.LM_Dec_3} baths</span>

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