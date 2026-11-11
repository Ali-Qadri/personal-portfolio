/**
 * ALI QADRI — LUXURY OPEN BOOK PORTFOLIO INTERACTION ENGINE
 * Two-Page Spread Edition (Side-by-Side Open Book)
 * 
 * Features:
 * - Synthesized Realistic Paper Turn Sound (Web Audio API - zero dependencies)
 * - Hanging Silk Bookmark Ribbon & Corner Dog-Ear Peels
 * - Direct "Hire Me" Modal Card & Instant Clipboard Copier
 * - Zero Viewport Scroll Enforcement
 * - Prepared Spreads Architecture for Subsequent Chapters
 */

(function () {
  'use strict';

  // State Management
  const state = {
    currentSpread: 1,
    totalSpreads: 0,
    soundEnabled: true,
    isFlipping: false,
    audioCtx: null
  };

  // DOM Elements
  const bookCasing = document.getElementById('bookCasing');
  const bookShadow = document.getElementById('bookShadow');
  const prevControlBtn = document.getElementById('prevControlBtn');
  const nextControlBtn = document.getElementById('nextControlBtn');
  const currentSpreadEl = document.getElementById('currentSpread');
  const totalSpreadEl = document.getElementById('totalSpread');
  const bookmarkRibbon = document.getElementById('bookmarkRibbon');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundOnIcon = soundToggleBtn?.querySelector('.sound-on-icon');
  const soundOffIcon = soundToggleBtn?.querySelector('.sound-off-icon');

  // Turn Prompts
  const turnNextHint = document.getElementById('turnNextHint');
  const cornerPeelRight = document.getElementById('cornerPeelRight');

  // Hire Me Modal Elements
  const hireMeBtn = document.getElementById('hireMeBtn');
  const hireMeNavBtn = document.getElementById('hireMeNavBtn');
  const hireModal = document.getElementById('hireModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const profileImageButton = document.getElementById('profileImageButton');
  const profileImageDialog = document.getElementById('profileImageDialog');
  const closeProfileImage = document.getElementById('closeProfileImage');
  const toast = document.getElementById('toast');

  /* ==========================================================================
     WEB AUDIO API: SYNTHESIZED PAPER TURN SOUND
     ========================================================================== */
  function playPaperTurnSound() {
    if (!state.soundEnabled) return;

    try {
      if (!state.audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        state.audioCtx = new AudioContextClass();
      }

      if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
      }

      const ctx = state.audioCtx;
      const bufferSize = ctx.sampleRate * 0.18; // ~180ms crisp sweep
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);

      // Generate brown/pink filtered noise
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.95 * b1 + white * 0.1;
        b2 = 0.85 * b2 + white * 0.2;
        output[i] = (b0 + b1 + b2) * 0.35;
      }

      const whiteNoiseSource = ctx.createBufferSource();
      whiteNoiseSource.buffer = buffer;

      // Bandpass filter to simulate paper frequency
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.16);
      filter.Q.setValueAtTime(1.8, ctx.currentTime);

      // Volume envelope
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      whiteNoiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      whiteNoiseSource.start();
    } catch (e) {
      console.warn('Paper audio notice:', e);
    }
  }

  /* ==========================================================================
     PAGE SPREAD NAVIGATION
     ========================================================================== */
  const spreads = document.querySelectorAll('.book-spread');
  state.totalSpreads = spreads.length;

  function updateUI() {
    if (currentSpreadEl) {
      const currentPages = Array.from(
        spreads[state.currentSpread - 1].querySelectorAll('.page-leaf'),
        (page) => Number(page.dataset.page)
      );
      const firstPage = currentPages[0];
      const lastPage = currentPages[currentPages.length - 1];
      currentSpreadEl.textContent = firstPage === lastPage
        ? String(firstPage).padStart(2, '0')
        : `${String(firstPage).padStart(2, '0')} – ${String(lastPage).padStart(2, '0')}`;
    }

    if (totalSpreadEl) totalSpreadEl.textContent = String(state.totalSpreads).padStart(2, '0');

    if (prevControlBtn) {
      prevControlBtn.disabled = state.currentSpread === 1;
    }
    if (nextControlBtn) {
      nextControlBtn.disabled = state.currentSpread === state.totalSpreads;
    }
  }

  function goToSpread(spreadNum) {
    if (spreadNum < 1 || spreadNum > state.totalSpreads) return;
    if (state.isFlipping) return;

    state.isFlipping = true;
    playPaperTurnSound();

    const allSpreads = document.querySelectorAll('.book-spread');
    allSpreads.forEach((spread) => {
      const idx = parseInt(spread.getAttribute('data-spread') || spread.id.replace('spread-', ''), 10);
      if (idx === spreadNum) {
        spread.classList.add('active-spread');
      } else {
        spread.classList.remove('active-spread');
      }
    });

    state.currentSpread = spreadNum;
    updateUI();

    const titles = {
      1: 'Cover & Restaurant ERP Project (Pages 01 – 02)',
      2: 'Path Finder & Experience (Pages 03 – 04)',
      3: 'Education & Contact (Pages 05 – 06)'
    };
    showToast(titles[spreadNum] || `Viewing Spread ${spreadNum}`);

    setTimeout(() => {
      state.isFlipping = false;
    }, 300);
  }

  function nextSpread() {
    if (state.currentSpread < state.totalSpreads) {
      goToSpread(state.currentSpread + 1);
    } else {
      showToast('You are on the final chapter.');
    }
  }

  function prevSpread() {
    if (state.currentSpread > 1) {
      goToSpread(state.currentSpread - 1);
    } else {
      showToast('You are on the opening spread (Pages 01 – 02).');
    }
  }

  // Navigation Buttons
  prevControlBtn?.addEventListener('click', prevSpread);
  nextControlBtn?.addEventListener('click', nextSpread);

  // Global Delegated Clicks for In-Page Turn Triggers
  document.addEventListener('click', (e) => {
    // Return to beginning trigger
    const firstTrigger = e.target.closest('[data-action="first"]');
    if (firstTrigger) {
      e.stopPropagation();
      goToSpread(1);
      return;
    }

    // Next page triggers
    const nextTrigger = e.target.closest('[data-action="next"], #turnNextHint, #cornerPeelRight, .corner-peel');
    if (nextTrigger) {
      e.stopPropagation();
      nextSpread();
      return;
    }

    // Previous page triggers
    const prevTrigger = e.target.closest('[data-action="prev"], .turn-prev-hint');
    if (prevTrigger) {
      e.stopPropagation();
      prevSpread();
      return;
    }

    // Hire Me triggers inside spreads
    const hireTrigger = e.target.closest('.open-hire-modal-btn');
    if (hireTrigger) {
      e.stopPropagation();
      openModal();
      return;
    }
  });

  // Bookmark Ribbon Click (Returns to Cover)
  bookmarkRibbon?.addEventListener('click', () => {
    goToSpread(1);
    showToast('Bookmark: Cover & Executive Summary');
  });

  // Page 6 Quick Inquiry Form Dispatcher
  const quickInquiryForm = document.getElementById('quickInquiryForm');
  quickInquiryForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('inqName')?.value || 'Client';
    const message = document.getElementById('inqMessage')?.value || '';
    const subject = encodeURIComponent(`Project Inquiry from ${name}`);
    const body = encodeURIComponent(`Hello Ali,\n\n${message}\n\nBest regards,\n${name}`);
    showToast('Dispatching inquiry to Ali Qadri...');
    window.location.href = `mailto:designwithsyed@gmail.com?subject=${subject}&body=${body}`;
  });

  /* ==========================================================================
     TOUCH SWIPE SUPPORT (TABLETS & MOBILE)
     ========================================================================== */
  let touchStartX = 0;
  let touchStartY = 0;

  window.addEventListener('touchstart', (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const diffX = e.changedTouches[0].screenX - touchStartX;
    const diffY = e.changedTouches[0].screenY - touchStartY;

    // Minimum 50px horizontal swipe threshold
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        nextSpread();
      } else {
        prevSpread();
      }
    }
  }, { passive: true });

  // Static Book: Zero cursor movement / parallax (stays completely still)

  /* ==========================================================================
     "HIRE ME" MODAL & CLIPBOARD FEEDBACK
     ========================================================================== */
  function openModal() {
    if (hireModal) {
      hireModal.classList.add('open');
      hireModal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeModal() {
    if (hireModal) {
      hireModal.classList.remove('open');
      hireModal.setAttribute('aria-hidden', 'true');
    }
  }

  hireMeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    openModal();
  });

  hireMeNavBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    openModal();
  });

  closeModalBtn?.addEventListener('click', closeModal);

  profileImageButton?.addEventListener('click', () => {
    profileImageDialog?.showModal();
  });

  closeProfileImage?.addEventListener('click', () => {
    profileImageDialog?.close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && profileImageDialog?.open) {
      profileImageDialog.close();
      return;
    }

    if (
      profileImageDialog?.open ||
      hireModal?.classList.contains('open') ||
      e.altKey ||
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey
    ) return;

    const target = e.target;
    if (
      target instanceof HTMLElement &&
      (target.isContentEditable || target.matches('input, textarea, select, [role="textbox"]'))
    ) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSpread();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSpread();
    }
  });

  profileImageDialog?.addEventListener('click', (e) => {
    if (e.target === profileImageDialog) {
      profileImageDialog.close();
    }
  });

  hireModal?.addEventListener('click', (e) => {
    if (e.target === hireModal) {
      closeModal();
    }
  });

  // Copy-to-Clipboard Buttons
  const copyButtons = document.querySelectorAll('.copy-pill');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied: ${textToCopy}`);
        }).catch(() => {
          showToast('Copied to clipboard!');
        });
      }
    });
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  // Initial UI Setup
  updateUI();

})();
