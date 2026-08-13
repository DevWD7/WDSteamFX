// ==UserScript==
// @name         WDSteamFx - Steam Multi Currency
// @namespace    https://github.com/DevWD7
// @version      1.1.0
// @description  Converts Steam prices (UAH, TRY, ARS, CNY, PKR, INR, EUR, GBP, USD) to the Gulf currency you pick (SAR, AED, QAR, KWD, BHD, OMR).
// @author       WDOX
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

    const VERSION = '1.1.0';
    const STEAM_GREEN = '#03a536';

    const FLAGS = {
        SAR: '<svg viewBox="0 0 900 900"><rect width="900" height="900" fill="#046a38"/><g transform="translate(450,450)scale(1.55)translate(-450,-297.93)"><path fill="#fff" d="M675 238.3c0-10.5-4.2-39-5.2-48.4-1-9.6-2-18.2-1.8-20.2s3.2 2.7 4.8 3c.8 0 .5-3-1-5.6l-6.6-11.8c-1-1.8-1.2-2.8-1.6-3s-4.3 7.4-3.9 8.3c1 1.5 1.8 2.3 2 5A606 606 0 0 0 665 203c1.4 11.2 4.4 35.5 4.5 50.5 0 5-.5 9.6-1.2 11.6-1.7 3-4.3 5.8-14 11.6-11 6.4-25.7 11.7-32 15.3-4 2.3-2.6 2.6.8 1.6s21-4.1 29.5-7.7c8-3.4 13.3-9.1 17.2-17.4 4.9-10.3 5.3-19 5.2-30.2m-34-80c.8-.4 7.9-.7 9.8-.3-1.3 1.7-9.7 5.7-9.7 6.4.2.5 5.8-.9 7.5-1.7q1.7-1.1 2.8-2.6c2-2.4 4.4-6.7 3.8-7.2-1-.9-10.5-.3-11.8-.1-.9 0-3 4-3.4 5q-.5 1.2 1 .5"/><path fill="#fff" d="M655.3 220.7c1.5-5 1.9-11-.1-17.3-2-6.5-7.2-10.5-10.8-12.5l-.7 6.2s5.2 2.6 8.7 9a22 22 0 0 1 1.4 16.3c-.3 1.6.8.8 1.5-1.7m-54.4 31.5c1.3-4.4 1.6-9.9-.1-15.6a20 20 0 0 0-9.8-11.2l-.6 5.6s4.7 2.3 7.8 8.1c2 3.7 2.9 8.9 1.3 14.7-.3 1.4.8.6 1.4-1.6m-189-85.5c2 3.9 3 9.4 1.3 15.5-.3 1.5.8.7 1.5-1.7a28 28 0 0 0-.2-16.4 22 22 0 0 0-10.3-12l-.6 6s5 2.5 8.3 8.6m-127.6 2a19 19 0 0 1-1 15.7c-.6 1.5.8.8 2-1.4a26 26 0 0 0 2.4-16.6 21 21 0 0 0-9.7-13.3l-1.7 6s5.1 3 8 9.6"/><path fill="#fff" d="M319.5 262c2.3-4.2 3.2-7 4.2-12q1.3-6.7.7-14.6c6.7-2.8 14.8-7.3 17.5-7.7-1.8 6.4 2.6 13.3 11.5 12.4l1.6 17.2c.8 7.7.7 17.4.6 19.1s1.2 1.4 2.5-2.4c1.7-5 2.2-18.2 1.6-27l-.7-8.4c5.8-2.7 6.8-7.8 9-10 1.9 6.8 12.6 7.7 16 6.3 4-1.9 5.4-5.1 6.5-12.7s-2-10.7-3.1-11.5l-2.9 9.8s2.6 2.7 2.7 4c-2 2-6.4 2-10.1.9s-4.8-3.5-4.6-5c.2-1.4 1.6-2.8 1.6-4.6s-.8-1.3-2.3.3a35 35 0 0 0-4.5 6.5 14 14 0 0 1-9.1 7.3l-2.3-22.6c-.3-3-3.5-28.2-3.7-31-.2-2.5-.6-5.4-.5-6.7q0-1.4 1.8.4a13 13 0 0 0 3.2 3c1-.5 0-3.8-1.4-6.8-1.4-2.9-6.2-14.5-7.2-15a28 28 0 0 0-4 8.3c.5.9 1.9 2.3 1.9 6.2 0 1.1.7 11.5 1.7 21.3.9 8.6 2 16.9 2.1 17.8.8 6.6 1.7 16 2.6 25-5.2-1-6.5-4.3-6.4-6.3.1-2.2 1.1-4.7.6-5.2-1-.6-7 2.7-15.2 6.3l-7.8 3c-.7-6.2-1.6-12.1-2-16.6v-.6a17 17 0 0 0 11.9-5.7c2.5-3.3 4.3-10 4.5-15.2s-4-14.6-5-17.6q-1.5-4.5-1.6-6.2c-.1-1 2.2 1.2 3.7 1.7 1 .2.7-2-.6-3.5s-7.7-11.4-8.2-10.7c-.3.4-3 7.7-3 8.8a6 6 0 0 1 2.2 4.4 75 75 0 0 0 3.2 14.2c1.6 4.4 5 12.8 5.2 15.2-2.4 1.7-8 4.6-13.5 4.4l-2.8-23c-.2-2.4-.2-5-.2-6.4q.1-1.6 1.9.1c1 1.2 2.7 2.8 3 2.7.8-.3.2-2.7-1.3-5.7s-7.3-15.2-8.3-15.7c-.5-.2-3.1 6.7-3.3 8.1.5 1 1.9 2.3 2 6.2 0 3.1 1.6 18.5 3 32-5.5-2.8-7.4-6.8-8-13.6-.5-4.7-.6-13.4-2.3-20.6a22 22 0 0 0-5.3-10.5l-3 9.7a59 59 0 0 1 3.2 17.6c0 7-.6 13.8-8.5 18.6-7.8 4.7-19.6 2.8-22.5-4.6-3-7.4 3.5-25.9 3.4-30.2 0-4.4-.8-5-2.6-4.3s-5.6 5-8.8 11.8-4.7 15.4-6.5 21.1-4.7 11.7-9.2 11.3c-4.6-.3-7-4.4-8.4-10.4s-.5-13.8-.1-15.9c.9-5-1.3-4-2.6 4a41 41 0 0 0 1.2 20.9c3 8.1 8 11.2 12.2 10.1 4.4-1 8.2-11.2 9.6-15.8 1.3-4.5 7.3-24.8 10.7-25.8.5 2.3-2.6 9.6-3.6 18.3-1 8.6 1.3 20.2 12.3 22.2s18.3-5.1 21-10 4-10.2 4.3-12.8c.3 6.7 4.8 17 13.6 20l1 .2c.4 5.4 1.3 12.5 2.1 19.9l-5.1 1.4-.8-2c-2.6-5.8-7-11.1-13.2-10.7-6.3.3-13.1 8.7-12.8 14.8.2 4.1 2.4 7.5 10.7 8.4q5.6.6 11.8-1a17 17 0 0 1 1 5c-2.6 3-24.1 19.3-40.3 20.9s-21-7-21.2-15.4c-.2-6.5 3.7-13 6.5-17.4 3.9-2.9 7-6.5 9.1-9.2l1.6.9a7 7 0 0 1 2.7 2.8c.3-.5 2-3.5 1.3-5q-.6-.7-3.5-2.3c1.9-4.6 1.8-9.2-.5-10.2-2.7-1.2-6.2 2-7.7 4q-1.1 1.5-1 3-.2 2 2 3.4 2 1.5 3.9 2.6c-3.5 3.7-11.9 9.1-17 12.3q-.4-.6-2 1.2l-1.3.9c-4 2.5-13.8 8-15.8 9.3-1.9 1.3-.7 1.1 0 .8l5.2-2.6 9.3-4.5q-1.6 2.4-2.8 5.5c-3.8 9.1-10 28 3.4 39.2 12.8 10.9 35 6.7 53.3-4.5 18.3-11.3 22.3-15.2 25.1-19.3m-59.7-44.8q-1-.7-.2-1.5 1-.8 2.4-1.3c2-.3 2.9 2 2 5.6zm42 15.4c-9.3 0-9.8-1.7-9.6-2.7s3.1-4 6.8-2.1q2.3 1.3 5 4.7zm-28.6 49.2c-17.6 4.8-34.8-2.7-35.8-17.4a43 43 0 0 1 6-24.6l6.8-3.5a37 37 0 0 0-5.5 25.8c2 9.5 10.4 15.3 24.4 13.4 14-1.8 32.8-15 38.1-20 1.7-1.8 2.7-3.5 4.2-6.8q1-2 1.8-5.2.3-2 .3-4.1 2.4-.7 5-1.7c.5 6 1 12 1 17.2-8.7 10.2-28.6 22-46.3 26.9M581.6 243c-.6-10-2-27.8-2.8-36.9-.7-8-2.1-19.1-3.2-28.8l-.2-6.2c0-1 1.1-.7 2.2.4s2.7 2.5 3 2.4c1.1-.6-.1-3.3-1.6-6.2s-7.4-15-8.4-15.4a28 28 0 0 0-3.4 8.4c.5.9 1.8 2.2 2 6.2.1 3.9 2.1 22 3.6 36.7 1 10.2 2.2 26.8 3.2 39.3l1 13.3c.5 7.7.2 17.4.2 19 0 1.8 1.2 1.5 2.5-2.3a80 80 0 0 0 2.2-20zm-50-34.6c-1.8.5-4.7-1.4-4.5-5.4.2-3.6 1.8-7 2.4-9.1.8-3 .8-5.8.1-4.2a69 69 0 0 0-5 15.3c-.7 4.7.9 7.8 3 8.8 2.5 1.3 4.4-.8 5.7-3.8s1-6.3.1-5.5c-.7.8-1 3.6-1.8 3.9m-26 14.6c1-2.6 1.2-5 .4-3.7-1.6 3-4.8 9-5.7 13.1s.2 7 2 8c2.2 1.3 4-.4 5.3-3 1.3-2.5 1.4-5.5.6-4.9-.7.7-1.2 3.2-2 3.4-1.6.3-4-1.5-3.4-5 .4-3.2 2-6.1 2.8-8m132.7-75.9c-1.9.5-4.6-1.6-4.1-5.6.4-3.6 2.1-6.9 2.9-9 1-3 1.1-5.8.3-4.2a70 70 0 0 0-6 15c-.8 4.7.5 7.9 2.5 9 2.5 1.4 4.5-.5 6-3.5 1.4-2.9 1.3-6.3.5-5.5s-1.2 3.6-2.1 3.8m-.6 49c2.5 1.4 4.5-.5 6-3.5 1.4-2.9 1.3-6.3.4-5.5-.7.8-1.1 3.6-2 3.8-1.9.4-4.6-1.6-4.1-5.6.4-3.6 2.1-7 2.8-9 1-3 1.2-5.8.4-4.2a69 69 0 0 0-6 15c-.9 4.7.5 7.8 2.5 9m32.2-62.6c1.2-3.5 1.4-7 .4-5a84 84 0 0 0-7.2 18.1c-1.1 5.7.5 9.5 3 10.9 3 1.7 5.4-.7 7.2-4.3 1.6-3.4 1.6-7.6.5-6.6-.9 1-1.4 4.3-2.5 4.6-2.2.5-5.5-2-5-6.8.6-4.3 2.7-8.3 3.5-10.9"/><path fill="#fff" d="M337.3 248c2-4.2 2.7-8.5 1.3-6.2a108 108 0 0 0-11.5 22c-2.1 7-.6 12 2.3 14 3.6 2.5 7-.2 9.6-4.5s3-9.4 1.6-8.3-2.4 5.3-3.8 5.5c-2.8.4-6.6-3-5.3-9 1.2-5.5 4.4-10.3 5.8-13.4m277.3 42.5c1.5-1.2 14.7-8.3 17.2-9.8 0 0 2.5-4 1.7-4.5-.7-.4-5.6 4-8.6 4.1s-7-2-7.2-3.9c.4-1.3 4-3.4 5.3-3.5 1.3 0 1.1 3 1.5 3.3.5.4 2.2-2 2.4-3s0-5.2-2.3-4.6c-3.8 1-9.5 8-10.1 10.1-.7 2.2 2.8 4.1 5.4 5.2-.2 0-2.1 1-3.4 2.2 0 0-1.3 1.5-1.9 4.4m-45 8.8c1.5-1.2 14.7-8.3 17.2-9.8 0 0 2.5-4 1.7-4.4-.7-.5-5.6 3.9-8.6 4s-7-2-7.2-3.9c.4-1.3 4-3.4 5.3-3.5 1.3 0 1.1 3 1.5 3.3.5.4 2.2-2 2.4-3s0-5.2-2.3-4.6c-3.8 1-9.5 8-10.1 10.1-.7 2.2 2.8 4.2 5.4 5.2-.2 0-2.1 1-3.4 2.2 0 0-1.3 1.5-1.9 4.4M468.3 172c1.1 1.4 8.9 11.2 15 17.4a618 618 0 0 0 28.7 27.4c2 14.8 4.2 33.7 5.1 41.4 1 7.7 1 17.4 1.1 19 0 1.8 1.2 1.4 2.4-2.4 1.5-5 1.7-18.2.9-27l-2.9-24.6a239 239 0 0 1 11.7 12.2c5.3 6 9.7 10.6 12.4 17.2 2 4.6 1.7 8.3 2.5 9 .7.6 1.5-5 .6-10.3-1.3-8.7-3.2-12.4-14.4-24.8q-6.6-7.4-14.2-14.4l-.5-4c-.4-2.9-4.2-28-4.5-30.8-.2-2.5-.7-5.4-.7-6.7q.1-1.4 1.9.4c1 1.1 3 3 3.2 2.9 1.1-.6 0-3.8-1.6-6.7-1.4-3-6.5-14.5-7.5-15a28 28 0 0 0-3.8 8.5c.6.9 1.9 2.2 2 6.2a399 399 0 0 0 4.9 38.9v.1l-12.3-11a188 188 0 0 1-20.8-21.4c-.2-.7 1-.3 3 0 2 .4 3.7 1 3.4 0-.2-.4-1-1.6-2.8-2.7l-10.5-6.4c-3.6-2.2-5.5-4-6.2-3.5-.4.2 0 7.7.2 8.6.9 0 2.5 1.1 3.7 2.5"/><path fill="#fff" d="M478.2 158.7a50 50 0 0 1 11.2.4c-1 .7-8.3 4.4-9.8 5.3q-2.1 1.3-1 1.3c2-.6 6.7-1.3 9-2.5 2.1-1 5.7-5.8 7.1-7.6 1.4-1.9 1.4-2.8 1-3.2a38 38 0 0 0-15-.5c-1.3.8-3.7 5.3-4 6.2q-.7 1.3 1.5.6m39.5-.6c1.2-.3 7-.1 9 .3-.8.6-6.7 3.6-7.8 4.3q-1.8 1.1-1 1c1.8-.4 5.5-1 7.4-2 1.7-.8 4.6-4.7 5.7-6.1q1.5-2.1.8-2.6a31 31 0 0 0-12.2-.4 20 20 0 0 0-3.2 5q-.5 1 1.3.5m32.1-.4c1.2-.3 7-.1 9 .3-.8.6-6.7 3.6-7.8 4.3q-1.8 1-1 1c1.8-.4 5.8-1 7.7-2 1.7-.8 3.7-4.7 4.8-6.1 1.1-1.5 1.1-2.2.9-2.6-1.2-.6-8-1.3-11.7-.4-1 .7-2.9 4.3-3.2 5s.1.8 1.3.5m-20 15.6c-1.9 3 .5 5.4 1.4 7.8-1.2 1.1-3 .1-3.6-.8-1.3-2-.9-5.9-2.4-6.5-.4 1.1-.6 2.3-.6 2.3s1.1 2.7.8 4.4c-.1 1.1-1.1 2.4-2.3 2.4-3.4 0-1.7-4.9-3-7.7l-.8 2.1.4 2.3q0 1.9.2 3.5.4 2.2 2.3 2.4c2.5.2 3.6-1.8 4-3.4.4 1.6 3.7 3.5 5.3 1.4 2.2-2.7.4-5-.7-7.6-.8-2-.5-3.2-1-2.6m-93.6-7.9q.2 1.8 1.8 2.2c2.1.3 3.2-1.4 3.6-2.9.3 1.5 3 3.3 4.5 1.5 2-2.2.7-4.3-.2-6.6-.6-1.7-.3-2.7-.7-2.2-1.8 2.5.1 4.7.7 6.8-1 .8-2.5 0-3-.9-1-1.7-.5-5-1.7-5.7l-.7 2s.9 2.3.5 3.8c-.2 1-1 2-2.1 2-2.9-.1-1.2-4.3-2.2-6.8l-.8 1.8q.3 1 .3 2zm68 116c.3-.5 1-2 .8-2.9s-1.3-5-3.6-6-4 1.2-5 4h-.8q-.3.6-.6 2.3c-.3 1.7-.7 2.7-3.6 5.4A92 92 0 0 1 476 294c-5 2.4-8.7 4.6-10 5.2s-1 1 .3.5l10.8-3.7q4-1.7 10-5.5 6.6-4.4 7.9-8.2l.8-2.6s1.6 1 4.4 1.6 3.6.5 4 0m-3.8-5.7c1.2.5 2 1.8 2.2 2.7-1.4 0-4-.7-5.2-1.2q1.1-2.1 3-1.5"/><path fill="#fff" d="M474.3 284.2c-3.9-.6-13.7-2-16.1-7.8 2-3 11.3-6.7 23-10.2s23.8-8 27.1-10.2c.7-.2 2.1-.1 2.1-.1.6-1.7 3.5-7.6 3.7-8.9-3.3.2-23.3 1.7-32.3 2.2-8.9.4-26 .3-31.8.3a101 101 0 0 1 28-13.2q1.6 2.7 2 5c.7-.7 1.3-3.3 1-6 7-2.2 10.6-3 12.2-3.3a27 27 0 0 0 3-10.1c-1.1-2-4.4-4.3-7.3-6.3-4-2.8-8.3-5.2-12.5-4.2-6 1.5-7 12.3-5.7 14.5l2.7 3.6q-6.7 2.6-12.7 5.8c-8.8 4.6-18.7 9.7-21.5 14.5l-.8.4c-.3.5-2 8-2.4 8.9 1.9-.1 15.5 0 25-.4l21.1-.6a89 89 0 0 0-21 8.6c-3.7 2.8-6 7-6 14.2a34 34 0 0 1-15-11.6c-6-8-4.8-16.4-7.2-27.3a73 73 0 0 0-15.6-33.3c-1.5 5.6-1.7 9.8-1.7 9.8s5.8 12.8 8.7 21a93 93 0 0 1 5.3 18c-2.4 5.3-16.7 16.4-28.6 23-11.3 6-21.3 6.7-24.8 2.3a7 7 0 0 1-1.4-3l4.6-2.1c10.2-4.7 28.2-14.4 32.5-19.5a20 20 0 0 0 1.8-20c-2.7-5-6.9-10.7-7.2-12.7-.2-1 2.7.3 4.5.4q1.3-.2-1.4-3l-9.3-7.9q-.8-.7-1 .2l-1.6 7.8.2 1q1 .4 1.7 1.8c.5 1.5 2.2 5.6 5 10.7 2.8 5.2 6.8 10.8 7.2 13.7-3.3 4.2-19.9 13.2-36 20.5a65 65 0 0 1 6.3-12.9c1.6-3 1.7-6.5.8-5.7s-1.5 3.7-2.4 3.9c-2 .4-4.8-2-4-6.1.6-3.8 2.6-7.2 3.5-9.4 1.2-3 1.5-6 .6-4.4-2 3.7-6 10.7-7.1 15.6-1.2 5 0 8.3 2.1 9.6q1.2.7 2.2.5-2.3 4-4.4 10c-6.5 2.9-12.8 5.5-18 7.4-19 6.7-32.3 10.7-41.7 13.6l-.4.2c.7-2.2.6-4.1-.1-3.6-.9.8-1.5 3.8-2.4 4-2 .4-4.7-2-4-6.1.6-3.8 2.6-7.2 3.5-9.4 1.2-3 1.5-6 .6-4.4-2 3.7-6 10.7-7.1 15.6-1.2 5 0 8.3 2.1 9.6 2.6 1.6 4.8-.4 6.5-3.5l.6-1.2 3-.5c4.3-1 15-2.5 29.9-4.5 11-1.4 18.5-4.4 25.8-7.7v2.4c.4 10 7 13 16 11a90 90 0 0 0 28-15.1 62 62 0 0 0 13-12.3c2-4.3 2.5-9 2.7-11.3.6 6.2 1.2 14.7 7 22 5.3 6.7 16.3 16 36.8 16.3.1-2.5-.9-10.1-.9-10.1M473 222c3-3.3 9.2-1.1 14 3q-3.9.9-9.4 3c-2.1-2.7-4.5-5.2-4.6-6m-115.8-45.3c1.4-.6 5.5-2.5 9.9-5 4.4-2.6 8.5-5.7 10.5-7.7l2-2.2 2.7 1.4c.9.3 2 .8 2.8-1.7.7-2.4-.3-4-1.7-5.8-1.2-1.6-3.2-4-4.7-4.5-1.4-.5-2 2.4-1.8 2.4h1.1c-1.9 1-3.3 3.9-3.4 4.9s0 1.9 2.7 2.5l1 .4c-2.2 2.6-6.3 5.2-9 7.1-4 2.8-9.6 6.1-11.2 7.1s-1.5 1.3-.9 1m23.8-19 .1-1.3c1.9 2 3.3 4.6 3.1 5q-1.1-.2-3.7-1.6zm-5.3 0c0-.4.7-1.5 2.2-2.1s2.2 1 2.3 3.1l-.5.8-1.3-.4q-2.2-.5-2.7-1.4"/><path fill="#fff" d="M455.8 216.3c2.2-1.4 8.1-5.7 11.5-8.5 2.4-2 5.1-4.9 7-7.3l3.3 2c2 1.1 2.7 2.8 2.7 2.8.4-.5 2-3.5 1.4-5-.4-.5-2.8-1.9-5.2-3.3 1.2-2.8 2.9-7.6.5-9.2-2-1.5-5.6.9-7.2 4-1.3 2.5-1.5 4.6 1 6.3l2.1 1.4c-2.6 2.9-7.3 7-10.7 9.9-4.2 3.5-8.1 6.9-8.8 7.7l-.2.3c-1-2.5-.7-4-1.4-3.2-2.9 4.6.8 8.3 2.1 12-1.8 1.7-4.6.2-5.5-1.3-2-3-1.3-9-3.6-10-.6 1.7-1 3.5-1 3.5s1.8 4.2 1.3 6.9c-.3 1.6-1.7 3.6-3.6 3.6-5.2.1-2.7-7.5-4.6-11.8l-1.2 3.2c.4 1.1.6 2.7.6 3.6q0 2.8.3 5.3.6 3.4 3.5 3.8c3.8.3 5.6-2.9 6.1-5.4.7 2.6 5.8 5.5 8.3 2.3 3.3-4.2.6-7.8-1-11.8l-.3-.5q.5.1 2.6-1.3m15-23.7c1.3-2.3 4-2.5 4.8-1.3q1 1.7-.3 5c-2.4-1.6-4.5-3-4.5-3.7"/><path fill="#fff" d="M372.2 201.3c-4.6-.3-7-4.4-8.4-10.4s-.5-13.8-.1-15.9c.3-2-1.8-1-2.6 4a41 41 0 0 0 1.3 20.9c2.9 8.1 7.8 11.2 12.2 10.1s8.1-11.2 9.5-15.8c1.3-4.5 7.3-23.2 10.7-24.2.5 2.3-2.6 8-3.6 16.7s.7 19.9 11.7 21.9 18.3-5.1 21-10 4-10.1 4.3-12.7c.3 6.6 4.9 16.9 13.6 19.8 8.5 2.9 15 .3 17.8-3.4 2.6-3.3 4.6-10 4.8-15.2s-4.3-14.6-5.3-17.7q-1.5-4.5-1.6-6c0-1.1 2.3 1.1 3.7 1.6 1 .2.7-2-.5-3.5s-7.8-11.4-8.3-10.7c-.2.4-2.9 7.7-3 8.8 1 .7 2.2 2.6 2.3 4.4s1.8 9.7 3.4 14.2 4.7 12.8 5 15.2c-3.2 2.2-10.2 5-16.9 2.1-6.7-2.8-8.8-7-9.5-14.3-.5-4.8-.6-13.4-2.2-20.7A22 22 0 0 0 426 150l-3 9.7c.8 2.4 3.3 10.6 3.3 17.6-.1 7-.7 13.9-8.5 18.6-8 4.7-19.1 2.8-22-4.6-3-7.3 3.5-24 3.5-28.3-.1-4.4-1-5-2.7-4.3-1.9.8-5.6 5-8.8 11.8s-4.7 13.7-6.5 19.5-4.7 11.7-9.2 11.3M241 175.7c5.6-.4 10.3-4.6 11.6-5.7s1.8-2.8 1-2.2c-6.5 5.8-15 6-15.5 5 .2-1 2.4-2.5 5.7-4.8q3-1.8 5.2-4.3h.3c2.5.6 5.3 1.6 6.2.8q2.3-2.3 0-6.1c-1.3-2-4.3-4-6.9-5.4s-3 .8-3.4 1.6q-.5 1.2.4 1.4a10 10 0 0 0-1.7 3.8q-.2 1.2.3 2 0 .3 1.5 1l1.1.4c-2 1.8-4.2 3.2-5.4 4a13 13 0 0 0-5.4 5.8c-.8 2.3-.5 3.2 5 2.7m10-16.3.1-1.2v-.8c1.8 1.3 4.6 3.7 4.4 5.2l-5.2-1.2zm-5.2.3c-1.3-1 0-2 1.1-2.7q2.2-1.3 3.1 2.1-.3 1-1 1.9c-1.2-.4-2.8-1-3.2-1.3m12 78.8c-1.6 1.4-2.3 5.9-2 6.1.4.3 5.4 2 6.2 2.4l.3-1.4c2.4 2.1 5 12.8 5.6 12.8q1 .1 2-4l1.6-9.8c.5-2.9 1.2-4.6 3-4.9s3 2 3.5 3.5c0 0 1.3-3 1.5-4.8-.3-1-3-4.6-5.3-3.4s-3.6 6.3-4 9.5c-.5 3.2-.9 7.1-1.4 7.8a30 30 0 0 0-4.7-10.4c-2.5-3-5.5-4.2-6.3-3.4m-21.3-5.5c2-.5 6.7-1.3 9-2.4 2.1-1 5.7-5.9 7.1-7.7s1.4-2.7 1-3.2a38 38 0 0 0-15-.4c-1.3.8-3.7 5.3-4 6.2-.4 1 0 .9 1.5.6s8.6-.2 11.2.3c-1 .8-8.3 4.5-9.8 5.3q-2 1.5-1 1.3m430.3 25.9c-.2-5.4-2.9-13.7-13-26.5-3.4-4.4-8.3-10.1-13.5-16l-.4-5.4c-.7-8-3-24.5-4-34.3l-.2-6.4q.1-1.6 1.9.2c1 1 2.7 2.7 3 2.6.8-.3.2-2.7-1.3-5.6-1.5-3-7-14.8-8-15.2-.5-.3-3.1 6.7-3.3 8.1.5.9 1.9 2.2 2 6.2s2.5 27.2 3.9 41.8v.9c-7.7-8.7-15-16.5-18-19.7l-1.6-1.9L613 177c-.2-2.5-.3-5-.2-6.4q.1-1.6 1.9.1c1 1.2 2.7 2.8 3 2.7.8-.3.1-2.7-1.3-5.7-1.5-2.9-7.2-15-8.3-15.4-.5-.3-3.2 7.2-3.4 8.6.5 1 1.9 2.3 2 6.2 0 1.7.5 6.8 1 13.2-5-6.1-10-12.5-10.4-13.8-.1-.6 1-.2 3 .1s3.8 1 3.5 0q-.2-1-2.8-2.9c-2-1.1-6.8-4.2-10.5-6.4-3.6-2.1-5.4-4-6.2-3.4-.4.2 0 7.6.2 8.6.9 0 2.6.7 3.7 2.2 1 1.4 8 11.2 13.6 17.8l7 8.3 1.6 17.6c1.1 12 5.2 43.7 5.2 54a25 25 0 0 1-15.3 6.8c-6.3 0-9.7-1.6-12.2-6.3l-2.2-4.2a8.4 8.4 0 0 0-9.2-4l-.6.2-1 .5q-3.7 1.8-7.5 6.8c-4.3 5.9-7.1 12.2-10.3 17.7-3.4 5.8-6 9.6-11.8 8.7-4.1-.7-7.3-4.2-9.2-8.6q8-5.4 12.3-15.4c3.7-8.8 5-18.8 4.7-30-.3-10.5-5.1-35.3-6.4-44.8-1.2-9.5-3-17.3-2.9-19.3s3.4 2.6 5 3c.8-.2.3-3.2-1.2-5.7-1-1.6-4.4-9.3-6.6-13-1-1.8-1.2-2.8-1.7-3s-4.1 7.5-3.7 8.4c1 1.5 1.8 2.2 2 5 .3 2.7 2.8 23 5 37.8 1.6 11.2 5.2 31.6 5.7 46.7.1 4.9-.6 8.4-1.2 10.4-1.6 3-4.1 6.3-13 12.7-1.4-9 0-16.3-1.2-17-1.5.2-1.7 4.4-2 9.6q0 3.6.6 9.2c-11 7.3-25.5 14-32.3 17.6-4 2-2.6 2.6.8 1.5 3.4-1 22-5.9 31.9-11.1l1-.6q.9 2.6 2 5c3.3 7 8 11 13.2 10.7 4.3-.4 7.5-5 10.3-10.6 2.7-5.6 7.4-16.3 12-20.2q2.7-2.4 5.4-3.5s3.2-1 6 .8q1.6 1.1 2.4 2.8c1.1 2.5 2.5 5.7 5.2 8.3 4.9 4.7 12.7 3.8 18.6 1 5.8-2.7 8.8-7 10.1-12a83 83 0 0 0 1.5-25.4c-.5-9-2-18.2-2.8-27.9-.2-3.1-.8-7.5-1.3-12.2a437 437 0 0 0 19.1 21.1l2.7 40.9c.5 7.7.1 17.4 0 19 0 1.8 1 1.5 2.3-2.3 1.8-5 3-18.1 2.5-26.9-.2-5.2-.7-14.6-1.3-23.5 4.5 5.2 8.7 10.5 11.4 14.1 4.9 6.4 9.4 14 11 18.7 1.5 4.8 1.6 6.2 2 7s1.6-2.6 1.4-8M584.6 439q-.9-2-3.4-2.2c-2.5-.2-3 1-3.4 2.2h-15.3q-.3-2.6.5-5h31.5l.8 1.4q1.2 2.1 3 3.6zm20.8-14.6h-37.8a9 9 0 0 0 4-8.3c-.3-2-2.2-3.4-4.6-3.6h-1.2c-2.8.3-5 2.4-4.6 4.6l.1.9.1 1.3q.3 2.6-.4 5H281.2a24 24 0 0 0 20 9.8l255.2-.1c-3 2-4.4 5.1-4 8.2.3 2.3 2.8 4 5.7 3.6 2.9-.2 5-2.3 4.7-4.6l-.2-.8h15c.3 1.4 1.8 2.5 3.6 2.5s3.2-1 3.5-2.5h15.2a20 20 0 0 0 11.5 3.5c4 0 7.3-2.8 7.3-6.3v-1.8c0-6.3-6-11.4-13.3-11.4"/></g></svg>',
        AED: '<svg viewBox="0 0 40 40"><rect width="40" height="13.34" fill="#00732f"/><rect y="13.34" width="40" height="13.33" fill="#fff"/><rect y="26.67" width="40" height="13.33" fill="#000"/><rect width="11" height="40" fill="#ff0000"/></svg>',
        QAR: '<svg viewBox="0 0 40 40"><rect width="40" height="40" fill="#8a1538"/><rect width="14" height="40" fill="#fff"/><path d="M8 0 14 2.22 8 4.44 14 6.67 8 8.89 14 11.11 8 13.33 14 15.56 8 17.78 14 20 8 22.22 14 24.44 8 26.67 14 28.89 8 31.11 14 33.33 8 35.56 14 37.78 8 40 14 40 14 0Z" fill="#8a1538"/></svg>',
        KWD: '<svg viewBox="0 0 40 40"><rect width="40" height="13.34" fill="#007a3d"/><rect y="13.34" width="40" height="13.33" fill="#fff"/><rect y="26.67" width="40" height="13.33" fill="#ce1126"/><path d="M0 0 12 13.34 12 26.67 0 40Z" fill="#000"/></svg>',
        BHD: '<svg viewBox="0 0 40 40"><rect width="40" height="40" fill="#ce1126"/><path d="M0 0h8l6 4-6 4 6 4-6 4 6 4-6 4 6 4-6 4 6 4-6 4H0Z" fill="#fff"/></svg>',
        OMR: '<svg viewBox="0 0 40 40"><rect width="40" height="13.34" fill="#fff"/><rect y="13.34" width="40" height="13.33" fill="#db161b"/><rect y="26.67" width="40" height="13.33" fill="#008000"/><rect width="11" height="40" fill="#db161b"/><g fill="#fff"><path d="M5.6 10 7.5 11.8 5.6 13.6 3.7 11.8Z"/><rect x="2.3" y="14" width="6.6" height="1.4" rx=".7"/><path d="M3.3 15.7h4.6l-1 3.1H4.3Z"/></g></svg>',
    };

    const ICONS = {
        x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
        discord: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.058a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .078-.011c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.099.246.198.373.292a.077.077 0 0 1-.006.128 12.3 12.3 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.029 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.029zM8.02 15.331c-1.182 0-2.157-1.086-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.211 0 2.176 1.095 2.157 2.419 0 1.333-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.419 0 1.333-.946 2.419-2.157 2.419z"/></svg>',
        github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 0 1 3-.405c1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
        coffee: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023a1.16 1.16 0 0 1-.108-.09c-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/></svg>',
        logo: '<svg viewBox="0 0 46 32"><defs><filter id="wdsfx-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#wdsfx-glow)" stroke-width="2.1"><circle cx="17" cy="16" r="11.6" fill="#2f6bff" fill-opacity=".16" stroke="#3b7bff"/><circle cx="29" cy="16" r="11.6" fill="#2ee36a" fill-opacity=".16" stroke="#2ee36a"/></g></svg>',
        refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3.4-7.03"/><path d="M21 3v6h-6"/></svg>',
        trend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18 13 9l4 4 6-7"/><path d="M17 6h6v6"/></svg>',
        chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
        back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6 15 12 9 18"/></svg>',
        close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6 18 18M18 6 6 18"/></svg>',
        minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/></svg>',
        check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="m4.5 12.5 5 5 10-11"/></svg>',
        palette: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21a9 9 0 1 1 9-9c0 1.8-1.5 2.6-3 2.6h-1.6a2 2 0 0 0-1.4 3.4c.5.6.2 1.6-.6 1.8-.8.2-1.6.2-2.4.2Z"/><circle cx="8" cy="10.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="7.6" r="1.1" fill="currentColor" stroke="none"/><circle cx="16" cy="10" r="1.1" fill="currentColor" stroke="none"/></svg>',
    };

    const SOCIAL = [
        { icon: ICONS.x,       url: 'https://x.com/wdox_',           title: 'X',       tint: '#5be49b' },
        { icon: ICONS.discord, url: 'https://discord.gg/qU3SPcheSG', title: 'Discord', tint: '#7b86f5' },
        { icon: ICONS.github,  url: 'https://github.com/DevWD7',     title: 'GitHub',  tint: '#dfe7f3' },
        { icon: ICONS.coffee,  url: 'https://ko-fi.com/wdox_',       title: 'Ko-fi',   tint: '#38b6e8' },
    ];

    const TARGETS = [
        { code: 'SAR', name: 'ريال سعودي',   nameEn: 'Saudi Riyal',    accent: '#2DBD2D', decimals: 2, peg: 3.7500 },
        { code: 'AED', name: 'درهم إماراتي', nameEn: 'UAE Dirham',     accent: '#7c83ff', decimals: 2, peg: 3.6725 },
        { code: 'QAR', name: 'ريال قطري',    nameEn: 'Qatari Riyal',   accent: '#c9184a', decimals: 2, peg: 3.6400 },
        { code: 'KWD', name: 'دينار كويتي',  nameEn: 'Kuwaiti Dinar',  accent: '#fbaa17', decimals: 3, peg: 0.3065 },
        { code: 'BHD', name: 'دينار بحريني', nameEn: 'Bahraini Dinar', accent: '#ff5470', decimals: 3, peg: 0.3760 },
        { code: 'OMR', name: 'ريال عُماني',  nameEn: 'Omani Rial',     accent: '#22d3ee', decimals: 3, peg: 0.3845 },
    ];

    const SOURCES = [
        { code: 'USD', label: 'دولار أمريكي',   labelEn: 'US Dollar',         sym: '$',  tint: '#2ee36a', tokens: ['$'],           regex: /(?:^|[^A-Za-z0-9])\$\s*([\d][\d.,]*)|US\$\s*([\d][\d.,]*)/ },
        { code: 'EUR', label: 'يورو',            labelEn: 'Euro',              sym: '€',  tint: '#7c83ff', tokens: ['€'],           regex: /([\d][\d.,\s\u00A0]*)\s*€|€\s*([\d][\d.,\s\u00A0]*)/ },
        { code: 'GBP', label: 'جنيه إسترليني',  labelEn: 'Pound',             sym: '£',  tint: '#fbaa17', tokens: ['£'],           regex: /([\d][\d.,\s\u00A0]*)\s*£|£\s*([\d][\d.,\s\u00A0]*)/ },
        { code: 'TRY', label: 'ليرة تركية',      labelEn: 'Turkish Lira',      sym: '₺',  tint: '#22d3ee', tokens: ['₺', 'TL'],     regex: /([\d][\d.,\s\u00A0]*)\s*(?:₺|TL)(?![A-Za-z])|(?:^|[^A-Za-z])(?:₺|TL)\s*([\d][\d.,\s\u00A0]*)/ },
        { code: 'UAH', label: 'هريفنيا أوكراني', labelEn: 'Hryvnia'      , sym: '₴',  tint: '#e879f9', tokens: ['₴'],           regex: /([\d][\d.,\s\u00A0]*)\s*₴|₴\s*([\d][\d.,\s\u00A0]*)/ },
        { code: 'ARS', label: 'بيزو أرجنتيني',   labelEn: 'Argentine Peso',    sym: 'AR$', tint: '#61b6ff', tokens: ['ARS$', 'AR$'], regex: /(?:ARS\$|AR\$)\s*([\d][\d.,\s\u00A0]*)/ },
        { code: 'CNY', label: 'يوان صيني',        labelEn: 'Chinese Yuan',      sym: '¥',  tint: '#ff6b6b', tokens: ['¥'],           regex: /([\d][\d.,\s\u00A0]*)\s*¥|¥\s*([\d][\d.,\s\u00A0]*)/ },
        { code: 'PKR', label: 'روبية باكستانية',  labelEn: 'Pakistani Rupee',   sym: '₨',  tint: '#a3e635', tokens: ['Rs', '₨'],     regex: /(?:^|[^A-Za-z])(?:Rs\.?|₨)\s*([\d][\d.,\s\u00A0]*)/ },
        { code: 'INR', label: 'روبية هندية',       labelEn: 'Indian Rupee',      sym: '₹',  tint: '#ff9933', tokens: ['₹'],           regex: /([\d][\d.,\s\u00A0]*)\s*₹|₹\s*([\d][\d.,\s\u00A0]*)/ },
    ];

    const SOURCE_ORDER = ['ARS', 'UAH', 'TRY', 'PKR', 'INR', 'CNY', 'GBP', 'EUR', 'USD'];
    const MATCH_ORDER = SOURCE_ORDER.map(code => SOURCES.find(s => s.code === code));

    const REQUIRED_LIVE = ['UAH', 'TRY', 'ARS', 'EUR', 'GBP'];
    const EXTRA_LIVE = ['CNY', 'PKR', 'INR'];
    const NEEDED = REQUIRED_LIVE.concat(EXTRA_LIVE, TARGETS.map(t => t.code));
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    const DEFAULT_RATES = { USD: 1, UAH: 42, TRY: 42, ARS: 1450, EUR: 0.90, GBP: 0.78, CNY: 7.1, PKR: 280, INR: 88 };
    TARGETS.forEach(t => { DEFAULT_RATES[t.code] = t.peg; });

    const DOCS = {
        ar: {
            terms: {
                title: 'سياسة الاستخدام',
                items: [
                    'الأداة مجانية ومفتوحة المصدر برخصة MIT، واستخدامها على مسؤوليتك الشخصية.',
                    'الأسعار المعروضة تقريبية للاسترشاد فقط، ومصدرها خدمات صرف خارجية قد تتأخر أو تختلف عن السعر الفعلي الذي يخصمه البنك أو بوابة الدفع.',
                    'الأداة تضيف نصًا بجانب السعر فقط، ولا تعدّل حسابك في Steam ولا تنفّذ أي عملية شراء أو دفع.',
                    'لا يتحمّل المطوّر أي مسؤولية عن فرق سعر أو قرار شراء بُني على الأرقام المعروضة.',
                    'الأداة مستقلة تمامًا وليست تابعة لشركة Valve أو منصة Steam ولا معتمدة منهما.',
                ],
            },
            privacy: {
                title: 'سياسة الخصوصية',
                items: [
                    'لا تجمع الأداة أي بيانات شخصية، ولا ترسل أي معلومة عن تصفحك أو حسابك لأي جهة.',
                    'إعداداتك (العملة المختارة وآخر أسعار الصرف) تُحفظ محليًا داخل متصفحك ولا تغادر جهازك.',
                    'تُطلب أسعار الصرف من: open.er-api.com و api.exchangerate.fun و hexarate.paikama.co. الطلب لا يحمل أي معرّف عنك، وتخضع هذه المواقع لسياسات الخصوصية الخاصة بها.',
                    'لا توجد إعلانات ولا أدوات تتبّع ولا تحليلات من أي نوع.',
                    'حذف الأداة من متصفحك يمسح كل ما حُفظ محليًا.',
                ],
            },
        },
        en: {
            terms: {
                title: 'Terms of Use',
                items: [
                    'This tool is free and open-source under the MIT license, and used at your own responsibility.',
                    'Displayed prices are approximate estimates from third-party exchange services, and may lag behind or differ from the actual rate charged by your bank or payment gateway.',
                    'The tool only adds text next to the price. It does not modify your Steam account or perform any purchase or payment.',
                    'The developer is not responsible for any price difference or purchase decision based on the displayed numbers.',
                    'This tool is fully independent and is not affiliated with or endorsed by Valve or the Steam platform.',
                ],
            },
            privacy: {
                title: 'Privacy Policy',
                items: [
                    'The tool does not collect any personal data and does not send any information about your browsing or account to anyone.',
                    'Your settings (selected currency and last exchange rates) are stored locally in your browser and never leave your device.',
                    'Exchange rates are requested from open.er-api.com, api.exchangerate.fun and hexarate.paikama.co. Requests carry no identifying information about you, and those sites are subject to their own privacy policies.',
                    'There are no ads, trackers, or analytics of any kind.',
                    'Removing the tool from your browser deletes everything stored locally.',
                ],
            },
        },
    };

    const T = {
        convertTo:     { ar: 'حوّل الأسعار إلى',              en: 'Convert prices to' },
        detects:       { ar: 'يتعرف على',                      en: 'Detects' },
        updated:       { ar: 'آخر تحديث',                      en: 'Updated' },
        source:        { ar: 'المصدر',                         en: 'Source' },
        refresh:       { ar: 'تحديث الأسعار الآن',             en: 'Update Prices Now' },
        refreshing:    { ar: 'جاري التحديث…',                  en: 'Updating…' },
        originalColor: { ar: 'تفعيل اللون الأصلي للأسعار',     en: 'Enable Original Price Color' },
        terms:         { ar: 'سياسة الاستخدام',                en: 'Terms of Use' },
        privacy:       { ar: 'سياسة الخصوصية',                 en: 'Privacy Policy' },
        back:          { ar: 'رجوع',                           en: 'Back' },
        agree:         { ar: 'أوافق وابدأ',                    en: 'Agree & Start' },
        later:         { ar: 'ليس الآن',                       en: 'Not Now' },
        fabTitle:      { ar: 'تغيير عملة التحويل',             en: 'Change target currency' },
        closeTitle:    { ar: 'إغلاق',                          en: 'Close' },
        minTitle:      { ar: 'تصغير',                          en: 'Minimize' },
        justNow:       { ar: 'الآن',                           en: 'Just now' },
        notYet:        { ar: 'لم يتم بعد',                     en: 'Not yet' },
        fallback:      { ar: 'قيم احتياطية',                   en: 'fallback values' },
        live:          { ar: 'يعمل الآن',                      en: 'Live' },
    };

    const AGO = {
        ar: { min: n => `قبل ${n} دقيقة`, hour: n => `قبل ${n} ساعة`, day: n => `قبل ${n} يوم` },
        en: { min: n => `${n} min ago`,   hour: n => `${n} hr ago`,   day: n => `${n} d ago` },
    };

    const other = lang => (lang === 'ar' ? 'en' : 'ar');
    const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'SELECT', 'OPTION']);

    const CSS = `
    .wds-price {
        margin-inline-start: 5px;
        color: var(--wds-price, #2ee36a);
        font-weight: 700;
        white-space: nowrap;
        direction: ltr;
        unicode-bidi: isolate;
        text-shadow: 0 0 12px color-mix(in srgb, var(--wds-price, #2ee36a) 45%, transparent);
    }
    #wds-fab, #wds-panel, #wds-gate {
        --bg: #060b14;
        --bg-2: #0c1420;
        --bg-3: #131d2e;
        --line: #1d2941;
        --ink: #eef3fa;
        --ink-2: #7d8ba4;
        --ink-3: #9fb0c8;
        font-family: "Segoe UI", system-ui, -apple-system, Tahoma, sans-serif;
        box-sizing: border-box;
    }
    #wds-fab *, #wds-panel *, #wds-gate * { box-sizing: border-box; }
    #wds-fab svg, #wds-panel svg, #wds-gate svg { display: block; }

    /* ---------- floating button ---------- */
    #wds-fab {
        position: fixed; top: 10px; right: 12px; z-index: 2147483000;
        display: flex; align-items: center; gap: 6px;
        padding: 3px 9px 3px 3px;
        background: rgba(6,11,20,.85);
        border: 1px solid var(--line); border-radius: 999px;
        backdrop-filter: blur(8px);
        cursor: pointer; color: var(--ink);
        box-shadow: 0 6px 22px rgba(0,0,0,.55);
        transition: border-color .18s ease, transform .18s ease;
    }
    #wds-fab:hover, #wds-fab:focus-visible {
        border-color: var(--wds-accent); transform: translateY(1px); outline: none;
    }
    #wds-fab .wds-code {
        font: 700 11px/1 "Segoe UI", system-ui, sans-serif;
        letter-spacing: .8px; color: var(--wds-accent);
    }
    #wds-fab .wds-chev { width: 11px; color: var(--ink-2); }

    .wds-disc {
        position: relative; flex: 0 0 auto;
        width: 40px; height: 40px; border-radius: 50%; overflow: hidden;
        background: #000;
        box-shadow: 0 0 0 2px var(--c, var(--line)), 0 0 14px -3px var(--c, transparent);
    }
    .wds-disc svg { width: 100%; height: 100%; }
    #wds-fab .wds-disc { width: 25px; height: 25px; --c: var(--wds-accent); }

    /* ---------- panel shell ---------- */
    #wds-panel {
        position: fixed; top: 54px; right: 12px; z-index: 2147483000;
        width: 430px; max-width: calc(100vw - 24px);
        max-height: calc(100vh - 80px); overflow: auto;
        direction: rtl; text-align: right;
        background:
            radial-gradient(120% 70% at 50% 0%, rgba(47,107,255,.10), transparent 60%),
            linear-gradient(170deg, #0d1626 0%, var(--bg) 60%);
        border: 1px solid var(--line); border-radius: 20px;
        color: var(--ink); font-size: 13px; line-height: 1.6;
        box-shadow: 0 28px 70px rgba(0,0,0,.75);
        animation: wds-in .18s ease-out;
    }
    #wds-panel[hidden] { display: none; }
    #wds-panel.wds-en { direction: ltr; text-align: left; }
    #wds-panel.wds-min .wds-body,
    #wds-panel.wds-min .wds-doc,
    #wds-panel.wds-min .wds-foot { display: none; }
    @keyframes wds-in { from { opacity: 0; transform: translateY(-8px); } }

    /* ---------- header ---------- */
    #wds-panel .wds-head, #wds-gate .wds-head {
        direction: ltr; text-align: left;
        display: flex; align-items: center; gap: 9px;
        padding: 13px 14px; border-bottom: 1px solid var(--line);
    }
    #wds-panel .wds-mark, #wds-gate .wds-mark {
        width: 44px; height: 44px; flex: 0 0 auto;
        display: grid; place-items: center; border-radius: 14px;
        background: radial-gradient(circle at 50% 40%, #11253c, #070e18);
        border: 1px solid var(--line);
        box-shadow: inset 0 0 20px -6px color-mix(in srgb, var(--wds-accent) 55%, transparent);
    }
    #wds-panel .wds-mark svg, #wds-gate .wds-mark svg { width: 30px; height: 30px; }
    #wds-panel .wds-titles, #wds-gate .wds-titles { flex: 1; min-width: 0; padding-inline-end: 8px; }
    #wds-panel .wds-title, #wds-gate .wds-title {
        font: 700 18px/1.15 "Segoe UI", system-ui, sans-serif; letter-spacing: .3px;
    }
    #wds-panel .wds-title i, #wds-gate .wds-title i { font-style: normal; color: #4a9eff; }
    #wds-panel .wds-ver, #wds-gate .wds-ver {
        display: flex; align-items: center; gap: 6px; white-space: nowrap;
        margin-top: 3px; font-size: 10.5px; color: var(--ink-2);
    }
    .wds-seg {
        display: flex; gap: 2px; padding: 3px; flex: 0 0 auto; margin-inline-start: auto;
        background: var(--bg-2); border: 1px solid var(--line); border-radius: 11px;
    }
    .wds-seg button {
        padding: 6px 9px; border: 0; border-radius: 8px; background: none;
        color: var(--ink-2); font: 700 11px/1 "Segoe UI", system-ui, sans-serif;
        letter-spacing: .6px; cursor: pointer; transition: color .15s ease, background .15s ease;
    }
    .wds-seg button:hover { color: var(--ink); }
    .wds-seg button[aria-pressed="true"] {
        color: var(--wds-accent);
        background: color-mix(in srgb, var(--wds-accent) 14%, transparent);
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wds-accent) 45%, transparent);
    }
    #wds-panel .wds-vsep { width: 1px; height: 20px; background: var(--line); flex: 0 0 auto; margin: 0 1px; }
    #wds-panel .wds-ico {
        width: 26px; height: 26px; flex: 0 0 auto; padding: 6px;
        background: none; border: 0; border-radius: 9px;
        color: var(--ink-2); cursor: pointer;
    }
    #wds-panel .wds-ico:hover { background: var(--bg-3); color: var(--ink); }
    #wds-panel .wds-ico svg { width: 100%; height: 100%; }

    /* ---------- body ---------- */
    #wds-panel .wds-body { padding: 15px; }
    #wds-panel .wds-legend {
        display: flex; align-items: center; gap: 8px;
        margin-bottom: 12px; font-size: 14px; font-weight: 700; color: var(--ink);
    }
    #wds-panel .wds-legend svg { width: 17px; height: 17px; color: var(--wds-accent); }

    #wds-panel .wds-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    #wds-panel .wds-opt {
        position: relative; display: flex; align-items: center; gap: 7px;
        direction: ltr; text-align: left; min-width: 0; overflow: hidden;
        padding: 9px; border-radius: 15px; cursor: pointer;
        background: linear-gradient(180deg, var(--bg-2), #070d17);
        border: 1px solid color-mix(in srgb, var(--c) 26%, var(--line));
        color: var(--ink); font: inherit;
        transition: border-color .15s ease, background .15s ease, transform .15s ease;
    }
    #wds-panel .wds-opt:hover { transform: translateY(-1px); border-color: color-mix(in srgb, var(--c) 60%, var(--line)); }
    #wds-panel .wds-opt:focus-visible { outline: 2px solid var(--c); outline-offset: 2px; }
    #wds-panel .wds-opt[aria-checked="true"] {
        border-color: var(--c);
        background: linear-gradient(180deg, color-mix(in srgb, var(--c) 15%, var(--bg-2)), #070d17);
        box-shadow: 0 0 26px -9px var(--c), inset 0 0 26px -16px var(--c);
    }
    #wds-panel .wds-opt .wds-disc { width: 32px; height: 32px; }
    #wds-panel .wds-opt .wds-names { flex: 1; min-width: 0; overflow: hidden; }
    #wds-panel .wds-opt .wds-names b {
        display: block; font-size: 12px; font-weight: 700;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    #wds-panel .wds-opt .wds-names i {
        display: block; font-style: normal; font-size: 10px; color: var(--ink-2);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    #wds-panel .wds-opt .wds-code {
        flex: 0 0 auto; align-self: flex-end; margin-bottom: 1px;
        font: 800 11.5px/1 "Segoe UI", system-ui, sans-serif;
        letter-spacing: .4px; color: var(--c);
    }
    #wds-panel .wds-opt:not([aria-checked="true"]) .wds-disc { box-shadow: 0 0 0 2px color-mix(in srgb, var(--c) 35%, var(--line)); }
    #wds-panel .wds-check {
        position: absolute; top: 6px; right: 6px;
        width: 16px; height: 16px; border-radius: 50%;
        display: grid; place-items: center; padding: 3.5px;
        background: var(--c); color: #04101c;
        opacity: 0; transform: scale(.5); transition: opacity .15s ease, transform .15s ease;
    }
    #wds-panel .wds-opt[aria-checked="true"] .wds-check { opacity: 1; transform: scale(1); }
    #wds-panel .wds-check svg { width: 100%; height: 100%; }

    /* ---------- detected currencies ---------- */
    #wds-panel .wds-rule {
        display: flex; align-items: center; justify-content: center; gap: 10px;
        width: 100%; margin: 16px 0 0; padding: 0;
        background: none; border: 0; cursor: pointer;
        color: var(--ink-3); font: inherit; font-size: 12px; font-weight: 600;
        transition: color .15s ease;
    }
    #wds-panel .wds-rule:hover { color: var(--ink); }
    #wds-panel .wds-rule:focus-visible {
        outline: 2px solid var(--wds-accent); outline-offset: 4px; border-radius: 9px;
    }
    #wds-panel .wds-rule::before, #wds-panel .wds-rule::after {
        content: ''; flex: 1; height: 1px;
        background: linear-gradient(90deg, transparent, var(--line));
    }
    #wds-panel .wds-rule::after { background: linear-gradient(90deg, var(--line), transparent); }
    #wds-panel .wds-rule span { display: flex; align-items: center; gap: 9px; }
    #wds-panel .wds-rule i {
        width: 5px; height: 5px; flex: 0 0 auto; transform: rotate(45deg);
        background: var(--wds-accent); box-shadow: 0 0 7px var(--wds-accent);
    }
    #wds-panel .wds-rule svg {
        width: 13px; height: 13px; flex: 0 0 auto; color: var(--ink-2);
        transition: transform .2s ease, color .15s ease;
    }
    #wds-panel .wds-rule[aria-expanded="true"] svg { transform: rotate(180deg); color: var(--wds-accent); }
    #wds-panel .wds-chips {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
        margin-top: 11px;
        animation: wds-in .16s ease-out;
    }
    #wds-panel .wds-chips[hidden] { display: none; }
    #wds-panel .wds-chip {
        display: flex; align-items: center; gap: 7px;
        min-width: 0; padding: 7px; border-radius: 14px;
        background: linear-gradient(180deg, color-mix(in srgb, var(--t) 10%, var(--bg-2)), #070d17);
        border: 1px solid color-mix(in srgb, var(--t) 34%, var(--line));
        box-shadow: 0 0 20px -14px var(--t), inset 0 0 22px -18px var(--t);
    }
    #wds-panel .wds-chip em {
        width: 27px; height: 27px; flex: 0 0 auto;
        display: grid; place-items: center; border-radius: 50%;
        background: radial-gradient(circle at 50% 35%, color-mix(in srgb, var(--t) 26%, #060d18), #050a12);
        border: 1px solid color-mix(in srgb, var(--t) 58%, transparent);
        box-shadow: 0 0 12px -5px var(--t), inset 0 0 12px -7px var(--t);
        color: var(--t); font-style: normal;
        font: 800 13.5px/1 "Segoe UI", system-ui, sans-serif;
        direction: ltr; unicode-bidi: isolate;
    }
    #wds-panel .wds-chip em.wds-wide { font-size: 9px; letter-spacing: -.2px; }
    #wds-panel .wds-chip u { flex: 1; min-width: 0; text-decoration: none; text-align: start; }
    #wds-panel .wds-chip b {
        display: block; font: 800 12.5px/1.2 "Segoe UI", system-ui, sans-serif;
        letter-spacing: .3px; color: var(--ink);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    #wds-panel .wds-chip i {
        display: block; font-style: normal; font-size: 9.5px; line-height: 1.35;
        color: var(--ink-2);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }

    #wds-panel .wds-meta {
        margin-top: 12px; font-size: 11.5px; color: var(--ink-2); text-align: center;
    }
    #wds-panel .wds-meta b { color: var(--ink-3); font-weight: 600; }
    #wds-panel .wds-ltr { direction: ltr; unicode-bidi: isolate; }
    #wds-panel .wds-dot {
        display: inline-block; width: 6px; height: 6px; border-radius: 50%;
        background: var(--wds-accent); box-shadow: 0 0 8px var(--wds-accent);
        margin: 0 4px; vertical-align: middle;
    }

    /* ---------- actions ---------- */
    #wds-panel .wds-refresh {
        position: relative; display: flex; align-items: center; justify-content: center;
        width: 100%; margin-top: 13px; padding: 11px 46px;
        border: 1px solid transparent; border-radius: 15px; cursor: pointer;
        color: var(--ink); font: inherit;
        background:
            linear-gradient(180deg, #0e1a2c, #080f1b) padding-box,
            linear-gradient(90deg, #2f6bff, var(--wds-accent)) border-box;
        box-shadow: 0 0 26px -14px var(--wds-accent);
        transition: filter .15s ease, transform .15s ease;
    }
    #wds-panel .wds-refresh:hover { filter: brightness(1.15); transform: translateY(-1px); }
    #wds-panel .wds-refresh[disabled] { opacity: .6; cursor: default; transform: none; }
    #wds-panel .wds-refresh svg {
        position: absolute; left: 18px; width: 21px; height: 21px; color: var(--wds-accent);
    }
    #wds-panel .wds-refresh[disabled] svg { animation: wds-spin .9s linear infinite; }
    #wds-panel .wds-refresh b { display: block; font-size: 14.5px; font-weight: 700; }
    #wds-panel .wds-refresh i { display: block; font-style: normal; font-size: 12.5px; color: #4a9eff; margin-top: 2px; }
    @keyframes wds-spin { to { transform: rotate(-360deg); } }

    #wds-panel .wds-toggle {
        display: flex; align-items: center; gap: 11px;
        width: 100%; margin-top: 10px; padding: 10px 12px;
        background: var(--bg-2); border: 1px solid var(--line); border-radius: 15px;
        cursor: pointer; color: var(--ink); font: inherit; text-align: inherit;
    }
    #wds-panel .wds-toggle:hover { background: var(--bg-3); }
    #wds-panel .wds-toggle .wds-swatch {
        width: 32px; height: 32px; flex: 0 0 auto; padding: 6px;
        display: grid; place-items: center; border-radius: 50%;
        border: 1px solid var(--line); color: var(--ink-2);
    }
    #wds-panel .wds-toggle[aria-checked="true"] .wds-swatch { color: var(--wds-accent); border-color: color-mix(in srgb, var(--wds-accent) 55%, var(--line)); }
    #wds-panel .wds-toggle .wds-swatch svg { width: 100%; height: 100%; }
    #wds-panel .wds-toggle .wds-labels { flex: 1; min-width: 0; }
    #wds-panel .wds-toggle b { display: block; font-size: 12.5px; font-weight: 700; }
    #wds-panel .wds-toggle i { display: block; font-style: normal; font-size: 11px; color: var(--ink-2); margin-top: 2px; }
    #wds-panel .wds-toggle-track {
        position: relative; width: 42px; height: 24px; border-radius: 999px;
        background: var(--line); flex: 0 0 auto; transition: background .18s ease;
    }
    #wds-panel .wds-toggle-thumb {
        position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%;
        background: #7d8ba4; transition: transform .18s ease, background .18s ease;
    }
    #wds-panel .wds-toggle[aria-checked="true"] .wds-toggle-track { background: color-mix(in srgb, var(--wds-accent) 32%, var(--bg-2)); }
    #wds-panel .wds-toggle[aria-checked="true"] .wds-toggle-thumb {
        transform: translateX(18px); background: var(--wds-accent); box-shadow: 0 0 10px var(--wds-accent);
    }

    /* ---------- documents view ---------- */
    #wds-panel .wds-doc { padding: 15px; }
    #wds-panel .wds-doc[hidden] { display: none; }
    #wds-panel .wds-back {
        display: flex; align-items: center; gap: 5px;
        background: none; border: 0; padding: 0; cursor: pointer;
        font: 600 12px/1 inherit; color: var(--ink-2);
    }
    #wds-panel .wds-back:hover { color: var(--wds-accent); }
    #wds-panel .wds-back svg { width: 13px; height: 13px; }
    #wds-panel .wds-doc-title { margin: 12px 0 10px; font-size: 15px; font-weight: 700; color: var(--ink); }
    #wds-panel .wds-doc-list {
        margin: 0; padding: 0; list-style: none;
        max-height: 300px; overflow: auto;
        font-size: 11.5px; line-height: 1.85; color: var(--ink-3);
    }
    #wds-panel .wds-doc-list li { position: relative; padding-inline-start: 14px; margin-bottom: 9px; }
    #wds-panel .wds-doc-list li::before {
        content: ''; position: absolute; inset-inline-start: 0; top: 8px;
        width: 5px; height: 5px; border-radius: 50%; background: var(--wds-accent);
    }

    /* ---------- footer ---------- */
    #wds-panel .wds-foot { padding: 12px 15px 13px; border-top: 1px solid var(--line); }
    #wds-panel .wds-foot-row {
        direction: ltr; display: flex; align-items: center; justify-content: space-between; gap: 10px;
    }
    #wds-panel .wds-links { display: flex; gap: 8px; }
    #wds-panel .wds-links a {
        width: 34px; height: 34px; padding: 8px;
        display: grid; place-items: center; border-radius: 11px;
        background: var(--bg-2); border: 1px solid var(--line);
        color: var(--t); text-decoration: none;
        transition: border-color .15s ease, transform .15s ease, background .15s ease;
    }
    #wds-panel .wds-links a:hover {
        border-color: var(--t); transform: translateY(-2px);
        background: color-mix(in srgb, var(--t) 14%, var(--bg-2));
    }
    #wds-panel .wds-links svg { width: 100%; height: 100%; }
    #wds-panel .wds-policy {
        direction: rtl; display: flex; align-items: center; gap: 7px;
        font-size: 11px; color: var(--ink-2);
    }
    #wds-panel.wds-en .wds-policy { direction: ltr; }
    #wds-panel .wds-policy button {
        background: none; border: 0; padding: 0; cursor: pointer;
        font: inherit; color: var(--ink-2); text-decoration: underline;
        text-underline-offset: 3px; text-decoration-color: var(--line);
    }
    #wds-panel .wds-policy button:hover { color: var(--wds-accent); text-decoration-color: currentColor; }
    #wds-panel .wds-by {
        margin-top: 11px; text-align: center; direction: ltr;
        font-size: 11.5px; color: var(--ink-2); letter-spacing: .4px;
    }
    #wds-panel .wds-by b { color: var(--wds-accent); font-weight: 800; }

    /* ---------- consent gate ---------- */
    #wds-gate {
        position: fixed; inset: 0; z-index: 2147483600;
        display: flex; align-items: center; justify-content: center; padding: 20px;
        background: rgba(3, 6, 12, .76); backdrop-filter: blur(5px);
        animation: wds-in .2s ease-out;
    }
    #wds-gate[hidden] { display: none; }
    #wds-gate .wds-card {
        width: 430px; max-width: 100%; max-height: 84vh;
        display: flex; flex-direction: column;
        direction: rtl; text-align: right;
        background:
            radial-gradient(120% 70% at 50% 0%, rgba(47,107,255,.10), transparent 60%),
            linear-gradient(170deg, #0d1626 0%, var(--bg) 60%);
        border: 1px solid var(--line); border-radius: 20px;
        color: var(--ink); font-size: 13px; line-height: 1.6;
        box-shadow: 0 30px 80px rgba(0,0,0,.78);
    }
    #wds-gate.wds-en .wds-card { direction: ltr; text-align: left; }
    #wds-gate .wds-scroll { flex: 1; overflow: auto; padding: 14px 16px 4px; }
    #wds-gate h5 { margin: 0 0 9px; font-size: 13px; font-weight: 700; color: var(--wds-accent); }
    #wds-gate section + section { margin-top: 16px; }
    #wds-gate ul { margin: 0; padding: 0; list-style: none; font-size: 11.5px; line-height: 1.8; color: var(--ink-3); }
    #wds-gate li { position: relative; padding-inline-start: 14px; margin-bottom: 8px; }
    #wds-gate li::before {
        content: ''; position: absolute; inset-inline-start: 0; top: 8px;
        width: 5px; height: 5px; border-radius: 50%; background: var(--wds-accent);
    }
    #wds-gate .wds-actions { display: flex; gap: 9px; padding: 13px 16px 16px; border-top: 1px solid var(--line); }
    #wds-gate .wds-actions button {
        flex: 1; padding: 12px; border-radius: 13px; cursor: pointer;
        font: 700 13px/1 inherit; border: 1px solid var(--line);
        transition: background .15s ease, border-color .15s ease, filter .15s ease;
    }
    #wds-gate .wds-agree {
        flex: 2; border-color: transparent; color: #04101c;
        background: linear-gradient(90deg, #4a9eff, var(--wds-accent));
    }
    #wds-gate .wds-agree:hover { filter: brightness(1.12); }
    #wds-gate .wds-later { background: var(--bg-2); color: var(--ink-2); }
    #wds-gate .wds-later:hover { background: var(--bg-3); color: var(--ink); }

    @media (max-width: 460px) {
        #wds-panel { right: 8px; left: 8px; width: auto; }
        #wds-panel .wds-grid { grid-template-columns: 1fr; }
    }
    @media (prefers-reduced-motion: reduce) {
        #wds-fab, #wds-panel, #wds-gate, #wds-panel .wds-opt, #wds-panel .wds-chips,
        #wds-panel .wds-rule svg, #wds-panel .wds-links a, #wds-panel .wds-refresh svg { animation: none; transition: none; }
    }`;

    const store = {
        get target() {
            const saved = GM_getValue('target_currency', 'SAR');
            return TARGETS.some(t => t.code === saved) ? saved : 'SAR';
        },
        set target(code) { GM_setValue('target_currency', code); },
        get lang() {
            const saved = GM_getValue('lang', 'ar');
            return saved === 'en' ? 'en' : 'ar';
        },
        set lang(code) { GM_setValue('lang', code === 'en' ? 'en' : 'ar'); },
        get originalColor() { return !!GM_getValue('original_color', false); },
        set originalColor(value) { GM_setValue('original_color', !!value); },
        get debug() { return GM_getValue('debug', false); },
        set debug(value) { GM_setValue('debug', !!value); },
        get accepted() { return !!GM_getValue('terms_accepted', ''); },
        set accepted(value) { GM_setValue('terms_accepted', value ? 'ok' : ''); },
    };

    const tp = key => T[key][store.lang];
    const ts = key => T[key][other(store.lang)];

    let RATES = Object.assign({}, DEFAULT_RATES);
    let TARGET = TARGETS.find(t => t.code === store.target);
    let meta = { source: '—', at: 0 };

    const injected = new Set();
    let seen = new WeakMap();
    let started = false;
    let renderVersion = 0;
    let running = false;
    let chipsOpen = false;

    function log(...args) {
        if (store.debug) console.log('[WDSteam]', ...args);
    }

    function parseAmount(raw) {
        let s = String(raw).trim().replace(/[\s\u00A0\u202F']/g, '');
        const lastComma = s.lastIndexOf(',');
        const lastDot = s.lastIndexOf('.');
        let decimalSep = null;

        if (lastComma > -1 && lastDot > -1) {
            decimalSep = lastComma > lastDot ? ',' : '.';
        } else if (lastComma > -1) {
            decimalSep = (s.length - lastComma - 1) === 3 ? null : ',';
        } else if (lastDot > -1) {
            decimalSep = (s.length - lastDot - 1) === 3 ? null : '.';
        }

        if (decimalSep === ',') s = s.replace(/\./g, '').replace(',', '.');
        else if (decimalSep === '.') s = s.replace(/,/g, '');
        else s = s.replace(/[.,]/g, '');

        return parseFloat(s);
    }

    function convertPrice(amount, fromCode) {
        const usd = fromCode === 'USD' ? amount : amount / RATES[fromCode];
        const rate = RATES[TARGET.code];
        if (!isFinite(usd) || !isFinite(rate) || rate <= 0) return null;
        return usd * rate;
    }

    function fmt(value, decimals) {
        return value.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
    }

    function timeAgo(ts_) {
        const lang = store.lang;
        if (!ts_) return T.notYet[lang];
        const mins = Math.floor((Date.now() - ts_) / 60000);
        if (mins < 1) return T.justNow[lang];
        if (mins < 60) return AGO[lang].min(mins);
        const hours = Math.floor(mins / 60);
        if (hours < 24) return AGO[lang].hour(hours);
        return AGO[lang].day(Math.floor(hours / 24));
    }

    function gmGet(url) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 8000,
                onload: (r) => { try { resolve(JSON.parse(r.responseText)); } catch (e) { resolve(null); } },
                onerror: () => resolve(null),
                ontimeout: () => resolve(null),
            });
        });
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
        const data = await gmGet('https://open.er-api.com/v6/latest/USD');
        return (data && data.result === 'success' && data.rates) ? pick(data.rates) : null;
    }

    async function fetchFromExchangerateFun() {
        const data = await gmGet('https://api.exchangerate.fun/latest?base=USD');
        return (data && data.rates) ? pick(data.rates) : null;
    }

    async function fetchFromHexarate() {
        const results = await Promise.all(
            NEEDED.map(code => gmGet(`https://hexarate.paikama.co/api/rates/USD/${code}/latest`))
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
                log('rates from', name, rates);
                return { rates: Object.assign({}, DEFAULT_RATES, rates), source: name };
            }
            log(name, 'failed, trying the next source');
        }
        return null;
    }

    async function getRates(force) {
        const cached = GM_getValue('fx_rates', null);
        const lastUpdate = GM_getValue('last_update', 0);
        const stale = !cached || (Date.now() - lastUpdate >= ONE_DAY_MS);

        if (!force && !stale) {
            return {
                rates: Object.assign({}, DEFAULT_RATES, cached),
                source: GM_getValue('fx_source', '—'),
                at: lastUpdate,
            };
        }

        const fresh = await fetchLiveRates();
        if (fresh) {
            GM_setValue('fx_rates', fresh.rates);
            GM_setValue('fx_source', fresh.source);
            GM_setValue('last_update', Date.now());
            return { rates: fresh.rates, source: fresh.source, at: Date.now() };
        }

        return {
            rates: Object.assign({}, DEFAULT_RATES, cached || {}),
            source: cached ? GM_getValue('fx_source', '—') : null,
            at: lastUpdate,
        };
    }

    function collectRoots(root, acc) {
        acc.push(root);
        const all = root.querySelectorAll ? root.querySelectorAll('*') : [];
        for (const el of all) if (el.shadowRoot) collectRoots(el.shadowRoot, acc);
        return acc;
    }

    function collectTextNodes(root) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
        const nodes = [];
        let n;
        while ((n = walker.nextNode())) nodes.push(n);
        return nodes;
    }

    function buildBadge(value) {
        const span = document.createElement('span');
        span.className = 'wds-price';
        span.dataset.v = renderVersion;
        span.textContent = `${fmt(value, TARGET.decimals)} ${TARGET.code}`;
        return span;
    }

    function sweepStale(roots) {
        for (const root of roots) {
            if (!root.querySelectorAll) continue;
            root.querySelectorAll(`.wds-price:not([data-v="${renderVersion}"])`).forEach((el) => {
                injected.delete(el);
                el.remove();
            });
        }
    }

    function stripNeighbours(node) {
        let sib = node.nextSibling;
        while (sib && sib.nodeType === 1 && sib.classList && sib.classList.contains('wds-price')) {
            const next = sib.nextSibling;
            injected.delete(sib);
            sib.remove();
            sib = next;
        }

        const parent = node.parentElement;
        if (parent && parent.querySelectorAll) {
            parent.querySelectorAll(':scope > .wds-price').forEach((el) => {
                injected.delete(el);
                el.remove();
            });
        }
    }

    function isStruck(parent) {
        return !!(parent.closest && (
            parent.closest('.discount_original_price') ||
            parent.tagName === 'S' ||
            (parent.style && parent.style.textDecoration.includes('line-through'))
        ));
    }

    function convertNodes() {
        if (running || !started) return;
        running = true;

        try {
            const roots = collectRoots(document, []);
            sweepStale(roots);
            const stats = { roots: roots.length, scanned: 0, converted: 0, skipped: 0, unmatched: [] };

            for (const root of roots) {
                for (const node of collectTextNodes(root)) {
                    const parent = node.parentElement;
                    if (!parent || SKIP_TAGS.has(parent.tagName)) continue;
                    if (parent.closest && parent.closest('#wds-panel, #wds-fab, #wds-gate, .wds-price')) continue;

                    const text = node.textContent;
                    if (!MATCH_ORDER.some(c => c.tokens.some(t => text.includes(t)))) continue;
                    stats.scanned++;

                    const rec = seen.get(node);
                    const unchanged = rec &&
                        rec.version === renderVersion &&
                        rec.text === text &&
                        (!rec.span || rec.span.isConnected);

                    if (unchanged) { stats.skipped++; continue; }
                    if (rec && rec.span) { rec.span.remove(); injected.delete(rec.span); }

                    if (isStruck(parent)) {
                        seen.set(node, { text, span: null, version: renderVersion });
                        continue;
                    }

                    let span = null;

                    for (const currency of MATCH_ORDER) {
                        if (!currency.tokens.some(t => text.includes(t))) continue;

                        const match = text.match(currency.regex);
                        if (!match) continue;

                        const value = parseAmount(match[1] || match[2]);
                        if (!isFinite(value) || value <= 0) continue;

                        const converted = convertPrice(value, currency.code);
                        if (converted === null || !isFinite(converted)) continue;

                        stripNeighbours(node);
                        span = buildBadge(converted);
                        try { node.after(span); } catch (e) { parent.appendChild(span); }
                        injected.add(span);
                        stats.converted++;
                        break;
                    }

                    if (!span && stats.unmatched.length < 15) {
                        stats.unmatched.push(JSON.stringify(text.trim()).slice(0, 80));
                    }
                    seen.set(node, { text, span, version: renderVersion });
                }
            }

            if (store.debug) {
                console.log('[WDSteam]', stats);
                if (stats.unmatched.length) console.log('[WDSteam] not converted:', stats.unmatched);
            }
        } finally {
            running = false;
        }
    }

    function rerender() {
        for (const root of collectRoots(document, [])) {
            if (root.querySelectorAll) root.querySelectorAll('.wds-price').forEach(el => el.remove());
        }
        injected.clear();
        seen = new WeakMap();
        renderVersion++;
        convertNodes();
    }

    function brandHead(withControls) {
        return `
            <span class="wds-mark">${ICONS.logo}</span>
            <div class="wds-titles">
                <div class="wds-title">WDSteam<i>Fx</i></div>
                <div class="wds-ver">Steam Multi Currency &middot; v${VERSION}</div>
            </div>
            <div class="wds-seg" role="group">
                <button type="button" data-lang="ar" aria-pressed="${store.lang === 'ar'}">AR</button>
                <button type="button" data-lang="en" aria-pressed="${store.lang === 'en'}">EN</button>
            </div>
            ${withControls ? `
            <span class="wds-vsep"></span>
            <button class="wds-ico wds-minimize" type="button" title="${tp('minTitle')}">${ICONS.minus}</button>
            <button class="wds-ico wds-x" type="button" title="${tp('closeTitle')}">${ICONS.close}</button>` : ''}`;
    }

    function bindLangSwitch(root, onSwitch) {
        root.querySelectorAll('.wds-seg button').forEach((btn) => {
            btn.addEventListener('click', () => {
                if (btn.dataset.lang === store.lang) return;
                store.lang = btn.dataset.lang;
                onSwitch();
            });
        });
    }

    function buildGate(onAccept) {
        const gate = document.createElement('div');
        gate.id = 'wds-gate';
        gate.hidden = true;

        function paint() {
            const docs = DOCS[store.lang];
            gate.classList.toggle('wds-en', store.lang === 'en');
            gate.innerHTML = `
                <div class="wds-card">
                    <div class="wds-head">${brandHead(false)}</div>
                    <div class="wds-scroll">
                        ${Object.values(docs).map(d => `
                            <section>
                                <h5>${d.title}</h5>
                                <ul>${d.items.map(t => `<li>${t}</li>`).join('')}</ul>
                            </section>`).join('')}
                    </div>
                    <div class="wds-actions">
                        <button class="wds-agree" type="button">${tp('agree')}</button>
                        <button class="wds-later" type="button">${tp('later')}</button>
                    </div>
                </div>`;

            bindLangSwitch(gate, paint);
            gate.querySelector('.wds-agree').addEventListener('click', () => {
                store.accepted = true;
                gate.hidden = true;
                onAccept();
            });
            gate.querySelector('.wds-later').addEventListener('click', () => { gate.hidden = true; });
        }

        paint();
        document.body.appendChild(gate);
        gate.refresh = paint;
        return gate;
    }

    function buildUI(onLocked) {
        const style = document.createElement('style');
        style.textContent = CSS;
        document.head.appendChild(style);

        const fab = document.createElement('button');
        fab.id = 'wds-fab';
        fab.type = 'button';
        document.body.appendChild(fab);

        const panel = document.createElement('div');
        panel.id = 'wds-panel';
        panel.hidden = true;
        document.body.appendChild(panel);

        const api = { closeDoc() {}, docOpen: () => false, paintMeta() {} };

        function paintAccent() {
            document.documentElement.style.setProperty('--wds-accent', TARGET.accent);
            document.documentElement.style.setProperty('--wds-price', store.originalColor ? STEAM_GREEN : TARGET.accent);
        }

        function paintFab() {
            fab.innerHTML = `
                <span class="wds-disc">${FLAGS[TARGET.code]}</span>
                <span class="wds-code">${TARGET.code}</span>
                <span class="wds-chev">${ICONS.chevron}</span>`;
            fab.title = tp('fabTitle');
        }

        function paintPanel(openDoc) {
            panel.classList.toggle('wds-en', store.lang === 'en');
            panel.innerHTML = `
                <div class="wds-head">${brandHead(true)}</div>
                <div class="wds-body">
                    <div class="wds-legend">${ICONS.trend}<span>${tp('convertTo')}</span></div>
                    <div class="wds-grid" role="radiogroup"></div>
                    <button class="wds-rule" type="button" aria-expanded="${chipsOpen}">
                        <span><i></i>${tp('detects')}${ICONS.chevron}</span>
                    </button>
                    <div class="wds-chips"${chipsOpen ? '' : ' hidden'}>
                        ${SOURCES.map(s => `
                            <span class="wds-chip" style="--t:${s.tint}">
                                <em class="${s.sym.length > 1 ? 'wds-wide' : ''}">${s.sym}</em>
                                <u>
                                    <b>${s.code}</b>
                                    <i>${store.lang === 'en' ? s.labelEn : s.label}</i>
                                </u>
                            </span>`).join('')}
                    </div>
                    <div class="wds-meta wds-rates"></div>
                    <button class="wds-refresh" type="button">
                        ${ICONS.refresh}
                        <span><b>${tp('refresh')}</b></span>
                    </button>
                    <button class="wds-toggle" type="button" role="switch" aria-checked="${store.originalColor}">
                        <span class="wds-swatch">${ICONS.palette}</span>
                        <span class="wds-labels"><b>${tp('originalColor')}</b></span>
                        <span class="wds-toggle-track"><span class="wds-toggle-thumb"></span></span>
                    </button>
                </div>
                <div class="wds-doc" hidden>
                    <button class="wds-back" type="button">${ICONS.back}<span>${tp('back')}</span></button>
                    <h5 class="wds-doc-title"></h5>
                    <ul class="wds-doc-list"></ul>
                </div>
                <div class="wds-foot">
                    <div class="wds-foot-row">
                        <div class="wds-links">
                            ${SOCIAL.map(s => `<a href="${s.url}" target="_blank" rel="noopener noreferrer" title="${s.title}" style="--t:${s.tint}">${s.icon}</a>`).join('')}
                        </div>
                        <div class="wds-policy">
                            <button type="button" data-doc="terms">${tp('terms')}</button>
                            <span>&middot;</span>
                            <button type="button" data-doc="privacy">${tp('privacy')}</button>
                        </div>
                    </div>
                    <div class="wds-by"><b>WDOX</b> &copy; ${new Date().getFullYear()}</div>
                </div>`;

            const grid = panel.querySelector('.wds-grid');
            const rule = panel.querySelector('.wds-rule');
            const chips = panel.querySelector('.wds-chips');
            const ratesLine = panel.querySelector('.wds-rates');
            const refreshBtn = panel.querySelector('.wds-refresh');
            const refreshTitle = refreshBtn.querySelector('b');
            const toggle = panel.querySelector('.wds-toggle');
            const body = panel.querySelector('.wds-body');
            const doc = panel.querySelector('.wds-doc');
            const docTitle = panel.querySelector('.wds-doc-title');
            const docList = panel.querySelector('.wds-doc-list');
            let currentDoc = null;

            function paintMeta() {
                const src = meta.source || tp('fallback');
                ratesLine.innerHTML = `${tp('updated')}: <b>${timeAgo(meta.at)}</b> &mdash; ${tp('source')}:<span class="wds-dot"></span><b class="wds-ltr">${src}</b>`;
            }

            function selectTarget(code) {
                TARGET = TARGETS.find(t => t.code === code);
                store.target = code;
                paintFab();
                grid.querySelectorAll('.wds-opt').forEach((o) => {
                    o.setAttribute('aria-checked', String(o.dataset.code === code));
                });
                paintAccent();
                rerender();
            }

            TARGETS.forEach((t) => {
                const opt = document.createElement('button');
                opt.type = 'button';
                opt.className = 'wds-opt';
                opt.dataset.code = t.code;
                opt.style.setProperty('--c', t.accent);
                opt.setAttribute('role', 'radio');
                opt.setAttribute('aria-checked', String(t.code === TARGET.code));
                opt.innerHTML = `
                    <span class="wds-disc" style="--c:${t.accent}">${FLAGS[t.code]}</span>
                    <span class="wds-names">
                        <b>${store.lang === 'en' ? t.nameEn : t.name}</b>
                    </span>
                    <span class="wds-code">${t.code}</span>
                    <span class="wds-check">${ICONS.check}</span>`;
                opt.addEventListener('click', () => selectTarget(t.code));
                grid.appendChild(opt);
            });

            function showDoc(key) {
                const d = DOCS[store.lang][key];
                if (!d) return;
                currentDoc = key;
                docTitle.textContent = d.title;
                docList.innerHTML = d.items.map(t => `<li>${t}</li>`).join('');
                body.hidden = true;
                doc.hidden = false;
            }

            function closeDoc() {
                currentDoc = null;
                doc.hidden = true;
                body.hidden = false;
            }

            rule.addEventListener('click', () => {
                chipsOpen = !chipsOpen;
                rule.setAttribute('aria-expanded', String(chipsOpen));
                chips.hidden = !chipsOpen;
            });

            panel.querySelectorAll('.wds-policy button').forEach((btn) => {
                btn.addEventListener('click', () => showDoc(btn.dataset.doc));
            });
            panel.querySelector('.wds-back').addEventListener('click', closeDoc);
            panel.querySelector('.wds-x').addEventListener('click', () => {
                panel.hidden = true;
                panel.classList.remove('wds-min');
                closeDoc();
            });
            panel.querySelector('.wds-minimize').addEventListener('click', () => {
                panel.classList.toggle('wds-min');
            });

            bindLangSwitch(panel, () => {
                const wasOpen = !panel.hidden;
                const wasMin = panel.classList.contains('wds-min');
                paintPanel(currentDoc);
                panel.hidden = !wasOpen;
                panel.classList.toggle('wds-min', wasMin);
            });

            toggle.addEventListener('click', () => {
                store.originalColor = !store.originalColor;
                toggle.setAttribute('aria-checked', String(store.originalColor));
                paintAccent();
                rerender();
            });

            refreshBtn.addEventListener('click', async () => {
                refreshBtn.disabled = true;
                refreshTitle.textContent = tp('refreshing');

                const result = await getRates(true);
                RATES = result.rates;
                meta = { source: result.source, at: result.at || Date.now() };

                paintMeta();
                refreshBtn.disabled = false;
                refreshTitle.textContent = tp('refresh');
                rerender();
            });

            api.closeDoc = closeDoc;
            api.docOpen = () => !doc.hidden;
            api.paintMeta = paintMeta;

            paintMeta();
            if (openDoc) showDoc(openDoc);
        }

        paintFab();
        paintPanel(null);
        paintAccent();

        fab.addEventListener('click', () => {
            if (!store.accepted) { onLocked(); return; }
            panel.hidden = !panel.hidden;
            if (panel.hidden) { api.closeDoc(); panel.classList.remove('wds-min'); }
            else api.paintMeta();
        });

        document.addEventListener('click', (e) => {
            if (panel.hidden) return;
            const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
            if (path.includes(panel) || path.includes(fab)) return;
            if (panel.contains(e.target) || fab.contains(e.target)) return;
            panel.hidden = true;
            api.closeDoc();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;
            if (api.docOpen()) api.closeDoc(); else panel.hidden = true;
        });

        return { fab, panel };
    }

    function watchPage() {
        let pending = null;
        const schedule = () => {
            if (running || pending) return;
            pending = setTimeout(() => { pending = null; convertNodes(); }, 250);
        };

        new MutationObserver(schedule).observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
        });

        setInterval(schedule, 3000);
    }

    function start() {
        if (started) return;
        started = true;
        convertNodes();
        watchPage();
    }

    getRates(false).then((result) => {
        RATES = result.rates;
        meta = { source: result.source, at: result.at || 0 };

        let gate = null;
        const ui = buildUI(() => { if (gate) gate.hidden = false; });

        if (store.accepted) { start(); return; }

        gate = buildGate(() => {
            ui.panel.hidden = true;
            start();
        });
        gate.hidden = false;
    });

})();
