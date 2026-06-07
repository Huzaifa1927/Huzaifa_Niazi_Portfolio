(function () {
    const typingText = document.getElementById('typing-text');
    const messages = ['Junior Software Developer', 'Web Developer', 'Problem Solver'];
    const typingDelay = 50;
    const erasingDelay = 40;
    const pauseDelay = 1000;
    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingTimeoutId = null;

    const navMenu = document.getElementById('navMenu');
    const hamburgerButton = document.querySelector('.hamburger');
    const backToTop = document.getElementById('backToTop');
    const projectModal = document.getElementById('projectModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.querySelector('.modal-close');
    const demoBtn = document.getElementById('demoBtn');
    const codeBtn = document.getElementById('codeBtn');
    const cardsContainer = document.getElementById('custom-cards');
    const skillsSection = document.getElementById('skills');

    const projectCards = cardsContainer ? Array.from(cardsContainer.querySelectorAll('.card-cover')) : [];
    const projectData = [
    { 
        image: './images/project 1.png', 
        demo: 'https://huzaifa1927.github.io/frubs-website-ui-clone/',
        code: 'https://github.com/Huzaifa1927/frubs-website-ui-clone'
    },
    { 
        image: './images/project 2.png', 
        demo: 'https://huzaifa1927.github.io/Zubbery-Clone/',
        code: 'https://github.com/Huzaifa1927/Zubbery-Clone'
    },
    { 
        image: './images/project 3.png', 
        demo: 'https://huzaifa1927.github.io/edu',
        code: 'https://github.com/huzaifa1927/edu'
    }
];

    function typeEffect() {
        if (!typingText) return;
        const currentMessage = messages[messageIndex];

        if (!isDeleting) {
            typingText.textContent = currentMessage.slice(0, charIndex + 1);
            charIndex += 1;
            if (charIndex === currentMessage.length) {
                isDeleting = true;
                typingTimeoutId = window.setTimeout(typeEffect, pauseDelay);
                return;
            }
        } else {
            typingText.textContent = currentMessage.slice(0, charIndex - 1);
            charIndex -= 1;
            if (charIndex === 0) {
                isDeleting = false;
                messageIndex = (messageIndex + 1) % messages.length;
                typingTimeoutId = window.setTimeout(typeEffect, typingDelay);
                return;
            }
        }

        typingTimeoutId = window.setTimeout(typeEffect, isDeleting ? erasingDelay : typingDelay);
    }

    function isValidProjectLink(link) {
        return Boolean(link && typeof link === 'string' && !link.startsWith('#') && !link.startsWith('javascript:'));
    }

    function setModalLinks(index) {
        const project = projectData[index] || {};
        const demoEnabled = isValidProjectLink(project.demo);
        const codeEnabled = isValidProjectLink(project.code);

        if (demoBtn) {
            demoBtn.href = demoEnabled ? project.demo : '#';
            demoBtn.classList.toggle('disabled', !demoEnabled);
            demoBtn.setAttribute('aria-disabled', String(!demoEnabled));
        }

        if (codeBtn) {
            codeBtn.href = codeEnabled ? project.code : '#';
            codeBtn.classList.toggle('disabled', !codeEnabled);
            codeBtn.setAttribute('aria-disabled', String(!codeEnabled));
        }
    }

    function openProjectModal(index) {
        const project = projectData[index];
        if (!project || !projectModal || !modalImage) return;
        modalImage.src = project.image;
        setModalLinks(index);
        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeProjectModal() {
        if (!projectModal) return;
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateBackToTop() {
        if (!backToTop) return;
        backToTop.classList.toggle('show', window.scrollY > 400);
    }

    let isScrollTicking = false;
    function onScroll() {
        if (isScrollTicking) return;
        isScrollTicking = true;
        window.requestAnimationFrame(() => {
            updateBackToTop();
            isScrollTicking = false;
        });
    }

    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.setProperty('--tx', `${Math.random() * 100 - 50}px`);
        sparkle.style.setProperty('--ty', `${Math.random() * 100 - 50}px`);
        document.body.appendChild(sparkle);
        window.setTimeout(() => sparkle.remove(), 800);
    }

    function handleDocumentClick(event) {
        const { clientX, clientY } = event;
        for (let i = 0; i < 6; i += 1) {
            createSparkle(clientX, clientY);
        }
    }

    function handleProjectActionClick(event) {
        const actionLink = event.target.closest('[data-action]');
        if (!actionLink || !cardsContainer?.contains(actionLink)) return;
        event.preventDefault();
        event.stopPropagation();

        const index = Number(actionLink.dataset.index);
        if (!Number.isInteger(index) || index < 0) return;

        openProjectModal(index);
    }

    function handleCardClick(event) {
        if (!cardsContainer) return;
        if (event.target.closest('[data-action]')) return;
        const card = event.target.closest('.card-cover');
        if (!card || !cardsContainer.contains(card)) return;

        const index = projectCards.indexOf(card);
        if (index >= 0) openProjectModal(index);
    }

    function handleActionClick(event) {
        const target = event.currentTarget;
        if (target.classList.contains('disabled')) {
            event.preventDefault();
        }
    }

    function handleModalBackdropClick(event) {
        if (event.target === projectModal) closeProjectModal();
    }

    function initTouchSupport() {
        if (!skillsSection) return;

        skillsSection.addEventListener('touchstart', (event) => {
            const card = event.target.closest('.skill-card');
            if (!card) return;
            card.classList.add('touched');
            window.clearTimeout(card._touchTimer);
            card._touchTimer = window.setTimeout(() => card.classList.remove('touched'), 1200);
        }, { passive: true });

        skillsSection.addEventListener('touchend', (event) => {
            const card = event.target.closest('.skill-card');
            if (!card) return;
            window.clearTimeout(card._touchTimer);
            card._touchTimer = window.setTimeout(() => card.classList.remove('touched'), 700);
        });
    }

    function init() {
        if (typingText) typeEffect();

        if (hamburgerButton && navMenu) {
            hamburgerButton.addEventListener('click', () => navMenu.classList.toggle('show-mobile'));
        }

        if (backToTop) {
            backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
            window.addEventListener('scroll', onScroll, { passive: true });
            updateBackToTop();
        }

        document.body.addEventListener('click', handleDocumentClick);

        if (cardsContainer) {
            cardsContainer.addEventListener('click', handleProjectActionClick);
            cardsContainer.addEventListener('click', handleCardClick);
        }

        if (modalClose) modalClose.addEventListener('click', closeProjectModal);
        if (projectModal) projectModal.addEventListener('click', handleModalBackdropClick);

        if (demoBtn) demoBtn.addEventListener('click', handleActionClick);
        if (codeBtn) codeBtn.addEventListener('click', handleActionClick);

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && projectModal?.classList.contains('active')) {
                closeProjectModal();
            }
        });

        initTouchSupport();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();