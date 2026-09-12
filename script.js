/* =====================================================
   SUPABASE CONNECTION
===================================================== */

const SUPABASE_URL = "https://odgsenqnxgzdsgzidwzo.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_rrfDt7mizfQcppZsxH8yBg_fHmAL1CP";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       READ MORE / READ LESS
    ========================================= */

    const readMoreButtons = document.querySelectorAll(".read-more-btn");

    readMoreButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const hiddenContent = button.nextElementSibling;

            if (!hiddenContent) {
                return;
            }

            if (hiddenContent.classList.contains("show")) {

                hiddenContent.classList.remove("show");
                button.textContent = "Read More";

            } else {

                hiddenContent.classList.add("show");
                button.textContent = "Read Less";

            }

        });

    });


    /* =========================================
       SECTION NAVIGATION
    ========================================= */

    const navigationLinks = document.querySelectorAll("[data-section]");
    const websiteSections = document.querySelectorAll(".page-section");


    function showSection(sectionName) {

        websiteSections.forEach(function (section) {

            section.classList.remove("active-section");

        });


        const targetSection = document.getElementById(sectionName);

        if (targetSection) {

            targetSection.classList.add("active-section");

        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    navigationLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            event.preventDefault();

            const sectionName = link.getAttribute("data-section");

            if (sectionName) {

                showSection(sectionName);

            }

        });

    });


    /* =========================================
       SHOW HOME SECTION FIRST
    ========================================= */

    if (document.getElementById("home")) {

        showSection("home");

    }

});

/* =====================================================
   PORTFOLIO IMAGE ZOOM VIEWER
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const portfolioImages = document.querySelectorAll(
        ".portfolio-visual-placeholder img"
    );

    if (!portfolioImages.length) {
        return;
    }


    /* CREATE VIEWER */

    const lightbox = document.createElement("div");

    lightbox.className = "portfolio-lightbox";

    lightbox.innerHTML = `
        <button
            class="portfolio-lightbox-close"
            type="button"
            aria-label="Close image viewer"
        >
            ×
        </button>

        <div class="portfolio-lightbox-stage">

            <img
                class="portfolio-lightbox-image"
                src=""
                alt=""
            >

        </div>

        <div class="portfolio-lightbox-controls">

            <button
                class="portfolio-zoom-out"
                type="button"
                aria-label="Zoom out"
            >
                −
            </button>

            <span class="portfolio-lightbox-zoom-level">
                100%
            </span>

            <button
                class="portfolio-zoom-in"
                type="button"
                aria-label="Zoom in"
            >
                +
            </button>

            <button
                class="portfolio-zoom-reset"
                type="button"
                aria-label="Reset zoom"
            >
                Reset
            </button>

        </div>
    `;


    document.body.appendChild(lightbox);


    /* ELEMENTS */

    const lightboxImage = lightbox.querySelector(
        ".portfolio-lightbox-image"
    );

    const closeButton = lightbox.querySelector(
        ".portfolio-lightbox-close"
    );

    const zoomInButton = lightbox.querySelector(
        ".portfolio-zoom-in"
    );

    const zoomOutButton = lightbox.querySelector(
        ".portfolio-zoom-out"
    );

    const zoomResetButton = lightbox.querySelector(
        ".portfolio-zoom-reset"
    );

    const zoomLevel = lightbox.querySelector(
        ".portfolio-lightbox-zoom-level"
    );


    /* ZOOM SETTINGS */

    let currentZoom = 1;

    const minimumZoom = 1;
    const maximumZoom = 4;
    const zoomStep = 0.25;


    /* PAN SETTINGS */

    let positionX = 0;
    let positionY = 0;

    let isDragging = false;

    let startX = 0;
    let startY = 0;


    /* UPDATE IMAGE */

    function updateImageTransform() {

        lightboxImage.style.transform =
            `translate(${positionX}px, ${positionY}px) scale(${currentZoom})`;

        zoomLevel.textContent =
            `${Math.round(currentZoom * 100)}%`;

    }


    /* RESET */

    function resetZoom() {

        currentZoom = 1;

        positionX = 0;
        positionY = 0;

        updateImageTransform();

    }


    /* ZOOM IN */

    function zoomIn() {

        if (currentZoom >= maximumZoom) {
            return;
        }

        currentZoom += zoomStep;

        if (currentZoom > maximumZoom) {
            currentZoom = maximumZoom;
        }

        updateImageTransform();

    }


    /* ZOOM OUT */

    function zoomOut() {

        if (currentZoom <= minimumZoom) {
            return;
        }

        currentZoom -= zoomStep;

        if (currentZoom < minimumZoom) {
            currentZoom = minimumZoom;
        }

        if (currentZoom === 1) {
            positionX = 0;
            positionY = 0;
        }

        updateImageTransform();

    }


    /* OPEN VIEWER */

    function openLightbox(image) {

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;

        resetZoom();

        lightbox.classList.add("active");

        document.body.style.overflow = "hidden";

    }


    /* CLOSE VIEWER */

    function closeLightbox() {

        lightbox.classList.remove("active");

        document.body.style.overflow = "";

        resetZoom();

    }


    /* IMAGE CLICK */

    portfolioImages.forEach(function (image) {

        image.addEventListener("click", function () {

            openLightbox(image);

        });

    });


    /* BUTTONS */

    zoomInButton.addEventListener("click", function () {

        zoomIn();

    });


    zoomOutButton.addEventListener("click", function () {

        zoomOut();

    });


    zoomResetButton.addEventListener("click", function () {

        resetZoom();

    });


    closeButton.addEventListener("click", function () {

        closeLightbox();

    });


    /* CLICK OUTSIDE IMAGE TO CLOSE */

    lightbox.addEventListener("click", function (event) {

        if (event.target === lightbox) {

            closeLightbox();

        }

    });


    /* ESCAPE KEY */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape" && lightbox.classList.contains("active")) {

            closeLightbox();

        }

    });


    /* MOUSE WHEEL ZOOM */

    lightbox.addEventListener("wheel", function (event) {

        if (!lightbox.classList.contains("active")) {
            return;
        }

        event.preventDefault();

        if (event.deltaY < 0) {

            zoomIn();

        } else {

            zoomOut();

        }

    }, { passive: false });


    /* DRAG IMAGE WHEN ZOOMED */

    lightboxImage.addEventListener("mousedown", function (event) {

        if (currentZoom <= 1) {
            return;
        }

        isDragging = true;

        lightboxImage.classList.add("dragging");

        startX = event.clientX - positionX;
        startY = event.clientY - positionY;

    });


    document.addEventListener("mousemove", function (event) {

        if (!isDragging) {
            return;
        }

        positionX = event.clientX - startX;
        positionY = event.clientY - startY;

        updateImageTransform();

    });


    document.addEventListener("mouseup", function () {

        isDragging = false;

        lightboxImage.classList.remove("dragging");

    });


});

document.addEventListener("DOMContentLoaded", function () {

    const reviewForm = document.getElementById("review-form");
    const reviewSuccessMessage = document.getElementById("review-success-message");

    if (!reviewForm || !reviewSuccessMessage) return;

    reviewForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const submitButton = reviewForm.querySelector(".review-submit-btn");

        if (!submitButton) return;

        const originalButtonText = submitButton.innerHTML;

        submitButton.disabled = true;
        submitButton.innerHTML = "Submitting...";

        try {

            const formData = new FormData(reviewForm);

            const clientName = formData.get("name");
            const businessName = formData.get("business") || null;
            const rating = Number(formData.get("rating"));
            const reviewText = formData.get("review");
            const permission = formData.get("permission") === "on";

            const { error: supabaseError } = await supabaseClient
                .from("reviews")
                .insert({
                    name: clientName,
                    business: businessName,
                    rating: rating,
                    review: reviewText,
                    permission: permission,
                    published: false
                });

            if (supabaseError) {
                throw new Error(supabaseError.message);
            }

            const formspreeResponse = await fetch(reviewForm.action, {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!formspreeResponse.ok) {
                throw new Error("Formspree submission failed.");
            }

            reviewForm.style.display = "none";
            reviewSuccessMessage.style.display = "block";

            reviewForm.reset();

        } catch (error) {

            console.error("Review submission error:", error);

            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;

            alert(
                "Something went wrong while submitting your review. Please try again."
            );

        }

    });

});

document.addEventListener("DOMContentLoaded", function () {

    const ratingLabels = document.querySelectorAll(".review-rating label");

    ratingLabels.forEach(function (label, index) {

        label.addEventListener("click", function () {

            ratingLabels.forEach(function (item, itemIndex) {

                const star = item.querySelector("span");

                if (!star) return;

                if (itemIndex <= index) {
                    star.classList.add("rating-selected");
                } else {
                    star.classList.remove("rating-selected");
                }

            });

        });

    });

});

// LOAD APPROVED CLIENT REVIEWS

document.addEventListener("DOMContentLoaded", async function () {

    const reviewsContainer = document.getElementById("home-reviews-list");

    if (!reviewsContainer) return;

    try {

        const { data: reviews, error } = await supabaseClient
            .from("reviews")
            .select("id, name, business, rating, review, created_at")
            .eq("published", true)
            .order("created_at", { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        if (!reviews || reviews.length === 0) {

            reviewsContainer.innerHTML = `
                <div class="reviews-empty">
                    Client feedback will appear here as approved reviews
                    become available.
                </div>
            `;

            return;
        }

        reviewsContainer.innerHTML = reviews.map(function (item) {

            const stars = "★".repeat(item.rating);

            const businessText = item.business
                ? item.business
                : "";

            return `
                <article class="review-card">

                    <div class="review-card-rating">
                        ${stars}
                    </div>

                    <p class="review-card-text">
                        ${item.review}
                    </p>

                    <div class="review-card-author">

                        <strong>
                            ${item.name}
                        </strong>

                        ${
                            businessText
                                ? `<span>${businessText}</span>`
                                : ""
                        }

                    </div>

                </article>
            `;

        }).join("");

    } catch (error) {

        console.error("Unable to load client reviews:", error);

        reviewsContainer.innerHTML = `
            <div class="reviews-empty">
                Client feedback could not be loaded right now.
            </div>
        `;

    }

});

/* =====================================================
   HEADER SCROLL + MOBILE MENU
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const header = document.querySelector(".site-header");
    const menuButton = document.getElementById("mobile-menu-btn");
    const mainNav = document.getElementById("main-nav");

    if (!header) return;


    /* HIDE HEADER WHEN MOVING TOWARD THE FOOTER */

    let lastScrollPosition = window.scrollY;

    window.addEventListener("scroll", function () {

        const currentScrollPosition = window.scrollY;

        if (
            currentScrollPosition > lastScrollPosition &&
            currentScrollPosition > 100
        ) {

            header.classList.add("header-hidden");

            if (mainNav) {
                mainNav.classList.remove("mobile-nav-open");
            }

            if (menuButton) {
                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

        } else {

            header.classList.remove("header-hidden");

        }

        lastScrollPosition = currentScrollPosition;

    });


    /* OPEN AND CLOSE MOBILE MENU */

    if (menuButton && mainNav) {

        menuButton.addEventListener("click", function () {

            mainNav.classList.toggle("mobile-nav-open");

            const menuIsOpen =
                mainNav.classList.contains("mobile-nav-open");

            menuButton.setAttribute(
                "aria-expanded",
                menuIsOpen ? "true" : "false"
            );

        });


        /* CLOSE MENU AFTER CHOOSING A PAGE */

        mainNav.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                mainNav.classList.remove("mobile-nav-open");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

    }

});

/* =====================================================
   SELECTED WORK → PORTFOLIO PROJECT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const workCards = document.querySelectorAll(
        ".home-work-card[data-portfolio-target]"
    );

    workCards.forEach(function (card) {

        card.addEventListener("click", function () {

            const targetId = card.getAttribute(
                "data-portfolio-target"
            );

            setTimeout(function () {

                const targetProject =
                    document.getElementById(targetId);

                if (targetProject) {

                    targetProject.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }, 150);

        });

    });

});

/* =====================================================
   AI SUPPORT CHAT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const chatToggle = document.getElementById("ai-chat-toggle");
    const chatWindow = document.getElementById("ai-chat-window");
    const chatClose = document.getElementById("ai-chat-close");
    const chatMessages = document.getElementById("ai-chat-messages");
    const chatInput = document.getElementById("ai-chat-input");
    const chatSend = document.getElementById("ai-chat-send");

    if (
        !chatToggle ||
        !chatWindow ||
        !chatClose ||
        !chatMessages ||
        !chatInput ||
        !chatSend
    ) {
        return;
    }

    const AI_CHAT_URL =
        "https://odgsenqnxgzdsgzidwzo.supabase.co/functions/v1/mercy-ai-chat";

    let conversation = [];

    function openChat() {

        chatWindow.classList.add("ai-chat-open");

        chatWindow.setAttribute(
            "aria-hidden",
            "false"
        );

        chatToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        setTimeout(function () {
            chatInput.focus();
        }, 100);

    }

    function closeChat() {

        chatWindow.classList.remove("ai-chat-open");

        chatWindow.setAttribute(
            "aria-hidden",
            "true"
        );

        chatToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    }

    function addMessage(role, text) {
    const message = document.createElement("div");

    message.className =
        role === "user"
            ? "ai-chat-message ai-chat-message-user"
            : "ai-chat-message ai-chat-message-ai";

    const bubble = document.createElement("div");
    bubble.className = "ai-chat-bubble";

    if (role === "assistant") {
        let formattedText = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        formattedText = formattedText
            .replace(/^###\s*(.*)$/gm, '<div class="ai-chat-heading">$1</div>')
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/^- (.*)$/gm, '<div class="ai-chat-bullet">$1</div>')
            .replace(/\n{2,}/g, '<div class="ai-chat-paragraph-space"></div>')
            .replace(/\n/g, "<br>");

        bubble.innerHTML = formattedText;

        const lowerText = text.toLowerCase();

        const needsEmail =
            lowerText.includes("email") &&
            (
                lowerText.includes("contact") ||
                lowerText.includes("reach out") ||
                lowerText.includes("get started") ||
                lowerText.includes("work with mercy")
            );

        const needsWhatsApp =
            lowerText.includes("whatsapp") &&
            (
                lowerText.includes("contact") ||
                lowerText.includes("reach out") ||
                lowerText.includes("get started") ||
                lowerText.includes("work with mercy")
            );

        if (needsEmail || needsWhatsApp) {
            const contactActions = document.createElement("div");
            contactActions.className = "ai-chat-contact-actions";

            if (needsEmail) {
                const emailButton = document.createElement("a");

                emailButton.href =
                    "https://mail.google.com/mail/?view=cm&fs=1&to=contact.mercyecommerce@gmail.com";

                emailButton.target = "_blank";
                emailButton.rel = "noopener noreferrer";
                emailButton.className =
                    "ai-chat-contact-btn ai-chat-email-btn";
                emailButton.innerHTML =
                    "Email Mercy <span>↗</span>";

                contactActions.appendChild(emailButton);
            }

            if (needsWhatsApp) {
                const whatsappButton = document.createElement("a");

                whatsappButton.href =
                    "https://wa.me/2349168542093?text=Hello%20Mercy%2C%20I%27d%20like%20to%20discuss%20improving%20my%20store.";

                whatsappButton.target = "_blank";
                whatsappButton.rel = "noopener noreferrer";
                whatsappButton.className =
                    "ai-chat-contact-btn ai-chat-whatsapp-btn";
                whatsappButton.innerHTML =
                    "Chat on WhatsApp <span>↗</span>";

                contactActions.appendChild(whatsappButton);
            }

            bubble.appendChild(contactActions);
        }
    } else {
        bubble.textContent = text;
    }

    message.appendChild(bubble);
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

    function showTyping() {

        const typing = document.createElement("div");

        typing.className =
            "ai-chat-message ai-chat-message-ai";

        typing.id = "ai-chat-typing";

        typing.innerHTML = `
            <div class="ai-chat-typing">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;

        chatMessages.appendChild(typing);

        chatMessages.scrollTop =
            chatMessages.scrollHeight;

    }

    function hideTyping() {

        const typing =
            document.getElementById("ai-chat-typing");

        if (typing) {
            typing.remove();
        }

    }

    async function sendMessage() {

        const message =
            chatInput.value.trim();

        if (!message || chatSend.disabled) {
            return;
        }

        addMessage("user", message);

        conversation.push({
            role: "user",
            content: message
        });

        chatInput.value = "";

        chatSend.disabled = true;

        chatInput.disabled = true;

        showTyping();

        try {

            const response = await fetch(
                AI_CHAT_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message: message,
                        conversation: conversation.slice(-10)
                    })
                }
            );

            const data = await response.json();

            hideTyping();

            if (!response.ok || !data.answer) {

                throw new Error(
                    data.error ||
                    "Unable to get an AI response."
                );

            }

            addMessage(
                "assistant",
                data.answer
            );

            conversation.push({
                role: "assistant",
                content: data.answer
            });

        } catch (error) {

            hideTyping();

            addMessage(
                "assistant",
                "I'm sorry, I'm having trouble connecting right now. Please try again in a moment or contact Mercy directly through the website."
            );

            console.error(
                "AI chat error:",
                error
            );

        } finally {

            chatSend.disabled = false;

            chatInput.disabled = false;

            chatInput.focus();

        }

    }

    chatToggle.addEventListener(
        "click",
        function () {

            if (
                chatWindow.classList.contains(
                    "ai-chat-open"
                )
            ) {
                closeChat();
            } else {
                openChat();
            }

        }
    );

    chatClose.addEventListener(
        "click",
        function () {
            closeChat();
        }
    );

    chatSend.addEventListener(
        "click",
        function () {
            sendMessage();
        }
    );

    chatInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );

});