// Content
const btnPassword = document.getElementById("generate-password");
const btnSearch = document.getElementById("btn-search");
const userInput = document.getElementById("user-input");
const searchInput  = document.getElementById("search")
const currentList = document.getElementById("list");
const emptyList  = document.getElementById("empty-list")

const specials = '!@#$%^&*_+-?';
const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';
const all = specials + lowercase + uppercase + numbers;

let pwdList = [];



/**
 * Display list when open the extension
 */
window.onload = () => {
    chrome.storage.sync.get("keys", ({ keys }) => {
        pwdList = keys;
        displayList(pwdList);
    });

}

btnPassword.addEventListener("click", async () => {
    const tab  = await  getCurrentTab();
    const password = (specials.picker(4) + lowercase.picker(4) + uppercase.picker(4) + all.picker(10)).shuffle();

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

btnSearch.addEventListener("click", async () => {
    const filteredList = filterPwdList();
    displayList(filteredList, true);
});


const getCurrentTab = async () => {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

const filterPwdList = async () => {
    return pwdList.filter(word => searchInput === word.url || searchInput === word.username || searchInput === word.title)
}

const displayList = (displayList, isFiltered= false) => {
    emptyList.innerHTML = ""
    currentList.innerHTML = ""

    if(displayList.length > 0) {
        let image;
        let kk = '';
        for(let i = 0; i < displayList.length; i++) {
            if(displayList[i].favIconUrl) {
                image = "<img src=" + displayList[i].favIconUrl + ">";
            } else {
                image = '<img src="">';
            }
            kk += "<tr> <td>" +
                image +
                '</td> <td> <p class="truncate">' +
                displayList[i].username +
                " </p></td> <td> " +
                displayList[i].password +
                "</td> </tr>"
        }

        currentList.innerHTML = "<thead>" +
            "   <tr>" +
            "       <th scope=\"col\">Site</th>" +
            "       <th scope=\"col\">Username</th>" +
            "       <th scope=\"col\">Password</th>" +
            "       <th scope=\"col\">Actions</th>" +
            "   </tr>" +
            " </thead>" +
            " <tbody>" +
                kk +
            "</tbody>";
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
