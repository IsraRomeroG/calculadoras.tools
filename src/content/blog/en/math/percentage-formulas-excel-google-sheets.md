---
title: "Percentage formulas in Excel and Google Sheets"
seoTitle: "Percentages in Excel and Google Sheets: useful formulas"
description: "Use spreadsheet formulas for percentages, discounts, increases and changes without double-counting percent formatting."
pubDate: 2026-04-16
locale: "en"
categoryId: "matematicas"
slug: "percentage-formulas-excel-google-sheets"
translationKey: "percentage-formulas-excel-google-sheets"
tags: [Excel percentages, Google Sheets, spreadsheet formulas]
readTime: "6 min read"
relatedCalculator:
  label: "Percentage calculator"
  href: "/en/math/percentage-calculator"
---

Assume `A2` contains the base value and `B2` contains a percentage.

| Goal | Formula |
| --- | --- |
| Percentage of a number | `=A2*B2` |
| What percentage A is of B | `=A2/B2` |
| Percentage change | `=(B2-A2)/A2` |
| Add a percentage | `=A2*(1+B2)` |
| Subtract a percentage | `=A2*(1-B2)` |

If `B2` is formatted as a percentage and displays `20%`, its stored value is normally `0.20`; do not divide by 100 again. If the cell contains the plain number `20`, use `B2/100`.

For a price of 500 in `A2` and 15% in `B2`, `=A2*(1-B2)` returns 425. To compare an old value in `A2` with a new value in `B2`, `=(B2-A2)/A2` returns a decimal; apply percentage formatting to display it correctly.

Common errors include dividing by the new value instead of the original, mixing text such as `"20%"` with numbers, and rounding intermediate formulas. Use absolute references such as `$B$1` when one rate should remain fixed as a formula is copied.

The [percentage calculator](/en/math/percentage-calculator) is useful for checking a spreadsheet result before filling a large range.
