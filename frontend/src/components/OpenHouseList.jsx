import React from "react";
import "../styles/OpenHouseList.css";

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(timeString) {
  if (!timeString) return "";

  const [hours, minutes] = timeString.split(":");

  const date = new Date();
  date.setHours(Number(hours));
  date.setMinutes(Number(minutes));

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getRemarks(allData) {
  if (!allData) return "";

  try {
    const parsed =
      typeof allData === "string"
        ? JSON.parse(allData)
        : allData;

    return parsed.OpenHouseRemarks || "";
  } catch {
    return "";
  }
}

export default function OpenHouseList({ openHouses }) {
  if (!openHouses || openHouses.length === 0) {
    return (
      <div className="openhouse-empty">
        No open houses scheduled.
      </div>
    );
  }

  return (
    <div className="openhouse-list">
      {openHouses.map((house, index) => (
        <div className="openhouse-card" key={index}>

          <div className="openhouse-row">
            <span className="icon">📅</span>
            <span>{formatDate(house.OpenHouseDate)}</span>
          </div>

          <div className="openhouse-row">
            <span className="icon">🕐</span>
            <span>
              {formatTime(house.OH_StartTime)} – {formatTime(house.OH_EndTime)}
            </span>
          </div>

          {getRemarks(house.all_data) && (
            <div className="remarks">
              {getRemarks(house.all_data)}
            </div>
          )}

        </div>
      ))}
    </div>
  );
}