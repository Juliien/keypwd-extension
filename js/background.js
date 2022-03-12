"use strict";

/**
 * @author Julien Da Corte
 */

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        keys: []
    });
});
