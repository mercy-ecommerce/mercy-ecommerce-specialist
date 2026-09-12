/* =====================================================
   SUPABASE CONNECTION
===================================================== */

const SUPABASE_URL = "https://odgsenqnxgzdsgzidwzo.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_rrfDt7mizfQcppZsxH8yBg_fHmAL1CP";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


/* =====================================================
   ADMIN PAGE
===================================================== */

document.addEventListener("DOMContentLoaded", async function () {

    const loginCard = document.getElementById("admin-login-card");
    const loginForm = document.getElementById("admin-login-form");
    const loginError = document.getElementById("admin-login-error");

    const dashboard = document.getElementById("admin-dashboard");
    const reviewsContainer = document.getElementById("admin-reviews");

    const logoutButton = document.getElementById("admin-logout-btn");


    /* =================================================
       SHOW DASHBOARD
    ================================================= */

    async function showDashboard() {

        loginCard.style.display = "none";
        dashboard.style.display = "block";

        await loadReviews();

    }


    /* =================================================
       SHOW LOGIN
    ================================================= */

    function showLogin() {

        loginCard.style.display = "block";
        dashboard.style.display = "none";

    }


    /* =================================================
       CHECK EXISTING LOGIN
    ================================================= */

    const {
        data: {
            session
        }
    } = await supabaseClient.auth.getSession();


    if (session) {

        await showDashboard();

    } else {

        showLogin();

    }


    /* =================================================
       LOGIN
    ================================================= */

    if (loginForm) {

        loginForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            loginError.textContent = "";

            const email =
                document.getElementById("admin-email").value.trim();

            const password =
                document.getElementById("admin-password").value;


            const loginButton =
                loginForm.querySelector(".admin-login-btn");


            if (!loginButton) {
                return;
            }


            const originalButtonText =
                loginButton.innerHTML;


            loginButton.disabled = true;
            loginButton.innerHTML = "Signing In...";


            try {

                const {
                    error
                } = await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });


                if (error) {

                    throw new Error(error.message);

                }


                loginForm.reset();

                await showDashboard();


            } catch (error) {

                console.error(
                    "Admin login error:",
                    error
                );


               loginError.textContent =
    "The email or password is incorrect. Please try again.";


                loginButton.disabled = false;
                loginButton.innerHTML = originalButtonText;

            }

        });

    }


    /* =================================================
       LOG OUT
    ================================================= */

    if (logoutButton) {

        logoutButton.addEventListener("click", async function () {

            await supabaseClient.auth.signOut();

            showLogin();

        });

    }


    /* =================================================
       LOAD REVIEWS
    ================================================= */

    async function loadReviews() {

        if (!reviewsContainer) {
            return;
        }


        reviewsContainer.innerHTML = `
            <div class="admin-loading">
                Loading reviews...
            </div>
        `;


        try {

            const {
                data: reviews,
                error
            } = await supabaseClient
                .from("reviews")
                .select(
                    "id, name, business, rating, review, permission, published, created_at"
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


            if (error) {

                throw new Error(error.message);

            }

const totalReviewsElement =
    document.getElementById("total-reviews");

const publishedReviewsElement =
    document.getElementById("published-reviews");

const pendingReviewsElement =
    document.getElementById("pending-reviews");


const totalReviews =
    reviews ? reviews.length : 0;

const publishedReviews =
    reviews
        ? reviews.filter(function (item) {
            return item.published === true;
        }).length
        : 0;

const pendingReviews =
    totalReviews - publishedReviews;


if (totalReviewsElement) {
    totalReviewsElement.textContent = totalReviews;
}

if (publishedReviewsElement) {
    publishedReviewsElement.textContent = publishedReviews;
}

if (pendingReviewsElement) {
    pendingReviewsElement.textContent = pendingReviews;
}

            if (!reviews || reviews.length === 0) {

                reviewsContainer.innerHTML = `
                    <div class="admin-empty">
                        No client reviews have been submitted yet.
                    </div>
                `;

                return;

            }


            reviewsContainer.innerHTML =
                reviews.map(function (item) {

                    const stars =
                        "★".repeat(item.rating);


                    const businessText =
                        item.business
                            ? item.business
                            : "Business name not provided";


                    const statusText =
                        item.published
                            ? "Published"
                            : "Pending Review";


                    const statusClass =
                        item.published
                            ? "published"
                            : "pending";


                    const buttonText =
                        item.published
                            ? "Unpublish Review"
                            : "Publish Review";


                    return `
                        <article class="admin-review-card">

                            <div class="admin-review-top">

                                <div>

                                    <span
                                        class="admin-review-status ${statusClass}"
                                    >
                                        ${statusText}
                                    </span>

                                    <h2>
                                        ${item.name}
                                    </h2>

                                    <span class="admin-review-business">
                                        ${businessText}
                                    </span>

                                </div>

                                <div class="admin-review-rating">
                                    ${stars}
                                </div>

                            </div>


                            <p class="admin-review-text">
                                ${item.review}
                            </p>


                            <div class="admin-review-bottom">

                                <span class="admin-review-permission">
                                    Publication permission:
                                    ${item.permission ? "Yes" : "No"}
                                </span>

                                <button
                                    type="button"
                                    class="admin-review-action"
                                    data-review-id="${item.id}"
                                    data-published="${item.published}"
                                >
                                    ${buttonText}
                                </button>

                            </div>

                        </article>
                    `;

                }).join("");


            connectReviewButtons();


        } catch (error) {

            console.error(
                "Unable to load reviews:",
                error
            );


            reviewsContainer.innerHTML = `
                <div class="admin-empty">
                    Reviews could not be loaded right now.
                </div>
            `;

        }

    }


    /* =================================================
       PUBLISH / UNPUBLISH
    ================================================= */

    function connectReviewButtons() {

        const actionButtons =
            document.querySelectorAll(
                ".admin-review-action"
            );


        actionButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                async function () {

                    const reviewId =
                        button.getAttribute(
                            "data-review-id"
                        );


                    const currentPublished =
                        button.getAttribute(
                            "data-published"
                        ) === "true";


                    const newPublished =
                        !currentPublished;


                    button.disabled = true;

                    button.textContent =
                        "Updating...";


                    try {

                        const {
                            error
                        } = await supabaseClient
                            .from("reviews")
                            .update({
                                published: newPublished
                            })
                            .eq(
                                "id",
                                reviewId
                            );


                        if (error) {

                            throw new Error(
                                error.message
                            );

                        }


                        await loadReviews();


                    } catch (error) {

                        console.error(
                            "Unable to update review:",
                            error
                        );


                        button.disabled = false;


                        button.textContent =
                            currentPublished
                                ? "Unpublish Review"
                                : "Publish Review";


                        alert(
                            "The review could not be updated. Please try again."
                        );

                    }

                }
            );

        });

    }

});