// 導航欄滾動效果
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// 平滑滾動
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollBy({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// 滾動顯示動畫
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// 監聽所有需要動畫的元素
document.querySelectorAll('.service-item, .portfolio-item, .contact-info, .contact-form').forEach((el) => {
    observer.observe(el);
});

// 作品集輪播功能
class PortfolioSlider {
    constructor() {
        this.slider = document.querySelector('.portfolio-grid');
        this.items = document.querySelectorAll('.portfolio-item');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.dotsContainer = document.querySelector('.slider-dots');
        
        this.currentIndex = 0;
        this.itemWidth = this.items[0].offsetWidth;
        this.itemsPerView = window.innerWidth > 768 ? 3 : 1;
        this.maxIndex = Math.max(0, this.items.length - this.itemsPerView);
        
        this.init();
    }

    init() {
        // 創建導航點
        this.items.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });

        // 添加按鈕事件
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());

        // 自動輪播
        this.startAutoPlay();

        // 響應式處理
        window.addEventListener('resize', () => {
            this.itemWidth = this.items[0].offsetWidth;
            this.itemsPerView = window.innerWidth > 768 ? 3 : 1;
            this.maxIndex = Math.max(0, this.items.length - this.itemsPerView);
            this.updateSliderPosition();
        });

        let touchStartX = 0;
        let touchEndX = 0;

        this.slider.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        this.slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) {
                this.next();
            } else if (touchEndX - touchStartX > 50) {
                this.prev();
            }
        });
    }

    updateSliderPosition() {
        this.slider.style.transform = `translateX(-${this.currentIndex * this.itemWidth}px)`;
        
        // 更新導航點
        const dots = this.dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    goToSlide(index) {
        this.currentIndex = Math.min(Math.max(0, index), this.maxIndex);
        this.updateSliderPosition();
    }

    prev() {
        this.goToSlide(this.currentIndex - 1);
    }

    next() {
        this.goToSlide(this.currentIndex + 1);
    }

    startAutoPlay() {
        setInterval(() => {
            if (this.currentIndex >= this.maxIndex) {
                this.currentIndex = 0;
            } else {
                this.currentIndex++;
            }
            this.updateSliderPosition();
        }, 5000); // 每5秒切換一次
    }
}

// 初始化輪播
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioSlider();
}); 