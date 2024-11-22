// ==UserScript==
// @name [SAP] Shikimori AnimePlay
// @namespace http://tampermonkey.net/
// @homepage https://github.com/xray108/Shikimori-AnimePlay
// @version 0.1.0
// @description Добавляет кнопку "Смотреть онлайн" на странице с аниме и при нажатии выводит видеоплеер kodik для просмотра прямо на Shikimori
// @author XRay108
// @icon https://www.google.com/s2/favicons?sz=64&domain=shikimori.one
// @match https://shikimori.one/animes/*
// @connect raw.githubusercontent.com
// @updateURL https://raw.githubusercontent.com/xray108/Shikimori-AnimePlay/main/js/sap_for_pc.js
// @downloadURL https://raw.githubusercontent.com/xray108/Shikimori-AnimePlay/main/js/sap_for_pc.js
// @grant none
// ==/UserScript==
(function() {
    'use strict';

    let currentPageTitle = document.title;
    let watchOnlineButtonAdded = false;
    let videoWindow = null;

    const targetSelector = '#animes_show > section > div > div.menu-slide-outer.x199 > div > div > div:nth-child(1) > div.b-db_entry > div.c-image > div.cc.block';

    function toggleVideoPlayer(button) {
        if (!videoWindow || videoWindow.closed) {
            openVideoWindow();
            button.textContent = '✖︎ Закрыть';
        } else {
            closeVideoWindow();
            button.textContent = '▶ Смотреть онлайн';
        }
    }

    function openVideoWindow() {
        const shikimoriID = getShikimoriID();
        if (shikimoriID) {
            const width = 960;
            const height = Math.round(width * 9 / 16);
            videoWindow = window.open('', currentPageTitle, `width=${width},height=${height}`);

            if (videoWindow) {
                const videoContent = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>${currentPageTitle}</title>
                        <style>
                            body {
                                margin: 0;
                                overflow: hidden;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                                background-color: #000;
                            }
                        </style>
                    </head>
                    <body>
                        <iframe
                            src="//kodik.cc/find-player?shikimoriID=${shikimoriID}"
                            width="100%"
                            height="100%"
                            frameborder="0"
                            allowfullscreen
                            allow="autoplay *; fullscreen *">
                        </iframe>
                    </body>
                    </html>
                `;

                videoWindow.document.open();
                videoWindow.document.write(videoContent);
                videoWindow.document.close();
            }
        }
    }

    function closeVideoWindow() {
        if (videoWindow && !videoWindow.closed) {
            videoWindow.close();
            videoWindow = null;
        }
    }

    function addWatchOnlineButton() {
        const targetElement = document.querySelector(targetSelector);
        if (targetElement && !watchOnlineButtonAdded) {
            const watchOnlineButton = document.createElement('button');
            watchOnlineButton.textContent = '▶ Смотреть онлайн';
            watchOnlineButton.classList.add('b-link_button');
            watchOnlineButton.style.cssText = `
                background-color: #ff4500;
                color: #ffffff;
                font-size: 16px;
                font-weight: bold;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s;
            `;

            watchOnlineButton.addEventListener('mouseenter', () => {
                watchOnlineButton.style.backgroundColor = '#ff6347';
            });
            watchOnlineButton.addEventListener('mouseleave', () => {
                watchOnlineButton.style.backgroundColor = '#ff4500';
            });

            watchOnlineButton.addEventListener('click', () => toggleVideoPlayer(watchOnlineButton));
            targetElement.parentNode.insertBefore(watchOnlineButton, targetElement.nextSibling);
            watchOnlineButtonAdded = true;
        }
    }

    function getShikimoriID() {
        const urlParts = window.location.pathname.split('/');
        const idPart = urlParts[urlParts.length - 1];
        return idPart ? idPart.split('-')[0] : null;
    }

    addWatchOnlineButton();

    const titleObserver = new MutationObserver(() => {
        if (document.title !== currentPageTitle) {
            currentPageTitle = document.title;
            if (videoWindow && !videoWindow.closed) {
                videoWindow.close();
            }
            watchOnlineButtonAdded = false;
            addWatchOnlineButton();
        }
    });
    titleObserver.observe(document.querySelector('title'), { subtree: true, characterData: true, childList: true });

})();
