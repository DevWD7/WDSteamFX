// WDSteam - background service worker
// Fetches exchange rates once a day and caches them in chrome.storage.local

const API_URL = "https://open.er-api.com/v6/latest/USD";
const DEFAULT_RATES = { UAH: 41.5, TRY: 33.5, ARS: 1000 };
const REFRESH_ALARM = "wdsteam-refresh-rates";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

async function fetchAndStoreRates() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data && data.rates) {
            const rates = { UAH: data.rates.UAH, TRY: data.rates.TRY, ARS: data.rates.ARS };
            await chrome.storage.local.set({ fx_rates: rates, last_update: Date.now() });
        }
    } catch (e) {
        const stored = await chrome.storage.local.get(["fx_rates"]);
        if (!stored.fx_rates) {
            await chrome.storage.local.set({ fx_rates: DEFAULT_RATES, last_update: Date.now() });
        }
    }
}

async function ensureRatesFresh() {
    const stored = await chrome.storage.local.get(["fx_rates", "last_update"]);
    const lastUpdate = stored.last_update || 0;
    if (!stored.fx_rates || Date.now() - lastUpdate >= ONE_DAY_MS) {
        await fetchAndStoreRates();
    }
}

chrome.runtime.onInstalled.addListener(() => {
    ensureRatesFresh();
    chrome.alarms.create(REFRESH_ALARM, { periodInMinutes: 24 * 60 });
});

chrome.runtime.onStartup.addListener(() => {
    ensureRatesFresh();
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === REFRESH_ALARM) {
        fetchAndStoreRates();
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message && message.type === "WDSTEAM_GET_RATES") {
        ensureRatesFresh().then(async () => {
            const stored = await chrome.storage.local.get(["fx_rates"]);
            sendResponse({ rates: stored.fx_rates || DEFAULT_RATES });
        });
        return true;
    }
});
