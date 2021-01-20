// ! Constants
const userDOMList = $("#user-list");
const emailWarning = $("#email-warning");
const phoneWarning = $("#phone-warning");

const submitBtn = document.getElementById("saveUser");
const saveEditBtn = document.getElementById("saveEdit");
const resetEditBtn = document.getElementById("resetEdit");

const inputList = Array.from($("input[type=text], input[type=email], input[type=tel]"));

const validInputs = {
    firstname: false,
    lastname: false,
    email: false,
    phone: false,
    address: false,
    zipcode: false,
    city: false
}

//#region Regex
// a-z0-9._- i början -> "@" -> a-z0-9_- -> "." -> två eller mer bokstäver i slutet (tld)
// [stödjer ej ickelatinska tecken]
const emailRegex = /^[a-z0-9._-]+@[a-z0-9_-]+\.\w{2,}$/i;
// Matchar allt utom a-z, specialkaraktärer (ex å, é), " " och "-"
const nameRegex = /[^a-z\u00C0-\u00ff -]/i;
// Samma som nameRegex + siffror + kommatecken
const addressRegex = /[^a-z0-9\u00C0-\u00ff, -]/i;
// Börjar på "0" eller "+" och följs av 7-20 siffror
const phoneRegex = /(^0|^\+)\d{7,20}$/;
// Fem siffor i rad och inget annat före eller efter
const zipRegex = /^\d{5}$/
//#endregion


// ! Variables
var userObjList = [];
var editingId = "";

// ! User class
class User {
    constructor(firstname, lastname, email, phone, address, zipcode, city) {
        this.id = Date.now().toString();
        this.firstName = firstname;
        this.lastName = lastname;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.zipcode = zipcode;
        this.city = city;
    }

    get displayName() {
        return `${this.firstName} ${this.lastName}`;
    }

    createElement() {
        this.div = $(document.createElement("div"))
            .addClass("d-flex justify-content-between align-items-center user-item")
            .attr("tabindex", 0)
            .attr("role", "button")
            .attr("name", "expand-user");

        let span = $(document.createElement("span"))
            .append($(document.createTextNode(this.displayName)));

        this.icon = $(document.createElement("i"))
            .addClass("toggle-details fas fa-angle-down");

        this.li = $(document.createElement("li"))
            .attr("id", "li-" + this.id)
            .append(
                $(this.div).append(span, this.icon),
                this.addDetails());

        this.attachToggles();
        return this.li;
    }

    addDetails() {
        let col1 = $(document.createElement("div"))
            .addClass("col-12 col-sm-7 col-lg-7")
            .append(`<p>ID: <span class="uid">${this.id}</span></p>`,
                `<p>E-post: <span>${this.email}</span></p>`,
                `<p>Telefon: <span>${this.phone}</span></p>`);

        let editUserBtn = $(document.createElement("i"))
            .addClass("edit-user fas fa-edit mx-1")
            .attr("tabindex", 0)
            .attr("role", "button")
            .attr("name", "edit-user")
            .click(() => this.editUser());

        let delUserBtn = $(document.createElement("i"))
            .addClass("del-user fas fa-trash-alt mx-1")
            .attr("tabindex", 0)
            .attr("role", "button")
            .attr("name", "delete-user")
            .click(() => this.deleteUser());

        let col2 = $(document.createElement("div"))
            .addClass("col-12 col-sm-5 col-lg-5 mt-3")
            .append($(document.createElement("div"))
                .append($(document.createElement("address"))
                    .append(`<p><span>${this.address}</span></p>`,
                        `<p><span>${this.zipcode}</span> <span>${this.city}</span></p>`)))
            .append($(document.createElement("div"))
                .addClass("d-flex justify-content-end")
                .append(editUserBtn, delUserBtn));

        let details = $(document.createElement("div"))
            .append(
                $(document.createElement("div"))
                .append(col1, col2)
                .addClass("row"))
            .addClass("user-details")
            .attr("id", this.id);

        return details;
    }

    attachToggles() {
        $(this.div).click(() => {
            $(`#${this.id}`).toggle(100);
            $(`#li-${this.id} .toggle-details`).toggleClass("fa-angle-down fa-angle-up");
        });
    }

    addToDOM() {
        userDOMList.append(this.li);
        delete this.li;
        delete this.div;
        delete this.icon;
    }

    editUser() {
        showEditElems();
        editingId = this.id;

        $("#id-nr").text(this.id);
        for (let property in this)
            $(`#${property.toLowerCase()}`).val(this[property]);

        inputList.forEach(input => validateInput({
            currentTarget: input
        }));
        toggleSubmits();
    }

    deleteUser() {
        $("#li-" + this.id).remove();
        userObjList = userObjList.filter((u) => u.id !== this.id);
    }
}

// ! Buttons
submitBtn.addEventListener("click", function (ev) {
    ev.preventDefault();

    let newUser = new User(...inputList.map((input) => input.value.trim()));

    if (!checkDuplicate(newUser)) {
        userObjList.push(newUser);
        newUser.createElement();
        newUser.addToDOM();
        editingId = "";
        resetInputs();
    }
});

saveEditBtn.addEventListener("click", function (ev) {
    ev.preventDefault();

    let newUser = new User(...inputList.map((input) => input.value.trim()));
    newUser.id = editingId;

    if (!checkDuplicate(newUser)) {
        if ($("#li-" + newUser.id).length > 0) {
            $("#li-" + newUser.id).replaceWith(newUser.createElement());
            userObjList = userObjList.map(user => user.id == newUser.id ? newUser : user);
        } else {
            userObjList.push(newUser);
            newUser.createElement();
            newUser.addToDOM();
        }

        hideEditElems();
        resetInputs();
        editingId = "";
    }
})

resetEditBtn.addEventListener("click", () => hideEditElems());

// ! Utilities
function checkDuplicate(newUser) {
    let duplicate = false;
    if (userObjList.find(user => user.email == newUser.email && user.id != newUser.id)) {
        emailWarning.show();
        duplicate = true;
    }
    if (userObjList.find(user => user.phone == newUser.phone && user.id != newUser.id)) {
        phoneWarning.show();
        duplicate = true;
    }
    return duplicate;
}

function validateInput(e) {
    let target = e.currentTarget;

    switch (target.id) {
        case "firstname":
        case "lastname":
        case "city":
            validInputs[target.id] = (target.value.trim().length > 0 && !nameRegex.test(target.value));
            break;
        case "address":
            validInputs[target.id] = (target.value.trim().length > 0 && !addressRegex.test(target.value));
            break;
        case "email":
            validInputs[target.id] = emailRegex.test(target.value);
            break;
        case "phone":
            validInputs[target.id] = phoneRegex.test(target.value);
            break;
        case "zipcode":
            validInputs[target.id] = zipRegex.test(target.value);
            break;
        default:
            break;
    }

    if (!validInputs[target.id])
        target.classList.add("invalid-input");
    else
        target.classList.remove("invalid-input");
}

function toggleSubmits() {
    let allValid = Object.values(validInputs).some((val) => val == false);
    submitBtn.disabled = allValid;
    saveEditBtn.disabled = allValid;
}

function showEditElems() {
    $("#reg-title").text("Redigera användare")
    $("#editBtns, #edit-id-display").show();
    $("#submitBtn").hide();
}

function hideEditElems() {
    $("#reg-title").text("Registrera användare")
    $("#editBtns, #edit-id-display").hide();
    $("#submitBtn").show();
    $("#id-nr").text("");
}

function resetInputs() {
    inputList.forEach((el) => el.value = "");
    submitBtn.disabled = true;
    saveEditBtn.disabled = true;
    emailWarning.hide();
    phoneWarning.hide();

    for (let key in validInputs)
        validInputs[key] = false;
}


// ! (jQuery) DOM ready
$(document).ready(function () {
    let me = new User("Johannes", "Bergendahl", "johannes@gmail.com", "0701234567", "Hemvägen", "11111", "Örebro");
    me.createElement();
    me.addToDOM();
    userObjList.push(me);

    // Reset vid init/reload
    resetInputs();
    hideEditElems();

    $("input[type=text], input[type=email], input[type=tel]").on("input", function (e) {
        validateInput(e);
        toggleSubmits();
    });

    $("#email").on("focus", () => emailWarning.hide());
    $("#phone").on("focus", () => phoneWarning.hide());
});