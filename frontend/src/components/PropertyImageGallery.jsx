import React, { useEffect, useMemo, useState } from "react";
import { getPhotoUrls } from "../utility/photos";
import "../styles/PropertyImageGallery.css";

export default function PropertyImageGallery({ photosRaw, altText = "Property" }) {
  const photos = useMemo(() => {
    const list = getPhotoUrls(photosRaw);
    return Array.isArray(list) ? list : [];
  }, [photosRaw]);

  const [validPhotos, setValidPhotos] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setValidPhotos(photos);
    setSelectedIndex(0);
  }, [photos]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen || validPhotos.length === 0) return;

      if (e.key === "Escape") {
        setLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev - 1 + validPhotos.length) % validPhotos.length);
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev + 1) % validPhotos.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, validPhotos.length]);

  const removeBrokenPhoto = (photo) => {
    setValidPhotos((prev) => {
      const updated = prev.filter((p) => p !== photo);
      setSelectedIndex((current) => Math.min(current, Math.max(updated.length - 1, 0)));
      return updated;
    });
  };

  if (validPhotos.length === 0) {
    return <div className="gallery-empty">No photos available</div>;
  }

  const selectedPhoto = validPhotos[selectedIndex] || validPhotos[0];

  return (
    <div className="property-gallery">
      <div className="gallery-main-wrap">
        <button
          type="button"
          className="gallery-main"
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={selectedPhoto}
            alt={altText}
            className="gallery-main-image"
            onError={() => removeBrokenPhoto(selectedPhoto)}
          />
        </button>

        <div className="gallery-counter">
          {selectedIndex + 1} / {validPhotos.length}
        </div>
      </div>

      <div className="gallery-thumbnails">
        {validPhotos.map((photo, index) => (
          <button
            key={`${photo}-${index}`}
            type="button"
            className={`gallery-thumb ${index === selectedIndex ? "active" : ""}`}
            onClick={() => setSelectedIndex(index)}
          >
            <img
              src={photo}
              alt={`${altText} thumbnail ${index + 1}`}
              className="gallery-thumb-image"
              onError={() => removeBrokenPhoto(photo)}
            />
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <div className="lightbox" onClick={() => setLightboxOpen(false)}>
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setLightboxOpen(false)}
          >
            ×
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-nav left"
              onClick={() =>
                setSelectedIndex((prev) => (prev - 1 + validPhotos.length) % validPhotos.length)
              }
            >
              ‹
            </button>

            <img src={selectedPhoto} alt={altText} className="lightbox-image" />

            <div className="lightbox-counter">
              {selectedIndex + 1} / {validPhotos.length}
            </div>

            <button
              type="button"
              className="lightbox-nav right"
              onClick={() =>
                setSelectedIndex((prev) => (prev + 1) % validPhotos.length)
              }
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}