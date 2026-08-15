---
title: "CETES and compound interest: what happens when you reinvest?"
seoTitle: "CETES reinvestment and compound interest: worked example"
description: "Understand how reinvesting Mexican Treasury bills can create compounding, which inputs matter and why a fixed-rate model has limits."
pubDate: 2026-04-11
locale: "en"
categoryId: "finanzas"
slug: "cetes-reinvestment-and-compound-interest"
translationKey: "cetes-reinvestment-and-compound-interest"
tags:
  - CETES
  - compound interest
  - Mexican Treasury bills
readTime: "7 min read"
relatedCalculator:
  label: "Compound interest calculator"
  href: "/en/finance/compound-interest-calculator"
---

> Currency amounts in this article are Mexican pesos. The examples use a hypothetical rate because CETES yields change at auction and Mexican tax rules can change by fiscal year.

## How compounding applies to CETES

CETES are zero-coupon debt securities issued by Mexico’s federal government. Buying one maturity does not lock in the same rate for many years. At maturity, you receive the amount due; compounding occurs only if you invest the proceeds—including the return—in a new security.

Reinvestment therefore creates a compound effect, but the rate on each new purchase may differ.

## A simple gross-return estimate

For an educational approximation:

```txt
gross interest = amount x annual rate x days / 360
```

Investing `$10,000` for 28 days at a hypothetical 10% annual rate gives:

```txt
gross interest = 10000 x 0.10 x 28 / 360
gross interest = 77.78
```

The `$77.78` is before Mexican income-tax withholding (`ISR`) and other applicable adjustments. Actual proceeds depend on the purchase yield and current rules. Consult [Cetesdirecto](https://www.cetesdirecto.com/) and [Banco de México](https://www.banxico.org.mx/) for official information.

## Reinvesting principal and returns

If you withdraw each period’s return and reinvest only `$10,000`, three identical hypothetical periods produce `$233.34` in gross interest. If you reinvest everything:

```txt
period 1: 10000.00 x 0.10 x 28 / 360 = 77.78
new principal: 10077.78

period 2: 10077.78 x 0.10 x 28 / 360 = 78.38
new principal: 10156.16

period 3: 10156.16 x 0.10 x 28 / 360 = 78.99
new principal: 10235.15
```

The difference is small over three short periods but becomes more noticeable when reinvestment continues.

## Inputs to verify

- The current yield for the maturity you intend to buy.
- Whether the term is 28, 91, 182 or 364 days.
- Applicable ISR withholding and tax treatment.
- Whether you need liquidity before maturity.
- Whether automatic reinvestment is enabled and available for your holding.

A fixed-rate projection cannot reproduce changing auction yields, purchase dates or future taxes. Confirm product settings directly in the official platform.

## Use a calculator as an approximation

In the [compound interest calculator](/en/finance/compound-interest-calculator), enter the initial principal, use an annual rate as an explicit assumption, set contributions to zero and compare reinvestment with a non-reinvested scenario.

For longer projections, also account for [inflation](/en/blog/finance/inflation-and-compound-interest) and review the [common calculator mistakes](/en/blog/finance/compound-interest-calculator-mistakes).

## Frequently asked questions

### Do CETES pay compound interest automatically?

A single CETE earns a return for its term. Compounding arises when you reinvest both principal and proceeds at maturity.

### Does the rate remain fixed after reinvestment?

Not necessarily. Each new purchase uses the yield available at that time.

### Does the calculator include ISR?

No. It models a constant gross rate. Estimate current tax effects separately.
