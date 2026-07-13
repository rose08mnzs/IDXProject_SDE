import React from "react";
import "../styles/PropertyDetails.css";

function prettifyText(value) {
  return String(value)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatBooleanLike(value) {
  if (value === true || value === 1 || value === "1" || value === "Y" || value === "Yes") {
    return "Yes";
  }
  if (value === false || value === 0 || value === "0" || value === "N" || value === "No") {
    return "No";
  }
  return null;
}

function formatList(value) {
  if (!value) return null;

  const items = Array.isArray(value)
    ? value
    : String(value).split(",");

  const cleaned = items
    .map((item) => prettifyText(item))
    .map((item) => item.replace(/\bSee Remarks\b/i, ""))
    .map((item) => item.trim())
    .filter(Boolean);

  if (cleaned.length === 0) return null;
  return cleaned.join(", ");
}

function formatValue(label, value) {
  if (value === null || value === undefined || value === "") return null;

  const boolValue = formatBooleanLike(value);
  if (boolValue !== null) return boolValue;

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (/^\d{4}-\d{2}-\d{2}T/.test(trimmed) || /^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const formattedDate = formatDate(trimmed);
      if (formattedDate) return formattedDate;
    }

    if (trimmed.toLowerCase() === "seeremarks") {
      return null;
    }

    if (trimmed.includes(",")) {
      const formattedList = formatList(trimmed);
      if (formattedList) return formattedList;
    }

    return prettifyText(trimmed);
  }

  if (typeof value === "number") {
    if (
      label.toLowerCase().includes("price") ||
      label.toLowerCase().includes("fee")
    ) {
      return `$${Number(value).toLocaleString()}`;
    }

    if (Number.isInteger(value)) return value.toLocaleString();
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  return prettifyText(value);
}

function DetailRow({ label, value }) {
  const formatted = formatValue(label, value);
  if (formatted === null || formatted === "") return null;

  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{formatted}</span>
    </div>
  );
}

function DetailGroup({ title, items }) {
  const visibleItems = items.filter((item) => {
    const formatted = formatValue(item.label, item.value);
    return formatted !== null && formatted !== "";
  });

  if (visibleItems.length === 0) return null;

  return (
    <section className="detail-group">
      <h3 className="detail-group-title">{title}</h3>
      <div className="detail-group-list">
        {visibleItems.map((item) => (
          <DetailRow key={item.label} label={item.label} value={item.value} />
        ))}
      </div>
    </section>
  );
}

export default function PropertyDetails({ property }) {
  const overview = [
    { label: "Property Type", value: property.L_Type_ },
    // { label: "Status", value: property.StandardStatus || property.L_Status },
    { label: "MLS Listing ID", value: property.L_ListingID },
    // { label: "Bedrooms", value: property.L_Keyword2 },
    // { label: "Bathrooms", value: property.LM_Dec_3 },
    // {
    //   label: "Living Area",
    //   value:
    //     property.LM_Int2_3 !== null && property.LM_Int2_3 !== undefined
    //       ? `${property.LM_Int2_3} ${property.LivingAreaUnits || "sqft"}`
    //       : "",
    // },
    {
      label: "Lot Size",
      value:
        property.LotSizeAcres
          ? `${property.LotSizeAcres} acres`
          : property.LotSizeSquareFeet
          ? `${property.LotSizeSquareFeet} sq ft`
          : "",
    },
    // { label: "Year Built", value: property.YearBuilt },
    { label: "Stories", value: property.StoriesTotal },
  ];

  const interior = [
    { label: "Flooring", value: property.Flooring },
    { label: "Appliances", value: property.Appliances },
    { label: "Heating", value: property.Heating },
    { label: "Cooling", value: property.Cooling },
    { label: "Fireplace", value: property.FireplaceYN },
    { label: "Interior Features", value: property.InteriorFeatures },
  ];

  const exterior = [
    { label: "Garage", value: property.GarageYN || property.AttachedGarageYN },
    { label: "Pool", value: property.PoolPrivateYN },
    { label: "Spa", value: property.SpaYN },
    { label: "Fencing", value: property.Fencing },
    { label: "Patio / Porch", value: property.PatioAndPorchFeatures },
    { label: "Roof", value: property.Roof },
  ];

  const community = [
    { label: "Subdivision", value: property.SubdivisionName },
    { label: "School District", value: property.HighSchoolDistrict },
    { label: "HOA", value: property.AssociationYN },
    {
      label: "HOA Fee",
      value:
        property.AssociationFee !== null && property.AssociationFee !== undefined
          ? property.AssociationFee
          : "",
    },
    { label: "HOA Amenities", value: property.AssociationAmenities },
    { label: "Community Features", value: property.CommunityFeatures },
  ];

  const listingInfo = [
    { label: "Days on Market", value: property.DaysOnMarket },
    { label: "Listing Date", value: property.ListingContractDate },
    { label: "Original Entry", value: property.OriginalEntryTimestamp },
    { label: "Price Change", value: property.PriceChangeTimestamp },
    {
      label: "Previous List Price",
      value: property.PreviousListPrice,
    },
  ];

  return (
    <div className="property-details-grid">
      <DetailGroup title="Overview" items={overview} />
      <DetailGroup title="Interior" items={interior} />
      <DetailGroup title="Exterior" items={exterior} />
      <DetailGroup title="Community" items={community} />
      <DetailGroup title="Listing Info" items={listingInfo} />
    </div>
  );
}