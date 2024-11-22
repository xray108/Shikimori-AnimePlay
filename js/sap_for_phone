// ==UserScript==
// @name [SAP] Shikimori AnimePlay
// @namespace http://tampermonkey.net/
// @homepage https://github.com/xray108/Shikimori-AnimePlay
// @version 0.1.0
// @description Добавляет кнопку "Смотреть онлайн" на странице с аниме и при нажатии выводит видеоплеер kodik для просмотра прямо на Shikimori
// @author XRay108
// @icon https://www.google.com/s2/favicons?sz=64&domain=shikimori.one
// @match https://shikimori.one/animes/*
// @updateURL https://raw.githubusercontent.com/xray108/Shikimori-AnimePlay/refs/heads/main/js/sap_for_phone.js
// @downloadURL https://raw.githubusercontent.com/xray108/Shikimori-AnimePlay/refs/heads/main/js/sap_for_phone.js
// @grant none
// ==/UserScript==
(function() {
    'use strict';

    let currentPageTitle = document.title;
    let watchOnlineButtonAdded = false;
    let videoModal = null;

    const targetSelector = '#animes_show > section > div > div.menu-slide-outer.x199 > div > div > div:nth-child(1) > div.b-db_entry > div.c-image > div.cc.block';

    function openVideoModal() {
        const shikimoriID = getShikimoriID();
        if (shikimoriID) {
            videoModal = document.createElement('div');
            videoModal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                z-index: 1000;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            `;

            const videoIframe = document.createElement('iframe');
            videoIframe.src = `//kodik.cc/find-player?shikimoriID=${shikimoriID}`;
            videoIframe.style.cssText = `
                width: 100vw;
                height: 56.25vw;
                border: none;
            `;
            videoIframe.allowFullscreen = true;
            videoIframe.setAttribute('allow', 'autoplay *; fullscreen *');
            videoModal.appendChild(videoIframe);

            const closeButton = document.createElement('button');
            closeButton.textContent = '✖';
            closeButton.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background-color: #ff4500;
                color: #ffffff;
                border: none;
                border-radius: 5px;
                padding: 10px;
                cursor: pointer;
                z-index: 1001;
            `;
            closeButton.addEventListener('click', closeVideoModal);
            videoModal.appendChild(closeButton);

            document.body.appendChild(videoModal);

            if (window.screen.orientation && window.screen.orientation.lock) {
                window.screen.orientation.lock('landscape').catch(error => {
                    console.error('Ошибка при переключении в горизонтальное положение:', error);
                });
            }
        }
    }

    function closeVideoModal() {
        if (videoModal) {
            document.body.removeChild(videoModal);
            videoModal = null;

            if (window.screen.orientation && window.screen.orientation.unlock) {
                window.screen.orientation.unlock();
            }
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

            watchOnlineButton.addEventListener('click', openVideoModal);
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
            if (videoModal) {
                closeVideoModal();
            }
            watchOnlineButtonAdded = false;
            addWatchOnlineButton();
        }
    });
    titleObserver.observe(document.querySelector('title'), { subtree: true, characterData: true, childList: true });

})();
