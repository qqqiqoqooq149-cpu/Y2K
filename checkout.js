/* =========================================================
   VYRA — CHECKOUT
========================================================= */

const STORAGE_KEY = "vyraBag";


/* =========================
   BAG
========================= */

function getBag() {

    try {

        const bag =
            JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            );

        return Array.isArray(bag) ? bag : [];

    } catch {

        return [];

    }
}


/* =========================
   PRICE
========================= */

function priceNumber(value) {

    const match =
        String(value)
            .replace(/,/g, "")
            .match(/[\d.]+/);

    return match ? Number(match[0]) : 0;
}


function money(value) {

    return `${Number(value).toLocaleString("en-US")} EGP`;

}


/* =========================
   RENDER
========================= */

function renderCheckout() {

    const itemsContainer =
        document.getElementById("checkoutItems");

    const empty =
        document.getElementById("checkoutEmpty");

    const subtotalElement =
        document.getElementById("checkoutSubtotal");

    const totalElement =
        document.getElementById("checkoutTotal");


    const bag = getBag();


    if (!bag.length) {

        itemsContainer.innerHTML = "";

        empty.style.display = "block";

        subtotalElement.textContent = "0 EGP";
        totalElement.textContent = "0 EGP";

        return;

    }


    empty.style.display = "none";


    let subtotal = 0;


    itemsContainer.innerHTML =
        bag.map(item => {

            const quantity =
                Number(item.quantity) || 1;

            const price =
                priceNumber(item.price);

            const itemTotal =
                price * quantity;

            subtotal += itemTotal;


            return `

                <div class="checkout-item">

                    <img
                        class="checkout-item-image"
                        src="${item.image}"
                        alt="${item.name}"
                    >

                    <div class="checkout-item-info">

                        <strong class="checkout-item-name">
                            ${item.name}
                        </strong>

                        <span class="checkout-item-meta">
                            SIZE: ${item.size || "ONE SIZE"}
                        </span>

                        <span class="checkout-item-meta">
                            QTY: ${quantity}
                        </span>

                        <span class="checkout-item-price">
                            ${money(itemTotal)}
                        </span>

                    </div>

                </div>

            `;

        }).join("");


    subtotalElement.textContent =
        money(subtotal);

    totalElement.textContent =
        money(subtotal);

}


/* =========================
   ALERT
========================= */

function showCheckoutAlert(title, text) {

    const alert =
        document.getElementById("checkoutAlert");

    document.getElementById(
        "checkoutAlertTitle"
    ).textContent = title;

    document.getElementById(
        "checkoutAlertText"
    ).textContent = text;


    alert.classList.add("show");


    clearTimeout(
        window.checkoutAlertTimer
    );


    window.checkoutAlertTimer =
        setTimeout(() => {

            alert.classList.remove("show");

        }, 3500);

}


/* =========================
   VALIDATION
========================= */

function validateForm() {

    const fields = [

        document.getElementById("fullName"),

        document.getElementById("phone"),

        document.getElementById("email"),

        document.getElementById("address"),

        document.getElementById("city"),

        document.getElementById("governorate")

    ];


    for (const field of fields) {

        if (!field.value.trim()) {

            field.focus();

            showCheckoutAlert(
                "MISSING INFORMATION",
                "Please complete all required fields."
            );

            return false;

        }

    }


    return true;

}


/* =========================
   PLACE ORDER
========================= */

document
    .getElementById("placeOrder")
    .addEventListener("click", () => {

        const bag = getBag();


        if (!bag.length) {

            showCheckoutAlert(
                "YOUR BAG IS EMPTY",
                "Add a product before checkout."
            );

            return;

        }


        if (!validateForm()) {

            return;

        }


        const orderNumber =
            "VYRA-" +
            Date.now()
                .toString()
                .slice(-6);


        localStorage.removeItem(STORAGE_KEY);


        document.getElementById(
            "placeOrder"
        ).disabled = true;


        document.getElementById(
            "placeOrder"
        ).innerHTML = `
            <span>ORDER PLACED</span>
            <span>✓</span>
        `;


        showCheckoutAlert(
            "ORDER PLACED",
            `ORDER ${orderNumber} — THANK YOU FOR SHOPPING VYRA.`
        );


        setTimeout(() => {

            window.location.href =
                "index.html";

        }, 3000);

    });


/* =========================
   INIT
========================= */

renderCheckout();