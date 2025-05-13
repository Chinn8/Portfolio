// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeSwitch = document.getElementById('theme-switch');
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    body.classList.add(savedTheme);
    themeSwitch.checked = savedTheme === 'dark-theme';
    themeIcon.textContent = savedTheme === 'dark-theme' ? '☀️' : '🌙';

    // Theme switch event listener
    themeSwitch.addEventListener('change', () => {
        if (themeSwitch.checked) {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark-theme');
            themeIcon.textContent = '☀️';
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light-theme');
            themeIcon.textContent = '🌙';
        }
    });

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.contents');
    const navLinks = document.querySelectorAll('nav ul li a');
    const navItems = document.querySelectorAll('nav ul li');

    // Function to open the menu
    function openMenu() {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add animation delay to each menu item
        navItems.forEach((item, index) => {
            item.style.transitionDelay = `${0.1 + (index * 0.05)}s`;
        });
    }
    
    // Function to close the menu
    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Reset transition delays
        navItems.forEach(item => {
            item.style.transitionDelay = '0s';
        });
    }

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event from bubbling up
        
        if (this.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
    
    // Add touch swipe functionality for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Check if touch is supported
    if ('ontouchstart' in window) {
        document.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});
        
        document.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});
    }
    
    function handleSwipe() {
        // Swipe left (open menu)
        if (touchEndX < touchStartX - 100 && !navMenu.classList.contains('active')) {
            openMenu();
        }
        
        // Swipe right (close menu)
        if (touchEndX > touchStartX + 100 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = navMenu.contains(event.target) || 
                              hamburger.contains(event.target) ||
                              event.target.closest('.theme-toggle');

        if (!isClickInside && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close menu on window resize if it's open
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMenu();
        }
        
        // Reset body overflow when switching to desktop view
        if (window.innerWidth > 768) {
            document.body.style.overflow = 'auto';
        }
    });
    
    // Add escape key functionality to close menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Add backdrop click to close menu (for better mobile UX)
    document.addEventListener('touchstart', function(e) {
        if (navMenu.classList.contains('active')) {
            const touchX = e.touches[0].clientX;
            // If touch is on the left side of the screen (backdrop area)
            if (touchX < window.innerWidth * 0.2 && window.innerWidth > 576) {
                closeMenu();
            }
        }
    }, {passive: true});

    // Add active class to nav links based on scroll position
    const sections = document.querySelectorAll('section');
    
    function setActiveNavLink() {
        let scrollPosition = window.scrollY + 100;
        let currentActive = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const id = section.getAttribute('id');
                currentActive = id;
            }
        });
        
        // Only update if we found an active section
        if (currentActive) {
            document.querySelectorAll('nav ul li a').forEach(link => {
                link.classList.remove('active-link');
                if (link.getAttribute('href') === '#' + currentActive) {
                    link.classList.add('active-link');
                }
            });
        }
    }
    
    // Initial call to highlight the active section
    setActiveNavLink();
    
    // Update active link on scroll with throttling for better performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                setActiveNavLink();
                scrollTimeout = null;
            }, 100);
        }
    });
    
    // Add smooth scrolling to all navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for navbar height
                    behavior: 'smooth'
                });
            }
        });
    });
});
