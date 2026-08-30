import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import PropertyImageCarousel from "./PropertyImageCarousel";

function PropertyCard({ property, isFavorite, onToggleFavorite }) {
  const navigate = useNavigate();
  const favorite = isFavorite(property.L_ListingID);

  function handleClick() {
    navigate(`/property/${property.L_ListingID}`);
  }

  function handleHeartClick(e) {
    e.stopPropagation();
    onToggleFavorite(property);
  }

  return (
    <div className="property-card" onClick={handleClick} style={{ position: "relative", cursor: "pointer" }}>
      <button 
        onClick={handleHeartClick}
        aria-label="Save to favorites"
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "white",
          border: "none",
          borderRadius: "50%",
          width: "35px",
          height: "35px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          zIndex: 2,
          fontSize: "18px"
        }}
      >
        {favorite ? "❤️" : "🤍"}
      </button>

      <PropertyImageCarousel
        photoData={property.L_Photos}
        alt={property.L_Address}
      />

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
          <span>{property.LM_Int2_3?.toLocaleString()} sqft</span>
        </div>
      </div>
    </div>
  );
}

PropertyCard.propTypes = {
  property: PropTypes.shape({
    L_ListingID: PropTypes.string.isRequired,
    L_SystemPrice: PropTypes.number,
    L_Address: PropTypes.string,
    L_City: PropTypes.string,
    L_State: PropTypes.string,
    L_Keyword2: PropTypes.number,
    LM_Dec_3: PropTypes.number,
    LM_Int2_3: PropTypes.number,
    L_Photos: PropTypes.array
  }).isRequired,
  isFavorite: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired
};

export default PropertyCard;