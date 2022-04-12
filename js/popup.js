"use strict";

/**
 * @author Julien Da Corte
 */

const btnPassword = document.getElementById('generate-password');
const btnExport = document.getElementById('export');
const userInput = document.getElementById('user-input');
const searchInput  = document.getElementById('search');
const currentList = document.getElementById('list');
const emptyList  = document.getElementById('empty-list');
const notification = document.getElementById('alert');
const fileSelector = document.getElementById('import');

const delayInMilliseconds = 2000; // 2 seconds
let pwdList = [];

const TypesEnum = Object.freeze({
    specials: '!@#$%^&*_+-?',
    lowercase:'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    all: ('!@#$%^&*_+-?abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
});

class User {
    constructor(title, url, favIconUrl, username, password) {
        this.title = title;
        this.url = url;
        this.favIconUrl = favIconUrl;
        this.username = username;
        this.password = password;
    }
}

/**
 * Display list when open the extension
 */
window.onload = () => {
    chrome.storage.sync.get("keys", ({ keys }) => {
        pwdList = keys;
        displayList(pwdList);
    });
}

/**
 * Event listener on password button
 */
btnPassword.addEventListener('click', async () => {
    const tab  = await getCurrentTab();
    const password = (TypesEnum.specials.picker(4) + TypesEnum.lowercase.picker(4) +
        TypesEnum.uppercase.picker(4) + TypesEnum.all.picker(10)).shuffle();

    const user = new User(tab.title, tab.url, tab.favIconUrl, userInput.value, password);

    pwdList.push(user);
    displayList(pwdList);
    chrome.storage.sync.set({
        keys: pwdList
    });
    displayNotification('Enregistré !', 'success')
});

/**
 * Event listener allows uploading data.json
 */
fileSelector.addEventListener('change', async () => {
    if(fileSelector.files[0]) {
        const result = await readFile(fileSelector.files[0]);
        pwdList = JSON.parse(result.toString());

        displayList(pwdList);
        chrome.storage.sync.set({
            keys: pwdList
        });
        displayNotification('Fichier importé !', 'primary')
    } else {
        displayNotification('Aucun fichier selectionné !', 'danger')
    }
});

searchInput.addEventListener('change', () => {
    if(searchInput.value.length === 0) {
        displayList(pwdList);
    } else {
        const filteredList = filterPwdList();
        displayList(filteredList, true);
    }
});

btnExport.addEventListener('click', () => {
    const userData = JSON.stringify(pwdList);
    const blob = new Blob([userData], {type: 'application/json'});
    let anchor = document.createElement('a');
    anchor.download = 'keypwd-saved-data.json';
    anchor.href = window.URL.createObjectURL(blob);
    anchor.innerHTML = 'download'
    anchor.click();
    displayNotification('Document exporter !', 'primary')
});


const readFile = async (inputFile) => {
    return new Promise((resolve, reject) => {
        const temporaryFileReader = new FileReader();

        temporaryFileReader.onerror = () => {
            temporaryFileReader.abort();
            reject(new DOMException("Problem parsing input file."));
        };

        temporaryFileReader.onload = () => {
            resolve(temporaryFileReader.result);
        };
        temporaryFileReader.readAsText(inputFile);
    });
}
/**
 * Return the user current tab in a Promise
 * @returns {Promise<*>}
 */
const getCurrentTab = async () => {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

/**
 * Return the pwdList filtered by user choice
 */
const filterPwdList = () => {
    return pwdList.filter(word => searchInput.value === word.url || searchInput.value === word.username || searchInput.value === word.title);
}

/**
 * Generate notification that will be displayed during N seconds
 * @param message
 * @param type
 */
const displayNotification = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = `
        <div class="alert alert-${type}" role="alert" style="padding: 5px !important;">
            ${message}
        </div>
    `;
    notification.append(wrapper);
    setTimeout(() => {
        notification.style.display = 'none';
    }, delayInMilliseconds);
}

/**
 * Display a table of list
 * @param displayList
 * @param isFiltered
 */
const displayList = (displayList, isFiltered= false) => {
    emptyList.innerHTML = '';
    currentList.innerHTML = '';

    if(displayList.length > 0) {
        let image;
        let tableBody = '';

        for(let i = 0; i < displayList.length; i++) {
            if(displayList[i].favIconUrl) {
                image = `<img src="${displayList[i].favIconUrl}" alt="icon of the site">`;
            } else {
                image = '<img src="" alt="">';
            }

            tableBody += `
            <tr>
                <td class="col-1"><a href="${displayList[i].url}" target="_blank">${image}</a></td>
                <td class="col-3"><span class="truncate">${displayList[i].username}</span></td>
                <td class="col-7"><span>${displayList[i].password}</span></td>
            </tr>`;
        }
        currentList.innerHTML = tableBody;
    } else {
        emptyList.innerHTML = (isFiltered) ? `Aucun filtre trouver pour "${searchInput.value}"`: 'Vous n\'avez aucun mot de passe';
    }
}

/**
 * Private function to pick random chars in list
 * @param n
 * @returns {string}
 */
String.prototype.picker = function(n) {
    let chars = '';

    for (let i = 0; i < n; i++) {
        chars += this.charAt(Math.floor(Math.random() * this.length));
    }
    return chars;
};

/**
 * Private function to shuffle the password
 * @returns {string}
 */
String.prototype.shuffle = function() {
    let array = this.split('');
    let tmp, current, top = array.length;

    if (top) {
        while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }
    }
    return array.join('');
};
