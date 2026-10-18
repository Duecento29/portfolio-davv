document.addEventListener('DOMContentLoaded', () => {
    if(window.DAVV_MOBILE)return;
    const carouselContainer = document.querySelector('.carousel-container');
    const carouselSlide = document.querySelector('.carousel-slide');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const triggerElement = document.querySelector('[data-carousel-trigger]');
    
    // Create backdrop overlay
    const backdrop = document.createElement('div');
    backdrop.className = 'carousel-backdrop';
    if (carouselContainer) {
        carouselContainer.parentElement.insertBefore(backdrop, carouselContainer);
    }
    
    // Create and add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'carousel-close';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Close carousel');
    
    if (carouselContainer) {
        const header = document.createElement('div');
        header.className = 'carousel-header';
        const title = document.createElement('p');
        title.className = 'carousel-title';
        title.textContent = 'Gallery';
        header.appendChild(title);
        header.appendChild(closeBtn);
        carouselContainer.insertBefore(header, carouselContainer.firstChild);
    }

    let counter = 0;
    let size = carouselItems.length > 0 ? carouselItems[0].clientWidth : 0;

    function updateCarousel() {
        if (size > 0) {
            carouselSlide.style.transition = "transform 0.5s ease-in-out";
            carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
        }
    }

    function handleNext() {
        if (counter >= carouselItems.length - 1) {
            counter = 0;
        } else {
            counter++;
        }
        updateCarousel();
    }

    function handlePrev() {
        if (counter <= 0) {
            counter = carouselItems.length - 1;
        } else {
            counter--;
        }
        updateCarousel();
    }

    if(nextBtn && prevBtn) {
        nextBtn.addEventListener('click', handleNext);
        prevBtn.addEventListener('click', handlePrev);
    }

    // Function to close carousel
    function closeCarousel() {
        if (!carouselContainer) return;
        carouselContainer.classList.remove('active');
        backdrop.classList.remove('active');
        document.removeEventListener('mousedown', handleClickOutside);
    }

    // Function to open carousel
    function openCarousel() {
        if (!carouselContainer) return;
        counter = 0;
        // Snap to slide 0 with no animation BEFORE container becomes visible (prevents glimpse of previous slide)
        if (carouselSlide) { carouselSlide.style.transition = 'none'; carouselSlide.style.transform = 'translateX(0)'; }
        carouselContainer.classList.add('active');
        backdrop.classList.add('active');
        // Container is now visible — clientWidth is correct
        size = carouselItems.length > 0 ? carouselItems[0].clientWidth : 0;
        setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 0);
    }
    // Expose globally so SVG onclick handlers on other pages can call it
    window.openCarousel = openCarousel;

    if(triggerElement) {
        triggerElement.addEventListener('click', () => {
            if (carouselContainer.classList.contains('active')) {
                closeCarousel();
            } else {
                openCarousel();
            }
        });
    }

    // Close button click handler
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeCarousel();
    });

    // Backdrop click handler
    backdrop.addEventListener('mousedown', (e) => {
        if (e.target === backdrop) {
            closeCarousel();
        }
    });

    // Function to handle click outside carousel
    function handleClickOutside(event) {
        if (carouselContainer.classList.contains('active') && 
            !carouselContainer.contains(event.target) && 
            event.target !== backdrop) {
            closeCarousel();
        }
    }

    window.addEventListener('resize', () => {
        if (carouselItems.length > 0) {
            size = carouselItems[0].clientWidth;
            carouselSlide.style.transition = "none"; // Disable transition during resize
            updateCarousel();
        }
    });

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && carouselContainer?.classList.contains('active')) closeCarousel(); });

    // Set initial position
    updateCarousel();
});