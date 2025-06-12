document.addEventListener("DOMContentLoaded", function () {
  // ==================== MOBILE MENU TOGGLE ====================
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector("nav ul");
  const navLinks = document.querySelectorAll("nav ul li a");

  hamburger.addEventListener("click", function () {
    this.classList.toggle("active");
    navMenu.classList.toggle("active");
    document.body.classList.toggle("no-scroll");
  });

  // Close menu when clicking on links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.classList.remove("no-scroll");
    });
  });

  // ==================== SMOOTH SCROLLING ====================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      const headerHeight = document.querySelector("header").offsetHeight;
      const targetPosition =
        targetElement.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });

  // ==================== WELCOME MESSAGE ====================
  const welcomeMessage = document.getElementById("welcome-message");

  function handleWelcomeMessage() {
    const storedName = localStorage.getItem("visitorName");

    if (welcomeMessage) {
      if (storedName) {
        welcomeMessage.textContent = `Hi ${storedName}, welcome to Bright Future Academy`;
      } else {
        setTimeout(() => {
          const name = prompt("Please enter your name:");
          if (name) {
            localStorage.setItem("visitorName", name);
            welcomeMessage.textContent = `Hi ${name}, welcome to Bright Future Academy`;
          } else {
            welcomeMessage.textContent = "Welcome to Bright Future Academy";
          }
        }, 1000);
      }
    }
  }

  handleWelcomeMessage();

  // ==================== CONTACT FORM VALIDATION ====================
  const contactForm = document.getElementById("contact-form");
  const formResult = document.getElementById("form-result");

  if (contactForm && formResult) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const formData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        message: document.getElementById("message-text").value.trim(),
        gender:
          document.querySelector('input[name="gender"]:checked')?.value ||
          "Not specified",
      };

      // Validation
      if (
        !formData.name ||
        !formData.email ||
        !formData.phone ||
        !formData.message
      ) {
        showAlert("Please fill in all required fields", "error");
        return;
      }

      if (!validateEmail(formData.email)) {
        showAlert("Please enter a valid email address", "error");
        return;
      }

      if (!validatePhone(formData.phone)) {
        showAlert(
          "Please enter a valid phone number (minimum 8 digits)",
          "error"
        );
        return;
      }

      // Process form data
      processFormData(formData);
    });
  }

  // ==================== HELPER FUNCTIONS ====================
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePhone(phone) {
    const re = /^[\d\s\-+()]{8,}$/;
    return re.test(phone);
  }

  function showAlert(message, type = "success") {
    const alertDiv = document.createElement("div");
    alertDiv.className = `form-alert ${type}`;
    alertDiv.textContent = message;

    const existingAlert = document.querySelector(".form-alert");
    if (existingAlert) existingAlert.remove();

    contactForm.prepend(alertDiv);

    setTimeout(() => {
      alertDiv.style.opacity = "1";
    }, 10);

    setTimeout(() => {
      alertDiv.style.opacity = "0";
      setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
  }

  function processFormData(formData) {
    // Display results
    document.getElementById("result-name").textContent = formData.name;
    document.getElementById("result-email").textContent = formData.email;
    document.getElementById("result-phone").textContent = formData.phone;
    document.getElementById("result-message").textContent = formData.message;
    document.getElementById("result-gender").textContent = formData.gender;

    // Show result section with animation
    formResult.style.display = "block";
    setTimeout(() => {
      formResult.style.opacity = "1";
      formResult.style.transform = "translateY(0)";
    }, 10);

    // Reset form
    contactForm.reset();

    // Store name in localStorage
    localStorage.setItem("visitorName", formData.name);

    // Update welcome message
    if (welcomeMessage) {
      welcomeMessage.textContent = `Hi ${formData.name}, welcome to Bright Future Academy`;
    }

    showAlert("Your message has been submitted successfully!", "success");
  }

  // ==================== SCROLL ANIMATIONS ====================
  function initScrollAnimations() {
    const animatedSections = document.querySelectorAll(".animate-on-scroll");

    if (animatedSections.length > 0) {
      // Set initial state
      animatedSections.forEach((section) => {
        section.style.opacity = "0";
        section.style.transform = "translateY(30px)";
        section.style.transition =
          "opacity 0.6s ease-out, transform 0.6s ease-out";
      });

      // Create intersection observer
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0)";
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px",
        }
      );

      // Observe each section
      animatedSections.forEach((section) => {
        observer.observe(section);
      });
    }
  }

  initScrollAnimations();

  // ==================== ADDITIONAL ENHANCEMENTS ====================
  // Prevent form resubmission on page refresh
  if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
  }

  // Add loading state to form submit button
  if (contactForm) {
    const submitButton = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener("submit", function () {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner"></span> Sending...';

        // Re-enable button after 5 seconds if still disabled
        setTimeout(() => {
          if (submitButton.disabled) {
            submitButton.disabled = false;
            submitButton.textContent = "Send Message";
          }
        }, 5000);
      }
    });
  }
});
