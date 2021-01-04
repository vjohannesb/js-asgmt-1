// * Constants
const userList = document.getElementById("user-list");
const submitBtn = document.getElementById("saveUser");
submitBtn.onsubmit = () => {
    preventDefault();
    console.log("hajhaj");
}

// * Variables
const inputList = [];
for (const elem of document.getElementsByTagName("input")) {
    inputList.push(elem);
}


// * Classes
class User {
    constructor(firstname, lastname, email, phone, adress, zipcode, city) {
        this.id = Date.now().toString();
        this.firstName = firstname;
        this.lastName = lastname;
        this.email = email;
        this.phone = phone;
        this.adress = adress;
        this.zipcode = zipcode;
        this.city = city;
    }

    get displayName() {
        return `${this.firstName} ${this.lastName}`;
    }

    get elementId() {
        return "#" + this.id;
    }

    createElement() {
        let div = $(document.createElement("div"))
            .addClass("d-flex justify-content-between align-items-center");

        let span = $(document.createElement("span"))
            .append($(document.createTextNode(this.displayName)));

        let icon = $(document.createElement("i"))
            .addClass("fas fa-angle-down");

        let details = createNewDetails(user);

        this.li = $(document.createElement("li"))
            .append($(div)
                .append(span)
                .append(icon))
            .append(details);

        return li;
    }

    attachToggle() {
        $(this.li).click(() => {
            $(elementId).toggle(100);
        })
    }

    addToDOM(parent) {
        parent.appendChild(this.li);
    }
}

submitBtn.addEventListener("click", function (ev) {
    ev.preventDefault();

    // TODO: VALIDATE
    let newUser = new User(
        inputList[0].value, inputList[1].value, inputList[2].value, inputList[3].value,
        inputList[4].value, inputList[5].value, inputList[6].value);
    console.log(newUser);

    createNewEntry(newUser);

    for (const input of inputList) {
        input.value = "";
    }

});

// * Functions
function createNewDetails(user) {
    let details = document.createElement("div");
    let subDiv = document.createElement("div");
    subDiv.classList.add("row");

    let column1 = document.createElement("div");
    column1.classList.add("col-6");

    column1.innerHTML =
        `<span class="fw-bold">Id: </span><span>${user.id}</span><br>\
        <span class="fw-bold">E-post: </span><span>${user.email}</span><br>\
        <span class="fw-bold">Telefon: </span><span>${user.phone}</span><br>`


    let column2 = document.createElement("div");
    column2.classList.add("col-6");

    column2.innerHTML = `${user.adress}<br>${user.zipcode} ${user.city}`


    let text = document.createTextNode("ID: X, Förnamn: Pepep, email: a@a.a");
    subDiv.appendChild(column1);
    subDiv.appendChild(column2);
    details.appendChild(subDiv);

    details.classList.add("user-details");
    details.id = user.id;

    return details;
}

function createNewEntry(user) {
    let li = document.createElement("li");
    let div = document.createElement("div");
    div.classList.add("d-flex", "justify-content-between", "align-items-center")

    let span = document.createElement("span");
    let text = document.createTextNode(`${user.firstName} ${user.lastName}`);
    span.appendChild(text);

    let icon = document.createElement("i");
    icon.classList.add("fas", "fa-angle-down");

    let details = createNewDetails(user);

    li.appendChild(div);
    div.appendChild(span);
    div.appendChild(icon);
    li.appendChild(details);

    userList.appendChild(li);

    $(li).click(() => {
        $(`#${user.id}`).toggle(100);
    });

    return li;
}

$(document).ready(function () {
    let me = new User("Johannes", "Bergendahl", "a@a.com", "07634762334", "Hemvägen", "111", "Örebro");
    let li = createNewEntry(me);



    console.log(me);

});