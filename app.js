<script>
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

    // Variables for drag functionality
    let isDragging = false;
    let startX;
    let currentX;
    let menuWidth = 250; // Width of the menu in pixels

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.contents');
    const navLinks = document.querySelectorAll('nav ul li a');

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function () {
        this.classList.toggle('active');
    navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
        });

        // Drag functionality
        navMenu.addEventListener('mousedown', (e) => {
        isDragging = true;
    startX = e.clientX;
    currentX = startX;
    navMenu.style.transition = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

    currentX = e.clientX;
    const diff = currentX - startX;

    // Calculate the new position
    let newPosition = Math.min(0, Math.max(-menuWidth, diff));

    // Apply the transform
    navMenu.style.transform = `translateX(${newPosition}px)`;
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;

    isDragging = false;
    navMenu.style.transition = 'right 0.3s ease';

    // Determine if menu should open or close based on drag distance
    const diff = currentX - startX;
    const threshold = menuWidth / 3;

            if (diff > threshold) {
        // Open menu
        navMenu.style.transform = 'translateX(0)';
    navMenu.classList.add('active');
    hamburger.classList.add('active');
            } else {
        // Close menu
        navMenu.style.transform = `translateX(-${menuWidth}px)`;
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
            }
        });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
            const isClickInside = navMenu.contains(event.target) || hamburger.contains(event.target);

    if (!isClickInside && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
    navMenu.classList.remove('active');
            }
        });

    // Close menu on window resize if it's open
    window.addEventListener('resize', function () {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
    navMenu.classList.remove('active');
            }
        });
</script>
