/**
 * SUBIN SOJAN & ROSMY DAVIS - WEDDING INVITATION
 * Luxury Interactive Engine with YouTube Audio (Aaro Nee from 1:15),
 * Magic Wish Generator, Calendar Integration, and Lightbox Gallery
 */

(function () {
  'use strict';

  // --- WEDDING TARGET DATE (January 17, 2027, 11:30 AM IST) ---
  const WEDDING_DATE = new Date('2027-01-17T11:30:00+05:30').getTime();

  // --- DOM ELEMENTS ---
  const invitationCover = document.getElementById('invitation-cover');
  const btnOpenInvite = document.getElementById('btn-open-invite');
  const weddingAudio = document.getElementById('wedding-audio');
  const audioControlBtn = document.getElementById('audio-control-btn');
  const scrollProgressBar = document.getElementById('scroll-progress-bar');
  const btnBackToTop = document.getElementById('btn-back-to-top');
  const particlesCanvas = document.getElementById('particles-canvas');

  // Countdown Elements
  const countDays = document.getElementById('count-days');
  const countHours = document.getElementById('count-hours');
  const countMinutes = document.getElementById('count-minutes');
  const countSeconds = document.getElementById('count-seconds');

  // Lightbox Elements
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  // Wishes Elements
  const wishesForm = document.getElementById('wishes-form');
  const wishesFeed = document.getElementById('wishes-feed');
  const btnMagicWish = document.getElementById('btn-magic-wish');
  const wishMessageInput = document.getElementById('wish-message');

  // RSVP Elements
  const rsvpModal = document.getElementById('rsvp-modal');
  const rsvpOpenBtns = document.querySelectorAll('.trigger-rsvp-modal');
  const rsvpCloseBtn = document.getElementById('rsvp-modal-close');
  const rsvpForm = document.getElementById('rsvp-form');

  let isAudioPlaying = false;
  let currentGalleryIndex = 0;
  let galleryItems = [];

  // ==========================================================================
  // 1. YOUTUBE MUSIC PLAYER ENGINE ("Sana - Aaro Nee" From 1:15 = 75 seconds)
  // ==========================================================================
  let ytPlayer = null;
  let ytReady = false;

  window.onYouTubeIframeAPIReady = function () {
    try {
      ytPlayer = new YT.Player('youtube-player', {
        height: '1',
        width: '1',
        videoId: 'il7oBI7lpNU', // YouTube ID for Sana - Aaro Nee
        playerVars: {
          autoplay: 0,
          controls: 0,
          loop: 1,
          playlist: 'il7oBI7lpNU',
          start: 75, // Starts at 1:15
          modestbranding: 1,
          playsinline: 1
        },
        events: {
          onReady: function () {
            ytReady = true;
          },
          onStateChange: function (event) {
            if (event.data === YT.PlayerState.PLAYING) {
              isAudioPlaying = true;
              updateAudioUI(true);
            } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
              isAudioPlaying = false;
              updateAudioUI(false);
            }
          }
        }
      });
    } catch (e) {
      console.warn('YouTube IFrame API initialization error:', e);
    }
  };

  function updateAudioUI(playing) {
    if (!audioControlBtn) return;
    const label = audioControlBtn.querySelector('.audio-text-label');
    if (playing) {
      audioControlBtn.classList.add('playing');
      if (label) label.textContent = 'Aaro Nee ♪';
    } else {
      audioControlBtn.classList.remove('playing');
      if (label) label.textContent = 'Music';
    }
  }

  function startWeddingMusic() {
    isAudioPlaying = true;
    updateAudioUI(true);

    // 1. Try YouTube Player (starts from 1:15)
    if (ytPlayer && ytReady && typeof ytPlayer.seekTo === 'function') {
      try {
        ytPlayer.seekTo(75, true);
        ytPlayer.playVideo();
        return;
      } catch (err) {
        console.warn('YouTube playback error:', err);
      }
    }

    // 2. Fallback to local audio element
    if (weddingAudio) {
      weddingAudio.currentTime = 0;
      const promise = weddingAudio.play();
      if (promise !== undefined) {
        promise.catch(() => playWebAudioMelody());
      }
    } else {
      playWebAudioMelody();
    }
  }

  function toggleMusic() {
    if (isAudioPlaying) {
      isAudioPlaying = false;
      updateAudioUI(false);

      if (ytPlayer && ytReady && typeof ytPlayer.pauseVideo === 'function') {
        try { ytPlayer.pauseVideo(); } catch (e) {}
      }
      if (weddingAudio) weddingAudio.pause();
      stopWebAudioMelody();
    } else {
      isAudioPlaying = true;
      updateAudioUI(true);

      if (ytPlayer && ytReady && typeof ytPlayer.playVideo === 'function') {
        try {
          ytPlayer.playVideo();
          return;
        } catch (e) {}
      }
      if (weddingAudio) {
        weddingAudio.play().catch(() => playWebAudioMelody());
      } else {
        playWebAudioMelody();
      }
    }
  }

  if (audioControlBtn) {
    audioControlBtn.addEventListener('click', toggleMusic);
  }

  // ==========================================================================
  // 2. WEB AUDIO SYNTHESIZER FALLBACK
  // ==========================================================================
  let webAudioCtx = null;
  let synthInterval = null;

  function playWebAudioMelody() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!webAudioCtx) webAudioCtx = new AudioContext();
      if (webAudioCtx.state === 'suspended') webAudioCtx.resume();

      const notes = [
        293.66, 440.0, 587.33, 739.99,
        220.0, 329.63, 440.0, 659.25,
        246.94, 369.99, 493.88, 587.33,
        185.0, 277.18, 369.99, 554.37,
        196.0, 293.66, 392.0, 493.88,
        146.83, 293.66, 440.0, 587.33,
        196.0, 392.0, 493.88, 587.33,
        220.0, 329.63, 440.0, 554.37
      ];

      let noteIdx = 0;
      if (synthInterval) clearInterval(synthInterval);

      function triggerNextNote() {
        if (!isAudioPlaying || !webAudioCtx) return;
        const freq = notes[noteIdx % notes.length];
        noteIdx++;

        const now = webAudioCtx.currentTime;
        const osc = webAudioCtx.createOscillator();
        const gain = webAudioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(gain);
        gain.connect(webAudioCtx.destination);

        osc.start(now);
        osc.stop(now + 1.85);
      }

      synthInterval = setInterval(triggerNextNote, 420);
    } catch (e) {
      console.warn('Web Audio synthesis error:', e);
    }
  }

  function stopWebAudioMelody() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  }

  // ==========================================================================
  // 3. OPENING INVITATION TRANSITION & AUTO-SCROLL ENGINE
  // ==========================================================================
  let autoScrollTimer = null;
  let autoScrollRafId = null;
  let isAutoScrolling = false;
  let isProgrammaticScroll = false;
  let autoScrollCurrentY = 0;
  let lastAutoScrollTimestamp = null;
  const AUTO_SCROLL_SPEED = 42; // pixels/sec (gentle, readable luxury pace)

  const userInteractionEvents = [
    'wheel',
    'touchstart',
    'touchmove',
    'pointerdown',
    'mousedown',
    'keydown'
  ];

  function onUserScrollInteraction() {
    stopAutoScroll();
  }

  function attachAutoScrollUserListeners() {
    userInteractionEvents.forEach((evt) => {
      window.addEventListener(evt, onUserScrollInteraction, { passive: true, capture: true });
    });
  }

  function removeAutoScrollUserListeners() {
    userInteractionEvents.forEach((evt) => {
      window.removeEventListener(evt, onUserScrollInteraction, { capture: true });
    });
  }

  function stopAutoScroll() {
    if (autoScrollTimer) {
      clearTimeout(autoScrollTimer);
      autoScrollTimer = null;
    }
    if (autoScrollRafId) {
      cancelAnimationFrame(autoScrollRafId);
      autoScrollRafId = null;
    }
    isAutoScrolling = false;
    isProgrammaticScroll = false;
    removeAutoScrollUserListeners();
  }

  function autoScrollStep(timestamp) {
    if (!isAutoScrolling) return;

    if (!lastAutoScrollTimestamp) {
      lastAutoScrollTimestamp = timestamp;
    }

    const delta = (timestamp - lastAutoScrollTimestamp) / 1000;
    lastAutoScrollTimestamp = timestamp;

    autoScrollCurrentY += AUTO_SCROLL_SPEED * delta;
    isProgrammaticScroll = true;
    window.scrollTo(0, autoScrollCurrentY);

    const maxScroll = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    ) - window.innerHeight;

    if (autoScrollCurrentY >= maxScroll - 4) {
      stopAutoScroll();
      return;
    }

    autoScrollRafId = requestAnimationFrame(autoScrollStep);
  }

  function startAutoScroll() {
    stopAutoScroll();
    isAutoScrolling = true;
    autoScrollCurrentY = window.scrollY || window.pageYOffset || 0;
    lastAutoScrollTimestamp = null;
    attachAutoScrollUserListeners();
    autoScrollRafId = requestAnimationFrame(autoScrollStep);
  }

  function scheduleAutoScroll(delayMs = 2000) {
    stopAutoScroll();

    // Attach listeners after a short delay so the initial tap/click doesn't instantly cancel
    setTimeout(() => {
      attachAutoScrollUserListeners();
    }, 300);

    autoScrollTimer = setTimeout(() => {
      startAutoScroll();
    }, delayMs);
  }

  if (btnOpenInvite && invitationCover) {
    btnOpenInvite.addEventListener('click', () => {
      // 1. Play "Aaro Nee" from 1:15
      startWeddingMusic();

      // 2. Animate cover unveil
      invitationCover.classList.add('opened');

      // 3. Start smooth, slow auto-scroll 2 seconds after opening
      scheduleAutoScroll(2000);

      // 4. Remove cover from layout after animation completes
      setTimeout(() => {
        invitationCover.style.display = 'none';
        triggerScrollReveals();
      }, 1200);
    });
  }

  // ==========================================================================
  // 4. PARTICLES CANVAS (Golden Bokeh & Floating Jasmine Blossoms)
  // ==========================================================================
  function initParticles() {
    if (!particlesCanvas) return;
    const ctx = particlesCanvas.getContext('2d');
    let width = (particlesCanvas.width = window.innerWidth);
    let height = (particlesCanvas.height = window.innerHeight);

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 18), 75);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 80;
        this.size = Math.random() * 2.5 + 0.8;
        this.speedY = Math.random() * 0.6 + 0.25;
        this.speedX = (Math.random() - 0.5) * 0.35;
        this.opacity = Math.random() * 0.7 + 0.2;
        this.fadeSpeed = Math.random() * 0.006 + 0.002;
        this.fadeDirection = 1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.isFloral = Math.random() < 0.25;

        const goldColors = ['223, 186, 115', '255, 240, 208', '242, 209, 121'];
        this.color = this.isFloral ? '225, 236, 251' : goldColors[Math.floor(Math.random() * goldColors.length)];
      }
      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        this.opacity += this.fadeSpeed * this.fadeDirection;
        if (this.opacity >= 0.85) this.fadeDirection = -1;
        if (this.opacity <= 0.15) this.fadeDirection = 1;

        if (this.y < -20 || this.x < -20 || this.x > width + 20) {
          this.reset();
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        if (this.isFloral) {
          ctx.beginPath();
          const r = this.size * 2.2;
          for (let p = 0; p < 4; p++) {
            ctx.rotate(Math.PI / 2);
            ctx.ellipse(0, -r, r * 0.45, r * 0.85, 0, 0, Math.PI * 2);
          }
          ctx.fillStyle = `rgba(${this.color}, ${this.opacity * 0.85})`;
          ctx.shadowBlur = this.size * 4;
          ctx.shadowColor = `rgba(225, 236, 251, 0.7)`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
          ctx.shadowBlur = this.size * 5;
          ctx.shadowColor = `rgba(${this.color}, 0.8)`;
          ctx.fill();
        }

        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      const p = new Particle();
      p.y = Math.random() * height;
      particles.push(p);
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      width = particlesCanvas.width = window.innerWidth;
      height = particlesCanvas.height = window.innerHeight;
    });

    animate();
  }

  // ==========================================================================
  // 5. COUNTDOWN TIMER ENGINE (January 17, 2027 at 11:30 AM IST)
  // ==========================================================================
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = WEDDING_DATE - now;

    const cdDays = document.getElementById('cd-days');
    const cdHours = document.getElementById('cd-hours');
    const cdMin = document.getElementById('cd-min');
    const cdSec = document.getElementById('cd-sec');

    if (distance <= 0) {
      if (cdDays) cdDays.textContent = '0';
      if (cdHours) cdHours.textContent = '0';
      if (cdMin) cdMin.textContent = '0';
      if (cdSec) cdSec.textContent = '0';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (cdDays) cdDays.textContent = String(days);
    if (cdHours) cdHours.textContent = String(hours);
    if (cdMin) cdMin.textContent = String(minutes);
    if (cdSec) cdSec.textContent = String(seconds);
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // ==========================================================================
  // 6. ADD TO CALENDAR (.ICS & GOOGLE CALENDAR)
  // ==========================================================================
  const btnAddCalendar = document.getElementById('btn-add-calendar');

  if (btnAddCalendar) {
    btnAddCalendar.addEventListener('click', (e) => {
      e.preventDefault();
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Subin & Rosmy Wedding//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:subin-rosmy-wedding-20270117@rayarome',
        'DTSTAMP:20261124T000000Z',
        'DTSTART:20270117T060000Z',
        'DTEND:20270117T110000Z',
        'SUMMARY:Holy Matrimony of Subin Sojan & Rosmy Davis',
        'DESCRIPTION:Join us for the Holy Matrimony of Subin Sojan & Rosmy Davis at St. Sebastian Church Rayarome Kannur followed by Reception at Parish Hall.',
        'LOCATION:St. Sebastian\'s Church, Rayarome, Alakode, Kannur, Kerala',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Subin_and_Rosmy_Wedding.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showNotification('Wedding event saved to your calendar! 📅');
    });
  }

  if (btnGoogleCalendar) {
    btnGoogleCalendar.addEventListener('click', (e) => {
      e.preventDefault();
      const title = encodeURIComponent('Holy Matrimony of Subin Sojan & Rosmy Davis');
      const details = encodeURIComponent('Celebration of Holy Matrimony at St. Sebastian\'s Church, Rayarome, Kannur, followed by wedding reception at Church Parish Hall.');
      const location = encodeURIComponent('St. Sebastian\'s Church, Rayarome, Alakode, Kannur, Kerala');
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20270117T060000Z/20270117T110000Z&details=${details}&location=${location}`;
      window.open(gcalUrl, '_blank');
    });
  }

  // ==========================================================================
  // 7. 3D COVERFLOW GALLERY & LIGHTBOX (Exactly matching Image 2)
  // ==========================================================================
  let coverflowCards = [];
  let coverflowThumbs = [];
  let currentCoverIndex = 0;

  const galleryImagesData = [
    { src: 'images/gallery1.jpg', title: 'Subin & Rosmy • Nuptial Grace' },
    { src: 'images/gallery2.jpg', title: 'Cherished Smiles • Watercolor Masterpiece' },
    { src: 'images/gallery3.jpg', title: 'Together in Love • Radiant Smiles' },
    { src: 'images/gallery4.jpg', title: 'Endless Grace • Traditional Elegance' }
  ];

  function updateCoverflow(index) {
    if (!coverflowCards.length) return;
    const total = coverflowCards.length;
    currentCoverIndex = (index + total) % total;

    coverflowCards.forEach((card, i) => {
      card.classList.remove('active', 'prev', 'next');
      if (i === currentCoverIndex) {
        card.classList.add('active');
      } else if (i === (currentCoverIndex - 1 + total) % total) {
        card.classList.add('prev');
      } else if (i === (currentCoverIndex + 1) % total) {
        card.classList.add('next');
      }
    });

    coverflowThumbs.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === currentCoverIndex);
    });

    // Update Scrubber Progress
    const scrubberProgress = document.getElementById('gallery-scrubber-progress');
    const scrubberThumb = document.getElementById('gallery-scrubber-thumb');
    const pct = ((currentCoverIndex + 1) / total) * 100;
    if (scrubberProgress) scrubberProgress.style.width = `${pct}%`;
    if (scrubberThumb) scrubberThumb.style.left = `${pct}%`;
  }

  function initGallery() {
    coverflowCards = Array.from(document.querySelectorAll('.coverflow-card'));
    coverflowThumbs = Array.from(document.querySelectorAll('.thumb-btn'));

    if (!coverflowCards.length) return;

    coverflowCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        if (card.classList.contains('active')) {
          openLightbox(index);
        } else if (card.classList.contains('prev')) {
          updateCoverflow(currentCoverIndex - 1);
        } else if (card.classList.contains('next')) {
          updateCoverflow(currentCoverIndex + 1);
        } else {
          updateCoverflow(index);
        }
      });
    });

    coverflowThumbs.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        updateCoverflow(index);
      });
    });

    // Touch gesture swipe support
    const track = document.querySelector('.coverflow-track');
    if (track) {
      let touchStartX = 0;
      let touchEndX = 0;

      track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const threshold = 40;
        if (touchEndX < touchStartX - threshold) {
          updateCoverflow(currentCoverIndex + 1);
        } else if (touchEndX > touchStartX + threshold) {
          updateCoverflow(currentCoverIndex - 1);
        }
      }, { passive: true });
    }

    updateCoverflow(0);
  }

  function openLightbox(index) {
    if (!galleryImagesData[index]) return;
    currentGalleryIndex = index;
    const data = galleryImagesData[index];

    if (lightboxImg) {
      lightboxImg.src = data.src;
      lightboxImg.alt = data.title;
    }
    if (lightboxTitle) {
      lightboxTitle.textContent = data.title;
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentGalleryIndex + 1} of ${galleryImagesData.length}`;
    }

    if (lightbox) {
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function nextLightbox() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryImagesData.length;
    openLightbox(currentGalleryIndex);
    updateCoverflow(currentGalleryIndex);
  }

  function prevLightbox() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryImagesData.length) % galleryImagesData.length;
    openLightbox(currentGalleryIndex);
    updateCoverflow(currentGalleryIndex);
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightbox);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
  });

  // ==========================================================================
  // 8. GUESTBOOK & AI MAGIC WAND (🪄)
  // ==========================================================================
  const MAGIC_BLESSINGS = [
    "Wishing Subin & Rosmy a lifetime of divine love, peace, and endless blessings as you unite in Holy Matrimony! 🥂✨",
    "Heartiest congratulations! May your home be filled with laughter, faith, and cherished memories for all eternity! 💍❤️",
    "May the Lord bless your marriage and guide your steps together. Congratulations Subin & Rosmy! 🕊️✨",
    "Warmest congratulations to the Mylakkattu and Payyappilly families on this beautiful and blessed union! 🎉",
    "\"A cord of three strands is not quickly broken.\" May your love continue to grow deeper every single day! 🌹",
    "Dear Subin & Rosmy, sending you our warmest wishes and prayers on this joyous milestone! Cheers to your forever! 🥂",
    "May God grant you both happiness, good health, and abundant joy as you start this wonderful journey together! 💒✨"
  ];

  let magicIndex = 0;
  if (btnMagicWish && wishMessageInput) {
    btnMagicWish.addEventListener('click', () => {
      const selected = MAGIC_BLESSINGS[magicIndex % MAGIC_BLESSINGS.length];
      magicIndex++;
      wishMessageInput.value = selected;
      btnMagicWish.classList.add('pulse-magic');
      setTimeout(() => btnMagicWish.classList.remove('pulse-magic'), 500);
      showNotification('Magic blessing generated! ✨');
    });
  }

  const INITIAL_WISHES = [
    {
      name: 'Mila Irene',
      relation: 'Family',
      message: 'Hearty congratulations dearest Subin & Rosmy! May God guide your steps, bless your home with boundless love, peace, and abundance!',
      date: 'November 2026'
    },
    {
      name: 'Susmi & Salas',
      relation: 'Family & Friends',
      message: 'Wishing you both a lifetime of love and joy! "A cord of three strands is not quickly broken" — so proud and happy for you both!',
      date: 'November 2026'
    },
    {
      name: 'Sunny & Family',
      relation: 'Well-wishers',
      message: 'Warmest congratulations to the Mylakkattu and Payyappilly families. Looking forward to celebrating this blessed union at Rayarome!',
      date: 'November 2026'
    }
  ];

  function loadWishes() {
    if (!wishesFeed) return;
    let wishes = [];
    try {
      const stored = localStorage.getItem('subin_rosmy_wishes');
      wishes = stored ? JSON.parse(stored) : INITIAL_WISHES;
    } catch (e) {
      wishes = INITIAL_WISHES;
    }

    wishesFeed.innerHTML = '';
    wishes.forEach((item) => renderWishItem(item));
  }

  function renderWishItem(item) {
    if (!wishesFeed) return;
    const card = document.createElement('div');
    card.className = 'wish-item-bubble';
    card.innerHTML = `
      <div class="wish-sender-header">
        <span class="wish-sender-name">${escapeHTML(item.name)} <small style="font-size:0.75rem; color: var(--gold-champagne); font-weight:normal;">(${escapeHTML(item.relation || 'Guest')})</small></span>
        <span class="wish-timestamp">${escapeHTML(item.date)}</span>
      </div>
      <p class="wish-text">${escapeHTML(item.message)}</p>
    `;
    wishesFeed.prepend(card);
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, (tag) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  if (wishesForm) {
    wishesForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('wish-name');
      const relationInput = document.getElementById('wish-relation');
      const messageInput = document.getElementById('wish-message');

      const name = nameInput.value.trim() || 'Evin Benny';
      const relation = relationInput.value.trim() || 'Guest';
      const message = messageInput.value.trim();

      if (!message) return;

      const newWish = {
        name,
        relation,
        message,
        date: 'Just now'
      };

      try {
        let stored = localStorage.getItem('subin_rosmy_wishes');
        let wishes = stored ? JSON.parse(stored) : [...INITIAL_WISHES];
        wishes.push(newWish);
        localStorage.setItem('subin_rosmy_wishes', JSON.stringify(wishes));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }

      renderWishItem(newWish);
      messageInput.value = '';
      showNotification('Thank you! Your heartfelt blessing has been recorded ✨');
    });
  }

  // ==========================================================================
  // 9. RSVP MODAL
  // ==========================================================================
  rsvpOpenBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (rsvpModal) {
        rsvpModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (rsvpCloseBtn) {
    rsvpCloseBtn.addEventListener('click', () => {
      if (rsvpModal) {
        rsvpModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  if (rsvpModal) {
    rsvpModal.addEventListener('click', (e) => {
      if (e.target === rsvpModal) {
        rsvpModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const guestName = document.getElementById('rsvp-name').value || 'Evin Benny';
      const attendance = document.querySelector('input[name="attendance"]:checked')?.value || 'attending';

      if (rsvpModal) {
        rsvpModal.classList.remove('active');
        document.body.style.overflow = '';
      }

      const msg = attendance === 'attending'
        ? `Dear ${guestName}, we are delighted that you will celebrate with us on January 17, 2027! 🥂`
        : `Dear ${guestName}, thank you for letting us know. You will be warmly in our hearts! ✨`;

      showNotification(msg);
    });
  }

  function showNotification(msg) {
    const toast = document.createElement('div');
    toast.className = 'wedding-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 2.5rem;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: linear-gradient(135deg, #0e1d3e, #071025);
      border: 1px solid var(--gold-primary);
      color: var(--gold-light);
      padding: 1rem 2rem;
      border-radius: 40px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(223, 186, 115, 0.4);
      font-family: var(--font-serif);
      font-size: 1.15rem;
      text-align: center;
      z-index: 999999;
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      max-width: 90vw;
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 400);
    }, 4200);
  }

  // Share Invitation Button
  const btnShareInvite = document.getElementById('btn-share-invite');
  if (btnShareInvite) {
    btnShareInvite.addEventListener('click', async () => {
      const shareData = {
        title: 'Wedding Invitation: Subin & Rosmy',
        text: 'Subin Sojan & Rosmy Davis cordially invite you to celebrate their Holy Matrimony on January 17, 2027.',
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {}
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
          showNotification('Invitation link copied to clipboard! 📋');
        });
      }
    });
  }

  // ==========================================================================
  // 10. SCROLL REVEALS & PROGRESS
  // ==========================================================================
  function triggerScrollReveals() {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;

    reveals.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= windowHeight * 0.9) {
        el.classList.add('revealed');
      }
    });
  }

  function handleScroll() {
    if (isAutoScrolling) {
      if (isProgrammaticScroll) {
        isProgrammaticScroll = false;
      } else {
        stopAutoScroll();
      }
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    if (scrollProgressBar && scrollHeight > 0) {
      const progress = (scrollTop / scrollHeight) * 100;
      scrollProgressBar.style.width = `${progress}%`;
    }

    if (btnBackToTop) {
      if (scrollTop > 450) {
        btnBackToTop.classList.add('visible');
      } else {
        btnBackToTop.classList.remove('visible');
      }
    }

    triggerScrollReveals();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  if (btnBackToTop) {
    btnBackToTop.addEventListener('click', () => {
      stopAutoScroll();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initGallery();
    loadWishes();
    triggerScrollReveals();

    // If invitation cover is already opened or dismissed, schedule auto-scroll after 2s
    if (!invitationCover || invitationCover.style.display === 'none' || invitationCover.classList.contains('opened')) {
      scheduleAutoScroll(2000);
    }
  });

})();
