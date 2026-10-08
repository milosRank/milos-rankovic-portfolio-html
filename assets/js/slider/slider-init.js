// Class names
import { class_slider } from '../utils/dom-class-names.js';

/**
 * IIFE to fake a namespace
 * 
 * @returns {Void}
 */
(function() {

    // Set slider classes
    const SLIDER_CLASES = {...class_slider};

    /**
     * This function is initializing swiper.js
     *
     * @param {String} sliderClass - CSS selector for swiper element
     * 
     * @returns {Void}
     */
    function initSlider (sliderClass) {

        // List of all siiders
        const SLIDERS = Array.from(document.querySelectorAll(sliderClass));

        // Exit function if there is no slider
        if (SLIDERS.length <= 0) return;

        // Loop throught all sliders
        SLIDERS.forEach((slider, index) => {

            let config; // Slider configuration
            let sliderType = Number(slider.dataset.slidertype); // Type of slider

            // Slider controls
            let sliderControlNext = slider.closest(".swiper-container")?.querySelector(`.${class_slider.control}.${class_slider.controlNext}`);
            let sliderControlPrev = slider.closest(".swiper-container")?.querySelector(`.${class_slider.control}.${class_slider.controlPrev}`);

            switch (sliderType) {

                case 1:

                    config = {
                        loop: true,
                        slidesPerView: 1,
                        spaceBetween: 0,
                        effect: "cards",
                        breakpoints: {
                            991: {
                                slidesPerView: 2,
                                spaceBetween: 30,
                            }
                        },
                        navigation: {
                            nextEl: sliderControlNext,
                            prevEl: sliderControlPrev,
                        },
                    }

                break;

            }


            // Add ID to every slider
            slider.setAttribute("id", `slider-${index + 1}`)

            // Init Swiper
            new Swiper(`#slider-${index + 1}`, config);
            
        });
    };

    window.addEventListener("load", function() {

        initSlider(`.${SLIDER_CLASES.container}`);

    });

}());