// Contact form element
const CONTACT_FORM = document.getElementById('contact-form');

if (CONTACT_FORM) {

    // Validation messages dictionary
    const DICTIONARY = [
        {
            key: 'Full name is required',
            dict: {
                sr: 'Ime i prezime su obavezni'
            }
        },
        {
            key: 'Email is required',
            dict: {
                sr: 'Email je obavezan'
            }
        },
        {
            key: 'Email has invalid format',
            dict: {
                sr: 'Email nema pravilan format'
            }
        },
        {
            key: 'Message is required',
            dict: {
                sr: 'Poruka je obavezna'
            }
        }
    ];

    // Validation messages styling
    const STYLING = {
        color: '#B00020',
        fontSize: '1.4rem',
        textDecoration: 'underlined',
    };

    // Instantiate Validation
    var contactValidation = new JustValidate('#contact-form', {
        STYLING
    }, DICTIONARY).onSuccess((event) => {
        event.target.submit();
    });

    // Set Contact Form Validation rules
    contactValidation
        .addField('#full_name',
            [
                {
                    rule: 'required',
                    errorMessage: 'Full name is required',
                }
            ]
        )
        .addField('#email',
            [
                {
                    rule: 'required',
                    errorMessage: 'Email is required',
                },
                {
                    rule: 'email',
                    errorMessage: 'Email has invalid format',
                },
            ]
        )
        .addField('#message',
            [
                {
                    rule: 'required',
                    errorMessage: 'Message is required',
                }
            ]
        );

        contactValidation.onSuccess((event) => {
            event.preventDefault();
        });
}



window.addEventListener("load", function() {

    if(!contactValidation) return;

    // Get current language
    const LANG = document.documentElement.getAttribute("lang");

    // Set translation of validation messages
    contactValidation.setCurrentLocale(LANG);

});