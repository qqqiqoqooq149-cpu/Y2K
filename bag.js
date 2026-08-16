/* =========================================================
   VYRA — SHARED BAG
   Persistent cart using localStorage
========================================================= */

(() => {
    const STORAGE_KEY = "vyraBag";

    const getBag = () => {
        try {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    };

    const saveBag = (bag) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bag));
    };

    const totalItems = (bag) =>
        bag.reduce((total, item) => total + (Number(item.quantity) || 1), 0);

    const priceNumber = (value) => {
        const match = String(value).replace(/,/g, "").match(/[\d.]+/);
        return match ? Number(match[0]) : 0;
    };

    const money = (value) =>
        `${Number(value).toLocaleString("en-US")} EGP`;

    function ensureUI() {

        if (!document.getElementById("vyraBagOverlay")) {
            const overlay = document.createElement("div");
            overlay.id = "vyraBagOverlay";
            overlay.className = "vyra-bag-overlay";
            overlay.innerHTML = `
                <aside class="vyra-bag-drawer" role="dialog" aria-modal="true" aria-label="Shopping bag">
                    <div class="vyra-bag-head">
                        <div>
                            <span class="vyra-bag-kicker">VYRA STUDIOS</span>
                            <h2>YOUR BAG<span>.</span></h2>
                        </div>
                        <button class="vyra-bag-close" id="vyraBagClose" aria-label="Close bag">×</button>
                    </div>

                    <div class="vyra-bag-items" id="vyraBagItems"></div>

                    <div class="vyra-bag-empty" id="vyraBagEmpty">
                        <span>YOUR BAG IS EMPTY</span>
                        <small>ADD SOMETHING YOU LOVE.</small>
                    </div>

                    <div class="vyra-bag-footer">
                        <div class="vyra-bag-total">
                            <span>TOTAL</span>
                            <strong id="vyraBagTotal">0 EGP</strong>
                        </div>
<button
    type="button"
    class="vyra-checkout"
    id="vyraCheckout"
    onclick="window.location.href='checkout.html';"
>
    CHECKOUT
    <span>→</span>
</button>
                    </div>
                </aside>
            `;
            document.body.appendChild(overlay);
        }

        if (!document.getElementById("vyraBagAlert")) {
            const alert = document.createElement("div");
            alert.id = "vyraBagAlert";
            alert.className = "vyra-bag-alert";
            alert.innerHTML = `
                <span class="vyra-bag-alert-icon">✓</span>
                <div>
                    <strong id="vyraBagAlertTitle"></strong>
                    <small id="vyraBagAlertText"></small>
                </div>
            `;
            document.body.appendChild(alert);
        }
    }

    function updateCount() {
        const count = document.getElementById("bagCount");
        if (!count) return;

        const total = totalItems(getBag());
        count.textContent = total;
        count.classList.toggle("is-empty", total === 0);
    }

    function render() {
        const itemsEl = document.getElementById("vyraBagItems");
        const emptyEl = document.getElementById("vyraBagEmpty");
        const totalEl = document.getElementById("vyraBagTotal");
        if (!itemsEl || !emptyEl || !totalEl) return;

        const bag = getBag();

        itemsEl.innerHTML = "";

        if (!bag.length) {
            emptyEl.classList.add("show");
            totalEl.textContent = "0 EGP";
            updateCount();
            return;
        }

        emptyEl.classList.remove("show");

        let total = 0;

        bag.forEach((item, index) => {
            const quantity = Number(item.quantity) || 1;
            const unitPrice = priceNumber(item.price);
            total += unitPrice * quantity;

            const row = document.createElement("div");
            row.className = "vyra-bag-item";
            row.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="vyra-bag-item-info">
                    <strong>${item.name}</strong>
                    <small>${item.color || ""}</small>
                    <small>SIZE: ${item.size || "—"}</small>
                    <div class="vyra-bag-item-bottom">
                        <span>${money(unitPrice * quantity)}</span>
                        <div class="vyra-qty">
                            <button data-action="minus" data-index="${index}">−</button>
                            <b>${quantity}</b>
                            <button data-action="plus" data-index="${index}">+</button>
                        </div>
                    </div>
                </div>
                <button class="vyra-remove" data-action="remove" data-index="${index}" aria-label="Remove item">×</button>
            `;
            itemsEl.appendChild(row);
        });

        totalEl.textContent = money(total);
        updateCount();
    }

function open() {
    ensureUI();
    render();

    document.getElementById("vyraBagOverlay").classList.add("open");

    document.documentElement.classList.add("vyra-bag-locked");
    document.body.classList.add("vyra-bag-locked");
}
function close() {
    const overlay = document.getElementById("vyraBagOverlay");

    if (overlay) {
        overlay.classList.remove("open");
    }

    document.documentElement.classList.remove("vyra-bag-locked");
    document.body.classList.remove("vyra-bag-locked");
}

function showAlert(title, text) {
    const alert = document.getElementById("bagAlert");

    if (!alert) return;

    document.getElementById("bagAlertTitle").textContent = title;
    document.getElementById("bagAlertText").textContent = text;

    alert.classList.add("show");

    clearTimeout(window.vyraBagAlertTimer);

    window.vyraBagAlertTimer = setTimeout(() => {
        alert.classList.remove("show");
    }, 2600);
}

    function addItem(item) {
        const bag = getBag();

        // Same product + same size = increase quantity.
        const existing = bag.find(
            entry => entry.id === item.id && entry.size === item.size
        );

        if (existing) {
            existing.quantity = (Number(existing.quantity) || 1) + 1;
        } else {
            bag.push({
                ...item,
                quantity: 1
            });
        }

        saveBag(bag);
        updateCount();
        render();
    }

    function changeQuantity(index, delta) {
        const bag = getBag();
        if (!bag[index]) return;

        bag[index].quantity = (Number(bag[index].quantity) || 1) + delta;

        if (bag[index].quantity <= 0) {
            bag.splice(index, 1);
        }

        saveBag(bag);
        render();
    }

    function removeItem(index) {
        const bag = getBag();
        if (!bag[index]) return;

        bag.splice(index, 1);
        saveBag(bag);
        render();
    }

    window.VyraBag = {
        getBag,
        addItem,
        open,
        close,
        showAlert,
        render
    };

    document.addEventListener("DOMContentLoaded", () => {
        ensureUI();
        updateCount();
        render();

document.getElementById("bagIcon")?.addEventListener("click", open);

        document.getElementById("vyraBagClose")?.addEventListener("click", close);

        document.getElementById("vyraBagOverlay")?.addEventListener("click", (event) => {
            if (event.target.id === "vyraBagOverlay") close();
        });

        document.getElementById("vyraBagItems")?.addEventListener("click", (event) => {
            const button = event.target.closest("[data-action]");
            if (!button) return;

            const index = Number(button.dataset.index);
            const action = button.dataset.action;

            if (action === "plus") changeQuantity(index, 1);
            if (action === "minus") changeQuantity(index, -1);
            if (action === "remove") removeItem(index);
        });


        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") close();
        });
    });
})();
