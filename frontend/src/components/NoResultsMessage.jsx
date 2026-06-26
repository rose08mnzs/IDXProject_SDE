import React from "react";
import "../styles/NoResultsMessage.css";

export default function NoResultsMessage({
  title = "No Results Found",
  message = "Try different filters.",
}) {
  return (
    <div className="no-results-container">
      <div className="no-results-icon">🔍</div>

      <h2>{title}</h2>

      <p>{message}</p>
    </div>
  );
}