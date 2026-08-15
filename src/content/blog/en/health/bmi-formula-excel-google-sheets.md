---
title: "BMI formulas for Excel and Google Sheets"
description: "Calculate and classify adult BMI in Excel or Google Sheets using height in metres or centimetres."
pubDate: 2026-06-18
locale: "en"
categoryId: "salud"
slug: "bmi-formula-excel-google-sheets"
translationKey: "bmi-formula-excel-google-sheets"
tags: [BMI, Excel, Google Sheets]
readTime: "3 min read"
relatedCalculator:
  label: "BMI calculator"
  href: "/en/health/bmi-calculator"
---

If weight in kilograms is in `A2` and height in metres is in `B2`, the BMI formula is:

```excel
=A2/(B2^2)
```

If height is stored in centimetres, convert it inside the formula:

```excel
=A2/((B2/100)^2)
```

To round the result to two decimal places:

```excel
=ROUND(A2/((B2/100)^2),2)
```

You can classify an adult result in `C2` with nested `IF` statements:

```excel
=IF(C2<18.5,"Underweight",IF(C2<25,"Healthy weight",IF(C2<30,"Overweight","Obesity")))
```

Excel and Google Sheets use the same core formulas. In some locales, function arguments require semicolons instead of commas.

Common errors include using centimetres as though they were metres, failing to square the full height and mixing pounds with the metric equation. Compare a sample row with the [BMI calculator](/en/health/bmi-calculator) before filling the formula down.

These categories apply to most adults as screening references. Children and teenagers require age- and sex-specific percentiles.

## Sources

- [CDC: Adult BMI Categories](https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html)

