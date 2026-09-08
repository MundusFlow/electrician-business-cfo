const SE_TAX_RATE = 0.153;
const SE_TAX_BASE = 0.9235; // only 92.35% of net profit is subject to SE tax

const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const formatPercent = (value) => `${value.toFixed(1)}%`;

const formatRate = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

// Disables `button` until every input in `inputs` has a value, and lets
// pressing Enter in any text/number input trigger the button (same as a click).
function wireUpForm(inputs, button) {
  const updateDisabledState = () => {
    button.disabled = !inputs.every((input) => input.value.trim() !== "");
  };

  inputs.forEach((input) => {
    input.addEventListener("input", updateDisabledState);
    input.addEventListener("change", updateDisabledState);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        button.click();
      }
    });
  });

  updateDisabledState();
}

const num = (el) => parseFloat(el.value) || 0;

// ---------------------------------------------------------------------------
// Quote / Bid Calculator
// ---------------------------------------------------------------------------
(() => {
  const materialsInput = document.getElementById("q_materials");
  const markupInput = document.getElementById("q_materialsMarkup");
  const hoursInput = document.getElementById("q_laborHours");
  const rateInput = document.getElementById("q_laborRate");
  const permitsInput = document.getElementById("q_permits");
  const marginInput = document.getElementById("q_profitMargin");
  const btn = document.getElementById("quoteBtn");
  const resultEl = document.getElementById("quoteResult");

  wireUpForm([materialsInput, hoursInput, rateInput, permitsInput], btn);

  btn.addEventListener("click", () => {
    const materials = num(materialsInput);
    const markupPct = num(markupInput);
    const hours = num(hoursInput);
    const rate = num(rateInput);
    const permits = num(permitsInput);
    const marginPct = num(marginInput);

    const materialsWithMarkup = materials * (1 + markupPct / 100);
    const laborCost = hours * rate;
    const subtotal = materialsWithMarkup + laborCost + permits;
    const profitBuffer = subtotal * (marginPct / 100);
    const quoteTotal = subtotal + profitBuffer;

    resultEl.innerHTML = `
      <div class="result-box">
        <p class="result-headline-label">Suggested Quote</p>
        <p class="result-headline-value result-highlight">${formatMoney(quoteTotal)}</p>

        <div class="result-breakdown">
          <p class="breakdown-title">Based on:</p>
          <div class="breakdown-row"><span>Materials (+${formatPercent(markupPct)} markup)</span><span>${formatMoney(materialsWithMarkup)}</span></div>
          <div class="breakdown-row"><span>Labor (${hours} hrs &times; ${formatMoney(rate)})</span><span>${formatMoney(laborCost)}</span></div>
          <div class="breakdown-row"><span>Permits / inspection</span><span>${formatMoney(permits)}</span></div>
          <div class="breakdown-row breakdown-total"><span>Subtotal</span><span>${formatMoney(subtotal)}</span></div>
          <div class="breakdown-row"><span>Profit buffer (${formatPercent(marginPct)})</span><span>${formatMoney(profitBuffer)}</span></div>
          <div class="breakdown-row breakdown-total"><span>Quote total</span><span>${formatMoney(quoteTotal)}</span></div>
        </div>

        <p class="result-tip">&#128161; Quote the round number, not the exact one&mdash;it reads more confident.</p>
      </div>
    `;

    showStickyBar();
  });
})();

// ---------------------------------------------------------------------------
// Job Profit Calculator
// ---------------------------------------------------------------------------
(() => {
  const invoicedInput = document.getElementById("jp_invoiced");
  const materialsInput = document.getElementById("jp_materials");
  const laborInput = document.getElementById("jp_labor");
  const otherInput = document.getElementById("jp_other");
  const btn = document.getElementById("jobProfitBtn");
  const resultEl = document.getElementById("jobProfitResult");

  wireUpForm([invoicedInput, materialsInput, laborInput, otherInput], btn);

  btn.addEventListener("click", () => {
    const invoiced = num(invoicedInput);
    const materials = num(materialsInput);
    const labor = num(laborInput);
    const other = num(otherInput);

    const totalCost = materials + labor + other;
    const profit = invoiced - totalCost;
    const margin = invoiced > 0 ? (profit / invoiced) * 100 : 0;
    const isLowMargin = margin < 15;

    resultEl.innerHTML = `
      <div class="result-box">
        <p class="result-headline-label">Job Profit</p>
        <p class="result-headline-value ${profit >= 0 ? "result-good" : "result-warning"}">${formatMoney(profit)}</p>

        <div class="result-breakdown">
          <p class="breakdown-title">Based on:</p>
          <div class="breakdown-row"><span>Invoiced / collected</span><span>${formatMoney(invoiced)}</span></div>
          <div class="breakdown-row"><span>&minus; Materials</span><span>${formatMoney(materials)}</span></div>
          <div class="breakdown-row"><span>&minus; Labor</span><span>${formatMoney(labor)}</span></div>
          <div class="breakdown-row"><span>&minus; Other job costs</span><span>${formatMoney(other)}</span></div>
          <div class="breakdown-row breakdown-total"><span>Total cost</span><span>${formatMoney(totalCost)}</span></div>
          <div class="breakdown-row breakdown-total"><span>Profit margin</span><span>${formatPercent(margin)}</span></div>
        </div>

        <p class="result-tip ${isLowMargin ? "warning-tip" : ""}">
          ${isLowMargin
            ? "&#9888;&#65039; Under 15% margin&mdash;this job barely covered overhead. Check your next quote."
            : "&#128161; Track this against your quote to see how close your estimate was."}
        </p>
      </div>
    `;

    showStickyBar();
  });
})();

// ---------------------------------------------------------------------------
// Hourly Rate Calculator
// ---------------------------------------------------------------------------
(() => {
  const takeHomeInput = document.getElementById("hr_takeHome");
  const vehicleInput = document.getElementById("hr_vehicle");
  const insuranceInput = document.getElementById("hr_insurance");
  const toolsInput = document.getElementById("hr_tools");
  const licensingInput = document.getElementById("hr_licensing");
  const otherOverheadInput = document.getElementById("hr_otherOverhead");
  const hoursPerWeekInput = document.getElementById("hr_hoursPerWeek");
  const weeksPerYearInput = document.getElementById("hr_weeksPerYear");
  const btn = document.getElementById("hourlyRateBtn");
  const resultEl = document.getElementById("hourlyRateResult");

  wireUpForm(
    [
      takeHomeInput,
      vehicleInput,
      insuranceInput,
      toolsInput,
      licensingInput,
      otherOverheadInput,
      hoursPerWeekInput,
      weeksPerYearInput,
    ],
    btn
  );

  btn.addEventListener("click", () => {
    const takeHome = num(takeHomeInput);
    const monthlyOverhead =
      num(vehicleInput) + num(insuranceInput) + num(toolsInput) + num(licensingInput) + num(otherOverheadInput);
    const annualOverhead = monthlyOverhead * 12;
    const hoursPerWeek = num(hoursPerWeekInput);
    const weeksPerYear = num(weeksPerYearInput);
    const billableHours = hoursPerWeek * weeksPerYear;

    const requiredRevenue = takeHome + annualOverhead;
    const minRate = billableHours > 0 ? requiredRevenue / billableHours : 0;

    resultEl.innerHTML = `
      <div class="result-box">
        <p class="result-headline-label">Minimum Rate To Charge</p>
        <p class="result-headline-value result-highlight">${formatMoney(minRate)}/hr</p>

        <div class="result-breakdown">
          <p class="breakdown-title">Based on:</p>
          <div class="breakdown-row"><span>Desired annual profit</span><span>${formatMoney(takeHome)}</span></div>
          <div class="breakdown-row"><span>+ Annual overhead</span><span>${formatMoney(annualOverhead)}</span></div>
          <div class="breakdown-row breakdown-total"><span>Required annual revenue</span><span>${formatMoney(requiredRevenue)}</span></div>
          <div class="breakdown-row"><span>&divide; Billable hours/year (${hoursPerWeek}/wk &times; ${weeksPerYear} wks)</span><span>${billableHours.toFixed(0)}</span></div>
          <div class="breakdown-row breakdown-total"><span>Minimum hourly rate</span><span>${formatMoney(minRate)}</span></div>
        </div>

        <p class="result-tip">&#128161; This is your break-even-plus-profit floor, not your dream rate. Price to the market above it.</p>
      </div>
    `;

    showStickyBar();
  });
})();

// ---------------------------------------------------------------------------
// Tax Reserve Calculator
// ---------------------------------------------------------------------------
(() => {
  const incomeInput = document.getElementById("tax_income");
  const materialsInput = document.getElementById("tax_materials");
  const expensesInput = document.getElementById("tax_expenses");
  const milesInput = document.getElementById("tax_miles");
  const mileageRateInput = document.getElementById("tax_mileageRate");
  const bracketSelect = document.getElementById("tax_bracket");
  const btn = document.getElementById("taxBtn");
  const resultEl = document.getElementById("taxResult");

  wireUpForm([incomeInput, materialsInput, expensesInput, milesInput, mileageRateInput, bracketSelect], btn);

  btn.addEventListener("click", () => {
    const income = num(incomeInput);
    const materials = num(materialsInput);
    const expenses = num(expensesInput);
    const miles = num(milesInput);
    const mileageRate = num(mileageRateInput);
    const bracketPct = num(bracketSelect);

    const mileageDeduction = miles * mileageRate;
    const netProfit = Math.max(income - materials - expenses - mileageDeduction, 0);

    const seTaxReserve = netProfit * SE_TAX_BASE * SE_TAX_RATE;
    const incomeTaxReserve = netProfit * (bracketPct / 100);
    const totalReserve = seTaxReserve + incomeTaxReserve;
    const spendable = netProfit - totalReserve;

    const reserveRate = SE_TAX_BASE * SE_TAX_RATE + bracketPct / 100;

    resultEl.innerHTML = `
      <div class="result-box">
        <p class="result-headline-label">Estimated Tax Reserve</p>
        <p class="result-headline-value result-warning">${formatMoney(totalReserve)}</p>
        <p class="result-intro" style="margin-top:-8px;">A planning estimate, not tax advice&mdash;confirm your actual obligations with a licensed tax professional.</p>

        <div class="result-breakdown">
          <p class="breakdown-title">Based on:</p>
          <div class="breakdown-row"><span>Income</span><span>${formatMoney(income)}</span></div>
          <div class="breakdown-row"><span>&minus; Materials / COGS</span><span>${formatMoney(materials)}</span></div>
          <div class="breakdown-row"><span>&minus; Other expenses</span><span>${formatMoney(expenses)}</span></div>
          <div class="breakdown-row"><span>&minus; Mileage (${miles} mi &times; ${formatRate(mileageRate)})</span><span>${formatMoney(mileageDeduction)}</span></div>
          <div class="breakdown-row breakdown-total"><span>= Estimated business profit</span><span>${formatMoney(netProfit)}</span></div>
          <div class="breakdown-row"><span>&times; Estimated tax reserve rate</span><span>${(reserveRate * 100).toFixed(1)}%</span></div>
          <div class="breakdown-row breakdown-total"><span>= Suggested tax reserve</span><span>${formatMoney(totalReserve)}</span></div>
          <div class="breakdown-row"><span>Spendable after reserve</span><span>${formatMoney(spendable)}</span></div>
        </div>

        <p class="result-tip">&#128161; The rate is 15.3% self-employment tax plus the ${bracketPct}% income tax bracket you picked above&mdash;it doesn't know your deductions, credits, state tax, or entity type. Move the reserve to a separate account the day you get paid.</p>
      </div>
    `;

    showStickyBar();
  });
})();

// ---------------------------------------------------------------------------
// Business Runway Calculator
// ---------------------------------------------------------------------------
(() => {
  const savingsInput = document.getElementById("savings");
  const monthlyExpensesInput = document.getElementById("monthlyExpenses");
  const btn = document.getElementById("runwayBtn");
  const resultEl = document.getElementById("runwayResult");

  wireUpForm([savingsInput, monthlyExpensesInput], btn);

  btn.addEventListener("click", () => {
    const savings = num(savingsInput);
    const monthlyExpenses = num(monthlyExpensesInput);

    if (monthlyExpenses <= 0) {
      resultEl.innerHTML = `<div class="result-box"><p class="result-intro">Enter your average monthly expenses to see your runway.</p></div>`;
      return;
    }

    const months = savings / monthlyExpenses;

    let wholeMonths = Math.floor(months);
    let days = Math.round((months - wholeMonths) * 30);
    if (days === 30) {
      wholeMonths += 1;
      days = 0;
    }
    const monthLabel = `${wholeMonths} month${wholeMonths === 1 ? "" : "s"}`;
    const dayLabel = `${days} day${days === 1 ? "" : "s"}`;
    const breakdown = days > 0 ? `${monthLabel} and ${dayLabel}` : monthLabel;

    resultEl.innerHTML = `
      <div class="result-box">
        <p class="result-headline-label">Your Estimated Runway</p>
        <p class="result-headline-value result-highlight">${months.toFixed(1)} months</p>

        <div class="result-breakdown">
          <p class="breakdown-title">Based on:</p>
          <div class="breakdown-row"><span>${formatMoney(savings)} in savings</span></div>
          <div class="breakdown-row"><span>&divide; ${formatMoney(monthlyExpenses)} avg. monthly expenses</span></div>
          <div class="breakdown-row breakdown-total"><span>= ${months.toFixed(1)} months of runway</span></div>
        </div>

        <p class="result-tip">&#128161; That's about ${breakdown} before you'd need new income.</p>
      </div>
    `;

    showStickyBar();
  });
})();

// ---------------------------------------------------------------------------
// Sticky bottom CTA bar: stays hidden until the visitor scrolls past the
// hero or runs any calculator, so the first screen isn't a sales pitch.
// ---------------------------------------------------------------------------
const stickyBar = document.getElementById("stickyBar");
let stickyBarShown = false;

function showStickyBar() {
  if (!stickyBar || stickyBarShown) return;
  stickyBarShown = true;
  stickyBar.classList.add("visible");
}

const hero = document.querySelector(".hero");
if (hero) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > hero.offsetHeight) {
      showStickyBar();
    }
  });
}

// ---------------------------------------------------------------------------
// Lightbox: click a product screenshot to view it full-size.
// ---------------------------------------------------------------------------
const lightbox = document.getElementById("lightbox");

if (lightbox) {
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  const openLightbox = (img) => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("open");
  };

  const closeLightbox = () => {
    lightbox.classList.remove("open");
  };

  document.querySelectorAll(".product-screenshot").forEach((img) => {
    img.addEventListener("click", () => openLightbox(img));
  });

  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
}
