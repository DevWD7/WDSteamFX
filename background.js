const REQUIRED_LIVE = ['UAH', 'TRY', 'ARS', 'EUR', 'GBP'];
const EXTRA_LIVE = ['CNY', 'PKR', 'INR'];
const TARGET_CODES = ['SAR', 'AED', 'QAR', 'KWD', 'BHD', 'OMR'];
const NEEDED = REQUIRED_LIVE.concat(EXTRA_LIVE, TARGET_CODES);
const REFRESH_ALARM = 'wdsteamfx-refresh-rates';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const DEFAULT_RATES = {
    USD: 1,
    UAH: 42,
    TRY: 42,
    ARS: 1450,
    EUR: 0.90,
    GBP: 0.78,
    CNY: 7.1,
    PKR: 280,
    INR: 88,
    SAR: 3.7500,
    AED: 3.6725,
    QAR: 3.6400,
    KWD: 0.3065,
    BHD: 0.3760,
    OMR: 0.3845,
};

async function getJson(url) {
    try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) return null;
        return await response.json();
    } catch (e) {
        return null;
    }
}

function pick(ratesObj) {
    const out = {};
    for (const code of NEEDED) {
        const value = Number(ratesObj[code]);
        if (isFinite(value) && value > 0) out[code] = value;
    }
    return out;
}

async function fetchFromOpenErApi() {
    const data = await getJson('https://open.er-api.com/v6/latest/USD');
    return (data && data.result === 'success' && data.rates) ? pick(data.rates) : null;
}

async function fetchFromExchangerateFun() {
    const data = await getJson('https://api.exchangerate.fun/latest?base=USD');
    return (data && data.rates) ? pick(data.rates) : null;
}

async function fetchFromHexarate() {
    const results = await Promise.all(
        NEEDED.map(code => getJson(`https://hexarate.paikama.co/api/rates/USD/${code}/latest`))
    );
    const rates = {};
    NEEDED.forEach((code, i) => {
        const r = results[i];
        if (r && r.status_code === 200 && r.data && r.data.mid > 0) rates[code] = r.data.mid;
    });
    return rates;
}

function ratesLookSane(rates) {
    return !!rates && REQUIRED_LIVE.every(c => isFinite(rates[c]) && rates[c] > 0);
}

async function fetchLiveRates() {
    const providers = [
        ['open.er-api.com', fetchFromOpenErApi],
        ['exchangerate.fun', fetchFromExchangerateFun],
        ['hexarate.paikama.co', fetchFromHexarate],
    ];

    for (const [name, fn] of providers) {
        const rates = await fn();
        if (ratesLookSane(rates)) {
            return { rates: Object.assign({}, DEFAULT_RATES, rates), source: name };
        }
    }
    return null;
}

async function readCache() {
    const stored = await chrome.storage.local.get(['fx_rates', 'fx_source', 'last_update']);
    return {
        rates: stored.fx_rates || null,
        source: stored.fx_source || null,
        at: stored.last_update || 0,
    };
}

async function ensureRates(force) {
    const cached = await readCache();
    const stale = !cached.rates || (Date.now() - cached.at >= ONE_DAY_MS);

    if (!force && !stale) {
        return {
            rates: Object.assign({}, DEFAULT_RATES, cached.rates),
            source: cached.source,
            at: cached.at,
        };
    }

    const fresh = await fetchLiveRates();
    if (fresh) {
        const at = Date.now();
        await chrome.storage.local.set({ fx_rates: fresh.rates, fx_source: fresh.source, last_update: at });
        return { rates: fresh.rates, source: fresh.source, at: at };
    }

    return {
        rates: Object.assign({}, DEFAULT_RATES, cached.rates || {}),
        source: cached.rates ? cached.source : null,
        at: cached.at,
    };
}

chrome.runtime.onInstalled.addListener(() => {
    ensureRates(false);
    chrome.alarms.create(REFRESH_ALARM, { periodInMinutes: 24 * 60 });
});

chrome.runtime.onStartup.addListener(() => {
    ensureRates(false);
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === REFRESH_ALARM) ensureRates(true);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message && message.type === 'WDSTEAMFX_GET_RATES') {
        ensureRates(!!message.force).then(sendResponse);
        return true;
    }
});
