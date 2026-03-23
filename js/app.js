// ============================================================
//              ANIME.JS ANIMATIONS (FULL REPLACEMENT)
// ============================================================

// ============================================
// LOADING SCREEN
// ============================================

// Check localStorage (once per browser)
if (!localStorage.getItem('portfolioLoadingSeen')) {
  showLoadingScreen();
} else {
  document.getElementById('loading-screen').style.display = 'none';
  animateContent();
}

function showLoadingScreen() {
  // Timeline dial loading
  const loadingTL = anime.timeline({
    easing: 'easeOutExpo'
  });

  // Logo entrance
  loadingTL
  .add({
    targets: '.loading-logo',
    opacity: [0, 1],
    scale: [0.8, 1.2],
    duration: 800
  })
  .add({
    targets: '.loading-logo',
    scale: 1,
    duration: 400,
    easing: 'easeOutElastic(1, .5)'
  })
  // Text reveal
  .add({
    targets: '.loading-text',
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 600,
    easing: 'easeOutCubic'
  }, '-=200')
  .add({
    targets: '.loading-subtitle',
    opacity: [0, 1],
    duration: 500,
    easing: 'easeOutQuad'
  }, '-=300')
  // Progress bar
  .add({
    targets: '.loading-bar',
    opacity: [0, 1],
    duration: 400
  }, '-=200')
  .add({
    targets: '.loading-percentage',
    opacity: [0, 1],
    duration: 300
  }, '-=100');

  // Progress simulation
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 100) progress = 100;
    
    // Animate bar width
    anime({
      targets: '.loading-bar-fill',
      width: `${progress}%`,
      duration: 300,
      easing: 'easeOutQuad'
    });
    
    document.querySelector('.loading-percentage').textContent = `${Math.floor(progress)}%`;
    
    if (progress >= 100) {
      clearInterval(progressInterval);
      
      // Save to localStorage
      localStorage.setItem('portfolioLoadingSeen', 'true');
      
      // Hide loading screen
      setTimeout(() => {
        anime({
          targets: '#loading-screen',
          opacity: 0,
          duration: 800,
          easing: 'easeInOutQuad',
          complete: () => {
            document.getElementById('loading-screen').style.display = 'none';
            animateContent();
          }
        });
      }, 500);
    }
  }, 300);
}

// ============================================
// CONTENT ENTRANCE ANIMATIONS
// ============================================

function animateContent() {
  const contentTL = anime.timeline();
  
  // Header slides down
  contentTL.add({
    targets: 'header',
    opacity: [0, 1],
    translateY: [-100, 0],
    duration: 800,
    easing: 'easeOutCubic'
  })
  // Hero fades in
  .add({
    targets: '.hero',
    opacity: [0, 1],
    duration: 1000,
    easing: 'easeOutQuad'
  }, '-=400')
  // Hero h1
  .add({
    targets: '.hero h1',
    translateY: [50, 0],
    opacity: [0, 1],
    duration: 800,
    easing: 'easeOutCubic'
  }, '-=600')
  // Hero p
  .add({
    targets: '.hero p',
    translateY: [30, 0],
    opacity: [0, 1],
    duration: 600,
    easing: 'easeOutQuad'
  }, '-=400')
  // Hero buttons stagger
  .add({
    targets: '.hero .btns .btn',
    translateY: [20, 0],
    opacity: [0, 1],
    duration: 500,
    delay: anime.stagger(150),
    easing: 'easeOutBack(1.4)'
  }, '-=300');
}

// ============================================
// SCROLL ANIMATIONS (IntersectionObserver)
// ============================================

// Custom scroll animation helper
function scrollAnimate(targets, options, triggerSelector, triggerOptions = {}) {
  const elements = document.querySelectorAll(targets);
  const trigger = triggerSelector ? document.querySelector(triggerSelector) : null;
  
  const defaultOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -10% 0px',
    once: true
  };
  
  const config = { ...defaultOptions, ...triggerOptions };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        anime({
          targets: entry.target.nodeType ? entry.target : elements,
          ...options
        });
        if (config.once) observer.unobserve(entry.target);
      }
    });
  }, config);
  
  if (trigger) {
    observer.observe(trigger);
  } else {
    elements.forEach(el => observer.observe(el));
  }
}

// Skills icons animation
scrollAnimate('.slide-track img', {
  opacity: [0, 1],
  scale: [0.8, 1],
  duration: 500,
  delay: anime.stagger(50),
  easing: 'easeOutBack(1.7)'
}, '.skills', { threshold: 0.1 });

// Project cards animation
scrollAnimate('.card', {
  opacity: [0, 1],
  translateY: [25, 0],
  duration: 800,
  delay: anime.stagger(150),
  easing: 'easeOutCubic'
}, '.project', { threshold: 0.1 });

// Project section fade in
scrollAnimate('.project', {
  opacity: [0, 1],
  duration: 800,
  easing: 'easeOutQuad'
}, '.project', { threshold: 0.1 });

// Bar animation (languages)
scrollAnimate('.bar', {
  opacity: [0, 1],
  translateY: [50, 0],
  duration: 1000,
  easing: 'easeOutCubic'
}, null, { threshold: 0.3 });

// ============================================
// HERO PARALLAX (Scroll)
// ============================================

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  const heroHeight = hero.offsetHeight;
  
  if (scrolled < heroHeight) {
    const progress = scrolled / heroHeight;
    
    // Direct style manipulation for performance (blat anime)
    const h1 = document.querySelector('.hero h1');
    const p = document.querySelector('.hero p');
    const btns = document.querySelector('.hero .btns');
    
    if (h1) {
      h1.style.transform = `translateY(${-100 * progress}px) scale(${1 - 0.3 * progress})`;
      h1.style.opacity = 1 - progress;
    }
    
    if (p) {
      p.style.transform = `translateY(${-100 * progress}px)`;
      p.style.opacity = 1 - progress;
    }
    
    if (btns) {
      btns.style.transform = `translateY(${-100 * progress}px) scale(${1 - 0.8 * progress})`;
      btns.style.opacity = 1 - progress;
    }
  }
});

// ============================================
// HOVER EFFECTS
// ============================================

// Nav links hover
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('mouseenter', () => {
    anime({
      targets: link,
      scale: 1.1,
      duration: 300,
      easing: 'easeOutQuad'
    });
  });
  
  link.addEventListener('mouseleave', () => {
    anime({
      targets: link,
      scale: 1,
      duration: 300,
      easing: 'easeOutQuad'
    });
  });
});

// Cards hover
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    anime({
      targets: card,
      translateY: -10,
      duration: 300,
      easing: 'easeOutQuad'
    });
  });
  
  card.addEventListener('mouseleave', () => {
    anime({
      targets: card,
      translateY: 0,
      duration: 300,
      easing: 'easeOutQuad'
    });
  });
});

// ============================================
// MENU HEADER MOBILE
// ============================================

const icon = document.querySelector('.icone');
const mobileNav = document.querySelector('.mobile-nav');
const iconElement = icon ? icon.querySelector('i') : null;

if (icon && mobileNav) {
  icon.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
    
    if (mobileNav.classList.contains('active')) {
      // Open menu
      anime({
        targets: mobileNav,
        translateY: [0],
        duration: 400,
        easing: 'easeOutCubic'
      });
      if (iconElement) {
        iconElement.classList.remove('fa-code');
        iconElement.classList.add('fa-xmark');
      }
    } else {
      // Close menu
      anime({
        targets: mobileNav,
        translateY: ['-120%'],
        duration: 400,
        easing: 'easeInCubic'
      });
      if (iconElement) {
        iconElement.classList.remove('fa-xmark');
        iconElement.classList.add('fa-code');
      }
    }
  });

  // Close menu on link click
  document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('active');
      anime({
        targets: mobileNav,
        translateY: ['-120%'],
        duration: 400,
        easing: 'easeInCubic'
      });
      if (iconElement) {
        iconElement.classList.remove('fa-xmark');
        iconElement.classList.add('fa-code');
      }
    });
  });
}

// ============================================
// LANGUAGES BAR (GitHub API)
// ============================================

async function loadLanguages() {
  const user = "simo-SM";
  const bar = document.getElementById("bar");
  const langContainer = document.getElementById("languages");
  const status = document.getElementById("status");

  // Reset visuals
  bar.innerHTML = "";
  langContainer.innerHTML = "";
  status.innerText = "Loading...";

  try {
    const res = await fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`);
    
    // Check ila l-API 3tat error (b7al rate limit awla user mashi hwa hadak)
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    
    const repos = await res.json();
    
    // Check ila l-user ma 3ndo ta repo
    if (repos.length === 0) {
      status.innerText = "No repositories found.";
      return;
    }

    const map = {};
    repos.forEach(r => {
      if (!r.fork) { // kan-ignoriw l-forks bach y-ban l-code dyalk ntiya
        const lang = r.language || "Other";
        map[lang] = (map[lang] || 0) + 1;
      }
    });

    const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((s, e) => s + e[1], 0);

    entries.forEach(([lang, val]) => {
      const percent = (val / total) * 100;
      const color = randomColor(); // khli l-function dyalk dyal l-alwan

      // Create Segment
      const seg = document.createElement("div");
      seg.className = "segment";
      seg.style.width = "0%"; 
      seg.style.background = color;
      bar.appendChild(seg);

      // Animate
      anime({
        targets: seg,
        width: `${percent}%`,
        duration: 1000,
        easing: 'easeOutQuad'
      });

      // Legend
      langContainer.innerHTML += `
        <div class="item">
          <div class="dot" style="background:${color}"></div>
          <strong>${lang}</strong> — ${percent.toFixed(1)}%
        </div>
      `;
    });

    status.innerText = ""; // mssa7 "Loading..." 3la t-khrej l-data

  } catch (error) {
    console.error('Error loading languages:', error);
    status.innerText = "Error loading data (Check console)";
  }
}

function randomColor(){
  return `hsl(${Math.random()*360}, 70%, 55%)`;
}

loadLanguages();

// ============================================
// LANGUAGES BAR ABOUT % (Circle)
// ============================================

const languages = {
  css: 50, 
  html: 30,
  python: 20
};

const maxLang = Object.keys(languages).reduce((a, b) => languages[a] > languages[b] ? a : b);
const percentageEl = document.querySelector(".percentage");
if (percentageEl) {
  percentageEl.textContent = maxLang.toUpperCase();
}

// Animate circle progress
const circleProgress = document.querySelector(".circle-progress");
if (circleProgress) {
  anime({
    targets: circleProgress,
    strokeDasharray: [`${languages[maxLang]}, 100`],
    duration: 1200,
    easing: 'easeOutQuad'
  });
}

// ============================================
// PROJECT FILTER & SHOW MORE
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.card');
  const showMoreBtn = document.getElementById('showMoreBtn');

  if (!showMoreBtn) return;

  let currentFilter = 'all';
  let showAll = false;
  const INITIAL_ITEMS = 3;

  function filterCards(filter) {
    currentFilter = filter;
    let visibleCount = 0;

    cards.forEach(card => {
      const categories = card.dataset.category.split(" ");
      const isMatch = filter === 'all' || categories.includes(filter);

      if (isMatch) {
        if (showAll || visibleCount < INITIAL_ITEMS) {
          card.style.display = "block";
          setTimeout(() => {
            card.classList.add('show');
            // Animate entrance
            anime({
              targets: card,
              opacity: [0, 1],
              translateY: [20, 0],
              duration: 400,
              easing: 'easeOutQuad'
            });
          }, 50);
          visibleCount++;
        } else {
          card.style.display = "none";
          card.classList.remove('show');
        }
      } else {
        card.classList.remove('show');
        card.style.display = "none";
      }
    });

    // Show More Button logic
    const totalMatches = Array.from(cards).filter(card => {
      const cats = card.dataset.category.split(" ");
      return filter === 'all' || cats.includes(filter);
    }).length;

    showMoreBtn.style.display = totalMatches > INITIAL_ITEMS ? "block" : "none";
  }

  // Initialize
  filterCards('all');
  
  // Add Active Class to "All" button default
  const allBtn = document.querySelector('[data-filter="all"]');
  if (allBtn) allBtn.classList.add('active');

  // Event Listeners
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      showAll = false;
      filterCards(btn.dataset.filter);
    });
  });

  showMoreBtn.addEventListener("click", () => {
    showAll = !showAll;
    filterCards(currentFilter);
  });
});

// ============================================
// CONTACT FORM ANIMATION
// ============================================

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    
    // Show loading state
    if (btnText) btnText.style.display = 'none';
    if (btnLoader) btnLoader.style.display = 'block';
    if (submitBtn) submitBtn.disabled = true;
    
    // Get form data
    const name = contactForm.name ? contactForm.name.value.trim() : '';
    const msg = contactForm.msg ? contactForm.msg.value.trim() : '';
    
    // Open WhatsApp
    if (name && msg) {
      const text = encodeURIComponent(`Hello Mohammed, I'm [${name}] --> ${msg}`);
      const wa = 'https://wa.me/+212608173585?text=' + text;
      window.open(wa, '_blank');
      
      // Show success
      setTimeout(() => {
        if (successMessage) {
          successMessage.style.display = 'block';
          anime({
            targets: successMessage,
            opacity: [0, 1],
            translateY: [10, 0],
            duration: 400,
            easing: 'easeOutQuad'
          });
        }
        if (btnText) btnText.style.display = 'block';
        if (btnLoader) btnLoader.style.display = 'none';
        if (submitBtn) submitBtn.disabled = false;
        contactForm.reset();
      }, 1000);
    }
  });
}

// ============================================
// PROJECT CLICK HANDLER
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === 'indexWEBsite.html' || href === 'indexWEBsite.html') {
        e.preventDefault();
        
        const projectData = {
          title: this.getAttribute('data-title') || 'Project',
          description: this.getAttribute('data-description') || 'No description available.',
          image: this.getAttribute('data-image') || '',
          githubApiUrl: this.getAttribute('data-github') || '',
          repoUrl: this.getAttribute('data-repo-url') || '',
          liveDemo: this.getAttribute('data-live-demo') || '',
          category: this.closest('.card')?.getAttribute('data-category') || 'website'
        };
        
        localStorage.setItem('selectedProject', JSON.stringify(projectData));
        window.location.href = href;
      }
    });
  });
});

// ============================================
// LANGUAGES BAR ANIMATION (bottom of file)
// ============================================

// Animate bar container
const barEl = document.querySelector('.bar');
if (barEl) {
  anime({
    targets: barEl,
    opacity: [0, 1],
    translateY: [50, 0],
    duration: 1000,
    easing: 'easeOutCubic'
  });
}

// Animate languages segments
const langSegments = document.querySelectorAll('.languages .segment, #bar .segment');
if (langSegments.length > 0) {
  anime({
    targets: langSegments,
    width: function(el) {
      return el.style.width;
    },
    duration: 1500,
    delay: anime.stagger(100, {start: 500}),
    easing: 'easeOutQuad'
  });
}

// =====================================
// this is code emailJS for contact form
// =====================================

(function(){
  emailjs.init("v5Dv4FykvX08LfJBV"); // put your public key here
})();

document.getElementById("contactForm").addEventListener("submit", function(e){
  e.preventDefault();

  emailjs.send("service_ep7bqt8", "template_032mj6k", {
      from_name: document.getElementById("name").value,
      from_email: document.getElementById("email").value,
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value,
  })
  .then(function(response) {
      document.getElementById("successMessage").style.display = "block";
      document.getElementById("contactForm").reset();
  }, function(error) {
      alert("Failed to send message. Try again.");
  });
});