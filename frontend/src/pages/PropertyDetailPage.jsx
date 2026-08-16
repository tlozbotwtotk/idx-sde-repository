import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchPropertyDetail,
  fetchOpenHouses,
} from "../api/client";
import PropertyImageGallery from "../components/PropertyImageGallery";
import PropertyMap from "../components/PropertyMap";
import "../App.css";

function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [openHouses, setOpenHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPropertyData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [propertyData, openHousesData] = await Promise.all([
        fetchPropertyDetail(id),
        fetchOpenHouses(id),
      ]);

      setProperty(propertyData);
      setOpenHouses(openHousesData);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load property details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPropertyData();
  }, [loadPropertyData]);

  function formatPrice(price) {
    if (price == null) {
      return "Price unavailable";
    }
    return `$${Number(price).toLocaleString()}`;
  }

  function formatDate(date) {
    if (!date) return "";
    const dateString = String(date).split("T")[0];
    const [year, month, day] = dateString.split("-");
    const localDate = new Date(year, month - 1, day);

    return localDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatTime(time) {
    if (!time) return "";

    const [hours, minutes] = String(time).split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function getOpenHouseRemarks(openHouse) {
    if (!openHouse?.all_data) return "";

    try {
      const data = JSON.parse(openHouse.all_data);
      return data.OpenHouseRemarks || "";
    } catch (err) {
      console.error("Invalid open house all_data JSON:", err);
      return "";
    }
  }

  if (loading) {
    return (
      <div className="property-detail-page">
        Loading property details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="property-detail-page">
        <h2>Unable to load property</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/")}>Back to Listings</button>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="property-detail-page">
        <h2>Property not found</h2>
        <button onClick={() => navigate("/")}>Back to Listings</button>
      </div>
    );
  }

  const sectionStyle = { marginBottom: "50px" };
  const headingStyle = { fontSize: "28px", marginBottom: "18px" };
  const indentedStyle = { marginLeft: "20px", lineHeight: "1.8" };

  return (
    <div className="property-detail-page">
      <button
        className="btn-back"
        onClick={() => navigate("/")}
        style={{ marginBottom: "40px" }}
      >
        ← Back to Listings
      </button>

      <div style={{ marginBottom: "50px" }}>
        <PropertyImageGallery
          photoData={property?.L_Photos}
          alt={property?.L_Address}
        />
      </div>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Price</h2>
        <div>{formatPrice(property?.L_SystemPrice)}</div>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Address</h2>
        <div>
          {property?.L_Address}
          {property?.L_City && `, ${property.L_City}`}
          {property?.L_State && `, ${property.L_State}`}
          {property?.L_Zip && ` ${property.L_Zip}`}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Location</h2>
        <div style={indentedStyle}>
          <PropertyMap
            latitude={property?.LMD_MP_Latitude}
            longitude={property?.LMD_MP_Longitude}
          />
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Stats</h2>
        <div style={indentedStyle}>
          <div>
            <strong>Beds:</strong> {property?.L_Keyword2 ?? "—"}
          </div>
          <div>
            <strong>Baths:</strong> {property?.LM_Dec_3 ?? "—"}
          </div>
          <div>
            <strong>Square feet:</strong>{" "}
            {property?.LM_Int2_3 != null
              ? `${property.LM_Int2_3.toLocaleString()} ft²`
              : "—"}
          </div>
          <div>
            <strong>Year built:</strong> {property?.YearBuilt ?? "—"}
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Description</h2>
        <div style={{ lineHeight: "1.7" }}>
          {property?.L_Remarks || "No description available."}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Property Details</h2>
        <div style={indentedStyle}>
          {property?.L_Type_ && (
            <div>
              <strong>Property Type:</strong> {property.L_Type_}
            </div>
          )}
          {property?.LotSizeAcres != null && (
            <div>
              <strong>Lot Size:</strong> {property.LotSizeAcres} acres
            </div>
          )}
          {property?.OpenParkingSpaces != null && (
            <div>
              <strong>Open Parking:</strong> {property.OpenParkingSpaces}
            </div>
          )}
          {property?.StoriesTotal != null && (
            <div>
              <strong>Stories:</strong> {property.StoriesTotal}
            </div>
          )}
          {property?.Flooring && (
            <div>
              <strong>Flooring:</strong> {property.Flooring}
            </div>
          )}
          {property?.Heating && (
            <div>
              <strong>Heating:</strong> {property.Heating}
            </div>
          )}
          {property?.Cooling && (
            <div>
              <strong>Cooling:</strong> {property.Cooling}
            </div>
          )}
        </div>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={headingStyle}>Open Houses</h2>
        {openHouses.length > 0 ? (
          <div>
            {openHouses.map((openHouse) => {
              const remarks = getOpenHouseRemarks(openHouse);
              return (
                <div
                  key={openHouse.id}
                  style={{ marginLeft: "20px", marginBottom: "20px" }}
                >
                  <div>
                    <strong>Date:</strong> {formatDate(openHouse.OpenHouseDate)}
                  </div>
                  <div>
                    <strong>Time:</strong> {formatTime(openHouse.OH_StartTime)}
                    {" - "}
                    {formatTime(openHouse.OH_EndTime)}
                  </div>
                  {remarks && (
                    <div>
                      <strong>Remarks:</strong> {remarks}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ marginLeft: "20px" }}>No open houses scheduled</div>
        )}
      </section>
    </div>
  );
}

export default PropertyDetailPage;