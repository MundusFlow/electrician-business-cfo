# Electrician Business CFO — Free Calculators

A static, client-side calculator page for electrical contractors, in the same
style as [Freelance Tax & Runway Estimator](https://mundusflow.github.io/freelance-tax-runway-estimator/).
Plain HTML, CSS, and JavaScript — no build step, no backend, no data leaves the browser.

## Calculators

- **Quote / Bid Calculator** — materials + markup, labor, permits, and a profit buffer → a suggested quote.
- **Job Profit Calculator** — invoiced amount minus actual materials/labor/other costs → profit and margin, with a low-margin warning under 15%.
- **Hourly Rate Calculator** — itemized monthly overhead (vehicle, insurance, tools, licensing, other) + desired annual profit ÷ billable hours/year → minimum rate to charge.
- **Tax Reserve Calculator** — splits self-employment tax (15.3%) from a selectable federal income tax bracket, and includes a mileage deduction with an editable IRS rate, instead of one flat percentage.
- **Business Runway Calculator** — savings ÷ monthly expenses → months of runway. Same as the original tool.

## Deploying

Live at [mundusflow.github.io/electrician-business-cfo](https://mundusflow.github.io/electrician-business-cfo/),
served from GitHub Pages (Settings → Pages → deploy from the `main` branch).

## The paid workbook

The CTA section and sticky bar link to the live Stripe Payment Link for the
"Electrician Business CFO" workbook ($29.69 one-time). The `images/` folder
holds the two product screenshots (Dashboard, Job Tracker), generated from a
sample-data copy of the real workbook — also used on the Stripe product
listing.
