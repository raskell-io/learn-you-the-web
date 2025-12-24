// Lucide Icons and Theme Toggle for Learn You the Web

(function() {
    'use strict';

    // Lucide SVG icons
    const icons = {
        panelLeft: '<svg class="lucide" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></svg>',
        sun: '<svg class="lucide" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
        moon: '<svg class="lucide" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
        search: '<svg class="lucide" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
        chevronLeft: '<svg class="lucide" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>',
        chevronRight: '<svg class="lucide" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>',
        printer: '<svg class="lucide" viewBox="0 0 24 24"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/></svg>'
    };

    function isDarkTheme() {
        return document.documentElement.classList.contains('mocha') ||
               document.documentElement.classList.contains('coal') ||
               document.documentElement.classList.contains('navy') ||
               document.documentElement.classList.contains('ayu');
    }

    function getThemeIcon() {
        return isDarkTheme() ? icons.moon : icons.sun;
    }

    function replaceIcon(selector, iconHtml) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            // Find the icon inside (could be i, svg, or the element itself)
            const iconEl = el.querySelector('i, svg') || el;
            if (iconEl.tagName === 'I' || iconEl.classList.contains('fa') || iconEl.tagName === 'svg') {
                iconEl.outerHTML = iconHtml;
            }
        });
    }

    function setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        // Replace theme popup with simple toggle
        const themePopup = document.querySelector('.theme-popup');
        if (themePopup) {
            themePopup.style.display = 'none';
        }

        // Update icon based on current theme
        function updateThemeIcon() {
            const iconContainer = themeToggle.querySelector('.lucide') || themeToggle.querySelector('i');
            if (iconContainer) {
                iconContainer.outerHTML = getThemeIcon();
            } else {
                // If no icon found, try to add one
                const existingIcon = themeToggle.querySelector('svg, i');
                if (existingIcon) {
                    existingIcon.outerHTML = getThemeIcon();
                }
            }
        }

        // Override click behavior
        themeToggle.removeAttribute('aria-haspopup');
        themeToggle.removeAttribute('aria-controls');

        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const html = document.documentElement;
            const isCurrentlyDark = isDarkTheme();

            // Remove all theme classes
            html.classList.remove('light', 'rust', 'coal', 'navy', 'ayu', 'latte', 'mocha');

            // Toggle between latte (light) and mocha (dark)
            const newTheme = isCurrentlyDark ? 'latte' : 'mocha';
            html.classList.add(newTheme);

            // Save preference
            try {
                localStorage.setItem('mdbook-theme', newTheme);
            } catch (e) {}

            // Update icon
            updateThemeIcon();
        });

        // Initial icon update
        updateThemeIcon();
    }

    function replaceAllIcons() {
        // Sidebar toggle
        replaceIcon('#sidebar-toggle', icons.panelLeft);

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i, svg');
            if (icon) {
                icon.outerHTML = getThemeIcon();
            }
        }

        // Search toggle
        replaceIcon('#search-toggle', icons.search);

        // Navigation arrows
        document.querySelectorAll('.nav-chapters.previous, .mobile-nav-chapters.previous').forEach(el => {
            const icon = el.querySelector('i, svg');
            if (icon) icon.outerHTML = icons.chevronLeft;
        });

        document.querySelectorAll('.nav-chapters.next, .mobile-nav-chapters.next').forEach(el => {
            const icon = el.querySelector('i, svg');
            if (icon) icon.outerHTML = icons.chevronRight;
        });

        // Print button
        const printBtn = document.querySelector('a[title="Print this book"]');
        if (printBtn) {
            const icon = printBtn.querySelector('i, svg');
            if (icon) icon.outerHTML = icons.printer;
        }
    }

    function makeMenuTitleClickable() {
        const menuTitle = document.querySelector('.menu-title');
        if (menuTitle && !menuTitle.querySelector('a')) {
            const text = menuTitle.textContent;
            menuTitle.innerHTML = `<a href="${window.path_to_root || ''}index.html" style="color: inherit; text-decoration: none;">${text}</a>`;
        }
    }

    function hideSidebarByDefault() {
        // Check if user has a saved preference
        let savedSidebar;
        try {
            savedSidebar = localStorage.getItem('mdbook-sidebar');
        } catch (e) {}

        // If no saved preference, hide sidebar
        if (!savedSidebar) {
            document.documentElement.classList.remove('sidebar-visible');
            const toggle = document.getElementById('sidebar-toggle-anchor');
            if (toggle) toggle.checked = false;
        }
    }

    // Run when DOM is ready
    function init() {
        replaceAllIcons();
        setupThemeToggle();
        makeMenuTitleClickable();
        hideSidebarByDefault();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
