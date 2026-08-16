import React, { useEffect, useState } from "react";

function PropertyImageGallery({ photoData, alt = "Property" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [mainImageLoading, setMainImageLoading] = useState(true);
  const [mainImageError, setMainImageError] = useState(false);
  const [lightboxImageLoading, setLightboxImageLoading] =
    useState(true);
  const [lightboxImageError, setLightboxImageError] =
    useState(false);
  const [thumbnailErrors, setThumbnailErrors] = useState({});

  let photos = [];

  if (photoData) {
    try {
      const parsedPhotos = JSON.parse(photoData);

      if (Array.isArray(parsedPhotos)) {
        photos = parsedPhotos.filter(
          (photo) =>
            typeof photo === "string" &&
            photo.trim() !== ""
        );
      }
    } catch (error) {
      console.error("Invalid L_Photos JSON:", error);
    }
  }

  /*
   * Close the lightbox when the Escape key is pressed.
   */
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setLightboxOpen(false);
      }
    }

    if (lightboxOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen]);

  if (photos.length === 0) {
    return (
      <div className="property-image-gallery">
        <div
          className="property-image-placeholder"
          style={{
            width: "100%",
            height: "450px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          No property image available
        </div>
      </div>
    );
  }

  const currentPhoto = photos[currentIndex];

  function handlePrevious(event) {
    event?.stopPropagation();

    setMainImageLoading(true);
    setMainImageError(false);

    setCurrentIndex((previousIndex) =>
      previousIndex === 0
        ? photos.length - 1
        : previousIndex - 1
    );
  }

  function handleNext(event) {
    event?.stopPropagation();

    setMainImageLoading(true);
    setMainImageError(false);

    setCurrentIndex((previousIndex) =>
      previousIndex === photos.length - 1
        ? 0
        : previousIndex + 1
    );
  }

  function handleThumbnailClick(index) {
    setMainImageLoading(true);
    setMainImageError(false);
    setCurrentIndex(index);
  }

  function handleMainImageLoad() {
    setMainImageLoading(false);
    setMainImageError(false);
  }

  function handleMainImageError() {
    setMainImageLoading(false);
    setMainImageError(true);
  }

  function handleThumbnailError(index) {
    setThumbnailErrors((previousErrors) => ({
      ...previousErrors,
      [index]: true,
    }));
  }

  function openLightbox() {
    setLightboxImageLoading(true);
    setLightboxImageError(false);
    setLightboxOpen(true);
  }

  function closeLightbox() {
    setLightboxOpen(false);
  }

  function handleLightboxImageLoad() {
    setLightboxImageLoading(false);
    setLightboxImageError(false);
  }

  function handleLightboxImageError() {
    setLightboxImageLoading(false);
    setLightboxImageError(true);
  }

  function handleLightboxPrevious(event) {
    event.stopPropagation();

    setLightboxImageLoading(true);
    setLightboxImageError(false);

    setCurrentIndex((previousIndex) =>
      previousIndex === 0
        ? photos.length - 1
        : previousIndex - 1
    );
  }

  function handleLightboxNext(event) {
    event.stopPropagation();

    setLightboxImageLoading(true);
    setLightboxImageError(false);

    setCurrentIndex((previousIndex) =>
      previousIndex === photos.length - 1
        ? 0
        : previousIndex + 1
    );
  }

  return (
    <>
      <div className="property-image-gallery">
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "450px",
            overflow: "hidden",
            cursor: "pointer",
            backgroundColor: "#f5f5f5",
          }}
          onClick={openLightbox}
        >
          {mainImageLoading && !mainImageError && (
            <div
              className="property-image-placeholder"
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              Property image loading...
            </div>
          )}

          {mainImageError ? (
            <div
              className="property-image-placeholder"
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span>
                Image
                <br />
                unavailable
              </span>
            </div>
          ) : (
            <img
              key={currentPhoto}
              src={currentPhoto}
              alt={alt}
              onLoad={handleMainImageLoad}
              onError={handleMainImageError}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                opacity: mainImageLoading ? 0 : 1,
                transition: "opacity 0.15s ease",
              }}
            />
          )}

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevious}
                aria-label="Previous photo"
                style={{
                  position: "absolute",
                  left: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                }}
              >
                ←
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next photo"
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                }}
              >
                →
              </button>
            </>
          )}
        </div>

        {photos.length > 1 && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
              overflowX: "auto",
              paddingBottom: "5px",
            }}
          >
            {photos.map((photo, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleThumbnailClick(index)}
                aria-label={`View photo ${index + 1}`}
                style={{
                  padding: 0,
                  border:
                    index === currentIndex
                      ? "3px solid #333"
                      : "3px solid transparent",
                  borderRadius: "4px",
                  background: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                  width: "90px",
                  height: "65px",
                  overflow: "hidden",
                }}
              >
                {thumbnailErrors[index] ? (
                  <div
                    style={{
                      width: "90px",
                      height: "65px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      fontSize: "11px",
                      color: "#666",
                      textAlign: "center",
                      lineHeight: "1.2",
                    }}
                  >
                    <span>
                      Image
                      <br />
                      unavailable
                    </span>
                  </div>
                ) : (
                  <img
                    src={photo}
                    alt={`Property photo ${index + 1}`}
                    onError={() =>
                      handleThumbnailError(index)
                    }
                    style={{
                      width: "90px",
                      height: "65px",
                      objectFit: "cover",
                      display: "block",
                      borderRadius: "2px",
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          onClick={closeLightbox}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close image"
            style={{
              position: "absolute",
              top: "20px",
              right: "25px",
              zIndex: 1002,
              fontSize: "30px",
            }}
          >
            ×
          </button>

          {photos.length > 1 && (
            <button
              type="button"
              onClick={handleLightboxPrevious}
              aria-label="Previous photo"
              style={{
                position: "absolute",
                left: "25px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1002,
                fontSize: "30px",
              }}
            >
              ←
            </button>
          )}

          {lightboxImageLoading &&
            !lightboxImageError && (
              <div
                style={{
                  position: "absolute",
                  color: "white",
                  fontSize: "18px",
                }}
              >
                Property image loading...
              </div>
            )}

          {lightboxImageError ? (
            <div
              style={{
                color: "white",
                fontSize: "18px",
                textAlign: "center",
              }}
            >
              Image
              <br />
              unavailable
            </div>
          ) : (
            <img
              key={currentPhoto}
              src={currentPhoto}
              alt={alt}
              onLoad={handleLightboxImageLoad}
              onError={handleLightboxImageError}
              onClick={(event) =>
                event.stopPropagation()
              }
              style={{
                maxWidth: "90%",
                maxHeight: "85vh",
                objectFit: "contain",
                opacity: lightboxImageLoading ? 0 : 1,
                transition: "opacity 0.15s ease",
              }}
            />
          )}

          {photos.length > 1 && (
            <button
              type="button"
              onClick={handleLightboxNext}
              aria-label="Next photo"
              style={{
                position: "absolute",
                right: "25px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1002,
                fontSize: "30px",
              }}
            >
              →
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default PropertyImageGallery;