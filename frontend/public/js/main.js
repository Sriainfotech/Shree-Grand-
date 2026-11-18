(function ($) {
    "use strict";

    // THEMEFOREST POINT 5: Cache window object
    var $window = $(window);

    // One Page Nav (Uncommented and made safe)
    if ($('.main-menu nav ul').length > 0) {
        var top_offset = $('.header-area').height() - 100;
        $('.main-menu nav ul').onePageNav({
            currentClass: 'active',
            scrollOffset: top_offset,
            filter: ':not([href="#"])' // Khali '#' wale links ko ignore karega
        });
    }

    // sticky (THEMEFOREST POINT 5: Cached selector)
    var $headerSticky = $("#header-sticky");
    if ($headerSticky.length > 0) {
        $window.on('scroll', function () {
            var scroll = $window.scrollTop();
            if (scroll < 200) {
                $headerSticky.removeClass("sticky-menu");
            } else {
                $headerSticky.addClass("sticky-menu");
            }
        });
    }

    // RESPONSIVE MENU
    var $mobileMenu = $('#mobile-menu');
    if ($('.responsive').length > 0 && $mobileMenu.length > 0) {
        $('.responsive').on('click', function (e) {
            $mobileMenu.slideToggle();
        });
    }

    // menu toggle
    if ($(".main-menu li a").length > 0) {
        $(".main-menu li a").on('click', function () {
            if ($window.width() < 1200 && $mobileMenu.length > 0) {
                $mobileMenu.slideUp();
            }
        });
    }

    // smoth scroll (Safety check added)
    var $smoothScroll = $('a.smoth-scroll');
    if ($smoothScroll.length > 0) {
        $smoothScroll.on('click', function (event) {
            var $anchor = $(this);
            var targetUrl = $anchor.attr('href');

            // Check if href is not empty and the target element actually exists
            if (targetUrl !== '#' && $(targetUrl).length > 0) {
                $('html, body').stop().animate({
                    scrollTop: $(targetUrl).offset().top - 100
                }, 1000);
            }
            event.preventDefault();
        });
    }

    // mainSlider (THEMEFOREST POINT 7: Length Check Added)
    var $basicSlider = $('.slider-active');
    if ($basicSlider.length > 0) {
        function mainSlider() {
            $basicSlider.on('init', function (e, slick) {
                var $firstAnimatingElements = $('.single-slider:first-child').find('[data-animation]');
                doAnimations($firstAnimatingElements);
            });
            $basicSlider.on('beforeChange', function (e, slick, currentSlide, nextSlide) {
                var $animatingElements = $('.single-slider[data-slick-index="' + nextSlide + '"]').find('[data-animation]');
                doAnimations($animatingElements);
            });
            $basicSlider.slick({
                autoplay: true,
                autoplaySpeed: 10000,
                dots: false,
                fade: true,
                arrows: true,
                prevArrow: '<button type="button" class="slick-prev"><i class="icon dripicons-chevron-left"></i></button>',
                nextArrow: '<button type="button" class="slick-next"><i class="icon dripicons-chevron-right"></i></button>',
                responsive: [
                    {
                        breakpoint: 1200,
                        settings: {
                            dots: false,
                            arrows: false
                        }
                    }
                ]
            });

            function doAnimations(elements) {
                var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                elements.each(function () {
                    var $this = $(this);
                    var $animationDelay = $this.data('delay');
                    var $animationType = 'animated ' + $this.data('animation');
                    $this.css({
                        'animation-delay': $animationDelay,
                        '-webkit-animation-delay': $animationDelay
                    });
                    $this.addClass($animationType).one(animationEndEvents, function () {
                        $this.removeClass($animationType);
                    });
                });
            }
        }
        mainSlider();
    }


    // services-active (THEMEFOREST POINT 7: Length Check Added)
    if ($('.services-active').length > 0) {
        $('.services-active').slick({
            dots: true,
            infinite: true,
            arrows: false,
            speed: 1000,
            slidesToShow: 3,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: { slidesToShow: 3, slidesToScroll: 1, infinite: true, dots: true }
                },
                {
                    breakpoint: 992,
                    settings: { slidesToShow: 2, slidesToScroll: 1 }
                },
                {
                    breakpoint: 767,
                    settings: { slidesToShow: 1, slidesToScroll: 1 }
                }
            ]
        });
    }


    // brand-active (THEMEFOREST POINT 7: Length Check Added)
    if ($('.brand-active').length > 0) {
        $('.brand-active').slick({
            dots: false,
            infinite: true,
            arrows: false,
            speed: 1000,
            slidesToShow: 6,
            slidesToScroll: 2,
            responsive: [
                { breakpoint: 1500, settings: { slidesToShow: 6, slidesToScroll: 3, infinite: true } },
                { breakpoint: 1200, settings: { slidesToShow: 5, slidesToScroll: 3, infinite: true } },
                { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 1 } },
                { breakpoint: 767, settings: { slidesToShow: 2, slidesToScroll: 1 } },
                { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
            ]
        });
    }

    // testimonial-active (THEMEFOREST POINT 7: Length Check Added)
    if ($('.testimonial-active').length > 0) {
        $('.testimonial-active').slick({
            dots: false,
            infinite: true,
            arrows: true,
            prevArrow: '<button type="button" class="slick-prev"><i class="icon dripicons-arrow-thin-left"></i></button>',
            nextArrow: '<button type="button" class="slick-next"><i class="icon dripicons-arrow-thin-right"></i></button>',
            speed: 1000,
            slidesToShow: 1,
            slidesToScroll: 1,
            responsive: [
                { breakpoint: 1024, settings: { slidesToShow: 1, slidesToScroll: 1, infinite: true } },
                { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
                { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
            ]
        });
    }

    // blog (THEMEFOREST POINT 7: Length Check Added)
    if ($('.blog-active').length > 0) {
        $('.blog-active').slick({
            dots: false,
            infinite: true,
            arrows: true,
            speed: 1500,
            slidesToShow: 1,
            slidesToScroll: 1,
            fade: true,
            prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-arrow-left"></i></button>',
            nextArrow: '<button type="button" class="slick-next"><i class="fas fa-arrow-right"></i></button>',
        });
    }

    // counterUp (Wapas add kiya gaya hai Safety check ke sath)
    if ($('.count').length > 0) {
        $('.count').counterUp({
            delay: 100,
            time: 1000
        });
    }

    /* magnificPopup img view */
    if ($('.popup-image').length > 0) {
        $('.popup-image').magnificPopup({
            type: 'image',
            gallery: { enabled: true }
        });
    }

    /* magnificPopup video view */
    if ($('.popup-video').length > 0) {
        $('.popup-video').magnificPopup({
            type: 'iframe'
        });
    }

    // paroller
    if ($('.paroller').length > 0) {
        $('.paroller').paroller();
    }

    //* Parallaxmouse js
    function parallaxMouse() {
        if ($('#parallax').length > 0) {
            var scene = document.getElementById('parallax');
            var parallax = new Parallax(scene);
        }
    }
    parallaxMouse();

    // service active
    var $singleService = $('.s-single-services');
    if ($singleService.length > 0) {
        $singleService.on('mouseenter', function () {
            $(this).addClass('active').parent().siblings().find('.s-single-services').removeClass('active');
        });
    }

    // scrollToTop
    $.scrollUp({
        scrollName: 'scrollUp',
        topDistance: '300',
        topSpeed: 300,
        animation: 'fade',
        animationInSpeed: 200,
        animationOutSpeed: 200,
        scrollText: '<i class="fas fa-level-up-alt"></i>',
        activeOverlay: false,
    });


    // isotop (Safety check added for grid and button filtering)
    var $gridWrapper = $('.grid');
    if ($gridWrapper.length > 0) {
        $gridWrapper.imagesLoaded(function () {
            // init Isotope
            var $grid = $gridWrapper.isotope({
                itemSelector: '.grid-item',
                percentPosition: true,
                masonry: {
                    // use outer width of grid-sizer for columnWidth
                    columnWidth: 1
                }
            });

            // filter items on button click
            $('.button-group').on('click', 'button', function () {
                var filterValue = $(this).attr('data-filter');
                if (filterValue) {
                    $grid.isotope({
                        filter: filterValue
                    });
                }
            });
        });
    }

    // typed js syntax fix (Safety check added for indexOf error)
    var $elementTyped = $(".element");
    if ($elementTyped.length > 0) {
        $elementTyped.each(function () {
            var a = $(this);
            var dataElements = a.attr("data-elements");

            // Code tabhi run hoga jab element mein data-elements attribute hoga
            if (dataElements) {
                a.typed({
                    strings: dataElements.split(","),
                    typeSpeed: 100,
                    backDelay: 3000
                });
            }
        });
    }

    //for menu active class
    if ($('.button-group > button').length > 0) {
        $('.button-group > button').on('click', function (event) {
            $(this).siblings('.active').removeClass('active');
            $(this).addClass('active');
            event.preventDefault();
        });
    }

    // WOW active
    if (typeof WOW !== 'undefined') {
        new WOW().init();
    }

})(jQuery);