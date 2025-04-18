"use strict";

/**
 * Class to manage timezone selection and display
 */
class TimezoneManager {
  constructor() {
    this.setupModal();
  }

  setupModal() {
    const modal = document.querySelector('.timezone-modal');
    const searchInput = modal.querySelector('.timezone-search');
    const list = modal.querySelector('.timezone-list');

    searchInput.addEventListener('input', () => {
      filterTimezones(searchInput.value, list);
    });

    populateTimezoneList(list);

    document.getElementById('time').addEventListener('click', () => {
      modal.classList.add('show');
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    });
  }
}

/**
 * Get timezone time
 * @param {string} timezone
 */
function getTimezoneTime(timezone) {
  return new Date().toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour12: true,
    hour: 'numeric',
    minute: 'numeric'
  });
}

// Set default timezone
let currentTimeZone = 'America/New_York';

// Update timezone list population with search functionality
function filterTimezones(search, list) {
  const filteredZones = Intl.supportedValuesOf('timeZone')
    .filter(zone => zone.toLowerCase().includes(search.toLowerCase()));
  populateTimezoneList(list, filteredZones);
}

function populateTimezoneList(list, zones = Intl.supportedValuesOf('timeZone')) {
  list.innerHTML = zones.map(zone => `
    <div class="timezone-option ${zone === currentTimeZone ? 'active' : ''}" data-zone="${zone}">
      <span>${zone.replace(/_/g, ' ')}</span>
      <span>${getTimezoneTime(zone)}</span>
    </div>
  `).join('');

  list.querySelectorAll('.timezone-option').forEach(option => {
    option.addEventListener('click', () => {
      currentTimeZone = option.dataset.zone;
      document.querySelector('.timezone-modal').classList.remove('show');
      updateTimeAndGreeting();
      saveTimezone(currentTimeZone);
      // Re-populate the list to update the active class
      populateTimezoneList(list);
    });
  });
}

// Save timezone preference
function saveTimezone(timezone) {
  localStorage.setItem('preferredTimezone', timezone);
}

// Load saved timezone
function loadSavedTimezone() {
  const saved = localStorage.getItem('preferredTimezone');
  if (saved) {
    currentTimeZone = saved;
    updateTimeAndGreeting();
  }
}


/**
 * Updates the time display and greeting
 */
function updateTimeAndGreeting() {
  const timeElement = document.getElementById('time');
  const greetingElement = document.getElementById('greeting');
  const dateElement = document.getElementById('date');
  const now = new Date();

  const timeString = now.toLocaleTimeString('en-US', {
    timeZone: currentTimeZone,
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  });

  const dateString = now.toLocaleDateString('en-US', {
    timeZone: currentTimeZone,
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const hour = parseInt(now.toLocaleTimeString('en-US', {
    timeZone: currentTimeZone,
    hour: 'numeric',
    hour12: false
  }));

  const greeting = hour < 12 ? 'Good Morning Mr Rmdy':
                    hour < 18 ? 'Good Afternoon' : 'Good Night';

  timeElement.textContent = timeString;
  greetingElement.textContent = greeting;
  dateElement.textContent = dateString;
}


// Generate stars and shooting stars
function generateStars() {
  const starsContainer = document.getElementById('stars');
  const shootingStarsContainer = document.getElementById('shooting-stars');

  // Clear existing stars
  starsContainer.innerHTML = '';
  shootingStarsContainer.innerHTML = '';

  // Add static stars
  for (let i = 0; i < 200; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.width = `${Math.random() * 2}px`;
    star.style.height = star.style.width;
    star.style.animationDelay = `${Math.random() * 2}s`;
    starsContainer.appendChild(star);
  }

  // Create shooting stars periodically
  setInterval(() => {
    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';
    shootingStar.style.left = `${Math.random() * 100}%`;
    shootingStar.style.top = `${Math.random() * 50}%`;
    shootingStar.style.animationDelay = `${Math.random() * 1}s`;
    shootingStarsContainer.appendChild(shootingStar);

    setTimeout(() => shootingStar.remove(), 1000);
  }, 3000);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  loadSavedTimezone();
  generateStars();
  new TimezoneManager();
  setInterval(updateTimeAndGreeting, 1000);
});