import React from "react";
import { useNavigate, Link } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import NoResultsMessage from "../components/NoResultsMessage";
import { useFavorites } from "../hooks/useFavorites";
import "../styles/ListingsPage.css";
import "../styles/PropertyDetailPage.css";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, favoritesCount, clearFavorites } = useFavorites();

  return (
    <div className="listings-page">
      <header className="hero-banner">
        <div className="hero-overlay">
          <h1>Favorites</h1>
          <p className="hero-count">
            {favoritesCount} saved properties{" "}
          </p>
        </div>
      </header>

      <div className="listings-subpage">
        <div className="favorites-header-actions">
          <button
            className="back-button"
            type="button"
            onClick={() => navigate(-1)}
          >
            ← Back to Listings
          </button>

          {favorites.length > 0 && (
            <button
              type="button"
              className="clear-favorites-btn"
              onClick={clearFavorites}
            >
              Clear Favorites
            </button>
          )}
        </div>

        {favorites.length === 0 ? (
          <NoResultsMessage
            title="No Favorites Yet"
            message="Tap the heart on any property to save it here."
          />
        ) : (
          <div className="property-grid">
            {favorites.map((property) => (
              <PropertyCard
                key={property.L_ListingID}
                property={property}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}