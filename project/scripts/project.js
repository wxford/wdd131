// DOM Elements
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const primaryNav = document.querySelector('#primary-navigation');
const currentYear = document.getElementById('current-year');
const newsletterForm = document.getElementById('newsletter-form');
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
const formResponse = document.getElementById('form-response');
const causeButtons = document.querySelectorAll('.cause-btn');
const statNumbers = {
    childrenHelped: document.getElementById('children-helped'),
    countries: document.getElementById('countries'),
    projects: document.getElementById('projects')
};

// Mobile Navigation Toggle
mobileNavToggle.addEventListener('click', () => {
    const visibility = primaryNav.getAttribute('data-visible');
    
    if (visibility === "false") {
        primaryNav.setAttribute('data-visible', "true");
        mobileNavToggle.setAttribute('aria-expanded', "true");
    } else {
        primaryNav.setAttribute('data-visible', "false");
        mobileNavToggle.setAttribute('aria-expanded', "false");
    }
});

// Set current year in footer
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// Animate statistics counter
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize stats animation when scrolled into view
function initStatsAnimation() {
    if (statNumbers.childrenHelped) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateValue(statNumbers.childrenHelped, 0, 18300000, 2000);
                    animateValue(statNumbers.countries, 0, 120, 1500);
                    animateValue(statNumbers.projects, 0, 8500, 2500);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statNumbers.childrenHelped);
    }
}

// Newsletter Form Handling
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        
        if (validateEmail(email)) {
            // Save to localStorage
            saveToLocalStorage('newsletterSubscribers', email);
            
            // Show success message
            formMessage.innerHTML = `
                <p class="success">Thank you for subscribing!</p>
                <p>We'll keep you updated on our work to help children worldwide.</p>
            `;
            formMessage.style.backgroundColor = '#d4edda';
            formMessage.style.color = '#155724';
            formMessage.style.padding = '1rem';
            formMessage.style.borderRadius = '4px';
            
            // Reset form
            newsletterForm.reset();
        } else {
            formMessage.innerHTML = '<p class="error">Please enter a valid email address.</p>';
            formMessage.style.backgroundColor = '#f8d7da';
            formMessage.style.color = '#721c24';
            formMessage.style.padding = '1rem';
            formMessage.style.borderRadius = '4px';
        }
    });
}

// Contact Form Handling
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            subscribe: document.getElementById('subscribe').checked,
            timestamp: new Date().toISOString()
        };
        
        if (validateContactForm(formData)) {
            // Save form data to localStorage
            saveFormData(formData);
            
            // Show success message
            formResponse.innerHTML = `
                <p class="success">Thank you for your message, ${formData.name}!</p>
                <p>We'll respond to your inquiry about "${formData.subject}" as soon as possible.</p>
            `;
            formResponse.style.backgroundColor = '#d4edda';
            formResponse.style.color = '#155724';
            formResponse.style.padding = '1rem';
            formResponse.style.borderRadius = '4px';
            
            // Reset form
            contactForm.reset();
        } else {
            formResponse.innerHTML = '<p class="error">Please fill in all required fields correctly.</p>';
            formResponse.style.backgroundColor = '#f8d7da';
            formResponse.style.color = '#721c24';
            formResponse.style.padding = '1rem';
            formResponse.style.borderRadius = '4px';
        }
    });
}

// Cause Button Interactions
causeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const cause = button.getAttribute('data-cause');
        const causeData = {
            education: {
                title: "Education Programs",
                description: "We provide access to quality education for children in crisis-affected areas, building schools, training teachers, and supplying learning materials.",
                impact: "Last year, we helped 12 million children access education."
            },
            healthcare: {
                title: "Healthcare Initiatives",
                description: "Our health programs provide vaccinations, maternal care, and treatment for malnutrition to give children a healthy start in life.",
                impact: "In 2023, we provided healthcare services to 8 million children."
            },
            nutrition: {
                title: "Nutrition Programs",
                description: "We combat childhood hunger through feeding programs, nutrition education, and supporting sustainable food sources for families.",
                impact: "Our nutrition programs reached 5 million children last year."
            }
        };
        
        // Create modal with cause information
        showCauseModal(causeData[cause]);
    });
});

// Helper Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateContactForm(formData) {
    return formData.name && 
           validateEmail(formData.email) && 
           formData.subject && 
           formData.message;
}

function saveToLocalStorage(key, value) {
    try {
        let data = JSON.parse(localStorage.getItem(key)) || [];
        if (!Array.isArray(data)) {
            data = [data];
        }
        data.push(value);
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}

function saveFormData(formData) {
    try {
        let submissions = JSON.parse(localStorage.getItem('contactSubmissions')) || [];
        submissions.push(formData);
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
        return true;
    } catch (e) {
        console.error('Error saving form data:', e);
        return false;
    }
}

function showCauseModal(data) {
    const modal = document.createElement('div');
    modal.className = 'cause-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${data.title}</h3>
            <p>${data.description}</p>
            <p><strong>Impact:</strong> ${data.impact}</p>
            <button class="btn close-modal">Close</button>
        </div>
    `;
    
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '2000';
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '2rem';
    modalContent.style.borderRadius = '8px';
    modalContent.style.maxWidth = '500px';
    modalContent.style.width = '90%';
    
    document.body.appendChild(modal);
    
    // Close modal when clicking the close button or outside content
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Dark/Light Mode Toggle (Bonus Feature)
function initThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌓';
    themeToggle.style.position = 'fixed';
    themeToggle.style.bottom = '20px';
    themeToggle.style.right = '20px';
    themeToggle.style.zIndex = '1000';
    themeToggle.style.background = 'var(--primary)';
    themeToggle.style.color = 'white';
    themeToggle.style.border = 'none';
    themeToggle.style.borderRadius = '50%';
    themeToggle.style.width = '50px';
    themeToggle.style.height = '50px';
    themeToggle.style.fontSize = '1.5rem';
    themeToggle.style.cursor = 'pointer';
    
    document.body.appendChild(themeToggle);
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('darkTheme', isDark);
    });
    
    // Check for saved theme preference
    if (localStorage.getItem('darkTheme') === 'true') {
        document.body.classList.add('dark-theme');
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initStatsAnimation();
    
    // Initialize theme toggle if not already present
    if (!document.querySelector('.theme-toggle')) {
        initThemeToggle();
    }
    
    // Add dark theme styles if needed
    if (!document.querySelector('#dark-theme-styles')) {
        const style = document.createElement('style');
        style.id = 'dark-theme-styles';
        style.textContent = `
            .dark-theme {
                --light: #222;
                --dark: #f8f9fa;
                --gray: #aaa;
                --white: #333;
                --black: #fff;
                background-color: var(--light);
                color: var(--dark);
            }
            
            .dark-theme .cause-card,
            .dark-theme .stat-item,
            .dark-theme .team-member,
            .dark-theme .contact-method,
            .dark-theme .contact-form {
                background-color: #444;
                color: var(--dark);
            }
            
            .dark-theme footer {
                background-color: #111;
            }
        `;
        document.head.appendChild(style);
    }
});