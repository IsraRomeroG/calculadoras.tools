import { describe, expect, it } from "vitest";
import rehypeWrapTables from "./wrap-tables.mjs";

describe("rehypeWrapTables", () => {
  it("wraps table nodes with a reusable scroll container", () => {
    const tree = {
      type: "root",
      children: [
        {
          type: "element",
          tagName: "table",
          properties: {},
          children: [],
        },
      ],
    };

    rehypeWrapTables()(tree);

    expect(tree.children[0]).toMatchObject({
      type: "element",
      tagName: "div",
      properties: {
        className: ["markdown-table-wrapper"],
      },
      children: [
        {
          type: "element",
          tagName: "table",
          properties: {
            className: ["markdown-table"],
          },
        },
      ],
    });
  });

  it("does not wrap a table twice", () => {
    const tree = {
      type: "root",
      children: [
        {
          type: "element",
          tagName: "div",
          properties: {
            className: ["markdown-table-wrapper"],
          },
          children: [
            {
              type: "element",
              tagName: "table",
              properties: {},
              children: [],
            },
          ],
        },
      ],
    };

    rehypeWrapTables()(tree);

    expect(tree.children).toHaveLength(1);
    expect(tree.children[0]).toMatchObject({
      tagName: "div",
      properties: {
        className: ["markdown-table-wrapper"],
      },
      children: [
        {
          tagName: "table",
          properties: {
            className: ["markdown-table"],
          },
        },
      ],
    });
  });

  it("preserves existing table classes", () => {
    const tree = {
      type: "root",
      children: [
        {
          type: "element",
          tagName: "table",
          properties: {
            className: ["custom-table"],
          },
          children: [],
        },
      ],
    };

    rehypeWrapTables()(tree);

    expect(tree.children[0].children[0].properties.className).toEqual([
      "custom-table",
      "markdown-table",
    ]);
  });
});
