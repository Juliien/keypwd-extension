// Content
const btnPassword = document.getElementById("generate-password");
const btnShow = document.getElementById("show-password");
const userInput = document.getElementById("user-input");
const currentList = document.getElementById("list");
const emptyList  = document.getElementById("empty-list")

const specials = '!@#$%^&*_+-?';
const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';
const all = specials + lowercase + uppercase + numbers;

let pwdList = [];


chrome.storage.sync.get("keys", ({ keys }) => {
    pwdList = keys;
});

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

    displayList();

    chrome.storage.sync.set({
        keys: pwdList
    });
});


btnShow.addEventListener("click", async () => {
    displayList();
});

const displayList = () => {
    if(pwdList.length > 0) {
        emptyList.innerHTML = ""

        let kk = '';

        for(let i = 0; i < pwdList.length; i++){
            kk += "<li>"+
                pwdList[i].title
                + " - " +
                pwdList[i].username
                + " - " +
                pwdList[i].password
                +"</li>"
        }
        currentList.innerHTML = kk;

        // if(pwdList[i].favIconUrl) {
        //     document.getElementById("faveIcon").innerHTML = "<img src=" + pwdList[0].favIconUrl + ">";
        // }
    } else {
        emptyList.innerHTML = "Vous n'avez aucun mot de passe"
    }
}

const getCurrentTab = async () => {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
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
