// Class names
import { class_navMenu } from '../utils/dom-class-names.js';

// Global functions
import { isIOS } from '../global/global.js';

// Global functions
import { SCREEN_LOCKER } from '../global/global.js';

/**
 * IIFE to fake a namespace
 * 
 * @param {globalThis} - global object
 * 
 * @returns {Void}
 */
(function (global) {

    // Set navigation menu classes
    const NAV_MENU_CLASSES = {
        activeAsSidebar: class_navMenu.activeAsSidebar,
        active: class_navMenu.active,
        buttonActive: class_navMenu.buttonActive,
    }

    // Scroll position (for purposes of IOS devices)
    var SCROLL_TO_Y_AXIS;

    /**
     * Represents a Navigation Menu object
     * 
     * @param {String} navigationMenuSelector - CSS selector for navigation menu element
     * @param {Number} toSidebarBreakpoint - represents a breakpoint on which nav menu will transform to sidebar
     * 
     * @constructor
     */
    function NavigationMenu(navigationMenuSelector, toSidebarBreakpoint, togglerSelector) {

        /**
         * Initializes the NavigationMenu
         */
        this.init = function() {

            this.navigationMenuSelector = navigationMenuSelector;
            this.toSidebarBreakpoint = toSidebarBreakpoint;
            this.HTMLNavMenuElement = document.querySelector(navigationMenuSelector);
            this.toggler = document.querySelector(togglerSelector);
            this.links = this.HTMLNavMenuElement.querySelectorAll("a");

            // Exit if there is no navigation menu
            if(!this.HTMLNavMenuElement) return;

        }

        this.init();
        this.attachEvents();

    }


    /**
     * Check if navigation menu is active as as sidebar
     * 
     * @returns {Boolean} - True if navigation menu is active as sidebar, otherwise false
     */
    NavigationMenu.prototype.isNavMenuActiveAsSidebar = function() {

        return (
                this.HTMLNavMenuElement?.classList.contains(NAV_MENU_CLASSES.activeAsSidebar) &&
                this.HTMLNavMenuElement?.classList.contains(NAV_MENU_CLASSES.active)
                );

    }


    /**
     * Sets class that indicates navigation menu transformed to sidebar
     * 
     * @returns {Void}
     */
    NavigationMenu.prototype.toggleActiveSidebarClass = function() {

        if(window.innerWidth <= this.toSidebarBreakpoint) {
            this.HTMLNavMenuElement?.classList.add(NAV_MENU_CLASSES.activeAsSidebar);
        }
        else {
            this.HTMLNavMenuElement?.classList.remove(NAV_MENU_CLASSES.activeAsSidebar);
        }

    }


    /**
     * Show/hide navigation menu when it transform to sidebar
     */
    NavigationMenu.prototype.toggleNavMenuAsSidebar = function() {

        this.HTMLNavMenuElement?.classList.toggle(NAV_MENU_CLASSES.active);
        this.toggler?.classList.toggle(class_navMenu.buttonActive);

        if(isIOS() && window.innerWidth <= 500) {

            if(this.isNavMenuActiveAsSidebar()) {
                SCROLL_TO_Y_AXIS = window.scrollY;
            }
            else {
                unlockScreen();
                window.scrollTo(0, SCROLL_TO_Y_AXIS); // Restore scroll position (IOS only)
            }

        }

    }


    /**
     * Hides navigation menu when it transform to sidebar
     * 
     * @returns {Void}
     */
    NavigationMenu.prototype.hideNavMenuAsSidebar = function() {

        this.HTMLNavMenuElement?.classList.remove(NAV_MENU_CLASSES.active);
        this.toggler?.classList.remove(class_navMenu.buttonActive);

    }


    /**
     * Sets active nav menu link
     * 
     * @param {HTMLElement} activeLink - link that will be set to active
     * 
     * @returns {Void}
     */
    NavigationMenu.prototype.setActiveLink = function(activeLink) {

        this.links.forEach(link => link === activeLink ? link.closest("li").classList.add("active-section") : link.closest("li").classList.remove("active-section"));

    }


    /**
     * Sets active nav menu link
     * 
     * @returns {Void}
     */
    NavigationMenu.prototype.setActiveLinkBasedOnSection = function() {

        // Get distance brtween top of the screen and scrolled area
        let fromTop = window.scrollY + 10;

        this.links.forEach((link) => {

            // If link has no has, exit
            if(!link.hash) return;
    
            // Get li element that wrapps link
            const LI = link.closest("li");
    
            // Get section related to link
            let section = document.querySelector(link.hash);
    
            // Acivate link
            (section.offsetTop - 150 <= fromTop && section.offsetTop - 150 + section.offsetHeight > fromTop) ? LI.classList.add("active-section") : LI.classList.remove("active-section");
    
        });

    }


    /**
     * Attach all events related to navigation menu
     * 
     * @returns {Void}
     */
    NavigationMenu.prototype.attachEvents = function() {

        // *** Call functions on load ***
        this.toggleActiveSidebarClass();
        this.setActiveLinkBasedOnSection();

        window.addEventListener("resize", () => {

            this.toggleActiveSidebarClass();
            SCREEN_LOCKER.isNavMenuActive = this.isNavMenuActiveAsSidebar();

        });

        window.addEventListener("scrollend", () => {

            this.setActiveLinkBasedOnSection();

        });

        if(this.toggler) {

            this.toggler.addEventListener("click", () => {

                this.toggleNavMenuAsSidebar();
                SCREEN_LOCKER.isNavMenuActive = this.isNavMenuActiveAsSidebar();
                SCREEN_LOCKER.regulateScreenLock();

            });

        }

        this.links.forEach(link => {

            link.addEventListener("click", () => this.setActiveLink(link));

        });

    }


    // Attach NavigationMenu Object to global object
    global.NavigationMenu = NavigationMenu;

}(window));