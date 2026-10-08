// Global elements
import { HEADER, ROOT } from '../utils/dom-elements.js';

// Class names
import { class_header, class_navMenu, class_dropdown } from '../utils/dom-class-names.js';

// Global functions
import { createScrollDirectionTracker, appendCSSVariable } from '../global/global.js';



/**
 * IIFE to fake a namespace
 * 
 * @param {globalThis} - global object
 * 
 * @returns {Void}
 */
(function (global) {

    // Set header classes
    const HEADER_CLASSES = {...class_header};

    /**
     * Represents a Header object
     * 
     * @constructor
     */
    function Header() {


        /**
         * Initialize header
         * 
         * @returns {Void}
         */
        this.init = function () {

            this.HTMLHeaderElement = HEADER; // HEADER is a global variable

            // Validate existance of header
            if(!this.HTMLHeaderElement) return;

            this.height = this.HTMLHeaderElement.offsetHeight; // Height of header
            this.getScrollDirection = createScrollDirectionTracker(); // Create scroll direction tracker for header object

            // Add NavigationMenu to Header
            this.navigationMenu = new NavigationMenu(`header .${class_navMenu.container}`, 1399, `header .${class_navMenu.menuToggler}`);

            // Add dropdown to header
            this.dropdown = new Dropdown(`header .${class_dropdown.container}`); // Init dropdown

        }

        // Initialize header
        this.init();

        // Validate existance of header
        if(!this.HTMLHeaderElement) return;

        // Attach all events related to Header
        this.attachEvents();

        // Make header floating/non-floating
        this.togglefloatingHeader();

        // Show/hide header
        // this.toggleHeader();

        // Set variable to show header height
        appendCSSVariable("headerHeight", `${this.HTMLHeaderElement.offsetHeight}px`);

    }


    /**
     * Show header
     * 
     * @returns {Void}
     */
    Header.prototype.showHeader = function() {
        this.HTMLHeaderElement.classList.add(HEADER_CLASSES.hidden);
    }


    /**
     * Hide header
     * 
     * @returns {Void}
     */
    Header.prototype.hideHeader = function() {
        this.HTMLHeaderElement.classList.remove(HEADER_CLASSES.hidden);
    }


    /**
     * Make header floating
     * 
     * @returns {Void}
     */
    Header.prototype.makeFloating = function() {
        this.HTMLHeaderElement.classList.add(HEADER_CLASSES.floatingHeader);
    }


    /**
     * Make header non floating
     * 
     * @returns {Void}
     */
    Header.prototype.makeNonFloating = function() {
        this.HTMLHeaderElement.classList.remove(HEADER_CLASSES.floatingHeader);
    }


    /**
     * Toggles header visibility
     * 
     * @returns {Void}
     */
    Header.prototype.toggleHeader = function () {

        // Exit function if there is no header
        if (!this.HTMLHeaderElement) return;

        // Set condition for show/hide header
        let condition = this.getScrollDirection() == "downscroll" && this.dropdown.isActive() === false && this.navigationMenu.isNavMenuActiveAsSidebar() === false && ROOT.scrollTop >= 120;

        // Show/hide header
        condition ? this.showHeader() : this.hideHeader();

    }


    /**
     * This function is making header show/hide and change its colors
     * depending on scroll direction, position of the user on the page etc...
     * 
     * @returns {Void}
     */
    Header.prototype.togglefloatingHeader = function () {

        // Exit function if there is no header
        if (!this.HTMLHeaderElement) return;

        // Make header floating/non-floating based on condition
        ROOT.scrollTop >= 50 ? this.makeFloating() : this.makeNonFloating();

    }


    /**
     * Attach all events related to header
     * 
     * @returns {Void}
     */
    Header.prototype.attachEvents = function() {

        window.addEventListener("resize", () => {
            appendCSSVariable("headerHeight", `${this.HTMLHeaderElement.offsetHeight}px`);
        });

        window.addEventListener("scroll", () => {

            // Make header floating/non-floating
            this.togglefloatingHeader();

            // Show/hide header
            // this.toggleHeader();

        });

        // Hide sidebar nav menu on click away
        window.addEventListener("click", (event) => {

            if (event.target.closest("header") == null && window.innerWidth <= this.navigationMenu.toSidebarBreakpoint) {
                this.navigationMenu.hideNavMenuAsSidebar();
            }

        });

    }


    // Attach Header Object to global object
    global.Header = Header;

}(window));