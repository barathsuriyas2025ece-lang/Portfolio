/**
 * Barathsuriya S - Portfolio JavaScript Controller
 * Core features: Interactive particle canvas, custom typing animator, portfolio category filter,
 * count-up counters via scroll IntersectionObserver, and local user feedback handler.
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- MOBILE NAV MENU ---
  const hamburger = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // --- SCROLL EVENTS: NAVBAR STICKY & SCROLL TO TOP ---
  const navbar = document.getElementById('main-navbar');
  const scrollTopBtn = document.getElementById('scroll-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- SCROLL SPY FOR ACTIVE NAVIGATION ---
  const sections = document.querySelectorAll('section');
  
  const scrollSpyOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -20% 0px'
  };

  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, scrollSpyOptions);

  sections.forEach(section => scrollSpyObserver.observe(section));








  // --- PORTFOLIO FILTERING ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const projectsContainer = document.getElementById('projects-container');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Update active class on button
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const filter = e.target.getAttribute('data-filter');

        // Apply grid fade animation
        if (projectsContainer) {
          projectsContainer.style.opacity = '0';
        }

        setTimeout(() => {
          projectCards.forEach(card => {
            const categories = card.getAttribute('data-category').split(' ');
            if (filter === 'all' || categories.includes(filter)) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });

          if (projectsContainer) {
            projectsContainer.style.opacity = '1';
          }
        }, 250);
      });
    });
  }


  // --- TERMINAL COPY TO CLIPBOARD ---
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          // Visual feedback
          const originalHTML = btn.innerHTML;
          btn.innerHTML = `<svg viewBox="0 0 24 24" fill="#27c93f"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
          btn.title = "Copied!";
          
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.title = "Copy";
          }, 1500);
        }).catch(err => {
          console.error('Could not copy text: ', err);
        });
      }
    });
  });


  // --- CONTACT FORM SUBMISSION ---
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status-msg');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const message = document.getElementById('form-message').value;

      if (!name || !email || !message) {
        formStatus.textContent = "Please fill in all fields.";
        formStatus.className = "form-status error";
        formStatus.style.display = "block";
        return;
      }

      /* 
       * METHOD 1: Out-of-the-box client mail redirect (Default)
       * Opens the user's default mail application pre-filled with the message details.
       */
      formStatus.textContent = "Redirecting to your mail client...";
      formStatus.className = "form-status success";
      formStatus.style.display = "block";

      const subject = `Portfolio Inquiry from ${name}`;
      const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
      const mailtoUrl = `mailto:barathsuriya.s2025ece@sece.ac.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      setTimeout(() => {
        window.location.href = mailtoUrl;
        formStatus.textContent = "Mail client opened! Please send the drafted email.";
        contactForm.reset();
      }, 1000);

      /* 
       * METHOD 2: Background sending via Free Web3Forms API (Uncomment to use)
       * To use, get a free key from https://web3forms.com/ and replace YOUR_ACCESS_KEY
       *
      formStatus.textContent = "Sending message...";
      formStatus.className = "form-status";
      formStatus.style.display = "block";

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: "YOUR_WEB3FORMS_ACCESS_KEY_HERE",
          name: name,
          email: email,
          message: message,
          subject: `Portfolio Contact from ${name}`
        })
      })
      .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
          formStatus.textContent = `Success! Thank you ${name}. Your message has been sent.`;
          formStatus.className = "form-status success";
          contactForm.reset();
        } else {
          console.log(response);
          formStatus.textContent = json.message || "Something went wrong.";
          formStatus.className = "form-status error";
        }
      })
      .catch((error) => {
        console.log(error);
        formStatus.textContent = "Failed to send message. Please try mailto link instead.";
        formStatus.className = "form-status error";
      });
      */
    });
  }

});
