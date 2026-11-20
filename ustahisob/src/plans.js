// Narxlarni shu yerdan boshqaring (so'mda).
const PLANS = {
  monthly: { label: 'Oylik', amount: 150000, days: 30 },
  yearly:  { label: 'Yillik', amount: 1500000, days: 365 }, // ~2 oy tejov
};

const TRIAL_DAYS = 14;

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

module.exports = { PLANS, TRIAL_DAYS, addDays };
