import { lockScreen, unlockScreen } from "../global/global.js";


/**
 * IIFE to fake a namespace
 * 
 * @param {globalThis} - global object
 * 
 * @returns {Void}
 */
(function (global) {

    // Instance of ScreenLocker
    let instance;

    /**
     * This is screen lock regulator. It should have only one instance.
     * 
     * @constructor
     * @returns {Void}
     */
    function ScreenLocker() {

        // Validate that there is only one instance of ScreenLocker
        if (instance) throw new Error("ScreenLocker should have only one instance!");

        this._isNavMenuActive = false;
        this._breakpoint = 576;
        this._isPopupActive = false;

        this.calcualteCondition();

        // Set instance
        instance = this;

    }

    // Define getters and setters for breakpoint
    Object.defineProperty(ScreenLocker.prototype, 'breakpoint', {

        get: function() {
            return this._breakpoint;
        },
        set: function(value) {
            this._breakpoint = value;

            // Recalculate condition when breakpoint property changes
            this.calcualteCondition();
        }

    });

    // Define getters and setters for breakpoint
    Object.defineProperty(ScreenLocker.prototype, 'isNavMenuActive', {

        get: function() {
            return this._isNavMenuActive;
        },
        set: function(value) {
            this._isNavMenuActive = value;

            // Recalculate condition when isNavMenuActive property changes
            this.calcualteCondition();
        }

    });

    // Define getters and setters for breakpoint
    Object.defineProperty(ScreenLocker.prototype, 'isPopupActive', {

        get: function() {
            return this._isPopupActive;
        },
        set: function(value) {

            this._isPopupActive = value;

            // Recalculate condition when isPopupActive property changes
            this.calcualteCondition();

        }

    });
    

    /**
     * Calculates and sets condition for screen locking / unlocking
     * 
     * @returns {Void}
     */
    ScreenLocker.prototype.calcualteCondition = function () {
        // this.condition = (window.innerWidth <= this.breakpoint && this.isNavMenuActive) || this.isPopupActive;
        this.condition = (window.innerWidth <= this.breakpoint && this.isNavMenuActive)
    }


    /**
     * Regulate screen lock based on condition
     * 
     * @returns {Void}
     */
    ScreenLocker.prototype.regulateScreenLock = function () {

        this.calcualteCondition();
        this.condition ? lockScreen() : unlockScreen();

    }


    // Append ScreenLocker to global object
    global.ScreenLocker = ScreenLocker;

}(window));


// Default export
export default ScreenLocker;