---
title: "CAGR: compound annual growth rate explained"
seoTitle: "CAGR formula: compound annual growth rate explained"
description: "Learn what CAGR measures, how to calculate it and why it differs from a simple average annual return."
pubDate: 2026-03-26
locale: "en"
categoryId: "finanzas"
slug: "cagr-compound-annual-growth-rate"
translationKey: "cagr-compound-annual-growth-rate"
tags:
  - CAGR
  - annualized return
  - compound growth
readTime: "6 min read"
relatedCalculator:
  label: "Compound interest calculator"
  href: "/en/finance/compound-interest-calculator"
---

CAGR answers a precise question: what constant annual compound rate would connect a beginning value to an ending value over a given number of years?

It is useful for comparing investments, sales, revenue, users or any other measure that changes over multiple periods. Its main limitation is equally important: one smooth annual number can conceal sharp gains, losses and volatility along the way.

## CAGR formula

```txt
CAGR = (ending value / beginning value) ^ (1 / years) - 1
```

The beginning value must be positive. If it is zero or negative, CAGR is generally not an appropriate measure.

Suppose an investment rises from `$100,000` to `$300,000` in 10 years:

```txt
CAGR = (300000 / 100000) ^ (1 / 10) - 1
CAGR = 3 ^ 0.1 - 1
CAGR = 0.1161 = 11.61%
```

Growing `$100,000` at a constant compound rate of about 11.61% for 10 years would produce approximately `$300,000`. That does not mean the actual return was 11.61% in every individual year.

## CAGR vs. a simple annual average

The total gain in the example is 200%. Dividing that by 10 gives a simple average of 20% a year—but compounding `$100,000` at 20% for 10 years would produce `$619,173.64`, not `$300,000`.

The simple average and CAGR answer different questions. CAGR accounts for compounding and gives the constant annual rate equivalent to the full-period result.

## When CAGR is useful

CAGR places growth over different time spans on an annualized basis. It can summarize historical investment performance or changes in business measures such as revenue, profit, customers and traffic. It can also be used in reverse to model a future value from an assumed annual growth rate.

## What CAGR leaves out

CAGR does not measure risk or the stability of the path. Two assets can have the same CAGR even if one rose steadily while the other fell sharply before recovering.

It also becomes misleading when there are intermediate deposits or withdrawals, because the ending value no longer results solely from growth of the original amount. Cash-flow-aware measures are more appropriate in that situation.

Finally, the selected start and end dates matter. An unusually low starting point or high ending point can make the annualized figure look more representative than it is. Treat CAGR as a summary, not a complete performance analysis. [Investor.gov](https://www.investor.gov/introduction-investing/investing-basics/what-risk) provides a useful reminder that every investment involves some degree of risk.

## Relationship to compound interest

The future-value formula is:

```txt
ending value = beginning value x (1 + rate) ^ years
```

Solving for the rate produces the CAGR formula. CAGR is therefore the annual compound rate that would explain the movement between two values.

Use the [compound interest calculator](/en/finance/compound-interest-calculator) to model a starting amount and assumed rate. For the algebra, see the [compound interest formula](/en/blog/finance/compound-interest-formula), and review [nominal vs. effective rates](/en/blog/finance/nominal-vs-effective-interest-rate) before comparing differently quoted products.

## Frequently asked questions

### Is CAGR the same as compound interest?

Not exactly. Compound interest describes how a balance grows when earnings are reinvested; CAGR is the constant annual compound rate connecting a start and end value.

### Does CAGR account for contributions?

The basic formula does not account for intermediate deposits or withdrawals.

### Does a high CAGR mean an investment is safe?

No. CAGR does not show volatility, liquidity, fees, taxes or the likelihood that past growth will continue.
