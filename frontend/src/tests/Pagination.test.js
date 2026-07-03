import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Pagination from "../components/Pagination";

describe("Pagination", () => {
  test("disables Previous on page 1", () => {
    render(
      <Pagination
        currentPage={1}
        totalItems={240}
        itemsPerPage={10}
        onPageChange={jest.fn()}
      />
    );

    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
  });

  test("disables Next on the last page", () => {
    render(
      <Pagination
        currentPage={24}
        totalItems={240}
        itemsPerPage={10}
        onPageChange={jest.fn()}
      />
    );

    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  test("calls onPageChange when a page number is clicked", () => {
    const onPageChange = jest.fn();

    render(
      <Pagination
        currentPage={1}
        totalItems={240}
        itemsPerPage={10}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "3" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  test("shows ellipsis for large page counts in the middle", () => {
    render(
      <Pagination
        currentPage={5}
        totalItems={500}
        itemsPerPage={10}
        onPageChange={jest.fn()}
      />
    );

    expect(screen.getAllByText("...")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "50" })).toBeInTheDocument();
  });

  test("shows correct pages near the start", () => {
    render(
      <Pagination
        currentPage={2}
        totalItems={500}
        itemsPerPage={10}
        onPageChange={jest.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "4" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "50" })).toBeInTheDocument();
  });

  test("shows correct pages near the end without duplicating the last page", () => {
    render(
      <Pagination
        currentPage={48}
        totalItems={500}
        itemsPerPage={10}
        onPageChange={jest.fn()}
      />
    );

    const lastPageButtons = screen.getAllByRole("button", { name: "50" });
    expect(lastPageButtons).toHaveLength(1);

    expect(screen.getByRole("button", { name: "47" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "48" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "49" })).toBeInTheDocument();
  });

  test("hides pagination when there is only one page", () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalItems={8}
        itemsPerPage={10}
        onPageChange={jest.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });
});