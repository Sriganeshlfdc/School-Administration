// --- CACHE DOM ELEMENTS ---
const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");
const fullScreenBtn = document.getElementById("fullscreen-btn");
const settingsBtn = document.getElementById("settings-btn");
const settingsPanel = document.getElementById("settings-panel");
const overlay = document.getElementById("overlay");
const menuIcon = menuToggle.querySelector('i');

// --- SIDEBAR TOGGLE ---
menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
  menuIcon.classList.toggle("fa-bars");
  menuIcon.classList.toggle("fa-xmark");
  
  // Toggle overlay on mobile
  if (window.innerWidth <= 768) {
    overlay.classList.toggle("active");
  }
});

// --- CLOSE SIDEBAR VIA OVERLAY (MOBILE) ---
overlay.addEventListener("click", () => {
  sidebar.classList.add("hidden");
  overlay.classList.remove("active");
  menuIcon.classList.add("fa-bars");
  menuIcon.classList.remove("fa-xmark");
});

// --- ACCORDION SUBMENUS ---
document.querySelectorAll(".main-item").forEach(item => {
  item.addEventListener("click", () => {
    const subMenu = item.nextElementSibling;
    const chevron = item.querySelector("i.fa-chevron-down");

    // Check if this menu is already open
    const isOpen = subMenu.classList.contains("show");

    // 1. Close all other sub-menus and reset icons
    document.querySelectorAll(".sub-menu.show").forEach(m => {
      m.classList.remove("show");
    });
    document.querySelectorAll(".main-item i.rotate").forEach(c => {
      c.classList.remove("rotate");
    });

    // 2. If this menu was NOT already open, open it
    if (!isOpen) {
      subMenu.classList.add("show");
      chevron.classList.add("rotate");
    }
    // If it was open, it's now closed by step 1
  });
});

// --- FULLSCREEN TOGGLE ---
fullScreenBtn.addEventListener("click", () => {
  const fullscreenIcon = fullScreenBtn.querySelector('i');
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    fullscreenIcon.classList.replace("fa-expand", "fa-compress");
  } else {
    document.exitFullscreen();
    fullscreenIcon.classList.replace("fa-compress", "fa-expand");
  }
});

// --- SETTINGS PANEL TOGGLE ---
settingsBtn.addEventListener("click", () => {
  settingsPanel.classList.toggle("show");
});

// --- CLICK OUTSIDE TO CLOSE SETTINGS ---
document.addEventListener("click", (e) => {
  // Check if click is outside settings panel AND not the settings button
  if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
    settingsPanel.classList.remove("show");
  }
});

// --- INITIAL SIDEBAR STATE (Desktop vs Mobile) ---
// On load, check screen size. If desktop, show sidebar.
if (window.innerWidth > 768) {
  sidebar.classList.remove("hidden");
  menuIcon.classList.add("fa-bars"); // Ensure it's correct
  menuIcon.classList.remove("fa-xmark");
} else {
  sidebar.classList.add("hidden"); // Ensure it's hidden
  menuIcon.classList.add("fa-bars");
  menuIcon.classList.remove("fa-xmark");
}

// --- CONTENT MODULE TOGGLING ---
const dashboardWelcome = document.getElementById("dashboard-welcome");
const admissionModule = document.getElementById("admission-module");
const navAdmissions = document.getElementById("nav-admissions");
const navQuickStats = document.getElementById("nav-quick-stats");

navAdmissions.addEventListener("click", (e) => {
  e.preventDefault();
  dashboardWelcome.style.display = "none";
  admissionModule.style.display = "block";
  // Close sidebar on mobile after clicking a link
  if (window.innerWidth <= 768) overlay.click();
});

navQuickStats.addEventListener("click", (e) => {
  e.preventDefault();
  dashboardWelcome.style.display = "block";
  admissionModule.style.display = "none";
  if (window.innerWidth <= 768) overlay.click();
});

// --- WIZARD (STEP-BY-STEP) LOGIC ---
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const steps = document.querySelectorAll(".step");
const indicators = document.querySelectorAll(".step-indicator li");
let currentStep = 0;

function showStep(stepIndex) {
  // Hide all steps
  steps.forEach(step => step.classList.remove("active"));
  // Show the correct step
  steps[stepIndex].classList.add("active");
  
  // Update indicators
  indicators.forEach((li, index) => {
    if (index === stepIndex) {
      li.classList.add("active");
    } else {
      li.classList.remove("active");
    }
  });
  
  // Update button states
  prevBtn.disabled = stepIndex === 0;
  
  if (stepIndex === steps.length - 1) {
    nextBtn.textContent = "Submit";
  } else {
    nextBtn.textContent = "Next";
  }
}

nextBtn.addEventListener("click", () => {
  if (currentStep < steps.length - 1) {
    // --- TODO: Add validation here ---
    currentStep++;
    showStep(currentStep);
  } else {
    // On "Submit" click
    alert("Admission form submitted successfully!");
    // Optionally reset the form
    currentStep = 0;
    showStep(currentStep);
    // And navigate back to dashboard
    navQuickStats.click();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
});

// Initialize the wizard
showStep(currentStep);