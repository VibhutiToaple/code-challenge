// src/__tests__/panels/FruitViewPanel.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

const { successMock, errorMock, infoMock, buyMock, sellMock, getInventoryMock } = vi.hoisted(() => {
  return {
    successMock: vi.fn(),
    errorMock: vi.fn(),
    infoMock: vi.fn(),
    buyMock: vi.fn(),
    sellMock: vi.fn(),
    getInventoryMock: vi.fn(() => ({
      apple: 10,
      banana: 5,
      orange: 3,
    })),
  };
});

vi.mock("antd", async () => {
  const actual = await vi.importActual<any>("antd");
  return {
    ...actual,
    message: {
      success: successMock,
      error: errorMock,
      info: infoMock,
    },
  };
});

vi.mock("../../engine/MockFruitMachine", () => ({
  MockFruitMachine: vi.fn().mockImplementation(() => ({
    getInventory: getInventoryMock,
    buy: buyMock,
    sell: sellMock,
  })),
}));

import { FruitViewPanel } from "@panels/FruitViewPanel";

describe("<FruitViewPanel />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("handles successful buy correctly", () => {
    buyMock.mockReturnValue(true);
    render(<FruitViewPanel />);
    fireEvent.click(screen.getByText("Buy"));
    expect(successMock).toHaveBeenCalledWith("Bought 1 apple(s).");
  });
});
