// Content
const btnPassword = document.getElementById("generate-password");
const userInput = document.getElementById("user-input");
const currentList = document.getElementById("list");
const emptyList  = document.getElementById("empty-list")

const specials = '!@#$%^&*_+-?';
const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';
const all = specials + lowercase + uppercase + numbers;

let pwdList = [];


// on windows load
window.onload = () => {
    chrome.storage.sync.get("keys", ({ keys }) => {
        pwdList = keys;
        displayList();
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

    displayList();

    chrome.storage.sync.set({
        keys: pwdList
    });
});

const displayList = () => {
    if(pwdList.length > 0) {
        emptyList.innerHTML = ""
        let image;
        let kk = '';
        for(let i = 0; i < pwdList.length; i++) {
            if(pwdList[i].favIconUrl) {
                image = "<img src=" + pwdList[i].favIconUrl + ">";
            } else {
                image = '<img src="">';
            }
            kk += "<tr> <td>" +
                    image +
                '</td> <td> <p class="truncate">' +
                    pwdList[i].username +
                " </p></td> <td> " +
                    pwdList[i].password +
                "</td> </tr>"
        }

        currentList.innerHTML = "<thead>\n" +
            "              <tr>\n" +
            "                  <th scope=\"col\">Site</th>\n" +
            "                  <th scope=\"col\">Username</th>\n" +
            "                  <th scope=\"col\">Password</th>\n" +
            "              </tr>\n" +
            "          </thead>\n" +
            "          <tbody>\n" +
                        kk +
            "          </tbody>";

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
