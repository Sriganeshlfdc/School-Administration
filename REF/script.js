// --- 1. STATE VARIABLES ---
let isSidebarOpen = true;
let isSettingsOpen = false;
let currentTheme = 'light';
let activeModule = 'dashboard';
let openMenu = null; // Tracks the open accordion
let currentStep = 0;

// --- 2. DOM ELEMENT CACHING ---
const body = document.body;
const menuToggle = document.getElementById('menu-toggle');
const menuIcon = menuToggle.querySelector('i');
const sidebar = document.getElementById('sidebar');
const content = document.getElementById('content');
const mainItems = document.querySelectorAll('.main-item');

const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const settingsCloseBtn = document.getElementById('settings-close-btn');

const themeToggleBtn = document.getElementById('theme-toggle-btn');

const fullscreenBtn = document.getElementById('fullscreen-btn');
const fullscreenIcon = fullscreenBtn.querySelector('i');

const navQuickStats = document.getElementById('nav-quick-stats');
const navAdmissions = document.getElementById('nav-admissions');
const dashboardModule = document.getElementById('dashboard-module');
const admissionModule = document.getElementById('admission-module');

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const steps = document.querySelectorAll('.step');
const indicators = document.querySelectorAll('.step-indicator li');

const admissionPopup = document.getElementById('admission-popup');
const popupCloseBtn = document.getElementById('popup-close-btn');

// --- 3. CORE FUNCTIONS ---

function handleToggleSidebar() {
  isSidebarOpen = !isSidebarOpen;
  
  if (isSidebarOpen) {
    sidebar.classList.remove('collapsed');
    menuIcon.classList.replace('fa-xmark', 'fa-bars');
  } else {
    sidebar.classList.add('collapsed');
    menuIcon.classList.replace('fa-bars', 'fa-xmark');
    // Close all sub-menus when collapsing
    closeAllSubMenus();
    openMenu = null;
  }
}

function handleToggleSettings() {
  isSettingsOpen = !isSettingsOpen;
  settingsPanel.classList.toggle('show', isSettingsOpen);
}

function handleToggleTheme() {
  currentTheme = (currentTheme === 'light') ? 'dark' : 'light';
  body.classList.replace(currentTheme === 'light' ? 'dark-theme' : 'light-theme', currentTheme + '-theme');
  themeToggleBtn.textContent = currentTheme === 'light' ? 'Switch to Dark' : 'Switch to Light';
}

function handleNavigate(moduleName) {
  activeModule = moduleName;
  dashboardModule.style.display = 'none';
  admissionModule.style.display = 'none';
  
  if (moduleName === 'dashboard') {
    dashboardModule.style.display = 'block';
  } else if (moduleName === 'admissions') {
    admissionModule.style.display = 'block';
  }
}

function closeAllSubMenus() {
  document.querySelectorAll('.sub-menu.show').forEach(m => m.classList.remove('show'));
  document.querySelectorAll('.main-item .rotate').forEach(c => c.classList.remove('rotate'));
}

function handleAccordionClick(item) {
  const menuName = item.dataset.menu;
  const subMenu = item.nextElementSibling;
  const chevron = item.querySelector('.fa-chevron-down');

  if (!isSidebarOpen) {
    // If sidebar is collapsed, open it first
    handleToggleSidebar();
  }
  
  const isThisMenuOpen = (openMenu === menuName);
  
  // 1. Close all menus
  closeAllSubMenus();
  
  if (isThisMenuOpen) {
    // 2. If this was the open menu, it's now closed
    openMenu = null;
  } else {
    // 3. Otherwise, open this new menu
    subMenu.classList.add('show');
    chevron.classList.add('rotate');
    openMenu = menuName;
  }
}

function handleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    fullscreenIcon.classList.replace('fa-expand', 'fa-compress');
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      fullscreenIcon.classList.replace('fa-compress', 'fa-expand');
    }
  }
}

function showStep(stepIndex) {
  steps.forEach((step, index) => {
    step.classList.toggle('active', index === stepIndex);
  });
  indicators.forEach((li, index) => {
    li.classList.toggle('active', index === stepIndex);
  });
  
  prevBtn.disabled = stepIndex === 0;
  nextBtn.textContent = stepIndex === steps.length - 1 ? 'Submit' : 'Next';
}

function handleNextStep() {
  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  } else {
    // Final step: Submit
    admissionPopup.style.display = 'grid';
  }
}

function handlePrevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

function handleClosePopup() {
  admissionPopup.style.display = 'none';
  currentStep = 0;
  showStep(currentStep);
  handleNavigate('dashboard');
}

// --- 4. EVENT LISTENERS ---
menuToggle.addEventListener('click', handleToggleSidebar);
settingsBtn.addEventListener('click', handleToggleSettings);
settingsCloseBtn.addEventListener('click', handleToggleSettings);
themeToggleBtn.addEventListener('click', handleToggleTheme);
fullscreenBtn.addEventListener('click', handleFullscreen);

navQuickStats.addEventListener('click', (e) => {
  e.preventDefault();
  handleNavigate('dashboard');
});
navAdmissions.addEventListener('click', (e) => {
  e.preventDefault();
  handleNavigate('admissions');
});

mainItems.forEach(item => {
  item.addEventListener('click', () => handleAccordionClick(item));
});

// Wizard buttons
prevBtn.addEventListener('click', handlePrevStep);
nextBtn.addEventListener('click', handleNextStep);

// Popup
popupCloseBtn.addEventListener('click', handleClosePopup);
admissionPopup.addEventListener('click', handleClosePopup); // Click overlay to close
document.querySelector('.popup-content').addEventListener('click', (e) => e.stopPropagation()); // Prevent closing when clicking content

// --- 5. INITIALIZATION ---
function initializeDashboard() {
  // Set initial sidebar state based on window size
  if (window.innerWidth <= 768) {
    isSidebarOpen = false;
    sidebar.classList.add('collapsed');
    // Mobile-specific logic (using overlay)
    initializeMobileOverlay();
  } else {
    isSidebarOpen = true;
    sidebar.classList.remove('collapsed');
  }
  
  // Set initial module
  handleNavigate('dashboard');
  
  // Set initial wizard step
  showStep(0);
  
  // Set initial theme
  body.classList.add(currentTheme + '-theme');
}

function initializeMobileOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'mobile-overlay';
  overlay.className = 'overlay';
  document.body.appendChild(overlay);
  
  menuToggle.addEventListener('click', () => {
    // This click is for mobile only
    if (window.innerWidth <= 768) {
      overlay.classList.toggle('active');
    }
  });
  
  overlay.addEventListener('click', () => {
    // Close sidebar when overlay is clicked
    handleToggleSidebar();
    overlay.classList.remove('active');
  });
}

// Run initialization on load
document.addEventListener('DOMContentLoaded', initializeDashboard);