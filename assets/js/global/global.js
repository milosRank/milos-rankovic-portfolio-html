// ==== This is global.js file. There will be stored global functions and variables. ====


// Global elements
import { ROOT } from "../utils/dom-elements.js";

// Class names
import { class_screenLocked } from "../utils/dom-class-names.js";

// Global Objects
import ScreenLocker from "../screen-locker/screen-locker.js";


/**
 * This function is checking if device is IOS
 * 
 * @returns {Boolean} 
 */
export let isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);


/**
 * Append custom variable to element/root element
 * 
 * @param {String} name Variable name. Two dashes(--) before name are automaticly appended to name
 * @param {String} value Variable value
 * @param {HTMLElement} element Element to append variable to. If empty, variable will be appended to root element
 * 
 * @returns {Void}
 */
export function appendCSSVariable(name, value, element) {

    // CSS variable name prefix (mandatory!)
    const prefix = "--";

    name = prefix + name; // Set proper name for CSS variable

    // Append CSS variable to root element
    if (!element) {
        document.documentElement.style.setProperty(name, value);
        return;
    }

    // Append CSS variable to element
    element.style.setProperty(name, value);

}


/**
 * This function is locking the screen (disable scrolling)
 * 
 * @returns {Void}
 */
export const lockScreen = () => ROOT.classList.add(class_screenLocked);


/**
 * This function is unlocking the screen (enable scrolling)
 * 
 * @returns {Void}
 */
export const unlockScreen = () => ROOT.classList.remove(class_screenLocked);


/**
 * Creates a scroll direction tracker
 * 
 * @returns {Function} - Returns a function that tracks the scroll direction and returns it
 */
export function createScrollDirectionTracker() {

    let scrollDirection, lastScrollTop = 0; // Initialize starting values

    /**
     * Get the direction of the scroll.
     * 
     * @returns {String} - Returns "downscroll" or "upscroll" depending on the scroll direction
     */
    return function getScrollDirection() {

        // Top offset of the page
        let topOffset = window.pageYOffset || document.documentElement.scrollTop;

        // Set direction of scroll on globally available scrollDirection variable
        scrollDirection = (topOffset > lastScrollTop ? "downscroll" : "upscroll");

        // For Mobile or negative scrolling
        lastScrollTop = topOffset <= 0 ? 0 : topOffset;

        // Get scroll direction
        return scrollDirection;

    };

}


/**
 * Checks if given HTML element / CSS selector is valid.
 * If HTML element exists return true.
 * If HTML element that is returned from querying with given CSS selector exists, return true.
 * If selector is invalid or element don"t exists, return false
 * 
 * @param {HTMLElement | String} elementOrSelector - HTMLElement or String
 *  
 * @returns {Boolean} - true if element is valid, otherwise false 
 */
function isElementValid(elementOrSelector) {

    // Case when string is passed
    if (typeof elementOrSelector === "string") {

        // Case when there is no element with given CSS selector
        if(document.querySelector(elementOrSelector) == null) {
            throw new Error("Element with " + elementOrSelector + "selector doesn't exists!");
        }

        // Case when there is an HTML element with given CSS selector
        return true;
    }

    // Case when HTML element is passed instead of CSS selector
    return elementOrSelector instanceof HTMLElement;

}


/**
 * This function returns element, 
 * but if given element is CSS selector than it"s querying DOM and returns founded element
 * 
 * @param {HTMLElement | String} elementOrSelector - The element or CSS selector to be assigned.
 * 
 * @throws {Error} - Throws an error if the input is not valid (String or HTMLElement)
 * 
 * @returns {HTMLElement} - The assigned element
 */
export function assignElement(elementOrSelector) {

    // Check if HTML element / CSS selector is valid
    if (isElementValid(elementOrSelector)) {

        if(typeof elementOrSelector === "string") {
            return document.querySelector(elementOrSelector);
        }
        else {
            return elementOrSelector;
        }
    }
    else {
        throw new Error("Invalid input. Expected string or HTMLElement.");
    }

}


/**
 * This method is equalizing elements heights and sets all heights to to biggest one among elements
 * 
 * @param {String} elementsSelector // Selector of all elements which height will be equalized
 * @param {Int} breakpoint // Breakpoint on which min height will reset
 * 
 * @returns {Void}
 */
export function equalizeElementsHeight(elementsSelector, breakpoint) {

    // Elements which height will be resized
    let elementsToEqualize = document.querySelectorAll(elementsSelector);

    // If there is no elements to resize, exti function
    if(!elementsToEqualize || elementsToEqualize.length <= 0) return; 

    // Reset min height of all elements
    elementsToEqualize.forEach((element) => element.style.minHeight = "unset");

    // Initial max height
    let maxHeight = 0;

    // Array of elements heights
    let elementsHeights = [];

    // Fill elements heights array
    elementsToEqualize.forEach((element, i) => elementsHeights[i] = element.offsetHeight);

    // Biggest elements height
    maxHeight = Math.max.apply(null, elementsHeights);
    
    // Set height of all elements to the bigges one
    elementsToEqualize.forEach((element) => element.style.minHeight = maxHeight + "px");

    // If there is no need to reset min height on certain breakpoint, exit function
    if(!breakpoint) return;

    // Indicates will condition behave as min or max width mediq query
    let breakpointCondition =  window.innerWidth <= breakpoint;

    // Reset min height on desired breakpoint
    if(breakpointCondition) elementsToEqualize.forEach((element) => element.style.minHeight = 0);

}


// Initialize ScreenLocker
// This is globally used object which properties can be changed on lots of places...
// Based on his properties this object will decide is the screen locked or not
export const SCREEN_LOCKER = new ScreenLocker();


/**
 * Scroll to desired element
 * 
 * @param {HTMLElement} element element to scroll to
 * 
 * @returns {Void} 
 */
export let scrollToElement = (element) => element.scrollIntoView({ behavior: "smooth" });


/**
 * Get width of scrollbar in pixels
 * 
 * @returns {Int} - Width of scrollbar in pixels
 */
export const getScrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth;


/**
 * Initializes the scroll to functionality of menu items
 * 
 * @returns {Int} - Width of scrollbar in pixels
 */
export const initMenuItemsScrollTo = () => {

    const menuWrappers = document.querySelectorAll(".scroll-to-menu-items");

    menuWrappers.forEach(menuWrapper => {

        const menuItems = menuWrapper?.querySelectorAll("a");

        menuItems?.forEach(item => {

            item.addEventListener("click", function(event) {

                event.preventDefault();
                let targetElement = document.querySelector(`${item.getAttribute("href")}`);
                if(targetElement) scrollToElement(targetElement);

                if(window.innerWidth <= 500) {
                    window.header.navigationMenu.toggleNavMenuAsSidebar();
                    window.header.navigationMenu.toggleActiveSidebarClass();
                }

            });

        });

    });

}