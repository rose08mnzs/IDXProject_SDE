import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPropertyDetail, fetchPropertyOpenHouses } from "../api/client";
import PropertyImageGallery from "../components/PropertyImageGallery";
import PropertyMap from "../components/PropertyMap";
import OpenHouseList from "../components/OpenHouseList";
import "../styles/PropertyDetailPage.css";
import PropertyDetails from "../components/PropertyDetails";
import DescriptionCard from "../components/DescriptionCard";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/Loading";

function formatPrice(value) {
  if (value === null || value === undefined || value === "") return "Price unavailable";
  return `$${Number(value).toLocaleString()}`;
}

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [openHouses, setOpenHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  console.log("Property:", property);
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const [propertyData, openHouseData] = await Promise.all([
          fetchPropertyDetail(id),
          fetchPropertyOpenHouses(id),
        ]);

        setProperty(propertyData);
        setOpenHouses(openHouseData);
      } catch (err) {
        setError(err.message || "Failed to load property.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!property) return  <ErrorMessage message={"Property not found."} />;

  const price = formatPrice(property.L_SystemPrice);

  return (
    <div className="detail-page">
      <button className="back-button" type="button" onClick={() => navigate(-1)}>
        ← Back to Listings
      </button>

      <div className="summary-card">
        <div className="summary-left">

           
          <h1 className="summary-address">{property.L_Address}</h1>

          <div className="summary-location">
            <span className="location-dot">📍</span>
            <span>
              {property.L_City}, {property.L_State} {property.L_Zip}
            </span>
          </div>
        </div>

        <div className="summary-stats">

          <div className="stat-item">
            <div className="stat-icon">🛏️</div>
            <div className="stat-value">{property.L_Keyword2 ?? "—"}</div>
            <div className="stat-label">beds</div>
          </div>

          <div className="stat-divider"></div>

          <div className="stat-item">
            <div className="stat-icon">🛁</div>
            <div className="stat-value">{property.LM_Dec_3 ?? "—"}</div>
            <div className="stat-label">baths</div>
          </div>

          <div className="stat-divider"></div>

          <div className="stat-item">
            <div className="stat-icon">📐</div>
            <div className="stat-value">{property.LM_Int2_3 ?? "—"}</div>
            <div className="stat-label">sqft</div>
          </div>

          <div className="stat-divider"></div>

          <div className="stat-item">
            <div className="stat-icon">📅</div>
            <div className="stat-value">{property.YearBuilt ?? "—"}</div>
            <div className="stat-label">year built</div>
          </div>

        </div>
      </div>

      <div className="content-grid">
        <section className="panel gallery-panel">
          <PropertyImageGallery
            photosRaw={property.L_Photos}
            altText={property.L_Address || "Property"}
          />
        </section>

        <div>

          <section className="panel description-panel">
            <div className="detail-row">
              <div className="summary-price">
                <h2 >Price</h2>{price}
              </div>
            </div>
            <br />
            
          <DescriptionCard
    description={property.L_Remarks}
   
/>
        </section>
        </div>
      </div>

      <div className="middle-grid">
        <section className="panel">
          <h2>Property Details</h2>
          <PropertyDetails property={property} />
        </section>
      </div>


      <div className="bottom-grid">
        <section className="panel map-panel">
          <h2>Map</h2>
          <PropertyMap
            latitude={property.LMD_MP_Latitude}
            longitude={property.LMD_MP_Longitude}
          />
        </section>
        <section className="panel open-house-panel">
          <h2>Open Houses</h2>
          <OpenHouseList openHouses={openHouses} />
        </section>
      </div>

    </div>
  );
}