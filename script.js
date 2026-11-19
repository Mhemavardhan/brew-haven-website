/**
 * Brew Haven — Interactive Frontend Scripts & Backend API Integration
 * Features: Mobile Navigation, Menu Filtering, Form Validation & Automated Email Reservation Engine
 * Connected to Node.js/Express Backend at /api/reservations
 */

// =============================================================================
// Backend API Configuration
// =============================================================================
// Automatically routes to localhost for local testing or deployed Render backend in production.
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000'
  : 'https://brew-haven-backend.onrender.com'; // Deployed Render URL

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------------------
  // 1. Mobile Menu Toggle
  // ---------------------------------------------------------------------------
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any navigation link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 2. Active Navigation Link on Scroll
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // 3. Menu Category Filtering
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // 4. Set Minimum Date for Reservation (Disable past dates)
  // ---------------------------------------------------------------------------
  const resDateField = document.getElementById('resDate');
  function initMinDate() {
    if (resDateField) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      resDateField.min = `${yyyy}-${mm}-${dd}`;
      if (!resDateField.value) {
        resDateField.value = `${yyyy}-${mm}-${dd}`;
      }
    }
  }
  initMinDate();

  // Helper to verify if time slot is in the future for today's reservations
  function isTimeInFuture(dateValue, timeValue) {
    if (!dateValue || !timeValue) return true;
    const now = new Date();
    const parts = dateValue.split('-').map(Number);
    const resYear = parts[0];
    const resMonth = parts[1] - 1;
    const resDay = parts[2];

    if (
      resYear === now.getFullYear() &&
      resMonth === now.getMonth() &&
      resDay === now.getDate()
    ) {
      const match = timeValue.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
      if (!match) return true;
      let h = parseInt(match[1], 10);
      const min = parseInt(match[2], 10);
      const period = match[3] ? match[3].toUpperCase() : null;

      if (period === 'PM' && h < 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;

      const slotDate = new Date(resYear, resMonth, resDay, h, min);
      return slotDate > now;
    }
    return true;
  }

  // ---------------------------------------------------------------------------
  // 5. Reservation Form Validation & Backend API Integration
  // ---------------------------------------------------------------------------
  const reservationForm = document.getElementById('reservationForm');
  const bookingModal = document.getElementById('bookingModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDoneBtn = document.getElementById('modalDoneBtn');
  const modalSummary = document.getElementById('modalSummary');
  const formStatusAlert = document.getElementById('formStatusAlert');
  const reserveBtn = document.getElementById('reserveBtn');
  const btnText = document.getElementById('btnText') || reserveBtn?.querySelector('span');
  const btnSpinner = document.getElementById('btnSpinner');

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

  let isSubmitting = false;

  function showError(field, errorElement, message) {
    if (field) field.style.borderColor = '#C62828';
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('visible');
    }
  }

  function clearError(field, errorElement) {
    if (field) field.style.borderColor = '#EFE6DD';
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('visible');
    }
  }

  function showFormAlert(message, type = 'error') {
    if (!formStatusAlert) return;
    formStatusAlert.className = `form-status-alert visible ${type}`;
    const icon = type === 'error' ? '⚠️ ' : type === 'success' ? '✓ ' : 'ℹ️ ';
    formStatusAlert.innerHTML = `<strong>${icon}</strong> ${message}`;
    formStatusAlert.style.display = 'block';
  }

  function hideFormAlert() {
    if (!formStatusAlert) return;
    formStatusAlert.className = 'form-status-alert';
    formStatusAlert.style.display = 'none';
    formStatusAlert.innerHTML = '';
  }

  // Real-time input listeners to clear validation errors & alerts
  if (fullName) fullName.addEventListener('input', () => { clearError(fullName, nameError); hideFormAlert(); });
  if (email) email.addEventListener('input', () => { clearError(email, emailError); hideFormAlert(); });
  if (phone) phone.addEventListener('input', () => { clearError(phone, phoneError); hideFormAlert(); });
  if (resDate) resDate.addEventListener('change', () => { clearError(resDate, dateError); hideFormAlert(); });
  if (resTime) resTime.addEventListener('change', () => { clearError(resTime, timeError); hideFormAlert(); });
  if (guests) guests.addEventListener('change', () => { clearError(guests, guestsError); hideFormAlert(); });

  if (reservationForm) {
    reservationForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Prevent duplicate submissions while in-flight
      if (isSubmitting) return;

      hideFormAlert();
      let isValid = true;

      // 1. Validate Full Name
      const trimmedName = fullName.value.trim();
      if (!trimmedName || trimmedName.length < 3) {
        showError(fullName, nameError, 'Please enter your full name (minimum 3 characters).');
        isValid = false;
      }

      // 2. Validate Email Address
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const trimmedEmail = email.value.trim();
      if (!trimmedEmail || !emailPattern.test(trimmedEmail)) {
        showError(email, emailError, 'Please enter a valid email address (e.g. alex@example.com).');
        isValid = false;
      }

      // 3. Validate Phone (at least 10 digits)
      const phoneClean = phone.value.replace(/\D/g, '');
      if (phoneClean.length < 10 || phoneClean.length > 15) {
        showError(phone, phoneError, 'Please enter a valid contact number (10 to 15 digits).');
        isValid = false;
      }

      // 4. Validate Date (must not be past)
      if (!resDate.value) {
        showError(resDate, dateError, 'Please select your preferred reservation date.');
        isValid = false;
      } else {
        const todayStr = new Date().toISOString().split('T')[0];
        if (resDate.value < todayStr) {
          showError(resDate, dateError, 'Reservation date cannot be in the past.');
          isValid = false;
        }
      }

      // 5. Validate Preferred Time Slot
      if (!resTime.value) {
        showError(resTime, timeError, 'Please select a dining time slot.');
        isValid = false;
      } else if (!isTimeInFuture(resDate.value, resTime.value)) {
        showError(resTime, timeError, 'Selected time slot has already passed for today. Please pick a later slot.');
        isValid = false;
      }

      // 6. Validate Number of Guests
      if (!guests.value) {
        showError(guests, guestsError, 'Please select the number of guests.');
        isValid = false;
      }

      if (!isValid) {
        showFormAlert('Please review the highlighted fields before submitting.', 'error');
        return;
      }

      // Prepare payload for backend API
      const reservationPayload = {
        fullName: trimmedName,
        email: trimmedEmail,
        phone: phone.value.trim(),
        resDate: resDate.value,
        resTime: resTime.value,
        guests: guests.value,
        seatingArea: seatingArea.value || 'Standard',
        specialRequests: specialRequests.value.trim()
      };

      // Enter Loading State
      isSubmitting = true;
      if (reserveBtn) reserveBtn.disabled = true;
      if (btnText) btnText.textContent = 'Confirming Reservation...';
      if (btnSpinner) btnSpinner.style.display = 'inline-block';

      try {
        const response = await fetch(`${API_BASE_URL}/api/reservations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(reservationPayload)
        });

        let result = {};
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          result = await response.json();
        } else {
          const rawText = await response.text().catch(() => '');
          result = {
            success: false,
            message: response.status === 404
              ? `Backend service not found on Render (HTTP 404). Please ensure your Web Service has been created at ${API_BASE_URL}.`
              : `Server returned HTTP ${response.status}: ${rawText.slice(0, 100)}`
          };
        }

        if (response.ok && result.success) {
          // Success: Display booking reference & details in modal
          const bookingRef = result.bookingReference || ('BH-' + Math.floor(100000 + Math.random() * 900000));
          const bookingDateFormatted = new Date(reservationPayload.resDate).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });

          modalSummary.innerHTML = `
            <p><span>Booking Reference:</span> <strong>${bookingRef}</strong></p>
            <p><span>Guest Name:</span> <strong>${reservationPayload.fullName}</strong></p>
            <p><span>Contact Email:</span> <strong>${reservationPayload.email}</strong></p>
            <p><span>Contact Phone:</span> <strong>${reservationPayload.phone}</strong></p>
            <p><span>Date & Time:</span> <strong>${bookingDateFormatted} at ${reservationPayload.resTime}</strong></p>
            <p><span>Party Size:</span> <strong>${reservationPayload.guests}</strong></p>
            <p><span>Seating Zone:</span> <strong>${reservationPayload.seatingArea}</strong></p>
            ${reservationPayload.specialRequests ? `<p><span>Special Notes:</span> <strong>${reservationPayload.specialRequests}</strong></p>` : ''}
            <div class="modal-email-notice">
              ✉️ Confirmation emails have been sent to <strong>${reservationPayload.email}</strong> and the café owner!
            </div>
          `;

          // Display confirmation modal
          bookingModal.classList.add('open');
          bookingModal.setAttribute('aria-hidden', 'false');

          // Reset form fields and restore minimum date
          reservationForm.reset();
          initMinDate();
        } else {
          // Server returned an error
          const errorMsg = result.message || 'We could not process your reservation. Please check your details and try again.';
          showFormAlert(errorMsg, 'error');
        }
      } catch (networkError) {
        console.error('Reservation API Error:', networkError);
        showFormAlert(
          `Unable to connect to the reservation backend at <code>${API_BASE_URL}</code>.<br>` +
          `• <strong>Action Required:</strong> The backend has not been deployed on Render yet, or the service URL is different.<br>` +
          `• <strong>If already created:</strong> Free-tier servers sleep after inactivity; wait 30 seconds and click Confirm again.<br>` +
          `• <strong>Instant Contact:</strong> Call us at +91 98765 43210.`,
          'error'
        );
      } finally {
        // Exit Loading State
        isSubmitting = false;
        if (reserveBtn) reserveBtn.disabled = false;
        if (btnText) btnText.textContent = 'Confirm Reservation';
        if (btnSpinner) btnSpinner.style.display = 'none';
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 6. Modal Close Handlers
  // ---------------------------------------------------------------------------
  function closeModal() {
    if (bookingModal) {
      bookingModal.classList.remove('open');
      bookingModal.setAttribute('aria-hidden', 'true');
    }
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
