import BrandList from "../../components/BrandList";
import useApi from "../../hooks/useApi";
import { act, render, screen } from "@testing-library/react";
import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../hooks/useApi", () => ({
  default: vi.fn(() => ({
    brandsGet: vi.fn(() =>
      Promise.resolve({
        data: {
          brands: [
            {
              id: "1",
              name: "Acme",
            },
          ],
          pagination: {
            page: 1,
            total: 1,
          },
        },
      })
    ),
  })),
}));

function buildComponent(props = {}) {
  return (
    <MemoryRouter>
      <BrandList {...props} />
    </MemoryRouter>
  );
}

it("renders successfully", async () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  await act(async () => root.render(buildComponent()));
});

describe("when the API returns error", () => {
  it("renders error", async () => {
    const message = "This is an error.";
    const brandsGet = vi.fn(() => ({ isError: true, message }));

    // @ts-ignore
    useApi.mockReturnValue({ brandsGet });

    await act(async () => render(buildComponent()));
    expect(screen.getByText(message)).toBeTruthy();
  });
});

describe("when the API returns success", () => {
  describe("when brands are empty", () => {
    it("renders `No brands yet.` message", async () => {
      const brandsGet = vi.fn(() => ({
        data: {
          brands: [],
          pagination: { page: 1, total: 1 },
        },
      }));

      // @ts-ignore
      useApi.mockReturnValue({ brandsGet });

      await act(async () => render(buildComponent()));
      expect(screen.getByText("No brands yet.")).toBeTruthy();
    });
  });

  describe("when brands are populated", () => {
    it("renders the list of brands", async () => {
      const brands = [
        { id: "1", name: "Brand1" },
        { id: "2", name: "Brand2" },
        { id: "3", name: "Brand3" },
      ];

      const brandsGet = vi.fn(() => ({
        data: {
          brands,
          pagination: { page: 1, total: 1 },
        },
      }));

      // @ts-ignore
      useApi.mockReturnValue({ brandsGet });

      await act(async () => render(buildComponent()));

      brands.forEach((brand) => {
        expect(screen.getByText(brand.name)).toBeTruthy();
      });
    });
  });

  describe("when pagination total > 1", () => {
    it("renders pagination", async () => {
      const brandsGet = vi.fn(() => ({
        data: {
          brands: [{ id: "1", name: "Acme" }],
          pagination: { page: 1, total: 2 },
        },
      }));

      // @ts-ignore
      useApi.mockReturnValue({ brandsGet });

      await act(async () => render(buildComponent()));
      expect(screen.getByTestId("pagination")).toBeTruthy();
    });
  });
});
