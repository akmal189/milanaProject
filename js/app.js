document.addEventListener('DOMContentLoaded', () => {
    const IsMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const lenis = new Lenis({
        // параметры настройки
        lerp: 0.08, // коэффициент сглаживания (0 - 1)
        smooth: true, // включить плавный скролл
        direction: 'vertical', // направление скролла (vertical or horizontal)
        smoothWheel: true, // плавный скролл колесом мыши
        smoothTouch: false, // плавный скролл при касании (mobile)
        infinite: false // бесконечный скролл
    })

    

    const headerLogo = document.querySelector('.site-header__logo');

    if(headerLogo) {
        headerLogo.classList.add('active')
    }


    const faqBlock = document.querySelector('.faq-block');
    

    if(faqBlock) {
        faqBlock.querySelectorAll('.faq-block__item').forEach((item) => {
            item.querySelector('.faq-block__item-title a').addEventListener('click', () => {
                const $this = item.querySelector('.faq-block__item-title a');
                const $body = item.querySelector('.faq-block__item-body');

                $this.classList.toggle('active');
                $body.classList.toggle('active');

                setTimeout(() => {
                    lenis.resize();
                }, 500)
            })
        })
    }

    const burgerBtn = document.querySelector('.site-header__burger-btn a');
    const burgerCloser = document.querySelector('.burger-menu__closer a');
    const burgerMenu = document.querySelector('.burger-menu');
    const headerMenu = document.querySelector('.site-header__menu nav');
    const burgerMenuInner = burgerMenu.querySelector('.burger-menu__inner');

    function isMobileView() {
        return window.innerWidth <= 1260 || (typeof IsMobile !== 'undefined' && IsMobile);
    }

    function updateMenuPosition() {
        if (isMobileView()) {
            if (!burgerMenuInner.contains(headerMenu)) {
                burgerMenuInner.appendChild(headerMenu);
            }
        } else {
            const headerContainer = document.querySelector('.site-header__menu');
            if (!headerContainer.contains(headerMenu)) {
                headerContainer.appendChild(headerMenu);
            }
            burgerMenu.classList.remove('opened');
            document.querySelector('html').classList.remove('overflow_hidden');
        }
    }

    updateMenuPosition();

    burgerBtn.addEventListener('click', (e) => {
        burgerMenu.classList.toggle('opened');
        document.querySelector('html').classList.toggle('overflow_hidden');
    });

    burgerCloser.addEventListener('click', (e) => {
        burgerMenu.classList.remove('opened');
        document.querySelector('html').classList.remove('overflow_hidden');
    });

    document.addEventListener('click', (e) => {
        if (burgerMenu.classList.contains('opened') &&
            !burgerMenuInner.contains(e.target) &&
            e.target !== burgerBtn) {
            burgerMenu.classList.remove('opened');
            document.querySelector('html').classList.remove('overflow_hidden');
        }
    });

    window.addEventListener('resize', updateMenuPosition);

    gsap.registerPlugin(ScrollTrigger);

    const items = document.querySelectorAll('.site-header__menu li, .hero-section__tags-item, .projects-block__item, .prices-block__item, .block-title, .faq-block__item, section');

    const groups = new Map();
	
	items.forEach((item) => {
	    const parent = item.parentElement;
	    if (!groups.has(parent)) {
	        groups.set(parent, []);
	    }
	    groups.get(parent).push(item);
	});
	
	const isMobile = window.innerWidth <= 768;
	
	groups.forEach((groupItems) => {
	    groupItems.forEach((item, index) => {
	        gsap.fromTo(item,
	            {
	                opacity: 0,
	                y: 30
	            },
	            {
	                opacity: 1,
	                y: 0,
	                scrollTrigger: {
	                    trigger: item.parentElement,
	                    start: isMobile ? "top 110%" : "top 95%",
	                },
	                duration: 1,
	                delay: index * 0.20
	            }
	        );
	    });
	});

    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href')

            // если это просто #
            if (!href || href === '#') return

            const targetId = href.split('#')[1]
            const target = document.getElementById(targetId)

            if (target) {
                e.preventDefault()

                document.querySelector('.burger-menu').classList.remove('opened');
                document.querySelector('html').classList.remove('overflow_hidden');

                lenis.scrollTo(target, {
                    offset: -70,
                    duration: 1.2,
                    easing: (t) => 1 - Math.pow(1 - t, 3)
                })
            }
        })
    })

    function getTextColor(bgColor) {
        // убираем # если есть
        const color = bgColor.replace('#', '');

        // парсим RGB
        const r = parseInt(color.substring(0, 2), 16);
        const g = parseInt(color.substring(2, 4), 16);
        const b = parseInt(color.substring(4, 6), 16);

        // считаем яркость (perceived luminance)
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b);

        // возвращаем цвет текста
        return luminance > 186 ? '#323232' : '#F2F3ED';
    }

    const priceBlock = document.querySelector('.prices-block');

    if(priceBlock) {
        priceBlock.querySelectorAll('.prices-block__item').forEach((item) => {
            const textColor = getTextColor(item.dataset.color);

            item.querySelector('.prices-block__item-title').style.color = textColor;
            item.querySelectorAll('.price-item').forEach((el) => el.style.color = textColor);
            item.querySelectorAll('.price-item__delim').forEach((el) => el.style.borderImage = `
                repeating-linear-gradient(
                    to right,
                    ${textColor} 0,
                    ${textColor} 1px,
                    transparent 1px,
                    transparent 6px
                ) 1
            `)
        })
    }

    function appendTags() {
        const tagsBlock = document.querySelector('.hero-section__tags');

        if(tagsBlock) {
            if(IsMobile && window.innerWidth <= 980) {
                document.querySelector('.hero-section').append(tagsBlock);
            } else {
                document.querySelector('.hero-section__right').append(tagsBlock);
            }
        }
    }
    appendTags();

    window.addEventListener('resize', appendTags);

    let pricesSwiper = null;

    const pricesSlider = () => {
        const pricesBlockSlider = document.querySelector('.prices-block');

        if (!pricesBlockSlider) return;
        if (window.innerWidth <= 980) {
            if (!pricesSwiper) {
                pricesSwiper = new Swiper('.prices-block .swiper', {
                    slidesPerView: 1.1,
                    effect: 'slide',
                    speed: 1000,
                    spaceBetween: 20,
                    lazy: {
                        loadPrevNext: true,
                        loadPrevNextAmount: 2
                    },
                    autoplay: {
                        delay: 999999,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    },
                    pagination: {
                        el: '.prices-block__slider-nav .swiper-pagination',
                        clickable: true,
                    }
                });
            }

        } else {
            if (pricesSwiper) {
                pricesSwiper.destroy(true, true);
                pricesSwiper = null;
            }
        }
    };

    pricesSlider();
    window.addEventListener('resize', pricesSlider);

    // запуск анимации скролла
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    requestAnimationFrame(() => {
        let height = document.body.scrollHeight;
        document.body.style.height = height + 'px';
    });
})