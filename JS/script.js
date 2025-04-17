document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");
    const navElement = document.querySelector(".nav-header nav");

    // Gestion du header fixe lors du défilement
    window.addEventListener("scroll", function() {
        if (window.scrollY > 100) {
            navElement.classList.add("fixed");
        } else {
            navElement.classList.remove("fixed");
        }
    });

    // Ajouter un comportement de défilement fluide pour les liens de navigation internes
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Vérifier si le lien pointe vers une ancre sur la page actuelle
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                
                // Retirer la classe active de tous les liens de navigation
                navLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                });
                
                // Ajouter la classe active au lien cliqué
                this.classList.add('active');
                
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    // Calculer un décalage pour afficher le titre correctement
                    // Tenir compte de la hauteur du header fixe + un espace supplémentaire
                    const headerHeight = navElement.offsetHeight;
                    const offset = headerHeight + 50; // 50px d'espace supplémentaire
                    
                    window.scrollTo({
                        top: targetSection.offsetTop - offset,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Ajouter un défilement fluide pour tous les liens qui pointent vers la section contact (sauf ceux de la navigation)
    document.querySelectorAll('a[href="#contact"]:not(.nav-link)').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = document.querySelector('#contact');
            if (targetSection) {
                // Calculer un décalage pour afficher le titre correctement
                const headerHeight = navElement.offsetHeight;
                const offset = headerHeight + 50; // 50px d'espace supplémentaire
                
                window.scrollTo({
                    top: targetSection.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mettre à jour la classe active lors du défilement
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            console.log(entry)
            if (entry.isIntersecting) {
                console.log(entry);
                navLinks.forEach(link => {
                    if (link.getAttribute("href") === `#${entry.target.id}`) {
                        // Retirer la classe active de tous les liens de navigation
                        navLinks.forEach(navLink => {
                            navLink.classList.remove('active');
                        });
                        // Ajouter la classe active au lien correspondant à la section visible
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.1, rootMargin: "-5% 0px -5% 0px" });

    sections.forEach(section => observer.observe(section));

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

    // Initialize Typed.js for the main title - on ne l'initialise pas ici mais dans updatePageContent
    // pour éviter la double initialisation
    const typingElement = document.querySelector('.typing-title');

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

    // Observe the about section to trigger the quote animation when it enters the viewport
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const quoteElement = document.querySelector('.quote-text');
                if (quoteElement && !quoteElement.hasAttribute('data-typed-initialized')) {
                    // Clear existing content for Typed.js to work properly
                    quoteElement.innerHTML = '';
                    // Get the quote in the current language
                    const quoteText = translations[currentLang]?.quote || translations['fr'].quote;
                    // Update the strings in the options
                    quoteTypingOptions.strings = [quoteText];
                    // Start the typing animation for the quote and store the instance
                    quoteElement._typed = new Typed(quoteElement, quoteTypingOptions);
                    // Mark the element as initialized to prevent re-initialization
                    quoteElement.setAttribute('data-typed-initialized', 'true');
                }
            }
        });
    }, { threshold: 0.2 });

    // Observe the about section
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        aboutObserver.observe(aboutSection);
    }

    // Language toggle functionality
    const langDropdown = document.querySelector('.lang-dropdown');
    const langToggle = document.querySelector('.lang-toggle');
    const langMenu = document.querySelector('.lang-menu');
    const langOptions = document.querySelectorAll('.lang-option');
    const langFlags = document.querySelectorAll('.lang-flag');
    
    // Détecter la langue du navigateur ou utiliser la langue enregistrée
    const getBrowserLanguage = () => {
        // Vérifier d'abord l'URL pour détecter la langue (priorité la plus haute)
        const path = window.location.pathname;
        if (path.endsWith('/EN')) {
            return 'en';
        } else if (path.endsWith('/ES')) {
            return 'es';
        } else if (path.endsWith('/PT')) {
            return 'pt';
        }
        
        // Ensuite vérifier si une langue est enregistrée dans le localStorage
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang) {
            return savedLang;
        }
        
        // En dernier recours, utiliser la langue du navigateur
        const browserLang = navigator.language || navigator.userLanguage;
        console.log(navigator.language);
        // Extraire juste le code de langue principal (avant le tiret s'il y en a un)
        const langCode = browserLang.split('-')[0].toLowerCase();
        
        // Vérifier si la langue est supportée, sinon utiliser le français par défaut
        const supportedLangs = ['fr', 'en', 'es', 'pt'];
        return supportedLangs.includes(langCode) ? langCode : 'fr';
    };
    
    // Définir la langue par défaut en fonction de la langue du navigateur ou la langue enregistrée
    let currentLang = getBrowserLanguage();
    
    // Fonction pour sauvegarder la langue préférée dans le localStorage
    const savePreferredLanguage = (lang) => {
        localStorage.setItem('preferredLanguage', lang);
    };
    
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
        
        // Mettre à jour les éléments de texte traduits
        updatePageContent(lang);
    };
    
    // Fonction pour mettre à jour l'URL en fonction de la langue
    const updateUrlForLanguage = (lang) => {
        const currentPath = window.location.pathname;
        let newPath;
        
        // Supprimer d'abord tous les suffixes de langue existants
        let basePath = currentPath;
        if (basePath.endsWith('/EN')) {
            basePath = basePath.substring(0, basePath.length - 3);
        } else if (basePath.endsWith('/ES')) {
            basePath = basePath.substring(0, basePath.length - 3);
        } else if (basePath.endsWith('/PT')) {
            basePath = basePath.substring(0, basePath.length - 3);
        }
        
        // Si c'est le français, utiliser simplement le chemin de base (sans suffixe)
        if (lang === 'fr') {
            // Pour le français, on veut simplement '/' ou le chemin de base sans suffixe
            // Vérifier si on est sur la page d'accueil
            if (basePath === '' || basePath === '/') {
                newPath = '/';
            } else {
                // Pour les autres pages (si applicable)
                newPath = basePath;
            }
        } else if (lang === 'en') {
            // Si l'URL se termine par un slash, ajouter juste "EN"
            if (basePath.endsWith('/')) {
                newPath = basePath + 'EN';
            } else {
                newPath = basePath + '/EN';
            }
        } else if (lang === 'es') {
            // Si l'URL se termine par un slash, ajouter juste "ES"
            if (basePath.endsWith('/')) {
                newPath = basePath + 'ES';
            } else {
                newPath = basePath + '/ES';
            }
        } else if (lang === 'pt') {
            // Si l'URL se termine par un slash, ajouter juste "PT"
            if (basePath.endsWith('/')) {
                newPath = basePath + 'PT';
            } else {
                newPath = basePath + '/PT';
            }
        } else {
            // Pour les autres langues non prévues, utiliser le chemin de base
            newPath = basePath;
        }
        
        // Si le nouveau chemin est différent du chemin actuel, mettre à jour l'URL
        if (newPath !== currentPath) {
            // Mettre à jour l'URL sans recharger la page
            window.history.pushState({ lang: lang }, '', newPath);
        }
    };
    
    // Fonction pour mettre à jour le contenu de la page en fonction de la langue
    const updatePageContent = (lang) => {
        // Parcourir tous les éléments avec un attribut data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                // Vérifier si c'est un bouton avec un span à l'intérieur
                if (element.classList.contains('cta-button') || element.classList.contains('card-button')) {
                    const spanElement = element.querySelector('span');
                    if (spanElement) {
                        spanElement.innerHTML = translations[lang][key];
                    } else {
                        element.innerHTML = translations[lang][key];
                    }
                } else {
                    element.innerHTML = translations[lang][key];
                }
            }
        });
        
        // Mettre à jour les listes
        // Liste Communication proactive
        const proactiveList = document.querySelector('.left-column ul');
        if (proactiveList && translations[lang] && translations[lang].proactive_list) {
            proactiveList.innerHTML = '';
            translations[lang].proactive_list.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = item;
                proactiveList.appendChild(li);
            });
        }
        
        // Liste Communication de crise
        const crisisList = document.querySelector('.right-column ul');
        if (crisisList && translations[lang] && translations[lang].crisis_list) {
            crisisList.innerHTML = '';
            translations[lang].crisis_list.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = item;
                crisisList.appendChild(li);
            });
        }
        
        // Mettre à jour les placeholders des champs de formulaire
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) {
                element.placeholder = translations[lang][key];
            }
        });
        
        // Mettre à jour l'animation Typed.js pour le titre principal
        if (typingElement) {
            const typingText = translations[lang]?.main_title || translations['fr'].main_title;
            
            // Supprimer l'instance existante si elle existe
            if (typingElement._typed) {
                typingElement._typed.destroy();
            }
            
            // S'assurer que tous les curseurs existants sont supprimés avant de créer une nouvelle instance
            const cursors = document.querySelectorAll('.typed-cursor');
            cursors.forEach(cursor => {
                cursor.remove();
            });
            
            // Créer une nouvelle instance avec le texte traduit
            typingElement._typed = new Typed(typingElement, {
                strings: [typingText],
                typeSpeed: 50,
                backSpeed: 0,
                startDelay: 300,
                loop: false,
                showCursor: false,
                cursorChar: '|',
                autoInsertCss: true
            });
        }
        
        // Reset the quote initialization flag when language changes
        const quoteElement = document.querySelector('.quote-text');
        if (quoteElement) {
            // Si une animation Typed.js est en cours pour la citation, on la détruit proprement
            if (quoteElement._typed) {
                quoteElement._typed.destroy();
            }
            
            quoteElement.removeAttribute('data-typed-initialized');
            quoteElement.innerHTML = '';
            
            // Réinitialiser l'animation de la citation si la section about est visible
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                // Vérifier si la section about est actuellement visible à l'écran
                const rect = aboutSection.getBoundingClientRect();
                const isVisible = 
                    rect.top < window.innerHeight && 
                    rect.bottom > 0;
                
                if (isVisible) {
                    // Obtenir le texte de la citation dans la langue actuelle
                    const quoteText = translations[lang]?.quote || translations['fr'].quote;
                    // Mettre à jour les chaînes dans les options
                    const quoteTypingOptions = {
                        strings: [quoteText],
                        typeSpeed: 30,
                        backSpeed: 30,
                        startDelay: 100,
                        backDelay: 1500,
                        loop: false,
                        showCursor: false,
                        autoInsertCss: true
                    };
                    // Démarrer l'animation de la citation et stocker l'instance pour pouvoir la détruire si nécessaire
                    quoteElement._typed = new Typed(quoteElement, quoteTypingOptions);
                    // Marquer l'élément comme initialisé
                    quoteElement.setAttribute('data-typed-initialized', 'true');
                }
            }
        }
    };
    
    // Initialiser l'interface avec la langue détectée
    updateUIForLanguage(currentLang);
    
    // Vérifier si l'URL doit être mise à jour pour correspondre à la langue actuelle
    const path = window.location.pathname;
    const urlHasLangSuffix = path.endsWith('/EN') || path.endsWith('/ES') || path.endsWith('/PT');
    
    // Si l'URL a un suffixe de langue qui ne correspond pas à la langue actuelle
    // OU si l'URL n'a pas de suffixe mais que la langue actuelle n'est pas le français
    if ((urlHasLangSuffix && 
         ((path.endsWith('/EN') && currentLang !== 'en') || 
          (path.endsWith('/ES') && currentLang !== 'es') || 
          (path.endsWith('/PT') && currentLang !== 'pt'))) || 
        (!urlHasLangSuffix && (currentLang === 'en' || currentLang === 'es' || currentLang === 'pt'))) {
        updateUrlForLanguage(currentLang);
    }
    
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
            
            // Mettre à jour l'URL en fonction de la langue sélectionnée (avant de sauvegarder dans localStorage)
            updateUrlForLanguage(currentLang);
            
            // Sauvegarder la langue sélectionnée comme préférence
            savePreferredLanguage(currentLang);
            
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
            
            // Mettre à jour l'URL en fonction de la langue sélectionnée (avant de sauvegarder dans localStorage)
            updateUrlForLanguage(currentLang);
            
            // Sauvegarder la langue sélectionnée comme préférence
            savePreferredLanguage(currentLang);
            
            // Mettre à jour l'interface
            updateUIForLanguage(currentLang);
            
            // Update class on body
            document.body.setAttribute('data-lang', currentLang);
            
            // Close menu immediately if not in burger menu
            langMenu.classList.remove('active');
            
            // Here you would add code to change the website content based on the selected language
            console.log(`Language changed to: ${currentLang} (from burger menu)`);
            
            // Ne pas fermer le menu burger si on change pour le français
            if (selectedLang !== 'fr') {
                // Fermer le menu burger
                hamburgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
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
            emailjs.send('service_auqmn2q', 'template_qlp9omd', formData)
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