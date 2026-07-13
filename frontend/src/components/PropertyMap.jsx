import React from "react";
import "../styles/PropertyMap.css";

export default function PropertyMap({ latitude, longitude }) {
  const lat = Number(latitude);
  const lng = Number(longitude);

  if (!lat || !lng) {
     return (
    <div className="property-map map-placeholder">
      <div className="map-placeholder-content">
        <div className="map-placeholder-icon">📍</div>
        <h3>Location Unavailable</h3>
        <p>
          The location for this property has not been provided.
        </p>
      </div>
    </div>
  );
  }

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return <div className="map-error">Map unavailable</div>;
  }

  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=15`;

  return (
    <div className="property-map">
      <iframe
        title="Property map"
        width="100%"
        height="350"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={src}
      />
      <div className="property-map-footer">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
          target="_blank"
          rel="noreferrer"
          className="directions-button"
        >
          Get Directions
        </a>
      </div>
    </div>
  );
}