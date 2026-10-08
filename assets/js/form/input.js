
/**
 * Init input field animation
 * 
 * @returns {Void}
 */
export default function animateInputFields() {

    /**
     * Activates input field (activate animation)
     * 
     * @param {HTMLInputElement} input
     *  
     * @returns {Void}
     */
    const activateInput = (input) => {

        if(isInputActive(input)) return; // If input is already active(animated), exit function
        input.classList.add(ANIMATE_CLASS);

    }



    /**
     * Deactivates input field (abolish animation)
     * 
     * @param {HTMLInputElement} input 
     * 
     * @returns {Void}
     */
    const deactivateInput = (input) => input.classList.remove(ANIMATE_CLASS);



    /**
     * Checks and reutrns if input field is currently active(animated)
     * 
     * @param {HTMLInputElement} input 
     * 
     * @returns {Boolean} 
     */
    const isInputActive = (input) => input.classList.contains(ANIMATE_CLASS);



    /**
     * Checks and returns if input field value is empty
     * 
     * @param {HTMLInputElement} input
     *  
     * @returns {Boolean}
     */
    const isInputValueEmpty = (input) => input.value === '';



    /**
     * Attach events to element
     * 
     * @param {HTMLElement} element 
     * 
     * @returns {Void}
     */
    const attachEvents = (element) => {

        // Activate input when it it focuesed with cursor
        element.addEventListener("focusin", function(event) {
            activateInput(event.currentTarget);
        });

        // This is case when for example email field is autocompleted and with that field,
        // password field is also autocompleted, than both of input fields must be active
        element.addEventListener("change", function(event) {

            if(isInputValueEmpty(this)) return; // Don't activate input field if its value is empty
            activateInput(event.currentTarget);

        });

        // If input is foucsed out and its value is empty, deactivate input
        element.addEventListener("focusout", function(event) {

            if(isInputValueEmpty(this)) deactivateInput(event.currentTarget);
            
        });

        // Activate input on load if its value is not empty 
        // Note: animateInputFields function is called on window load event, so this line will execute when page loads
        if(isInputValueEmpty(element)) return;
        activateInput(element);

    }



    // Get all inputs
    let inputs = getAllInputFields();
    const ANIMATE_CLASS = "active";

    // Exit function if there is no input fields on the page
    if(!inputs || inputs.length < 0) return;
    
    // Init input fields animation on various events
    inputs.forEach(element => attachEvents(element));
    
}



// Selector for all desired inputs
const inputSelector = "input:not([type='submit']):not([type='button']), textarea";


/**
 * Get list of all input fields
 * 
 * @returns {HTMLAllCollection} List of all input fields on page
 */
const getAllInputFields = () => document.querySelectorAll(inputSelector);