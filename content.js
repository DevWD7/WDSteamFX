// WDSteam - Steam Multi Currency Converter (content script)
// Converts UAH / TRY / ARS / USD prices found on Steam pages into SAR

(function () {
    'use strict';

    const SAR_RATE = 3.75;

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

    const DEBUG = true;

    function startConverter(rates) {

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

                            const span = document.createElement('span');
                            span.innerHTML = `<b>${sar} SAR</b>`;
                            span.style.marginLeft = '4px';
                            span.style.color = '#3fb950';
                            span.className = 'sar-price-final';

                            parent.appendChild(span);
                            parent.setAttribute('data-sar', 'true');
                            stats.converted++;
                            matchedThisNode = true;
                            break;
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

    chrome.runtime.sendMessage({ type: "WDSTEAM_GET_RATES" }, (response) => {
        const rates = (response && response.rates) || { UAH: 41.5, TRY: 33.5, ARS: 1000 };
        startConverter(rates);
    });

})();
