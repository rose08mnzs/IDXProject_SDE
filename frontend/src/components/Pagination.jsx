import React, { useEffect, useState,useRef } from "react";
import "../styles/Pagination.css";

function buildPageItems(currentPage, totalPages) {
  if (totalPages <= 1) return [];

  // Show all pages when the page count is small
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items = [];

  const addPage = (page) => {
    if (!items.includes(page)) {
      items.push(page);
    }
  };

  addPage(1);

  // For the start - show first 5 pages, ellipsis, last page
  if (currentPage <= 4) {
    for (let page = 2; page <= 5; page += 1) {
      addPage(page);
    }
    items.push("...");
    addPage(totalPages);
    return items;
  }

  // for the end - show first page, ellipsis, last 5 pages
  if (currentPage >= totalPages - 3) {
    items.push("...");
    for (let page = totalPages - 4; page <= totalPages; page += 1) {
      addPage(page);
    }
    return items;
  }

  //  for the middle -show first page, ellipsis, current-1/current/current+1, ellipsis, last page
  items.push("...");
  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    addPage(page);
  }
  items.push("...");
  addPage(totalPages);

  return items;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) {
    return null;
  }

  const pageItems = buildPageItems(currentPage, totalPages);

  return (
    <nav className="pagination" aria-label="Property pagination">
      <button
        type="button"
        className="pagination-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      <div className="pagination-pages">
        {pageItems.map((item, index) =>
          item === "..." ? (
            <span key={`ellipsis-${index}`} className="pagination-ellipsis">
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`pagination-page ${
                currentPage === item ? "active" : ""
              }`}
              onClick={() => onPageChange(item)}
              aria-current={currentPage === item ? "page" : undefined}
            >
              {item}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        className="pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </nav>
  );
}