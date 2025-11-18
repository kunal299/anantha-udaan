// Interactions & polish

// Dynamic year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Pointer interaction: subtle pop/tilt & glow position update
document.addEventListener('pointermove', (e) => {
  document.querySelectorAll('.card.glow').forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (rect.width > 0 && rect.height > 0) {
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    }

    if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
      const offsetX = (x - rect.width / 2) / 60;
      const offsetY = (y - rect.height / 2) / 140;
      card.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(1.01)`;
      card.style.transition = "transform .12s ease-out";
    } else {
      card.style.transform = '';
    }
  });
});

// Reset on pointerleave
document.addEventListener('pointerleave', () => {
  document.querySelectorAll('.card.glow').forEach(card => {
    card.style.transform = '';
  });
});

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Observe cards
document.querySelectorAll('.card').forEach(el => {
  if (!el.classList.contains('pre')) el.classList.add('pre');
  io.observe(el);
});

// Pre / in animation style injection
const style = document.createElement('style');
style.textContent = `
  .card.pre { opacity: 0; transform: translateY(10px); }
  .card.in { opacity: 1; transform: translateY(0); transition: opacity .4s ease, transform .4s ease; }
`;
document.head.appendChild(style);

// ===========================
// Image Modal / Lightbox
// ===========================
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.querySelector('.modal-close');
const modalBackdrop = document.querySelector('.modal-backdrop');

// Function to open modal
function openModal(imageSrc, imageAlt) {
  modalImage.src = imageSrc;
  modalImage.alt = imageAlt || 'Enlarged view';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

// Function to close modal
function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = ''; // Restore scrolling
  // Clear the image after animation completes
  setTimeout(() => {
    if (!modal.classList.contains('active')) {
      modalImage.src = '';
    }
  }, 300);
}

// Add click event to all clickable images
const clickableImages = document.querySelectorAll(
  '.card-image img, .work-card .work-img img, .presented-card img, .mission-image-card img, .qr-wrap img'
);

clickableImages.forEach(img => {
  img.addEventListener('click', function(e) {
    e.preventDefault();
    openModal(this.src, this.alt);
  });
});

// Close modal when clicking the close button
if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}

// Close modal when clicking the backdrop
if (modalBackdrop) {
  modalBackdrop.addEventListener('click', closeModal);
}

// Close modal when pressing Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
  }
});

// Prevent modal content clicks from closing the modal
if (modal) {
  modal.querySelector('.modal-content').addEventListener('click', function(e) {
    if (e.target.tagName !== 'IMG') {
      e.stopPropagation();
    }
  });
}

// ===========================
// Donate Now Button - Open QR Modal
// ===========================
const donateNowBtn = document.querySelector('.donate-now-btn');
if (donateNowBtn) {
  donateNowBtn.addEventListener('click', function(e) {
    e.preventDefault();
    // Find the QR code image in the contribute section
    const qrImage = document.querySelector('#contribute .qr-wrap img');
    if (qrImage) {
      openModal(qrImage.src, qrImage.alt);
    }
  });
}