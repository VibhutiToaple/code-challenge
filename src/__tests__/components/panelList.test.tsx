import React from "react";
import { describe, it, expect } from "vitest";
import { panelList } from "../../components/panelList";
import FruitBookPanel from "../../panels/FruitBookPanel";
import AboutPanel from "../../panels/AboutPanel";
import { FruitViewPanel } from "../../panels/FruitViewPanel";

describe("panelList configuration", () => {
  it("exports an array of panels", () => {
    expect(Array.isArray(panelList)).toBe(true);
    expect(panelList.length).toBe(3);
  });

  it("contains valid keys and titles", () => {
    const expectedKeys = ["fruitbook", "fruitview", "about"];
    const expectedTitles = ["Fruit Book", "Fruit View", "About"];

    const actualKeys = panelList.map((p) => p.key);
    const actualTitles = panelList.map((p) => p.title);

    expect(actualKeys).toEqual(expectedKeys);
    expect(actualTitles).toEqual(expectedTitles);
  });

  it("each panel has key, title, and content properties", () => {
    panelList.forEach((panel) => {
      expect(panel).toHaveProperty("key");
      expect(panel).toHaveProperty("title");
      expect(panel).toHaveProperty("content");
    });
  });

  it("each content is a valid React element", () => {
    panelList.forEach((panel) => {
      expect(React.isValidElement(panel.content)).toBe(true);
    });
  });

  it("matches each key with its respective component", () => {
    const map = {
      fruitbook: FruitBookPanel,
      fruitview: FruitViewPanel,
      about: AboutPanel,
    };

    panelList.forEach((panel) => {
      const Component = map[panel.key as keyof typeof map];
      // compare element types (since content is JSX)
      expect(panel.content.type).toBe(Component);
    });
  });

  it("has no duplicate keys", () => {
    const keys = panelList.map((p) => p.key);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(keys.length);
  });
});
