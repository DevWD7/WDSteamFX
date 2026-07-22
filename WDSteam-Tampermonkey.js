// ==UserScript==
// @name         WDSteam - Steam Multi Currency
// @namespace    https://github.com/DevWD7
// @version      5.5
// @description  Converts Steam prices (UAH, TRY, ARS, USD) to SAR automatically on Steam pages.
// @author       WDOX (maintainer) — original idea & first version by BAKHSHAWI999 (https://gist.github.com/BAKHSHAWI999)
// @match        https://store.steampowered.com/*
// @match        https://steamcommunity.com/*
// @connect      hexarate.paikama.co
// @connect      api.exchangerate.fun
// @connect      open.er-api.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    const SAR_RATE = 3.75; // SAR is officially pegged to USD at a fixed rate
    // Last-resort numbers, only used if BOTH live sources fail and there is
    // no usable cache yet. These are approximate and get replaced by a live
    // fetch as soon as one succeeds.
    const DEFAULT_RATES = { UAH: 41.5, TRY: 33.5, ARS: 1000 };
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    const CURRENCIES = [
        { code: "UAH", symbol: "₴", regex: /([\d][\d.,\s\u00A0]*)\s*₴|₴\s*([\d][\d.,\s\u00A0]*)/, locale: "eu" },
        { code: "TRY", symbol: "₺", regex: /([\d][\d.,\s\u00A0]*)\s*(?:₺|TL)\b|(?:₺|TL)\s*([\d][\d.,\s\u00A0]*)/, locale: "eu" },
        { code: "ARS", symbol: "ARS$", regex: /(?:ARS\$|AR\$)\s*([\d][\d.,\s\u00A0]*)/, locale: "eu" },
        { code: "USD", symbol: "$", regex: /(?:^|\s)\$\s*([\d][\d,]*\.?\d*)|US\$\s*([\d][\d,]*\.?\d*)/, locale: "us" },
    ];

    function parseEU(raw) {
        let s = raw.trim().replace(/[\s\u00A0]/g, '').replace(/\./g, '').replace(',', '.');
        return parseFloat(s);
    }

    function parseUS(raw) {
        let s = raw.trim().replace(/,/g, '');
        return parseFloat(s);
    }

    function parseAmount(raw, locale) {
        return locale === "us" ? parseUS(raw) : parseEU(raw);
    }

    function toSAR(amount, code, rates) {
        if (code === "USD") return amount * SAR_RATE;
        const fromRate = rates[code];
        if (!fromRate) return null;
        return (amount / fromRate) * SAR_RATE;
    }

    // ---- Rate fetching / caching ----
    // Three independent free, no-key sources, tried in order. If one is down,
    // slow, or returns bad data, we automatically fall through to the next
    // instead of silently using stale/wrong numbers.

    function gmGet(url) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                timeout: 6000,
                onload: function (response) {
                    try {
                        resolve(JSON.parse(response.responseText));
                    } catch (e) {
                        resolve(null);
                    }
                },
                onerror: function () { resolve(null); },
                ontimeout: function () { resolve(null); },
            });
        });
    }

    async function fetchFromHexarate() {
        // https://hexarate.paikama.co/api/rates/USD/UAH/latest — direct pair
        // lookup, no key, no rate limits. We need USD->UAH, USD->TRY,
        // USD->ARS (i.e. "how many units of X per 1 USD"), fetched in parallel.
        const pairs = ["UAH", "TRY", "ARS"];
        const results = await Promise.all(
            pairs.map((code) => gmGet(`https://hexarate.paikama.co/api/rates/USD/${code}/latest`))
        );
        const rates = {};
        for (let i = 0; i < pairs.length; i++) {
            const r = results[i];
            if (r && r.status_code === 200 && r.data && r.data.mid) {
                rates[pairs[i]] = r.data.mid;
            }
        }
        return rates;
    }

    async function fetchFromExchangerateFun() {
        // https://api.exchangerate.fun/latest?base=USD — free, no key, hourly updates
        const data = await gmGet("https://api.exchangerate.fun/latest?base=USD");
        if (data && data.rates) {
            return { UAH: data.rates.UAH, TRY: data.rates.TRY, ARS: data.rates.ARS };
        }
        return null;
    }

    async function fetchFromOpenErApi() {
        // https://open.er-api.com/v6/latest/USD
        const data = await gmGet("https://open.er-api.com/v6/latest/USD");
        if (data && data.result === "success" && data.rates) {
            return { UAH: data.rates.UAH, TRY: data.rates.TRY, ARS: data.rates.ARS };
        }
        return null;
    }

    function ratesLookSane(rates) {
        // Basic sanity check so a malformed/garbage response never gets used —
        // if a source returns zero/negative/missing numbers, treat it as a fail
        // and move on to the next source instead of showing a broken price.
        return !!(rates && rates.UAH > 0 && rates.TRY > 0 && rates.ARS > 0);
    }

    async function fetchLiveRates() {
        const hexarate = await fetchFromHexarate();
        if (ratesLookSane(hexarate)) {
            if (DEBUG) console.log('[WDSteam debug] rates fetched from hexarate.paikama.co', hexarate);
            return hexarate;
        }

        if (DEBUG) console.log('[WDSteam debug] hexarate failed/looked wrong, trying exchangerate.fun');
        const exchangerateFun = await fetchFromExchangerateFun();
        if (ratesLookSane(exchangerateFun)) {
            if (DEBUG) console.log('[WDSteam debug] rates fetched from exchangerate.fun', exchangerateFun);
            return exchangerateFun;
        }

        if (DEBUG) console.log('[WDSteam debug] exchangerate.fun failed/looked wrong, trying open.er-api.com');
        const openErApi = await fetchFromOpenErApi();
        if (ratesLookSane(openErApi)) {
            if (DEBUG) console.log('[WDSteam debug] rates fetched from open.er-api.com', openErApi);
            return openErApi;
        }

        return null; // all three sources failed
    }

    async function getRates() {
        const cachedRates = GM_getValue("fx_rates", null);
        const lastUpdate = GM_getValue("last_update", 0);
        const isStale = !cachedRates || (Date.now() - lastUpdate >= ONE_DAY_MS);

        if (!isStale) return cachedRates;

        const fresh = await fetchLiveRates();
        if (fresh) {
            GM_setValue("fx_rates", fresh);
            GM_setValue("last_update", Date.now());
            return fresh;
        }

        // Both sources failed — keep using cache if we have one, else defaults
        return cachedRates || DEFAULT_RATES;
    }

    const DEBUG = true; // set to false once the issue is fixed

    function startConverter(rates) {

        // Steam's newer price widgets (special promo boxes, bundle prices, etc.)
        // are sometimes rendered inside Shadow DOM. A plain document.evaluate()
        // XPath query can't see past a shadow boundary, so we recursively collect
        // every root (the document itself, plus any open shadow roots inside it)
        // and scan each one separately.
        function collectRoots(root, acc) {
            acc.push(root);
            const all = root.querySelectorAll ? root.querySelectorAll('*') : [];
            for (const el of all) {
                if (el.shadowRoot) {
                    collectRoots(el.shadowRoot, acc);
                }
            }
            return acc;
        }

        function collectTextNodes(root) {
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
            const nodes = [];
            let n;
            while ((n = walker.nextNode())) nodes.push(n);
            return nodes;
        }

        function convertNodes() {
            const roots = collectRoots(document, []);
            const stats = { rootsScanned: roots.length, shadowRoots: roots.length - 1, textNodesScanned: 0, symbolHits: 0, regexMatches: 0, skippedStrike: 0, skippedAlready: 0, converted: 0, unmatchedSamples: [] };

            for (const root of roots) {
                const textNodes = collectTextNodes(root);
                stats.textNodesScanned += textNodes.length;

                for (const node of textNodes) {
                    const parent = node.parentElement;
                    if (!parent) continue;

                    const text = node.textContent;
                    const hasAnySymbol = CURRENCIES.some(c => text.includes(c.symbol));
                    if (!hasAnySymbol) continue;
                    stats.symbolHits++;

                    if (parent.hasAttribute('data-sar')) { stats.skippedAlready++; continue; }

                    if (parent.closest && (parent.closest('.discount_original_price') || parent.tagName === 'S' || parent.style.textDecoration.includes('line-through'))) {
                        stats.skippedStrike++;
                        continue;
                    }

                    let matchedThisNode = false;

                    for (const currency of CURRENCIES) {
                        if (!text.includes(currency.symbol)) continue;

                        const match = text.match(currency.regex);
                        if (!match) continue;
                        stats.regexMatches++;

                        const rawNum = match[1] || match[2];
                        const priceVal = parseAmount(rawNum, currency.locale);

                        if (!isNaN(priceVal) && priceVal > 0) {
                            const sarVal = toSAR(priceVal, currency.code, rates);
                            if (sarVal === null || isNaN(sarVal)) continue;
                            const sar = sarVal.toFixed(2);

                            // Plain inline text placed right next to the price,
                            // on the same line — bold, no background, no flag.
                            const span = document.createElement('span');
                            span.innerHTML = `<b>${sar} SAR</b>`;
                            span.style.marginLeft = '4px';
                            span.style.color = '#3fb950';
                            span.className = 'sar-price-final';

                            parent.appendChild(span);
                            parent.setAttribute('data-sar', 'true');
                            stats.converted++;
                            matchedThisNode = true;
                            break; // this text node is handled, move to the next one
                        }
                    }

                    if (!matchedThisNode && stats.unmatchedSamples.length < 15) {
                        stats.unmatchedSamples.push(JSON.stringify(text.trim()).slice(0, 80));
                    }
                }
            }

            if (DEBUG) {
                console.log('[WDSteam debug]', stats);
                if (stats.unmatchedSamples.length) {
                    console.log('[WDSteam debug] text containing a currency symbol but NOT converted:', stats.unmatchedSamples);
                }
            }
        }

        convertNodes();

        const observer = new MutationObserver(() => {
            convertNodes();
        });

        observer.observe(document.body, { childList: true, subtree: true });
        setInterval(convertNodes, 2000);
    }

    getRates().then((rates) => {
        startConverter(rates || DEFAULT_RATES);
    });

})();
