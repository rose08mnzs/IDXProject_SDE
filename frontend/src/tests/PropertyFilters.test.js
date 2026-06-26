import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PropertyFilters from "../components/PropertyFilters";

describe("PropertyFilters", () => {
  const defaultFilters = {
    city: "",
    zipcode: "",
    minPrice: "",
    maxPrice: "",
    beds: "",
    baths: "",
  };

  const defaultFilterOptions = {
    beds: [1, 2, 3, 4, 5],
    baths: [1, 2, 3, 4, 5],
  };

  test("renders all six inputs", () => {
    render(
      <PropertyFilters
        filters={defaultFilters}
        setFilters={jest.fn()}
        onSearch={jest.fn()}
        onClear={jest.fn()}
        filterOptions={defaultFilterOptions}
      />
    );

    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/min price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/max price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^beds$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^baths$/i)).toBeInTheDocument();
  });

  test("submitting sends the combined filters", () => {
    const onSearch = jest.fn();
    const setFilters = jest.fn();

    render(
      <PropertyFilters
        filters={defaultFilters}
        setFilters={setFilters}
        onSearch={onSearch}
        onClear={jest.fn()}
        filterOptions={defaultFilterOptions}
      />
    );

    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: "Austin" },
    });
    fireEvent.change(screen.getByLabelText(/zip code/i), {
      target: { value: "78701" },
    });
    fireEvent.change(screen.getByLabelText(/min price/i), {
      target: { value: "250000" },
    });
    fireEvent.change(screen.getByLabelText(/max price/i), {
      target: { value: "750000" },
    });
    fireEvent.change(screen.getByLabelText(/^beds$/i), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByLabelText(/^baths$/i), {
      target: { value: "2" },
    });

    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  test("clear resets the form and calls onClear", () => {
    const onClear = jest.fn();
    const setFilters = jest.fn();

    render(
      <PropertyFilters
        filters={defaultFilters}
        setFilters={setFilters}
        onSearch={jest.fn()}
        onClear={onClear}
        filterOptions={defaultFilterOptions}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /clear filters/i }));

    expect(onClear).toHaveBeenCalledTimes(1);
  });
});