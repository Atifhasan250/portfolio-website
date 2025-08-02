// Carousel functionality for projects section
class Carousel {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector('.carousel-track');
        this.slides = container.querySelectorAll('.project-card');
        this.prevBtn = container.querySelector('.carousel-btn-prev');
        this.nextBtn = container.querySelector('.carousel-btn-next');
        this.dotsContainer = container.querySelector('.carousel-dots');
        
        this.currentIndex = 0;
        this.slideWidth = 320 + 24; // slide width + gap
        this.visibleSlides = this.getVisibleSlides();
        
        this.init();
    }
    
    init() {
        this.createDots();
        this.addEventListeners();
        this.updateCarousel();
        this.handleResize();
    }
    
    getVisibleSlides() {
        const containerWidth = this.container.offsetWidth;
        if (containerWidth < 768) return 1;
        if (containerWidth < 1024) return 2;
        return 3;
    }
    
    createDots() {
        if (!this.dotsContainer) return;
        
        this.dotsContainer.innerHTML = '';
        const totalDots = Math.max(1, this.slides.length - this.visibleSlides + 1);
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }
    
    addEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Touch/swipe support
        let startX = 0;
        let endX = 0;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
        
        // Mouse drag support
        let isDragging = false;
        let startMouseX = 0;
        let endMouseX = 0;
        
        this.track.addEventListener('mousedown', (e) => {
            isDragging = true;
            startMouseX = e.clientX;
            this.track.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });
        
        document.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            endMouseX = e.clientX;
            this.track.style.cursor = 'grab';
            this.handleSwipe(startMouseX, endMouseX);
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    handleResize() {
        window.addEventListener('resize', debounce(() => {
            this.visibleSlides = this.getVisibleSlides();
            this.createDots();
            this.updateCarousel();
        }, 250));
    }
    
    prevSlide() {
        this.currentIndex = Math.max(0, this.currentIndex - 1);
        this.updateCarousel();
    }
    
    nextSlide() {
        const maxIndex = Math.max(0, this.slides.length - this.visibleSlides);
        this.currentIndex = Math.min(maxIndex, this.currentIndex + 1);
        this.updateCarousel();
    }
    
    goToSlide(index) {
        const maxIndex = Math.max(0, this.slides.length - this.visibleSlides);
        this.currentIndex = Math.min(maxIndex, Math.max(0, index));
        this.updateCarousel();
    }
    
    updateCarousel() {
        if (!this.track) return;
        
        const translateX = -this.currentIndex * this.slideWidth;
        this.track.style.transform = `translateX(${translateX}px)`;
        
        // Update dots
        const dots = this.dotsContainer?.querySelectorAll('.carousel-dot');
        dots?.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
        
        // Update button states
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
            this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
        }
        
        if (this.nextBtn) {
            const maxIndex = Math.max(0, this.slides.length - this.visibleSlides);
            this.nextBtn.disabled = this.currentIndex >= maxIndex;
            this.nextBtn.style.opacity = this.currentIndex >= maxIndex ? '0.5' : '1';
        }
    }
    
    // Auto-play functionality
    startAutoPlay(interval = 5000) {
        this.autoPlayInterval = setInterval(() => {
            const maxIndex = Math.max(0, this.slides.length - this.visibleSlides);
            if (this.currentIndex >= maxIndex) {
                this.currentIndex = 0;
            } else {
                this.nextSlide();
            }
        }, interval);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
    
    // Pause auto-play on hover
    pauseOnHover() {
        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        const carousel = new Carousel(carouselContainer);
        
        // Enable auto-play with pause on hover
        carousel.startAutoPlay(6000);
        carousel.pauseOnHover();
        
        // Pause auto-play when user interacts
        const interactionEvents = ['click', 'touchstart', 'keydown'];
        interactionEvents.forEach(event => {
            carouselContainer.addEventListener(event, () => {
                carousel.stopAutoPlay();
                // Resume after 10 seconds of inactivity
                setTimeout(() => carousel.startAutoPlay(6000), 10000);
            });
        });
    }
});

// Utility function for debouncing (if not already defined)
if (typeof debounce === 'undefined') {
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}