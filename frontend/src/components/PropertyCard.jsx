import React from "react";
import { getFirstPhotoUrl } from "../utility/photos";
import "../styles/PropertyCard.css";
export default function PropertyCard({ property }) {
  const photoUrl = getFirstPhotoUrl(property.L_Photos);
console.log("Listing:", property.L_ListingID);
console.log("Raw L_Photos:", property.L_Photos);
console.log("First photo url:", photoUrl);
  const price =
    property.L_SystemPrice !== null && property.L_SystemPrice !== undefined
      ? `$${Number(property.L_SystemPrice).toLocaleString()}`
      : "Price unavailable";

  const beds = property.L_Keyword2 ?? "—";
  const baths = property.LM_Dec_3 ?? "—";
  const sqft = property.LM_Int2_3 ?? "—";

  return (
    <div className="property-card">
      <div className="property-image-wrap">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={property.L_Address || "Property"}
            className="property-image"
          />
        ) : (
          <div className="property-image placeholder">No photo available</div>
        )}
      </div>


      <div className="property-content">

        <div className="address">{property.L_Address || "Address unavailable"}</div>

        <div className="location">
          <span className="icon">📍</span>
          <span className="text">
            {[property.L_City, property.L_State]
              .filter(Boolean)
              .join(", ")}
          </span>
        </div>

        <div className="details">
          <div className="detail-item">
            <span className="icon">🛏 </span>
            <span>{beds} beds</span>
          </div>

          <div className="detail-item">
            <span className="icon">🛁 </span>
            <span>{baths} baths</span>
          </div>

          <div className="detail-item">
            <span className="icon">📐 </span>
            <span>{sqft} sqft</span>
          </div>
        </div>
        <div className="price">{price}</div>
      </div>
    </div>
  );
}