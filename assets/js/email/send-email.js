// Global functions
import { scrollToElement } from '../global/global.js';

window.addEventListener("load", function () {

    const contactForm = document.getElementById('contact-form');
    const messageContainer = contactForm?.querySelector('#submit-message');
    const submitButton = contactForm?.querySelector("button[type='submit']");
    const spinner = submitButton?.querySelector(".spinner");

    /**
     * Event listener for the form submission.
     * Prevents default form submission and sends form data via Fetch API.
     * Displays success or error messages and disables submit button on success.
     * Scrolls viewport to the message container after response.
     * @returns {void}
     */
    contactForm.addEventListener('submit', async function (event) {

        const fullName = contactForm.querySelector("#full_name").value;
        const emailAddress = contactForm.querySelector("#email").value;
        const phoneNumber = contactForm.querySelector("#phone_number").value;
        const message = contactForm.querySelector("#message").value;

        event.preventDefault(); // Prevent default form submission (page reload)
        submitButton.setAttribute("disabled", true);
        spinner.classList.add("show");

        // Check if client-side validation is passed.
        // If not, only then go to the served-side validation.
        if(!contactValidation.isValid) {

            spinner.classList.remove("show");
            submitButton.removeAttribute("disabled");
            return;

        }

        await fetch("/api/send-email", {
            method: "POST",
            body: JSON.stringify({
                name: fullName,
                email: emailAddress,
                phone: phoneNumber,
                message: message
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(async response => {
            submitButton.removeAttribute("disabled");
            const parsedResponse = await response.json();

            if (!response.ok || !parsedResponse.success) {
                handleFail({ msg: parsedResponse.error || "Slanje nije uspelo." });
            } else {
                handleSuccess({ msg: "Poruka je uspešno poslata!" });
            }

            return parsedResponse;
        })
        .catch(error => {
            console.log(error);

        })
        .finally(() => {
            spinner.classList.remove("show");
        });

    });


    /**
     * Handles a successful server response after form submission.
     * Updates the message container with the success message, applies styling,
     * and scrolls the viewport to the message container.
     *
     * @param {Object} response - The server response object.
     * @param {string} response.msg - The success message to display.
     * @param {string} response.status - The status of the response (should be "success").
     * 
     * @returns {Void}
     */
    const handleSuccess = (response) => {

        messageContainer.innerHTML = response.msg;
        messageContainer.classList.add("success");
        messageContainer.classList.remove("error");
        scrollToElement(messageContainer);

    };


    /**
     * Handles a failed server response after form submission.
     * Updates the message container with the error message, applies styling,
     * scrolls the viewport to the message container, and re-enables the submit button.
     * 
     * @returns {Void}
     *
     * @param {Object} response - The server response object.
     * @param {string} response.msg - The error message to display.
     * @param {string} response.status - The status of the response (should be "fail").
     */
    const handleFail = (response) => {

        messageContainer.innerText = response.msg;
        messageContainer.classList.add("error");
        messageContainer.classList.remove("success");
        scrollToElement(messageContainer);
        submitButton.removeAttribute("disabled");

    };

});