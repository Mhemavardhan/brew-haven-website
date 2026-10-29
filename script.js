/**
 * Brew Haven — Interactive Frontend Scripts
 * Features: Mobile Navigation, Menu Filtering, Form Validation & Reservation Engine
 * SESD Assignment 3 — SR University
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Active Navigation Link on Scroll
  const sections = document.querySelectorAll('section[id], header[id]');
  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // 3. Menu Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      menuCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 4. Set Minimum Date for Reservation (Disable past dates)
  const resDateField = document.getElementById('resDate');
  if (resDateField) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    resDateField.min = `${yyyy}-${mm}-${dd}`;
    resDateField.value = `${yyyy}-${mm}-${dd}`;
  }

  // 5. Reservation Form Validation & Confirmation
  const reservationForm = document.getElementById('reservationForm');
  const bookingModal = document.getElementById('bookingModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDoneBtn = document.getElementById('modalDoneBtn');
  const modalSummary = document.getElementById('modalSummary');

  // Input elements
  const fullName = document.getElementById('fullName');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const resDate = document.getElementById('resDate');
  const resTime = document.getElementById('resTime');
  const guests = document.getElementById('guests');
  const seatingArea = document.getElementById('seatingArea');
  const specialRequests = document.getElementById('specialRequests');

  // Error label elements
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');
  const dateError = document.getElementById('dateError');
  const timeError = document.getElementById('timeError');
  const guestsError = document.getElementById('guestsError');

  function showError(field, errorElement, message) {
    field.style.borderColor = '#C62828';
    errorElement.textContent = message;
    errorElement.classList.add('visible');
  }

  function clearError(field, errorElement) {
    field.style.borderColor = '#EFE6DD';
    errorElement.textContent = '';
    errorElement.classList.remove('visible');
  }

  // Real-time input listeners to clear errors
  fullName.addEventListener('input', () => clearError(fullName, nameError));
  email.addEventListener('input', () => clearError(email, emailError));
  phone.addEventListener('input', () => clearError(phone, phoneError));
  resDate.addEventListener('change', () => clearError(resDate, dateError));
  resTime.addEventListener('change', () => clearError(resTime, timeError));
  guests.addEventListener('change', () => clearError(guests, guestsError));

  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      if (!fullName.value.trim() || fullName.value.trim().length < 3) {
        showError(fullName, nameError, 'Please enter a valid full name (minimum 3 characters).');
        isValid = false;
      }

      // Validate Email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
        showError(email, emailError, 'Please enter a valid email address.');
        isValid = false;
      }

      // Validate Phone (10 digits minimum)
      const phoneClean = phone.value.replace(/\D/g, '');
      if (phoneClean.length < 10) {
        showError(phone, phoneError, 'Please enter a valid 10-digit contact number.');
        isValid = false;
      }

      // Validate Date
      if (!resDate.value) {
        showError(resDate, dateError, 'Please select your preferred date.');
        isValid = false;
      }

      // Validate Time
      if (!resTime.value) {
        showError(resTime, timeError, 'Please select a dining time slot.');
        isValid = false;
      }

      // Validate Guests
      if (!guests.value) {
        showError(guests, guestsError, 'Please select the number of guests.');
        isValid = false;
      }

      // If valid, generate booking reference and open modal
      if (isValid) {
        const randomRef = 'BH-' + Math.floor(100000 + Math.random() * 900000);
        const bookingDateFormatted = new Date(resDate.value).toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });

        modalSummary.innerHTML = `
          <p><span>Booking Reference:</span> <strong>${randomRef}</strong></p>
          <p><span>Guest Name:</span> <strong>${fullName.value.trim()}</strong></p>
          <p><span>Contact Email:</span> <strong>${email.value.trim()}</strong></p>
          <p><span>Date & Time:</span> <strong>${bookingDateFormatted} at ${resTime.value}</strong></p>
          <p><span>Party Size:</span> <strong>${guests.value}</strong></p>
          <p><span>Seating Zone:</span> <strong>${seatingArea.value}</strong></p>
          ${specialRequests.value.trim() ? `<p><span>Special Notes:</span> <strong>${specialRequests.value.trim()}</strong></p>` : ''}
        `;

        // Display modal
        bookingModal.classList.add('open');
        bookingModal.setAttribute('aria-hidden', 'false');

        // Reset form
        reservationForm.reset();
        // Restore today's date
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        resDate.value = `${yyyy}-${mm}-${dd}`;
      }
    });
  }

  // 6. Modal Close Handlers
  function closeModal() {
    bookingModal.classList.remove('open');
    bookingModal.setAttribute('aria-hidden', 'true');
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeModal);
  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal && bookingModal.classList.contains('open')) {
      closeModal();
    }
  });
});
