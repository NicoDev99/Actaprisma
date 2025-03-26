document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    // Hamburger menu functionality
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('nav ul');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    if (hamburgerMenu && navMenu && menuOverlay) {
        // Toggle menu when hamburger is clicked
        hamburgerMenu.addEventListener('click', function() {
            hamburgerMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking on overlay
        menuOverlay.addEventListener('click', function() {
            hamburgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
        
        // Close menu when clicking on a navigation link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // Initialize Typed.js for the main title
    const typingOptions = {
        strings: ['Vous avez <br /> un objectif ?'],
        typeSpeed: 50,
        backSpeed: 0,
        startDelay: 300,
        loop: false,
        showCursor: true,
        cursorChar: '|',
        autoInsertCss: true
    };
    
    // Start the typing animation for the main title
    if (document.querySelector('.typing-title')) {
        new Typed('.typing-title', typingOptions);
    }

    // Initialize Typed.js for the quote in the about section
    const quoteTypingOptions = {
        strings: ['Votre image est un actif sur lequel capitaliser pour atteindre vos ambitions.'],
        typeSpeed: 0,
        backSpeed: 0,
        startDelay: 500,
        loop: false,
        showCursor: false,
        autoInsertCss: true
    };

    // Create an intersection observer for the quote element
    const quoteObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If the quote is in the viewport
            if (entry.isIntersecting && !entry.target.hasAttribute('data-typed-initialized')) {
                // Start the typing animation for the quote
                new Typed(entry.target, quoteTypingOptions);
                // Mark the element as initialized to prevent re-initialization
                entry.target.setAttribute('data-typed-initialized', 'true');
            }
        });
    }, { threshold: 0.5 });

    // Observe the quote element
    const quoteElement = document.querySelector('.quote-text');
    if (quoteElement) {
        quoteElement.innerHTML = '';  // Clear existing content for Typed.js to work
        quoteObserver.observe(quoteElement);
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
                });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));
    
    // Language toggle functionality
    const langDropdown = document.querySelector('.lang-dropdown');
    const langToggle = document.querySelector('.lang-toggle');
    const langMenu = document.querySelector('.lang-menu');
    const langOptions = document.querySelectorAll('.lang-option');
    const langFlags = document.querySelectorAll('.lang-flag');
    
    // Détecter la langue du navigateur
    const getBrowserLanguage = () => {
        const browserLang = navigator.language || navigator.userLanguage;
        console.log(navigator.language);
        // Extraire juste le code de langue principal (avant le tiret s'il y en a un)
        const langCode = browserLang.split('-')[0].toLowerCase();
        
        // Vérifier si la langue est supportée, sinon utiliser le français par défaut
        const supportedLangs = ['fr', 'en', 'es', 'pt'];
        return supportedLangs.includes(langCode) ? langCode : 'fr';
    };
    
    // Définir la langue par défaut en fonction de la langue du navigateur
    let currentLang = getBrowserLanguage();
    
    // Mettre à jour l'interface pour refléter la langue par défaut
    const updateUIForLanguage = (lang) => {
        // Mettre à jour le bouton de langue principal
        const selectedOption = document.querySelector(`.lang-option[data-lang="${lang}"]`);
        if (selectedOption) {
            langToggle.textContent = selectedOption.textContent.split(' ')[0];
            
            // Mettre à jour les classes actives pour les options du menu déroulant
            langOptions.forEach(opt => {
                opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
            });
            
            // Mettre à jour les classes actives pour les drapeaux du menu burger
            langFlags.forEach(flag => {
                flag.classList.toggle('active', flag.getAttribute('data-lang') === lang);
            });
        }
    };
    
    // Initialiser l'interface avec la langue détectée
    updateUIForLanguage(currentLang);
    
    // Ajouter une classe au body pour indiquer la langue active
    document.body.setAttribute('data-lang', currentLang);

    // Toggle menu on click when not in burger menu
    langToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        // Ne pas ouvrir le menu si on est en mode burger
        if (window.innerWidth > 1350) {
            langMenu.classList.toggle('active');
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!langDropdown.contains(e.target)) {
            langMenu.classList.remove('active');
        }
    });

    // Handle language selection for dropdown menu
    langOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const selectedLang = this.getAttribute('data-lang');
            
            // Update current language
            currentLang = selectedLang;
            
            // Mettre à jour l'interface
            updateUIForLanguage(currentLang);
            
            // Update class on body
            document.body.setAttribute('data-lang', currentLang);
            
            // Close menu immediately if not in burger menu
            langMenu.classList.remove('active');
            
            // Here you would add code to change the website content based on the selected language
            console.log(`Language changed to: ${currentLang}`);
            
            // Si on est dans le burger menu, fermer le menu
            if (hamburgerMenu.classList.contains('active')) {
                hamburgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });

    // Handle language selection for burger menu flags
    langFlags.forEach(flag => {
        flag.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            
            // Update current language
            currentLang = selectedLang;
            
            // Mettre à jour l'interface
            updateUIForLanguage(currentLang);
            
            // Update class on body
            document.body.setAttribute('data-lang', currentLang);
            
            // Here you would add code to change the website content based on the selected language
            console.log(`Language changed to: ${currentLang} (from burger menu)`);
            
            // Fermer le menu burger
            hamburgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Gestion de l'expansion des cartes
    const cardHeaders = document.querySelectorAll('.card-header');
    
    cardHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const card = this.closest('.service-card');
            card.classList.toggle('expanded');
        });
    });

    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        const requiredFields = contactForm.querySelectorAll('[required]');
        const errorMessages = {
            'fr': {
                required: 'Ce champ est obligatoire',
                email: 'Veuillez entrer une adresse email valide'
            },
            'en': {
                required: 'This field is required',
                email: 'Please enter a valid email address'
            },
            'es': {
                required: 'Este campo es obligatorio',
                email: 'Por favor, introduce una dirección de correo electrónico válida'
            },
            'pt': {
                required: 'Este campo é obrigatório',
                email: 'Por favor, insira um endereço de e-mail válido'
            }
        };
        
        // Valider un champ et afficher les erreurs
        const validateField = (field) => {
            const errorElement = document.getElementById(`${field.id}-error`);
            
            if (!errorElement) return true;
            
            if (field.required && field.value.trim() === '') {
                errorElement.textContent = errorMessages[currentLang]?.required || errorMessages['fr'].required;
                field.classList.add('error');
                return false;
            }
            
            if (field.type === 'email' && field.value.trim() !== '') {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(field.value)) {
                    errorElement.textContent = errorMessages[currentLang]?.email || errorMessages['fr'].email;
                    field.classList.add('error');
                    return false;
                }
            }
            
            errorElement.textContent = '';
            field.classList.remove('error');
            return true;
        };
        
        // Valider tous les champs et soumettre le formulaire
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Réinitialiser le statut du formulaire
            formStatus.className = 'form-status';
            formStatus.textContent = '';
            formStatus.style.display = 'none';
            
            // Valider tous les champs requis
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });
            
            if (!isValid) return;
            
            // Désactiver le bouton d'envoi pendant la soumission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            
            // Afficher un indicateur de chargement
            submitButton.textContent = '...';
            
            // Préparer les données du formulaire
            const formData = {
                project: contactForm.project.value,
                organization: contactForm.organization.value,
                role: contactForm.role.value,
                lastname: contactForm.lastname.value,
                firstname: contactForm.firstname.value,
                email: contactForm.email.value,
                phone: contactForm.phone.value,
                message: contactForm.message.value
            };
            
            // Envoyer le formulaire via EmailJS
            emailjs.send('service_lg8fbh9', 'template_czs3jtk', formData)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // Afficher le message de succès
                    formStatus.className = 'form-status success';
                    formStatus.textContent = translations[currentLang]?.form_success || translations['fr'].form_success;
                    formStatus.style.display = 'block';
                    
                    // Réinitialiser le formulaire
                    contactForm.reset();
                    
                    // Réactiver le bouton d'envoi
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                    
                    // Faire défiler vers le message de succès
                    formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, function(error) {
                    console.log('FAILED...', error);
                    
                    // Afficher le message d'erreur
                    formStatus.className = 'form-status error';
                    formStatus.textContent = translations[currentLang]?.form_error || translations['fr'].form_error;
                    formStatus.style.display = 'block';
                    
                    // Réactiver le bouton d'envoi
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                });
        });
        
        // Valider les champs en temps réel
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }
});