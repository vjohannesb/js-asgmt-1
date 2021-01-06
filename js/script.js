// * Constants
const userDOMList = document.getElementById("user-list");
const submitBtn = document.getElementById("saveUser");
const saveEditBtn = document.getElementById("saveEdit");
const resetEditBtn = document.getElementById("resetEdit");

const detailCol1 = "col-7 col-md-12 col-lg-7";
const detailCol2 = "col-5 col-md-12 col-lg-5";

const inputList = Array.from($("input").not(submitBtn).not(saveEditBtn).not(resetEditBtn))

// * Variables
var userObjList = [];

// ! User-class
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
        this.editing = false;
    }

    get displayName() {
        return `${this.firstName} ${this.lastName}`;
    }

    get elementId() {
        return "#" + this.id;
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

        this.attachToggle();
        return this.li;
    }

    addDetails() {
        let col1 = $(document.createElement("div"))
            .addClass(detailCol1)
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
            .addClass(detailCol2)
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

    attachToggle() {
        $(this.div).click(() => {
            $(this.elementId).toggle(100);
            $(this.icon).toggleClass("fa-angle-down fa-angle-up");

        });
        // Tillgänglighet, simulera klick på enter (32) & space (13)
        $(this.div).keydown((event) => {
            if (event.which === 13 || event.which === 32)
                $(this.div).click();
        });
    }

    addToDOM(parent) {
        if (!parent) console.error(`No parent selected.`)
        else $(parent).append(this.li);
    }

    createElementAndAddToDOM(parent) {
        this.createElement();
        this.addToDOM(parent);
    }

    editUser() {
        showEditElems();

        $("#id-nr").text(this.id);
        $("#firstname").val(this.firstName);
        $("#lastname").val(this.lastName);
        $("#email").val(this.email);
        $("#phone").val(this.phone);
        $("#address").val(this.address);
        $("#zipcode").val(this.zipcode);
        $("#city").val(this.city);
    }

    deleteUser() {
        console.log("before: ", userObjList);
        $("#li-" + this.id).remove();
        userObjList = userObjList.filter((e) => e.id !== this.id);
        console.log("after :", userObjList);

    }
}

// ! Buttons
submitBtn.addEventListener("click", function (ev) {
    ev.preventDefault();

    // TODO: VALIDATE
    let user = new User(...inputList.map((input) => input.value));
    userObjList.push(user);
    user.createElementAndAddToDOM(userDOMList)

    console.log(userObjList);
});

saveEditBtn.addEventListener("click", function (ev) {
    ev.preventDefault();

    let user = new User(...inputList.map((input) => input.value));
    user.id = $("#id-nr").text();
    $("#li-" + user.id).replaceWith(user.createElement());

    resetInputs();
    hideEditElems();
})

resetEditBtn.addEventListener("click", () => hideEditElems());

// ! Utilities
function validateInput() {
    // TODO: Byt ut static validate mot "live feedback"
    for (const input of inputList) {
        switch (input.id) {
            case "firstname":
            case "lastname":
            case "address":
            case "city":
                break;
        }
    }
}

function hideEditElems() {
    $("#editBtns").hide();
    $("#edit-id-display").hide();
    $("#reg-title").text("Registrera användare")
    $("#submitBtn").show();
    $("#id-nr").text("");
}

function showEditElems() {
    $("#editBtns").show();
    $("#edit-id-display").show();
    $("#reg-title").text("Redigera användare")
    $("#submitBtn").hide();
}

function resetInputs() {
    inputList.forEach((el) => el.value = "");
}

// ! (jQuery) DOM ready
$(document).ready(function () {
    let me = new User("Johannes", "Bergendahl", "a@a.com", "07634762334", "Hemvägen", "111", "Örebro");
    me.createElementAndAddToDOM(userDOMList);
    userObjList.push(me);

});