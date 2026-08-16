const filters = document.querySelectorAll(".filter");
const products = document.querySelectorAll(".product");

function filterProducts(category) {

    filters.forEach(filter => {
        filter.classList.toggle(
            "active",
            filter.dataset.filter === category
        );
    });

    const toShow = [];

    products.forEach(product => {

        const isMatch =
            product.dataset.category === category;

        product.style.display =
            isMatch ? "block" : "none";

        if (isMatch) {
            toShow.push(product);
        }
    });

    toShow.forEach((product, index) => {

        product.animate(
            [
                {
                    opacity: 0,
                    transform: "translateY(25px) scale(.96)"
                },
                {
                    opacity: 1,
                    transform: "translateY(0) scale(1)"
                }
            ],
            {
                duration: 500,
                delay: index * 60,
                easing: "cubic-bezier(.16,1,.3,1)",
                fill: "both"
            }
        );

    });

}


// DEFAULT
filterProducts("tees");


filters.forEach(filter => {

    filter.addEventListener("click", () => {

        filterProducts(filter.dataset.filter);

    });

});



/* =========================================
   HERO + LOGO VIDEOS
========================================= */

const videos = document.querySelectorAll("video");

const videoObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach(entry => {

            const video = entry.target;

            if (entry.isIntersecting) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }

        });

    },
    {
        threshold: 0.1
    }
);

videos.forEach(video => {
    videoObserver.observe(video);
});



/* =========================================
   PRODUCT PAGE LINKS
========================================= */

document.querySelectorAll(".product").forEach(productCard => {

    const image =
        productCard.querySelector(".product-image img");

    if (!image) return;

    const src =
        image.getAttribute("src");

    if (!src) return;

    const fileName =
        src.split("/").pop();

    let productId = null;


    // TEES

    if (fileName.startsWith("product-")) {

        const number =
            fileName.match(/\d+/)?.[0];

        productId = `tee-${number}`;

    }


    // SHORTS

    else if (fileName.startsWith("short-")) {

        const number =
            fileName.match(/\d+/)?.[0];

        productId = `bottom-${number}`;

    }


    // BELTS

    else if (fileName.startsWith("belt-")) {

        const number =
            fileName.match(/\d+/)?.[0];

        productId = `belt-${number}`;

    }


    // CAPS

    else if (fileName.startsWith("cap-")) {

        const number =
            fileName.match(/\d+/)?.[0];

        productId = `cap-${number}`;

    }


    if (productId) {

        productCard.href =
            `product.html?id=${productId}`;

    }

});

