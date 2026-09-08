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

This folder is ready to push to a new GitHub repo and serve with GitHub Pages
(Settings → Pages → deploy from the `main` branch), same as the original project.

## Before going live

The "Electrician Business CFO" workbook CTA (`index.html`, the `.cta` section
and `#stickyBar`) currently points at a placeholder `mailto:you@example.com`
link — swap that for a real signup form, waitlist link, or checkout link once
the paid workbook and pricing exist.
