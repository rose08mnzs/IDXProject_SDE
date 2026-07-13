import React, { useMemo, useState } from "react";
import { getPhotoUrls } from "../utility/photos";

export default function PropertyImageCarousel({ photosRaw, altText = "Property" }) {
  const photos = useMemo(() => getPhotoUrls(photosRaw), [photosRaw]);
  const [index, setIndex] = useState(0);

  console.log("photos:", photos.length > 0 ? photos[0] : "");

  if (photos.length === 0) {
    return <div className="property-image placeholder">No photo available</div>;
  }

  const goPrev = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const goNext = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % photos.length);
  };

  return (
    <div className="image-carousel">
      <img src={photos[index]} alt={altText} className="property-image"  onError={(e) => {
        e.currentTarget.src = "/placeholder.jpg";
      }} />

      {photos.length > 1 && (
        <>
          <button type="button" onClick={goPrev} className="carousel-arrow left">
            ‹
          </button>
          <button type="button" onClick={goNext} className="carousel-arrow right">
            ›
          </button>
          <div className="carousel-counter">
            {index + 1} / {photos.length}
          </div>
        </>
      )}
    </div>
  );
}