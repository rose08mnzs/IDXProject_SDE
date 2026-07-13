import React, { useState } from "react";
import "../styles/DescriptionCard.css";

export default function DescriptionCard({
  title = "Description",
  header,
  description,
}) {
  const [expanded, setExpanded] = useState(false);

  const hasLongText = description && description.length > 1100;
  console.log("Description length:", description ? description.length : 0);
  console.log("hasLongText:", hasLongText); 
  console.log("expanded:", expanded); 
  console.log("!expanded && !hasLongText ? expanded : collapsed", !expanded || !hasLongText ? "expanded" : "collapsed"); 
  
  let descriptionClass = "";

  if (!expanded && !hasLongText) {
    descriptionClass = "expanded";
  }
  else if (!expanded && hasLongText) {
    descriptionClass = "collapsed";
  }
  else if (expanded) {
    descriptionClass = "expanded";
  }
  else {
    descriptionClass = "collapsed";
  }
  return (
    <div className="description-card">

      {header && (
        <div className="description-header">
          {header}
        </div>
      )}

      <div className="description-body">
        <h2>{title}</h2>

        <div className={`description-text ${descriptionClass}`}>
          {description || "No description available."}
        </div>

        {hasLongText && (
          <button
            className="read-more-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show Less" : "Read More"}
          </button>
        )}
      </div>

    </div>
  );
}