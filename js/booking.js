/* ============================================
   ART BY REMYA — Booking Module
   Form validation, WhatsApp integration, FAQ
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initBookingForm();
  initFAQ();
});

/* ==================== BOOKING FORM ==================== */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const successMessage = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset errors
    form.querySelectorAll('.form__group').forEach(g => {
      g.classList.remove('form__group--error');
    });

    let isValid = true;

    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.closest('.form__group').classList.add('form__group--error');
      }
    });

    // Validate phone number
    const phone = form.querySelector('#phone');
    if (phone && phone.value.trim()) {
      const phoneRegex = /^[+]?[\d\s\-()]{8,15}$/;
      if (!phoneRegex.test(phone.value.trim())) {
        isValid = false;
        phone.closest('.form__group').classList.add('form__group--error');
      }
    }

    if (!isValid) {
      // Scroll to first error
      const firstError = form.querySelector('.form__group--error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Show success message
    if (typeof gsap !== 'undefined') {
      gsap.to(form, {
        opacity: 0,
        height: 0,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          form.style.display = 'none';
          if (successMessage) {
            successMessage.classList.add('form__success--visible');
            gsap.fromTo(successMessage,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
            );
          }
        }
      });
    } else {
      form.style.display = 'none';
      if (successMessage) {
        successMessage.classList.add('form__success--visible');
      }
    }

    // Log data (in production, this would send to a server)
    console.log('Booking submitted:', data);
  });

  // WhatsApp booking button
  const whatsappBookBtn = document.getElementById('whatsappBook');
  if (whatsappBookBtn) {
    whatsappBookBtn.addEventListener('click', (e) => {
      const name = form.querySelector('#name')?.value || '';
      const eventType = form.querySelector('#eventType')?.value || '';
      const eventDate = form.querySelector('#eventDate')?.value || '';
      const location = form.querySelector('#location')?.value || '';

      let message = `Hi! I'd like to book a mehendi appointment.`;
      if (name) message += `\n\nName: ${name}`;
      if (eventType) message += `\nEvent: ${eventType}`;
      if (eventDate) message += `\nDate: ${eventDate}`;
      if (location) message += `\nLocation: ${location}`;

      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/918220275364?text=${encoded}`, '_blank');
    });
  }
}

/* ==================== FAQ ACCORDION ==================== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq__item');
  if (faqItems.length === 0) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq__item--open');

      // Close all
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('faq__item--open');
          const otherAnswer = otherItem.querySelector('.faq__answer');
          if (otherAnswer) {
            if (typeof gsap !== 'undefined') {
              gsap.to(otherAnswer, { maxHeight: 0, duration: 0.3, ease: 'power2.inOut' });
            } else {
              otherAnswer.style.maxHeight = '0';
            }
          }
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('faq__item--open');
        if (typeof gsap !== 'undefined') {
          gsap.to(answer, { maxHeight: 0, duration: 0.3, ease: 'power2.inOut' });
        } else {
          answer.style.maxHeight = '0';
        }
      } else {
        item.classList.add('faq__item--open');
        const inner = answer.querySelector('.faq__answer-inner');
        const height = inner ? inner.offsetHeight : 200;
        if (typeof gsap !== 'undefined') {
          gsap.to(answer, { maxHeight: height + 20, duration: 0.4, ease: 'power2.out' });
        } else {
          answer.style.maxHeight = (height + 20) + 'px';
        }
      }
    });
  });
}
