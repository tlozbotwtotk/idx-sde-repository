import React, { useState, useEffect, useRef } from "react"; // <-- NEW: import useRef

function PropertyImageCarousel({ photoData, alt = "Property" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const imgRef = useRef(null); // <-- NEW: create the ref

  // Safely parse photos whether passed as a JSON string or an array
  let photos = [];
  if (photoData) {
    if (Array.isArray(photoData)) {
      photos = photoData.filter((photo) => typeof photo === "string" && photo.trim() !== "");
    } else if (typeof photoData === "string") {
      try {
        const parsedPhotos = JSON.parse(photoData);
        if (Array.isArray(parsedPhotos)) {
          photos = parsedPhotos.filter((photo) => typeof photo === "string" && photo.trim() !== "");
        }
      } catch (error) {
        console.error("Invalid photoData JSON:", error);
      }
    }
  }

  // Reset error and loading state whenever the active photo index changes
  useEffect(() => {
    setImageError(false);
    setLoading(true);

    // <-- NEW: If the browser already has this cached, clear loading instantly!
    if (imgRef.current && imgRef.current.complete) {
      setLoading(false);
    }
  }, [currentIndex]);

  function handlePrevious(event) {
    event.stopPropagation();
    setCurrentIndex((previousIndex) =>
      previousIndex === 0 ? photos.length - 1 : previousIndex - 1
    );
  }

  function handleNext(event) {
    event.stopPropagation();
    setCurrentIndex((previousIndex) =>
      previousIndex === photos.length - 1 ? 0 : previousIndex + 1
    );
  }

  const imageAreaStyle = {
    width: "100%",
    height: "220px",
    position: "relative",
    overflow: "hidden",
  };

  const placeholderStyle = {
    width: "100%",
    height: "220px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  if (photos.length === 0) {
    return (
      <div className="property-image-carousel">
        <div className="property-image-placeholder" style={placeholderStyle}>
          No property image available
        </div>
      </div>
    );
  }

  const currentPhoto = photos[currentIndex];

  return (
    <div className="property-image-carousel">
      {imageError ? (
        <div className="property-image-placeholder" style={placeholderStyle}>
          Image unavailable
        </div>
      ) : (
        <div style={imageAreaStyle}>
          <img
            ref={imgRef} // <-- NEW: attach the ref here
            key={currentPhoto}
            src={currentPhoto}
            alt={alt}
            className="property-image"
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setImageError(true);
            }}
            style={{
              width: "100%",
              height: "220px",
              objectFit: "cover",
              display: "block",
              opacity: loading ? 0 : 1,
              transition: "opacity 0.15s ease",
            }}
          />

          {loading && (
            <div
              className="property-image-placeholder"
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Property image loading...
            </div>
          )}
        </div>
      )}

      {photos.length > 1 && (
        <div
          className="carousel-controls"
          style={{
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: 0,
          }}
        >
          <button
            type="button"
            className="carousel-button"
            onClick={handlePrevious}
            aria-label="Previous photo"
          >
            ←
          </button>

          <span
            className="carousel-counter"
            style={{
              minWidth: "60px",
              textAlign: "center",
            }}
          >
            {currentIndex + 1} / {photos.length}
          </span>

          <button
            type="button"
            className="carousel-button"
            onClick={handleNext}
            aria-label="Next photo"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

export default PropertyImageCarousel;