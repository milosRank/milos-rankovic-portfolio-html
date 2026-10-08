// Class names
import { class_dropdown } from '../utils/dom-class-names.js';


/**
 * IIFE to fake a namespace
 * 
 * @param {globalThis} - global object
 * 
 * @returns {Void}
 */
(function (global) {

    // Set dropdown classes
    const DROPDOWN_CLASSES = {...class_dropdown}

    // Dropdown button HTML template
    const dropdownButtonTemplate = `
    <svg xmlns="http://www.w3.org/2000/svg" width="10.339" height="6.259" viewBox="0 0 10.339 6.259">
        <g id="Right_Arrow" data-name="Right Arrow" transform="translate(9.769 0.496) rotate(90)">
        <path id="Shape" d="M5.07,5.055,1.1,9.011A.645.645,0,0,1,.189,8.1L3.7,4.6.189,1.1A.645.645,0,0,1,1.1.189L5.07,4.145a.643.643,0,0,1,0,.911Z" transform="translate(0.004 0)" fill="#02c39a" stroke="#02c39a" stroke-width="1"/>
        </g>
    </svg>
    `;


    /**
     * Creates a Dropdown instance
     * 
     * @constructor
     * 
     * @param {String} dropdownParentSelector - The CSS selector for the dropdown parent elements
     * 
     * @returns {Void}
     */
    function Dropdown(dropdownParentSelector) {

        // Initialize object
        this.init(dropdownParentSelector);

        // Check if there is dropdowns elements. If not, exit funciton
        if (!this.dropdownContainers || this.dropdownContainers.length <= 0) return; // No dropdown parents found!

    }


    /**
     * Initializes dropdown
     * 
     * @param {String} dropdownParentSelector - The CSS selector for the dropdown parent elements
     *
     * @returns {Void}
     */
    Dropdown.prototype.init = function (dropdownParentSelector) {

        this.LIParents = [];
        this.dropdownParentSelector = dropdownParentSelector;

        this.dropdownContainers = Array.from(document.querySelectorAll(dropdownParentSelector)); // Init dropdown parents
        this.dropdownContainers.forEach((container, index) => container.dataset.dropdownId = `${DROPDOWN_CLASSES.parent}-${index + 1}`); // Set unique ID for all dropdown parents

        this.initDropdownButton(); // Init dropdown button
        this.appendDropdownButtons(); // Append dropdown button to its parent

        this.attachEvents(); // Attach all events

    }


    /**
     * Get nearest <ul> element
     * 
     * @param {HTMLElement} parentEl - The parent element
     * 
     * @returns {HTMLElement} - The nearest <ul> element
     */
    Dropdown.prototype.getNearestUlElement = (parentEl) => parentEl.querySelector("ul");


    /**
     * Get all same level <ul> elements based on <ul> element passed as parameter
     * 
     * @param {HTMLElement} UL - <ul> element
     * 
     * @returns {Array} - Array of <ul> elements
     */
    Dropdown.prototype.getULSiblings = function (UL) {

        // Get holder of active <ul> elements
        let activeULParent = UL.parentNode.parentNode;

        // Get all <ul> elements that are the same level as <ul> that will be activated
        return Array.from(activeULParent.querySelectorAll(`:scope > .${DROPDOWN_CLASSES.parent} > ul`)).filter((element) => element != UL);

    }


    /**
     * Get all active UL elements
     * 
     * @return {HTMLElement} - active UL elements
     */
    Dropdown.prototype.getAllActiveLists = function () {

        let ULs = [];

        this.dropdownContainers.forEach(element => {

            let activeULs = element.querySelectorAll(`ul.${DROPDOWN_CLASSES.parentActive}`);

            // Push every UL as single item
            activeULs.forEach(activeUL => ULs.push(activeUL));

        });

        return ULs;

    }


    /**
     * Get all active dropdown button elements
     * 
     * @return {Array} - active dropdown button elements
     */
    Dropdown.prototype.getAllActiveDropdownButtons = () => document.querySelectorAll(`.${DROPDOWN_CLASSES.button}.${DROPDOWN_CLASSES.buttonActive}`);


    /**
     * Get all <li> elements of an list parent(UL)
     * 
     * @param {HTMLElement} listParent - The list parent element
     * 
     * @returns {HTMLAllCollection} - All <li> elements
     */
    Dropdown.prototype.getAllLiElements = (listParent) => Array.from(listParent.querySelectorAll(":scope > li"));


    /**
     * Get all dropdown buttons from its container
     * 
     * @param {HTMLElement} container - Container(scope) element from who we are searchng for dropdown buttons
     * 
     * @returns {HTMLAllCollection} - List of dropdown buttons
     */
    Dropdown.prototype.getAllDropdownButtons = (container) => Array.from(container.querySelectorAll(`.${DROPDOWN_CLASSES.button}`));


    /**
     * Check if there are nested elements inside the parent element
     * 
     * @param {HTMLElement} parentEl - The parent element
     * @param {String} elementToLookForSelector - The selector for the nested element
     * 
     * @returns {Boolean} - True if there are nested elements, false otherwise
     */
    Dropdown.prototype.checkNestedElements = (parentEl, elementToLookForSelector) => parentEl.querySelectorAll(elementToLookForSelector).length <= 0 ? false : true;


    /**
     * Append dropdown buttons to its parents
     * 
     * @returns {Void}
     */
    Dropdown.prototype.appendDropdownButtons = function () {

        /**
         * Recursive function that processes nested elements and appends dropdown buttons until there is no more inner lists
         * 
         * @param {HTMLAllCollection} container 
         * 
         * @returns {Void}
         */
        let processNestedElements = (container) => {

            let UL = this.getNearestUlElement(container);
            let liElements = this.getAllLiElements(UL);

            liElements.forEach(LI => {

                let button = this.getClonedDropdownButton(); // Get dropdown button

                // Check if there is nested UL elements inside LI element.
                // If it is true, append dropdown button to it.
                if (this.checkNestedElements(LI, "ul")) {

                    LI.appendChild(button);
                    LI.classList.add(DROPDOWN_CLASSES.parent);
                    processNestedElements(LI);

                }

            });

        }

        this.dropdownContainers.forEach(container => processNestedElements(container));

    }


    /**
     * This function is creating a dropdown button template that will be appended on list parents
     * It initializes button, but don't append or clone it
     * 
     * @returns {Void}
     */
    Dropdown.prototype.initDropdownButton = function () {

        /**
         * Set dropdown classes
         */
        this.dropdownButtonClass = DROPDOWN_CLASSES.button; // Dropdown button
        this.dropdownButtonActiveClass = DROPDOWN_CLASSES.buttonActive; // Active dropdown button

        // Button template
        this.dropdownButtonTemplate = dropdownButtonTemplate;
        this.dropdownButton = document.createElement("button"); // Create button
        this.dropdownButton.setAttribute("aria-label","Navigation dropdown button");
        this.dropdownButton.innerHTML = this.dropdownButtonTemplate; // Set inner HTML of button from its template
        this.dropdownButton.classList.add(this.dropdownButtonClass); // Set class that will indicate this is a dropdown button

    }


    /**
     * Get cloned dropdown button element
     * 
     * @returns {HTMLButtonElement} - The cloned dropdown button element
     */
    Dropdown.prototype.getClonedDropdownButton = function () {
        return this.dropdownButton.cloneNode(true);
    }


    /**
     * Show/hide dropdown
     * 
     * @param {HTMLUListElement} UL - <ul> element
     * 
     * @returns {Void}
     */
    Dropdown.prototype.toggleDropdown = (UL) => UL.classList.toggle(DROPDOWN_CLASSES.parentActive);


    /**
     * Hide dropdown
     * 
     * @param {HTMLUListElement} UL - <ul> element
     * 
     * @returns {Void}
     */
    Dropdown.prototype.hideDropdown = (UL) => UL.classList.remove(DROPDOWN_CLASSES.parentActive);


    /**
     * Add/remove active dropdown button style
     * 
     * @param {HTMLUListElement} button - <button> element
     * 
     * @returns {Void}
     */
    Dropdown.prototype.toggleButtonActiveStyle = (button) => button.classList.toggle(DROPDOWN_CLASSES.buttonActive);


    /**
     * Remove active dropdown button style
     * 
     * @param {HTMLUListElement} button - <button> element
     * 
     * @returns {Void}
     */
    Dropdown.prototype.removeButtonActiveStyle = function (button) {
        button.classList.remove(DROPDOWN_CLASSES.buttonActive);
    }


    /**
     * Hide all dropdowns
     *
     * @returns {Void}
     */
    Dropdown.prototype.hideAllDropdowns = function () {

        let activeLists = this.getAllActiveLists(); // Active Ul's
        let activeDropdownButtons = this.getAllActiveDropdownButtons(); // Active dropdown buttons

        if(!activeLists || activeLists.length <=0) return; // Exit if there is no active lists

        /**
         * Deactivate lists and dropdown buttons
         */
        activeLists.forEach(UL => this.hideDropdown(UL));
        activeDropdownButtons.forEach(button => this.removeButtonActiveStyle(button));

    }


    /**
     * Checks if dropdown is active
     * 
     * @returns {Boolean} - Returns true if dropdown is active, otherwise returns false
     */
    Dropdown.prototype.isActive =() => !!document.querySelector(`.${DROPDOWN_CLASSES.parent} .${DROPDOWN_CLASSES.buttonActive}`);


    /**
     * Attach all events related to dropdown
     * 
     * @returns {Void}
     */
    Dropdown.prototype.attachEvents = function () {

        this.dropdownContainers.forEach(container => {

            // Get all dropdown buttons from its container
            let dropdownButtons = this.getAllDropdownButtons(container);

            dropdownButtons.forEach(button => {

                let UL = button.parentElement.querySelector(":scope > ul"); // Get all <ul> that are in the sam DOM tree level as button

                button.addEventListener("click", () => {

                    let activeULSiblings = this.getULSiblings(UL);
                    
                    if(activeULSiblings) {

                        // Deactivate all dropdowns that are the same level as <ul> that will be activated
                        activeULSiblings.forEach(element => {

                            let btn = element.parentElement.querySelector(":scope > button");
                            this.removeButtonActiveStyle(btn);
                            this.hideDropdown(element);

                        });
                    }

                    this.toggleDropdown(UL); // Toggle dropdown
                    this.toggleButtonActiveStyle(button); // Toggle active button

                });

            });
            
        });

        window.addEventListener("click", (event) => {

            // Hide dropdown on click away
            let clickedElement = event.target;
            if(clickedElement.closest(this.dropdownParentSelector) == null) this.hideAllDropdowns();

        });

    }


    // Append Dropdown to global object
    global.Dropdown = Dropdown;

}(window));