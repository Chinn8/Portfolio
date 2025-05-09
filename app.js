// Improved Menu Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Custom cursor elements
    const cursor = document.createElement('div');
    const cursorFollower = document.createElement('div');
    cursor.className = 'cursor';
    cursorFollower.className = 'cursor-follower';
    document.body.appendChild(cursor);
    document.body.appendChild(cursorFollower);

    // Custom cursor movement
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        // Add slight delay to follower for smooth effect
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 50);
    });

    // Cursor effects on hover
    document.querySelectorAll('a, button, .hamburger').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursorFollower.style.transform = 'scale(0.5)';
        });

        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
        });
    });

    // Enhanced menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.contents');
    const navLinks = document.querySelectorAll('nav ul li a');
    const menuWidth = 250; // Width of the menu in pixels

    // Variables for drag functionality
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let lastTouch = 0;
    
    // Function to open menu
    function openMenu() {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        navMenu.style.transform = 'translateX(0)';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    }
    
    // Function to close menu
    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        navMenu.style.transform = `translateX(${menuWidth}px)`;
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent event bubbling
        
        if (navMenu.classList.contains('active')) {
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

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = navMenu.contains(event.target) || hamburger.contains(event.target);
        
        if (!isClickInside && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Mouse drag functionality for desktop
    navMenu.addEventListener('mousedown', (e) => {
        if (window.innerWidth <= 768) { // Only enable dragging on mobile/tablet sizes
            isDragging = true;
            startX = e.clientX;
            currentX = startX;
            navMenu.style.transition = 'none';
            
            // Prevent default to avoid text selection during drag
            e.preventDefault();
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        currentX = e.clientX;
        const diff = currentX - startX;
        
        // Calculate the new position (constrained to prevent dragging too far)
        // For right-side menu, we need to ensure it doesn't go beyond the right edge
        let newPosition = Math.min(0, Math.max(-menuWidth, diff));
        
        // Apply the transform
        navMenu.style.transform = `translateX(${newPosition}px)`;
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        
        isDragging = false;
        navMenu.style.transition = 'transform 0.3s ease';
        
        // Determine if menu should open or close based on drag distance
        const diff = currentX - startX;
        const threshold = menuWidth / 3;
        
        if (Math.abs(diff) > threshold) {
            // If dragged more than threshold, toggle menu state
            if (diff < 0) {
                closeMenu();
            } else {
                openMenu();
            }
        } else {
            // If dragged less than threshold, revert to original state
            if (navMenu.classList.contains('active')) {
                openMenu();
            } else {
                closeMenu();
            }
        }
    });

    // Touch functionality for mobile devices
    navMenu.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        currentX = startX;
        currentY = startY;
        lastTouch = Date.now();
        navMenu.style.transition = 'none';
    }, { passive: true });

    navMenu.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
        
        // Check if the gesture is more horizontal than vertical to prevent
        // interfering with vertical scrolling
        const deltaX = Math.abs(currentX - startX);
        const deltaY = Math.abs(currentY - startY);
        
        if (deltaX > deltaY) {
            // Prevent scrolling when dragging horizontally
            e.preventDefault();
            
            const diff = currentX - startX;
            let newPosition = Math.min(0, Math.max(-menuWidth, diff));
            navMenu.style.transform = `translateX(${newPosition}px)`;
        }
    }, { passive: false });

    navMenu.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        isDragging = false;
        navMenu.style.transition = 'transform 0.3s ease';
        
        const diff = currentX - startX;
        const threshold = menuWidth / 3;
        const timeDiff = Date.now() - lastTouch;
        const isQuickSwipe = timeDiff < 300;
        
        // If it's a quick swipe or dragged beyond threshold
        if ((isQuickSwipe && Math.abs(diff) > 30) || Math.abs(diff) > threshold) {
            if (diff < 0) {
                closeMenu();
            } else {
                openMenu();
            }
        } else {
            // If dragged less than threshold, revert to original state
            if (navMenu.classList.contains('active')) {
                openMenu();
            } else {
                closeMenu();
            }
        }
    }, { passive: true });

    // Close menu on window resize if it's open
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMenu();
        }
        
        // Reset any inline styles when switching between mobile and desktop
        if (window.innerWidth > 768) {
            navMenu.style.transform = '';
            navMenu.style.transition = '';
        }
    });

    // Scroll animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;

            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('active');
            }
        });
    };

    // Initial animation check
    animateOnScroll();

    // Check animations on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Parallax effect
    const parallaxElements = document.querySelectorAll('.parallax');

    window.addEventListener('scroll', () => {
        parallaxElements.forEach(element => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            element.style.transform = `translateY(${rate}px)`;
        });
    });
});
