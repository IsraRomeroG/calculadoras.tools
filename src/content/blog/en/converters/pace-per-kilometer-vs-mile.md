---
title: "Pace per kilometer vs. pace per mile: how to convert"
seoTitle: "Pace per km to pace per mile: running formula and table"
description: "Convert running pace between minutes per kilometer and minutes per mile with formulas, examples and a quick reference table."
pubDate: 2026-07-30
locale: "en"
categoryId: "conversores"
slug: "pace-per-kilometer-vs-mile"
translationKey: "pace-per-kilometer-vs-mile"
tags:
  - pace per kilometer
  - pace per mile
  - running pace
readTime: "7 min read"
relatedCalculator:
  label: "Convert kilometers and miles"
  href: "/en/converters/kilometers-to-miles"
sources:
  - label: "NIST Guide to the SI, Appendix B.9: Conversion Factors"
    url: "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9"
    publisher: "National Institute of Standards and Technology"
    accessedDate: 2026-07-28
  - label: "Marathon"
    url: "https://worldathletics.org/disciplines/road-running/marathon"
    publisher: "World Athletics"
    accessedDate: 2026-07-28
  - label: "Half Marathon"
    url: "https://worldathletics.org/disciplines/road-running/half-marathon"
    publisher: "World Athletics"
    accessedDate: 2026-07-28
methodologyNote: "Pace is converted as time per unit of distance: min/mi = min/km × 1.609344. Seconds are rounded only when presenting the final result."
---

## How to convert min/km to min/mi

Pace tells you how long it takes to cover one unit of distance. To convert minutes per kilometer (`min/km`) to minutes per mile (`min/mi`), multiply the pace by `1.609344`:

```txt
pace in min/mi = pace in min/km × 1.609344
```

For example, a pace of `5:00 min/km` is approximately `8:03 min/mi`.

The pace per mile has more minutes because a mile is longer than a kilometer. [NIST](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9) gives the relationship:

```txt
1 mi = 1.609344 km
```

The [kilometers-and-miles conversion guide](/en/blog/converters/how-to-convert-kilometers-to-miles) explains this factor for distance. For pace, the same factor applies to the time required to cover each unit.

## How to convert min/mi to min/km

For the reverse conversion, divide the pace per mile by `1.609344`:

```txt
pace in min/km = pace in min/mi / 1.609344
```

For example:

```txt
8:00 min/mi = 8 decimal minutes
8 / 1.609344 = 4.970969... min/km
```

Convert the decimal part back to seconds:

```txt
0.970969 × 60 = 58.258 seconds
```

Rounded to the nearest second:

```txt
8:00 min/mi ≈ 4:58 min/km
```

## Worked examples

### Convert 5:00 min/km to min/mi

Because there are no seconds, the pace is already `5` decimal minutes:

```txt
5 × 1.609344 = 8.04672 minutes
```

Convert the fraction of a minute to seconds:

```txt
0.04672 × 60 = 2.8032 seconds
```

The result is:

```txt
5:00 min/km ≈ 8:03 min/mi
```

### Convert 5:30 min/km to min/mi

Thirty seconds is half a minute:

```txt
5:30 = 5 + 30 / 60 = 5.5 minutes
```

Then multiply:

```txt
5.5 × 1.609344 = 8.851392 minutes
0.851392 × 60 = 51.08352 seconds
```

Therefore:

```txt
5:30 min/km ≈ 8:51 min/mi
```

### Convert 6:00 min/km to min/mi

```txt
6 × 1.609344 = 9.656064 minutes
0.656064 × 60 = 39.36384 seconds
```

Rounded to the nearest second:

```txt
6:00 min/km ≈ 9:39 min/mi
```

## Quick equivalent-pace table

The table converts paces from `4:00` to `8:00 min/km` in 30-second intervals. The min/mi results are rounded to the nearest second.

| Pace per kilometer | Approximate pace per mile |
| ---: | ---: |
| 4:00 min/km | 6:26 min/mi |
| 4:30 min/km | 7:15 min/mi |
| 5:00 min/km | 8:03 min/mi |
| 5:30 min/km | 8:51 min/mi |
| 6:00 min/km | 9:39 min/mi |
| 6:30 min/km | 10:28 min/mi |
| 7:00 min/km | 11:16 min/mi |
| 7:30 min/km | 12:04 min/mi |
| 8:00 min/km | 12:52 min/mi |

The table is a quick reference. For an intermediate pace, apply the formula and retain full precision until converting the decimal fraction to seconds.

## Paces for 5K, 10K, half marathon and marathon

Converting pace does not change the distance or total time; it only expresses the same average in another unit. As a mathematical example, maintaining exactly `5:00 min/km` for the entire event would produce:

| Race | Distance | Time at 5:00 min/km |
| --- | ---: | ---: |
| 5K | 5 km | 25:00 |
| 10K | 10 km | 50:00 |
| Half marathon | 21.0975 km | 1:45:29 |
| Marathon | 42.195 km | 3:30:59 |

[World Athletics](https://worldathletics.org/disciplines/road-running/half-marathon) defines the half-marathon distance as `21.0975 km` and the [marathon](https://worldathletics.org/disciplines/road-running/marathon) as `42.195 km`.

These times assume a constant average. They are not a recommendation or performance prediction.

For the equivalent race distances in both unit systems, see the [kilometers-to-miles race table](/en/blog/converters/kilometers-to-miles-table).

## Pace and speed are not the same

Pace expresses time per distance:

```txt
min/km or min/mi
```

Speed expresses distance per time:

```txt
km/h or mph
```

They describe the same average movement from different perspectives, but the numbers behave inversely: a lower pace means less time per unit and therefore a higher speed.

For example:

```txt
speed in km/h = 60 / pace in minutes per km
60 / 5 = 12 km/h
```

Thus, `5:00 min/km` equals an average speed of `12 km/h`. This is a different operation from converting `min/km` to `min/mi`.

## A converted pace does not guarantee identical performance

The conversion assumes that you maintain exactly the same average. It does not adjust for:

- elevation changes;
- wind and temperature;
- surface and course turns;
- fatigue or stops;
- race strategy;
- GPS or measurement errors.

Two sessions with the same converted pace can therefore represent different efforts. The equivalence is mathematical; it does not evaluate fitness or predict a time for another event.

Avoid multiplying an already rounded pace to calculate a long race time. Retain the internal precision and round only at the end, because a few seconds per mile can accumulate over a half marathon or marathon.

## Calculate your pace manually

To analyze a distance and time:

1. Convert the total time to seconds.
2. Divide by the distance in kilometers or miles.
3. Convert the result back to minutes and seconds.
4. Use `1.609344` to express the same pace in the other unit.

To convert only the length of a route, use the [kilometers-to-miles converter](/en/converters/kilometers-to-miles).

## Frequently asked questions

### How do I convert min/km to min/mile?

Convert the pace to decimal minutes and multiply by `1.609344`. Then convert the result's decimal fraction to seconds and round at the end.

### Why is the pace-per-mile number larger?

Because one mile is `1.609344 km`. At the same average effort, it takes longer to complete a mile than a kilometer.

### Is 5:00 min/km exactly 8:00 min/mile?

No. `5:00 min/km` is approximately `8:03 min/mi`. Using `8:00` is an easy approximation, but it represents a slightly faster pace.

### Are pace and speed the same?

They describe the same movement from different perspectives. Pace is time per unit of distance; speed is distance traveled per unit of time.

### Does the conversion predict my race time?

No. It only translates the same pace between kilometers and miles. A prediction would need to consider distance, recent performance and actual race conditions.
