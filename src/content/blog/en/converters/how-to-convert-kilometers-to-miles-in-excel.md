---
title: "How to convert kilometers to miles in Excel and Google Sheets"
seoTitle: "Convert km to miles in Excel: formula and examples"
description: "Learn how to convert a column of kilometers to miles in Excel or Google Sheets with formulas, rounding and reverse conversion."
pubDate: 2026-08-01
locale: "en"
categoryId: "conversores"
slug: "how-to-convert-kilometers-to-miles-in-excel"
translationKey: "kilometers-to-miles-spreadsheet"
tags:
  - kilometers to miles in Excel
  - Google Sheets
  - conversion formulas
readTime: "5 min read"
relatedCalculator:
  label: "Convert kilometers to miles"
  href: "/en/converters/kilometers-to-miles"
sources:
  - label: "NIST Guide to the SI, Appendix B.9: Conversion Factors"
    url: "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9"
    publisher: "National Institute of Standards and Technology"
    accessedDate: 2026-07-28
  - label: "ROUND function"
    url: "https://support.microsoft.com/en-us/office/round-function-c018c5d8-40fb-4053-90b1-b3e7f61a213c"
    publisher: "Microsoft Support"
    accessedDate: 2026-07-28
  - label: "Google Sheets function list"
    url: "https://support.google.com/docs/table/25273"
    publisher: "Google Docs Editors Help"
    accessedDate: 2026-07-28
  - label: "Set a spreadsheet's location and calculation settings"
    url: "https://support.google.com/docs/answer/58515?hl=en"
    publisher: "Google Docs Editors Help"
    accessedDate: 2026-07-28
methodologyNote: "The formulas use the exact equivalence 1 mi = 1.609344 km. Examples retain the full value during calculation and show two decimal places where stated."
---

<!-- Editorial review: this URL expands the applied-math cluster. -->

## Formula for converting kilometers to miles

If cell `A2` contains a distance in kilometers, divide it by `1.609344`:

```txt
=A2/1.609344
```

The formula works in both Excel and Google Sheets when the spreadsheet uses a decimal point. For example, if `A2` contains `10`, the result is:

```txt
6.213711922...
```

In other words:

```txt
10 km ≈ 6.21 mi
```

The factor comes from the exact equivalence published by [NIST](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9):

```txt
1 mi = 1.609344 km
```

In a regional setting that uses a decimal comma, you may need to enter the factor as `1,609344`:

```txt
=A2/1,609344
```

The spreadsheet's locale determines which version the application recognizes.

## How to apply the formula to a column

Arrange the spreadsheet with kilometers in column `A` and miles in column `B`:

```txt
A1: Kilometers
B1: Miles
A2: 1
B2: =A2/1.609344
```

Then:

1. Select cell `B2`.
2. Move the pointer over the fill handle in the cell's lower-right corner.
3. Drag it down to the last row containing a distance.

The relative reference changes automatically: in `B3` it becomes `=A3/1.609344`, in `B4` it becomes `=A4/1.609344`, and so on.

If you prefer to keep the factor visible and editable, enter it once, for example in `D1`:

```txt
D1: 1.609344
B2: =A2/$D$1
```

The dollar signs make `D1` an absolute reference. When you drag the formula, `A2` changes to `A3`, `A4` and later rows, while `$D$1` remains fixed.

This structure can also reduce locale-related problems: you only need to enter the correct decimal separator once in `D1`, and the formula then uses a cell reference.

## How to round the result

To return a value rounded to two decimal places, an English-language installation normally uses:

```txt
=ROUND(A2/1.609344,2)
```

In installations that use decimal commas, the formula may use a semicolon between arguments:

```txt
=ROUND(A2/1,609344;2)
```

Localized versions of Excel may also translate the function name. For example, Spanish Excel uses `REDONDEAR`:

```txt
=REDONDEAR(A2/1,609344;2)
```

Do not copy a variation without checking the spreadsheet's settings. [Google Sheets documentation](https://support.google.com/docs/answer/58515?hl=en) explains that the locale affects number formatting and that the function language can be configured separately.

You should also choose between **rounding the value** and only **limiting the displayed decimal places**:

- `ROUND` returns a new numeric value that is already rounded.
- Number formatting with two decimal places changes how the cell looks but retains the result's precision for later calculations.
- Neither option changes the original distance stored in `A2`.

If you will reuse the miles in other operations, it is usually better to keep `=A2/1.609344` and apply two-decimal number formatting. Use `ROUND` when the formula's stored result must be limited to that precision.

## Reverse formula: miles to kilometers

If `A2` contains statute miles and you want kilometers, multiply by `1.609344`:

```txt
=A2*1.609344
```

With a decimal comma:

```txt
=A2*1,609344
```

For example, if `A2` contains `10`:

```txt
10 × 1.609344 = 16.09344 km
```

To return two decimal places, use the version compatible with your settings:

```txt
=ROUND(A2*1.609344,2)
=ROUND(A2*1,609344;2)
```

These formulas convert international statute miles (`mi`), not nautical miles.

## Example distance table

This table assumes that kilometers are in column `A`, the formula is entered in column `B`, and the displayed result is rounded to two decimal places:

| Kilometers | Formula | Miles |
| ---: | --- | ---: |
| 1 | `=A2/1.609344` | 0.62 |
| 5 | `=A3/1.609344` | 3.11 |
| 10 | `=A4/1.609344` | 6.21 |
| 20 | `=A5/1.609344` | 12.43 |
| 42.195 | `=A6/1.609344` | 26.22 |
| 50 | `=A7/1.609344` | 31.07 |
| 100 | `=A8/1.609344` | 62.14 |

The complete results contain more decimal places. The “Miles” column shows two to make the table easier to read; this does not mean the factor was reduced to `1.61`.

You can compare these figures with the [kilometers-to-miles table for common distances](/en/blog/converters/kilometers-to-miles-table).

## Common regional-setting errors

A correct formula can still produce an error when pasted into a spreadsheet with different settings. Check these three elements:

### Decimal separator

Depending on the locale, a decimal may use a point or a comma:

```txt
1.609344
1,609344
```

If the spreadsheet treats the factor as text or splits the formula incorrectly, use the convention shown by other numbers in the file.

### Argument separator

Functions with multiple arguments may use a comma or a semicolon:

```txt
=ROUND(A2/1.609344,2)
=ROUND(A2/1,609344;2)
```

Do not confuse the decimal comma with the argument separator. In settings that use a comma for decimals, a semicolon commonly separates arguments.

### Function name

English Excel uses `ROUND`. Localized versions may use a translated name, while Google Sheets can use English or another supported function language. Two spreadsheets with the same numeric locale may therefore accept different function names.

If you see `#NAME?` or a formula parse error, start typing `=` followed by the first letters of the function. The spreadsheet's suggestions will show the available name. You can also avoid a rounding function, retain the full value, and use:

```txt
=A2/1.609344
```

Adjust the decimal separator when necessary.

## Check an individual conversion

A spreadsheet is useful for converting dozens or hundreds of rows. To verify one value before filling the entire column, use the [kilometers-to-miles converter](/en/converters/kilometers-to-miles).

If the result does not match:

1. Confirm that you divide when converting kilometers to miles.
2. Confirm that you multiply when converting miles to kilometers.
3. Check the decimal separator and function language.
4. Compare the complete value before applying rounding.

The guide to [converting kilometers to miles](/en/blog/converters/how-to-convert-kilometers-to-miles) explains why the factor `1.609344` is used.

## Frequently asked questions

### What is the km-to-miles formula in Excel?

If `A2` contains kilometers, use `=A2/1.609344`. In a locale with a decimal comma, the formula may be `=A2/1,609344`.

### How do I convert an entire column?

Enter the formula in the first result row and drag the fill handle down. Excel or Google Sheets will change `A2` to `A3`, `A4` and subsequent references.

### How do I round to two decimal places?

Use `=ROUND(A2/1.609344,2)` in a decimal-point setting or `=ROUND(A2/1,609344;2)` when the spreadsheet uses a decimal comma and semicolons. If later calculations need the full precision, format the cell to two decimal places instead of rounding the formula.

### Why does Excel show an error for the formula?

The most common causes are an incorrect decimal separator, the wrong argument separator, or a function name that does not match Excel's language.

### Does the formula work the same way in Google Sheets?

The operation `=A2/1.609344` is the same, but you may need to replace the decimal point with a comma. The function name and argument separator for rounding depend on the spreadsheet locale and selected function language.
