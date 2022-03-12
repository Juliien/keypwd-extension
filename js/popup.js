"use strict";

/**
 * @author Julien Da Corte
 */

const btnPassword = document.getElementById("generate-password");
const userInput = document.getElementById("user-input");
const searchInput  = document.getElementById("search")
const currentList = document.getElementById("list");
const emptyList  = document.getElementById("empty-list")

let pwdList = [];
let deleteItem;

const TypesEnum = Object.freeze({
    specials: '!@#$%^&*_+-?',
    lowercase:'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    all: ('!@#$%^&*_+-?abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
});

/**
 * Display list when open the extension
 */
window.onload = () => {
    chrome.storage.sync.get("keys", ({ keys }) => {
        pwdList = keys;
        displayList(pwdList);
        deleteItem = document.getElementById("delete")
    });
}

btnPassword.addEventListener('click', async () => {
    const tab  = await getCurrentTab();
    const password = (TypesEnum.specials.picker(4) + TypesEnum.lowercase.picker(4) +
        TypesEnum.uppercase.picker(4) + TypesEnum.all.picker(10)).shuffle();

    const key = {
        title: tab.title,
        url: tab.url,
        favIconUrl: tab.favIconUrl,
        username: userInput.value,
        password: password
    }
    pwdList.push(key);
    displayList(pwdList);
    chrome.storage.sync.set({
        keys: pwdList
    });
});

searchInput.addEventListener('change', () => {
    if(searchInput.value.length === 0) {
        displayList(pwdList);
    } else {
        const filteredList = filterPwdList();
        displayList(filteredList, true);
    }
});

if (deleteItem) {
    deleteItem.addEventListener('click', () => {
        console.log(e);
    //     const index = pwdList.indexOf(pwd);
    //     console.log(pwd, index)
    //     if (index > -1) {
    //         pwdList.splice(index, 1);
    //     }
    //     displayList(pwdList);
    //     deletePassword(pwd)
    //     displayList(pwdList);
    //     chrome.storage.sync.set({
    //         keys: pwdList
    //     });
    });
}


/**
 * Return the user current tab
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

// const copyPassword = (pwd) => {
//     return navigator.clipboard.writeText(pwd);
// }


const displayList = (displayList, isFiltered= false) => {
    emptyList.innerHTML = ""
    currentList.innerHTML = ""

    if(displayList.length > 0) {
        let image;
        let tableBody = '';
        for(let i = 0; i < displayList.length; i++) {
            if(displayList[i].favIconUrl) {
                image = `<img src="${displayList[i].favIconUrl}" alt="site icon">`;
            } else {
                image = '<img src="" alt="">';
            }

            tableBody += `
            <tr>
                <td class="col-1"><a href="${displayList[i].url}" target="_blank">${image}</a></td>
                <td class="col-4"><span class="truncate">${displayList[i].username}</span></td>
                <td class="col-7"><span>${displayList[i].password}</span>
<!--                    <div class="d-flex justify-content-start">-->
<!--                        <button class="btn btn-sm btn-icon" data-bs-toggle="modal" data-bs-target="#exampleModal">-->
<!--                            <span class="material-icons">visibility</span>-->
<!--                        </button>-->
<!--                        <button class="btn btn-sm btn-icon">-->
<!--                            <span class="material-icons">content_copy</span>-->
<!--                        </button>-->
<!--                        <button class="btn btn-sm btn-icon" id="delete">-->
<!--                            <span class="material-icons" style="color:red">delete</span>-->
<!--                        </button>-->
<!--                    </div>-->
                </td>
            </tr>`;
        }

        currentList.innerHTML = `
        <thead>
            <tr>
                <th scope="col">Site</th>
                <th scope="col">Identifiant</th>
                <th scope="col">Mot de passe</th>
            </tr>
        </thead>
        <tbody>
            ${tableBody}
        </tbody>`;
    } else {
        emptyList.innerHTML = (isFiltered) ? `Aucun filtre trouver pour "${searchInput.value}"`: 'Vous n\'avez aucun mot de passe';
    }
}

String.prototype.picker = function(n) {
    let chars = '';

    for (let i = 0; i < n; i++) {
        chars += this.charAt(Math.floor(Math.random() * this.length));
    }
    return chars;
};

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
