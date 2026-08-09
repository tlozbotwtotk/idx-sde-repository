import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return <div style={{ height: "96px" }} />;
  }

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  function handlePrevious() {
    if (canGoPrevious) {
      onPageChange(currentPage - 1);
    }
  }

  function handleNext() {
    if (canGoNext) {
      onPageChange(currentPage + 1);
    }
  }

  function getPageNumbers() {
    if (totalPages <= 4) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    const pages = new Set([
      1,
      totalPages,
      currentPage,
    ]);

    if (currentPage > 1) {
      pages.add(currentPage - 1);
    }

    if (currentPage < totalPages) {
      pages.add(currentPage + 1);
    }

    const sortedPages = Array.from(pages).sort(
      (a, b) => a - b
    );

    const result = [];

    sortedPages.forEach((page, index) => {
      const previousPage = sortedPages[index - 1];

      if (index > 0 && page - previousPage > 1) {
        result.push("...");
      }

      result.push(page);
    });

    return result;
  }

  return (
    <div
      className="pagination"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        margin: "30px 0",
      }}
    >
      <button
        className="pagination-btn"
        onClick={handlePrevious}
        disabled={!canGoPrevious}
        style={{
          padding: "8px 16px",
          border: "1px solid #ddd",
          background: "white",
          borderRadius: "4px",
          cursor: canGoPrevious ? "pointer" : "not-allowed",
          fontSize: "14px",
          opacity: canGoPrevious ? 1 : 0.5,
        }}
      >
        ← Previous
      </button>

      <div
        className="pagination-numbers"
        style={{
          display: "flex",
          gap: "5px",
        }}
      >
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="pagination-ellipsis"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 5px",
                color: "#666",
              }}
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              className={`pagination-number ${
                page === currentPage ? "active" : ""
              }`}
              onClick={() => onPageChange(page)}
              style={{
                minWidth: "36px",
                height: "36px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight:
                  page === currentPage ? "700" : "400",
                border:
                  page === currentPage
                    ? "2px solid #1976d2"
                    : "1px solid #ddd",
                background:
                  page === currentPage
                    ? "#1976d2"
                    : "white",
                color:
                  page === currentPage
                    ? "white"
                    : "#333",
                boxShadow:
                  page === currentPage
                    ? "0 2px 6px rgba(25, 118, 210, 0.4)"
                    : "none",
              }}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        className="pagination-btn"
        onClick={handleNext}
        disabled={!canGoNext}
        style={{
          padding: "8px 16px",
          border: "1px solid #ddd",
          background: "white",
          borderRadius: "4px",
          cursor: canGoNext ? "pointer" : "not-allowed",
          fontSize: "14px",
          opacity: canGoNext ? 1 : 0.5,
        }}
      >
        Next →
      </button>
    </div>
  );
}

export default Pagination;