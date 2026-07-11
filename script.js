// ==================================================
// Open Me, Darling — vanilla JS state machine
// ==================================================

const CORRECT_PASSWORD = '021425';

const INTRO_LINES = [
  'Hi Darling...',
  'I made something for you.',
  'I hope this makes you smile.',
  'Please stay until the end.',
];

const MEMORIES = [
  { src: 'photo1.jpeg', caption: "Every story has a beginning, and you're my favorite chapter.", rotate: -4 },

  { src: 'photo2.jpeg', caption: "One smile from you can brighten my whole day.", rotate: 3 },

  { src: 'photo3.jpeg', caption: "Home has never been a place — it has always been you.", rotate: -3 },

  { src: 'photo4.jpeg', caption: "The best memories are the ones we create together.", rotate: 4 },

  { src: 'photo5.jpeg', caption: "My favorite future is the one that has you in it. ❤️", rotate: -2 },

  { src: 'photo6.jpeg', caption: "Every moment with you is a memory I'll always treasure.", rotate: 2 },

  { src: 'photo7.jpeg', caption: "You make even the ordinary days feel magical.", rotate: -5 },

  { src: 'photo8.jpeg', caption: "Every picture tells a story, and ours is my favorite.", rotate: 4 },

  { src: 'photo9.jpeg', caption: "No matter where life takes us, I'll always choose you.", rotate: -3 },

  { src: 'photo10.jpeg', caption: "This is only the beginning of our forever. ❤️", rotate: 3 },

  { src: 'photo11.jpeg', caption: "Thank you for every beautiful memory we've made together. ❤️", rotate: -4 },
];

const BIRTHDAY_LINES = [
  "Today isn't just another monthsary.",
  "It's also my birthday.",
  "I don't need expensive gifts.",
  "Because having you is already the greatest gift I've ever received.",
  'Thank you for choosing me every single day.',
];

/* ---------------- helpers ---------------- */

function $(id) {
  return document.getElementById(id);
}

function showPage(id) {
  document.querySelectorAll('.page').forEach((el) => el.classList.remove('active'));
  const page = $(id);
  page.classList.remove('active'); // reset animation
  // force reflow so the fade-in animation replays
  void page.offsetWidth;
  page.classList.add('active');
}

/** Spawns a field of slowly rising decorative hearts inside `container`. */
function spawnFloatingHearts(container, count = 14) {
  if (!container || container.dataset.spawned) return;
  container.dataset.spawned = 'true';
  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.className = 'floating-heart';
    span.textContent = '❤';
    const left = Math.random() * 100;
    const size = 12 + Math.random() * 22;
    const duration = 9 + Math.random() * 9;
    const delay = Math.random() * 10;
    const opacity = 0.25 + Math.random() * 0.4;
    const drift = (Math.random() - 0.5) * 80;
    const scale = 0.7 + Math.random() * 0.8;
    span.style.left = `${left}%`;
    span.style.fontSize = `${size}px`;
    span.style.animationDuration = `${duration}s`;
    span.style.animationDelay = `${delay}s`;
    span.style.setProperty('--o', opacity);
    span.style.setProperty('--drift', `${drift}px`);
    span.style.setProperty('--s', scale);
    container.appendChild(span);
  }
}

/**
 * Types `text` into `el` at `speed` ms/char, then calls `onDone`.
 * Returns a cancel function.
 */
function typewriter(el, text, speed, startDelay, onDone) {
  let index = 0;
  let interval;
  el.textContent = '';

  const timeout = setTimeout(() => {
    interval = setInterval(() => {
      index += 1;
      el.textContent = text.slice(0, index);
      if (index >= text.length) {
        clearInterval(interval);
        if (onDone) onDone();
      }
    }, speed);
  }, startDelay || 0);

  return () => {
    clearTimeout(timeout);
    if (interval) clearInterval(interval);
  };
}

/* ================================================
   PASSWORD PAGE
   ================================================ */

function initPasswordPage(onCorrect) {
  spawnFloatingHearts($('hearts-password'), 16);

  const form = $('password-form');
  const input = $('password-input');
  const errorText = $('password-error');
  const card = document.querySelector('.password-card');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value.trim() === CORRECT_PASSWORD) {
      errorText.textContent = '';
      onCorrect();
    } else {
      errorText.textContent = "Hmm... that's not it, darling. 🤍";
      card.classList.remove('shake');
      void card.offsetWidth;
      card.classList.add('shake');
    }
  });

  input.addEventListener('input', () => {
    errorText.textContent = '';
  });
}

/* ================================================
   INTRO PAGE
   ================================================ */

function initIntroPage(onDone) {
  spawnFloatingHearts($('hearts-intro'), 10);
  const typedEl = $('intro-typed');

  function playLine(index) {
    if (index >= INTRO_LINES.length) {
      setTimeout(onDone, 900);
      return;
    }
    const isLast = index === INTRO_LINES.length - 1;
    typewriter(typedEl, INTRO_LINES[index], 48, 300, () => {
      setTimeout(() => playLine(index + 1), isLast ? 1400 : 900);
    });
  }

  playLine(0);
}

/* ================================================
   MUSIC PAGE
   ================================================ */

function initMusicPage(onNext) {
  spawnFloatingHearts($('hearts-music'), 12);

  const audio = $('bg-audio');
  const playBtn = $('play-btn');
  const iconPlay = $('icon-play');
  const iconPause = $('icon-pause');
  const disc = $('vinyl-disc');
  const card = $('music-card');

  let isPlaying = false;

  function updateUI() {
    iconPlay.style.display = isPlaying ? 'none' : 'block';
    iconPause.style.display = isPlaying ? 'block' : 'none';
    disc.classList.toggle('spinning', isPlaying);
    card.classList.toggle('pulse-glow', isPlaying);
  }

  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      updateUI();
    } else {
      audio.play().then(() => {
        isPlaying = true;
        updateUI();
      }).catch(() => {
        isPlaying = false;
        updateUI();
      });
    }
  });

  $('music-next').addEventListener('click', onNext);
}

/* ================================================
   MEMORIES PAGE
   ================================================ */

function initMemoriesPage(onNext) {
  const list = $('polaroid-list');
  list.innerHTML = '';

  MEMORIES.forEach((memory) => {
    const card = document.createElement('div');
    card.className = 'polaroid';
    card.style.setProperty('--rot', `${memory.rotate}deg`);

    const img = document.createElement('img');
    img.src = memory.src;
    img.alt = memory.caption;
    img.loading = 'lazy';

    const caption = document.createElement('p');
    caption.className = 'polaroid-caption';
    caption.textContent = memory.caption;

    card.appendChild(img);
    card.appendChild(caption);
    list.appendChild(card);
  });

  // Fade in each polaroid as it scrolls into view.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 },
  );
  list.querySelectorAll('.polaroid').forEach((el) => observer.observe(el));

  $('memories-next').addEventListener('click', onNext, { once: true });
}



/* ================================================
   LETTER PAGE
   ================================================ */

function initLetterPage(onNext) {
  spawnFloatingHearts($('hearts-letter'), 14);

  const textEl = $('letter-text');
  const errorEl = $('letter-error');
  const nextWrap = $('letter-next-wrap');

  fetch('letter.txt')
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load letter: ${res.status}`);
      return res.text();
    })
    .then((text) => {
      typewriter(textEl, text, 22, 400, () => {
        nextWrap.style.display = 'flex';
      });
    })
    .catch(() => {
      errorEl.textContent = "I couldn't load the letter right now. Please refresh and try again. 🤍";
    });

  $('letter-next').addEventListener('click', onNext, { once: true });
}

/* ================================================
   BIRTHDAY SURPRISE PAGE
   ================================================ */

function initBirthdayPage(onNext) {
  spawnFloatingHearts($('hearts-birthday'), 12);

  const textEl = $('birthday-text');
  const btn = $('birthday-next');

  let stage = 'wait';
  let revealIndex = 0;

  function render() {
    if (stage === 'wait') {
      textEl.innerHTML = 'Wait...<br><span style="font-style:normal;font-size:0.85em;opacity:0.85">There is one more thing.</span>';
      btn.textContent = 'Click to continue';
    } else {
      textEl.textContent = BIRTHDAY_LINES[revealIndex];
      btn.textContent =
        revealIndex < BIRTHDAY_LINES.length - 1 ? 'Continue' : 'One last thing ❤️';
    }
  }

  render();

  btn.addEventListener('click', () => {
    if (stage === 'wait') {
      stage = 'reveal';
      render();
      return;
    }
    if (revealIndex < BIRTHDAY_LINES.length - 1) {
      revealIndex += 1;
      render();
    } else {
      onNext();
    }
  });
}

/* ================================================
   FINAL GIFT PAGE
   ================================================ */

function initGiftPage() {
  spawnFloatingHearts($('hearts-gift'), 16);

  const sparkleContainer = $('sparkles');
  if (!sparkleContainer.dataset.spawned) {
    sparkleContainer.dataset.spawned = 'true';
    for (let i = 0; i < 18; i++) {
      const span = document.createElement('span');
      span.className = 'sparkle';
      span.textContent = '✦';
      const left = 10 + Math.random() * 80;
      const top = 5 + Math.random() * 70;
      const size = 8 + Math.random() * 12;
      const duration = 1.6 + Math.random() * 1.8;
      const delay = Math.random() * 3;
      span.style.left = `${left}%`;
      span.style.top = `${top}%`;
      span.style.fontSize = `${size}px`;
      span.style.animationDuration = `${duration}s`;
      span.style.animationDelay = `${delay}s`;
      sparkleContainer.appendChild(span);
    }
  }

  const box = $('gift-box');
  const lid = $('gift-lid');
  const heading = $('gift-heading');
  const hint = $('gift-hint');
  const finalText = $('gift-final-text');
  const heart = $('gift-heart');

  box.classList.add('shaking');

  box.addEventListener(
    'click',
    () => {
      box.classList.remove('shaking');
      lid.classList.add('opened');
      heart.classList.add('visible');
      heading.textContent = "Happy Monthsary, my love \u2014 and happy birthday to me, because you're my favorite gift.";
      hint.style.display = 'none';
      finalText.style.display = 'block';
    },
    { once: true },
  );
}

/* ================================================
   Boot the state machine
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPasswordPage(() => {
    showPage('page-intro');
    initIntroPage(() => {
      showPage('page-music');
      initMusicPage(() => {
        showPage('page-memories');
        initMemoriesPage(() => {
          showPage('page-letter');
          initLetterPage(() => {
            showPage('page-birthday');
            initBirthdayPage(() => {
              showPage('page-gift');
              initGiftPage();
            });
          });
        });
      });
    });
  });
});