import React from "react";

function PropertyMap({ latitude, longitude }) {
  if (
    latitude == null ||
    longitude == null ||
    latitude === "" ||
    longitude === ""
  ) {
    return null;
  }

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(
    apiKey
  )}&q=${encodeURIComponent(`${latitude},${longitude}`)}&zoom=15`;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${latitude},${longitude}`
  )}`;

  return (
    <div className="property-map-container">
      <div
        style={{
          width: "100%",
          height: "400px",
          marginBottom: "12px",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <iframe
          title="Property Location Map"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={mapUrl}
        ></iframe>
      </div>

      <div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#0066cc",
            textDecoration: "underline",
            fontWeight: "500",
          }}
        >
          Get Directions
        </a>
      </div>
    </div>
  );
}

export default PropertyMap;