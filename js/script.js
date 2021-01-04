// * Constants
const userList = document.getElementById("user-list");
const submitBtn = document.getElementById("saveUser");

const detailCol1 = "col-7";
const detailCol2 = "col-5";

// * Variables
const inputList = [];
$("input").each((i, elem) => {
    if (elem.type != "submit") {
        inputList.push(elem);
    }
});


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

        this.icon = $(document.createElement("i"))
            .addClass("fas fa-angle-down");

        this.li = $(document.createElement("li"))
            .append(
                $(div).append(span, this.icon),
                this.addDetails());
    }

    addDetails() {
        let col1 = $(document.createElement("div"))
            .addClass(detailCol1)
            .append(`<p>ID: <span>${this.id}</span></p>`,
                `<p>E-post: <span>${this.email}</span></p>`,
                `<p>Telefon: <span>${this.phone}</span></p>`);

        let col2 = $(document.createElement("div"))
            .addClass(detailCol2)
            .append($(document.createElement("address"))
                .append(`<p>${this.adress}</p>`,
                    `<p>${this.zipcode} ${this.city}</p>`));

        let details = $(document.createElement("div"))
            .append(
                $(document.createElement("div"))
                .append(col1, col2)
                .addClass("row"))
            .addClass("user-details")
            .attr("id", this.id);

        return details;
    }

    attachToggle() {
        $(this.icon).click(() => {
            $(this.elementId).toggle(100);
            $(this.icon).toggleClass("fa-angle-down fa-angle-up");
        })
    }

    addToDOM(parent) {
        this.createElement();
        this.attachToggle();
        $(parent).append(this.li);
    }
}

// TODO: Byt ut static validate mot "live feedback"
function validateInput() {
    for (const input of inputList) {
        switch (input.id) {
            case "firstname":
            case "lastname":
            case "adress":
            case "city":
                break;
        }
    }
}

submitBtn.addEventListener("click", function (ev) {
    ev.preventDefault();

    // TODO: VALIDATE
    new User(...inputList.map((input) => input.value)).addToDOM(userList);
    inputList.forEach((el) => el.value = "");
});

$(document).ready(function () {
    let me = new User("Johannes", "Bergendahl", "a@a.com", "07634762334", "Hemvägen", "111", "Örebro");
    me.addToDOM(userList);

    console.log(me);
});