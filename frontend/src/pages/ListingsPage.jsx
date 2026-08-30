import { useEffect, useState, useCallback } from "react";
import { fetchProperties } from "../api/client";
import { useFavorites } from "../hooks/useFavorites";
import PropertyFilters from "../components/PropertyFilters";
import Pagination from "../components/Pagination";
import PropertyCard from "../components/PropertyCard";
import "../App.css";

const SAVED_FILTERS_KEY = "propertyListingFilters";
const SAVED_PAGE_KEY = "propertyListingCurrentPage";
const SAVED_SORT_BY_KEY = "propertyListingSortBy";
const SAVED_SORT_ORDER_KEY = "propertyListingSortOrder";

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { favorites, isFavorite, toggleFavorite, favoritesCount } = useFavorites();

  const [filters, setFilters] = useState(() => {
    try {
      const savedFilters = sessionStorage.getItem(SAVED_FILTERS_KEY);
      return savedFilters ? JSON.parse(savedFilters) : {};
    } catch {
      console.error("Failed to load saved filters");
      return {};
    }
  });

  const [currentPage, setCurrentPage] = useState(() => {
    try {
      const savedPage = sessionStorage.getItem(SAVED_PAGE_KEY);
      return savedPage ? Number(savedPage) : 1;
    } catch {
      console.error("Failed to load saved page");
      return 1;
    }
  });

  const [sortBy, setSortBy] = useState(() => {
    try {
      return sessionStorage.getItem(SAVED_SORT_BY_KEY) || "";
    } catch {
      return "";
    }
  });

  const [sortOrder, setSortOrder] = useState(() => {
    try {
      return sessionStorage.getItem(SAVED_SORT_ORDER_KEY) || "ASC";
    } catch {
      return "ASC";
    }
  });

  const [itemsPerPage] = useState(20);

  const displayedProperties = showFavoritesOnly ? favorites : properties;
  const totalPages = showFavoritesOnly ? 1 : Math.ceil(total / itemsPerPage);

  const loadProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const offset = (currentPage - 1) * itemsPerPage;

      const queryParams = {
        ...filters,
        limit: itemsPerPage,
        offset: offset,
      };

      if (sortBy) {
        queryParams.sortBy = sortBy;
        queryParams.sortOrder = sortOrder;
      }

      const data = await fetchProperties(queryParams);

      setProperties(data.results);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
      setError("Failed to load properties. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, sortBy, sortOrder, itemsPerPage]);

  useEffect(() => {
    let isMounted = true;

    if (!showFavoritesOnly) {
      const timer = setTimeout(() => {
        if (isMounted) {
          loadProperties();
        }
      }, 0);

      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    }
  }, [loadProperties, showFavoritesOnly]);

  function handleSearch(newFilters) {
    setShowFavoritesOnly(false);
    setFilters(newFilters);
    setCurrentPage(1);
    setSortBy("");
    setSortOrder("ASC");

    sessionStorage.setItem(SAVED_FILTERS_KEY, JSON.stringify(newFilters));
    sessionStorage.setItem(SAVED_PAGE_KEY, "1");
    sessionStorage.removeItem(SAVED_SORT_BY_KEY);
    sessionStorage.setItem(SAVED_SORT_ORDER_KEY, "ASC");
  }

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
    sessionStorage.setItem(SAVED_PAGE_KEY, String(newPage));
    window.scrollTo(0, 0);
  }

  function handleSortByChange(e) {
    const value = e.target.value;
    setSortBy(value);
    setCurrentPage(1);
    sessionStorage.setItem(SAVED_SORT_BY_KEY, value);
    sessionStorage.setItem(SAVED_PAGE_KEY, "1");
    if (value) {
      sessionStorage.setItem(SAVED_SORT_ORDER_KEY, sortOrder);
    } else {
      sessionStorage.removeItem(SAVED_SORT_BY_KEY);
    }
  }

  function handleSortOrderChange(e) {
    const value = e.target.value;
    setSortOrder(value);
    setCurrentPage(1);
    sessionStorage.setItem(SAVED_SORT_ORDER_KEY, value);
    sessionStorage.setItem(SAVED_PAGE_KEY, "1");
  }

  const startResult = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endResult = Math.min(currentPage * itemsPerPage, total);

  const isDateSort = sortBy === "ListingContractDate";
  const ascLabel = isDateSort ? "Oldest" : "Ascending";
  const descLabel = isDateSort ? "Newest" : "Descending";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <button 
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          style={{ 
            cursor: "pointer", 
            background: showFavoritesOnly ? "#27ae60" : "#3498db", 
            color: "white", 
            padding: "8px 16px", 
            borderRadius: "4px",
            border: "none",
            fontWeight: "bold"
          }}
        >
          {showFavoritesOnly ? "Show All Listings" : `❤️ Favorites (${favoritesCount})`}
        </button>
      </div>

      <h1>{showFavoritesOnly ? "My Favorite Properties" : "Property Listings"}</h1>

      {!showFavoritesOnly && (
        <>
          <PropertyFilters
            onSearch={handleSearch}
            savedFilters={filters}
          />

          <div className="sort-controls" style={{ margin: "20px 0", display: "flex", justifyContent: "center", gap: "15px", alignItems: "center" }}>
            <label>
              Sort by:{" "}
              <select id="sort-by-select" name="sortBy" value={sortBy} onChange={handleSortByChange}>
                <option value="">Default</option>
                <option value="L_SystemPrice">Price</option>
                <option value="ListingContractDate">Date Listed</option>
                <option value="LM_Int2_3">Size (SqFt)</option>
                <option value="L_Keyword2">Bedrooms</option>
                <option value="LM_Dec_3">Bathrooms</option>
              </select>
            </label>

            {sortBy && (
              <label>
                Order:{" "}
                <select id="sort-order-select" name="sortOrder" value={sortOrder} onChange={handleSortOrderChange}>
                  <option value="ASC">{ascLabel}</option>
                  <option value="DESC">{descLabel}</option>
                </select>
              </label>
            )}
          </div>
        </>
      )}

      {loading && !showFavoritesOnly ? (
        <div>Loading properties...</div>
      ) : error && !showFavoritesOnly ? (
        <div>{error}</div>
      ) : (
        <>
          {!showFavoritesOnly && (
            <p>
              Showing {startResult}-{endResult} of {total} properties
            </p>
          )}

          {displayedProperties.length === 0 ? (
            <div className="no-results">
              {showFavoritesOnly 
                ? "You haven't saved any favorite properties yet." 
                : "No properties found. Try adjusting your filters."}
            </div>
          ) : (
            <>
              <div className="property-grid">
                {displayedProperties.map((property) => (
                  <PropertyCard
                    key={property.L_ListingID}
                    property={property}
                    isFavorite={isFavorite}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>

              {!showFavoritesOnly && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ListingsPage;