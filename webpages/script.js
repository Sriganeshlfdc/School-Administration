/*
 * ===================================
 * TABLE OF CONTENTS
 * ===================================
 * 1. STATE VARIABLES
 * 2. DOM ELEMENT CACHING
 * 3. EVENT HANDLERS
 * - Core App (Sidebar, Settings, Theme, Fullscreen)
 * - Navigation (Module & Accordion)
 * - Admission Wizard (Steps, Validation, Popup)
 * - Student List (Filter, Search, Render)
 * 4. HELPER FUNCTIONS
 * 5. INITIALIZATION
 * ===================================
*/

// --- 1. STATE VARIABLES ---
let isSidebarOpen = true;
let isSettingsOpen = false;
let currentTheme = 'light';
let activeModule = 'dashboard';
let openMenu = null; // Tracks the open accordion
let currentStep = 0; // Tracks the current wizard step

// *** NEW: Dummy student data for filtering ***
let allStudents = [
  { id: 'S-10234', name: 'Jane A. Doe', grade: 'grade-10', year: '2024-2025', contact: 'Sarah Doe (s.doe@example.com)' },
  { id: 'S-10235', name: 'John B. Smith', grade: 'grade-9', year: '2024-2025', contact: 'David Smith (d.smith@example.com)' },
  { id: 'S-10236', name: 'Michael C. Johnson', grade: 'grade-11', year: '2023-2024', contact: 'Mary Johnson (m.johnson@example.com)' },
  { id: 'S-10237', name: 'Emily D. Brown', grade: 'grade-10', year: '2024-2025', contact: 'James Brown (j.brown@example.com)' },
  { id: 'S-10238', name: 'David Lee', grade: 'grade-9', year: '2023-2024', contact: 'Anna Lee (a.lee@example.com)' }
];

// --- 2. DOM ELEMENT CACHING ---
const body = document.body;
const menuToggle = document.getElementById('menu-toggle');
const menuIcon = menuToggle.querySelector('i');
const sidebar = document.getElementById('sidebar');
const content = document.getElementById('content');
const mainItems = document.querySelectorAll('.main-item');

// Settings
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const settingsCloseBtn = document.getElementById('settings-close-btn');

// Theme
const themeToggleBtn = document.getElementById('theme-toggle-btn');

// Fullscreen
const fullscreenBtn = document.getElementById('fullscreen-btn');
const fullscreenIcon = fullscreenBtn.querySelector('i');

// Navigation
const navLinks = document.querySelectorAll('.sidebar .main-item, .sidebar .sub-menu a');
// *** MODIFIED: Added all existing modules to selection ***
const modules = document.querySelectorAll(
  '#dashboard-module, #admission-module, #student-list-module, #summary-module, #migrate-module, #quickedit-module, #academicedit-module, #searchstudent-module, #studentaccounts-module, #oldstudentdebt-module, #oldstudentrec-module'
);
const mobileOverlay = document.getElementById('overlay');

// Admission Wizard
const admissionModule = document.getElementById('admission-module');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const steps = document.querySelectorAll('.step-content .step');
const stepIndicators = document.querySelectorAll('.step-indicator li');

// Admission Popup
const admissionPopup = document.getElementById('admission-popup');
const popupCloseBtn = document.getElementById('popup-close-btn');

// *** NEW: Student List & Filter ***
const studentFilterForm = document.getElementById('student-filter-form');
const studentSearchInput = document.getElementById('student-search');
const filterClass = document.getElementById('filter-class');
const filterYear = document.getElementById('filter-year');
const filterTerm = document.getElementById('filter-term');
const studentTableBody = document.querySelector('.student-list-table tbody');


// --- 3. EVENT HANDLERS ---

/**
 * CORE APP HANDLERS
 */
function toggleSidebar() {
  isSidebarOpen = !isSidebarOpen;
  
  if (window.innerWidth <= 768) {
    // Mobile logic
    sidebar.classList.toggle('open', isSidebarOpen);
    mobileOverlay.classList.toggle('active', isSidebarOpen);
    sidebar.classList.remove('collapsed'); 
  } else {
    // Desktop logic
    sidebar.classList.toggle('collapsed', !isSidebarOpen);
    content.classList.toggle('collapsed', !isSidebarOpen);
    menuIcon.className = isSidebarOpen ? 'fa fa-chevron-left' : 'fa fa-bars';
  }
}

function toggleSettings() {
  isSettingsOpen = !isSettingsOpen;
  settingsPanel.classList.toggle('show');
}

function toggleTheme() {
  body.classList.remove(currentTheme + '-theme');
  currentTheme = (currentTheme === 'light') ? 'dark' : 'light';
  body.classList.add(currentTheme + '-theme');
  themeToggleBtn.textContent = (currentTheme === 'light') ? 'Switch to Dark' : 'Switch to Light';
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    fullscreenIcon.className = 'fa-solid fa-compress';
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      fullscreenIcon.className = 'fa-solid fa-expand';
    }
  }
}

/**
 * NAVIGATION HANDLERS
 */
function handleNavigate(targetModule) {
  if (!targetModule) return;

  activeModule = targetModule;

  // *** UPDATED: Update URL hash without reloading page ***
  if (history.pushState) {
      history.pushState(null, null, '#' + targetModule);
  } else {
      window.location.hash = targetModule;
  }

  // Hide all modules
  modules.forEach(module => {
    // Check if module exists on this page before trying to hide it
    if (module) {
        module.style.display = 'none';
    }
  });

  // Show target module
  const moduleToShow = document.getElementById(targetModule + '-module');
  if (moduleToShow) {
    moduleToShow.style.display = 'block';
  }

  // Update active states for all sidebar links
  navLinks.forEach(link => {
    link.classList.remove('active');
    
    // Check main item (like Dashboard)
    if (link.dataset.menu === targetModule) {
      link.classList.add('active');
    }
    
    // *** MODIFIED: Check sub-menu items ***
    const linkId = link.id;
    let linkMod = null;
    
    if (linkId === 'addstudent') linkMod = 'admission';
    if (linkId === 'viewstudent') linkMod = 'student-list'; // Map 'viewstudent' to 'student-list'
    
    // Map all other sub-menu IDs directly
    if (['summary', 'migrate', 'quickedit', 'academicedit', 'searchstudent', 'studentaccounts', 'oldstudentdebt', 'oldstudentrec'].includes(linkId)) {
        linkMod = linkId;
    }
    
    if (linkMod && linkMod === targetModule) {
        link.classList.add('active');
        // Also activate its parent accordion
        const parentMenu = link.closest('li').parentElement.previousElementSibling;
        if(parentMenu) {
          parentMenu.classList.add('active');
        }
    }
  });

  // Close mobile sidebar on navigation
  if (window.innerWidth <= 768 && isSidebarOpen) {
    toggleSidebar();
  }
}

function handleAccordion(e) {
  const item = e.currentTarget;
  
  // *** UPDATED: If the item is a link (<a> tag), let the browser navigate ***
  if (item.tagName === 'A') {
      // We only set active class here. Navigation is handled by browser.
      // Clear active class from all other main items
      mainItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active'); // Set current link as active
      return; 
  }
  
  // Original logic for <button> accordions
  const subMenu = item.nextElementSibling;
  const targetModule = item.dataset.menu;

  // Case 1: Item has no sub-menu (like Dashboard - but this is now an <a>)
  if (!subMenu || !subMenu.classList.contains('sub-menu')) {
    // This case might not be used anymore if all top-level items are <a> or accordions
    handleNavigate(targetModule); 
    // Close any other open accordion
    if(openMenu) {
      openMenu.style.display = 'none';
      openMenu.classList.remove('show');
      const oldChevron = openMenu.previousElementSibling.querySelector('.fa-chevron-down');
      if(oldChevron) oldChevron.classList.remove('rotate');
      openMenu = null;
    }
    return;
  }

  // Case 2: Item is a <button> and has a sub-menu -> Toggle it
  const chevron = item.querySelector('.fa-chevron-down'); 

  // Close other open menu if there is one
  if (openMenu && openMenu !== subMenu) {
    openMenu.style.display = 'none';
    openMenu.classList.remove('show');
    const oldChevron = openMenu.previousElementSibling.querySelector('.fa-chevron-down');
    if(oldChevron) oldChevron.classList.remove('rotate');
  }

  // Toggle current menu
  if (subMenu.style.display === 'grid') {
    subMenu.style.display = 'none';
    subMenu.classList.remove('show');
    if(chevron) chevron.classList.remove('rotate');
    openMenu = null;
  } else {
    subMenu.style.display = 'grid';
    subMenu.classList.add('show');
    if(chevron) chevron.classList.add('rotate');
    openMenu = subMenu;
  }
}

/**
 * ADMISSION WIZARD HANDLERS
 */
function handleNextStep() {
  // Safety check if wizard buttons exist on this page
  if (!steps || steps.length === 0) return;

  if (validateStep(currentStep)) {
    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);
    } else {
      // Final step: Submit
      admissionPopup.classList.add('show');
    }
  } else {
    // Validation failed
    // Using console.error instead of alert
    console.error('Validation Failed: Please fill out all required fields.');
    // We can also add a visual indicator here
  }
}

function handlePrevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

function handleClosePopup() {
  admissionPopup.classList.remove('show');
  
  // Reset form to first step and go to dashboard
  currentStep = 0;
  showStep(currentStep);
  // Optional: You might want to clear form fields here
  // e.g., document.getElementById('admission-form').reset();
  
  // *** UPDATED: Navigate to student list instead of dashboard ***
  handleNavigate('student-list');
}

/**
 * *** NEW: STUDENT LIST HANDLERS ***
 */
function handleFilterStudents(e) {
  e.preventDefault(); // Stop form from reloading page
  
  // Get filter values
  const searchTerm = studentSearchInput.value.toLowerCase().trim();
  const selectedClass = filterClass.value;
  const selectedYear = filterYear.value;
  // const selectedTerm = filterTerm.value; // Not used in dummy data, but here's how
  
  // Filter the dummy data
  const filteredStudents = allStudents.filter(student => {
    const nameMatch = student.name.toLowerCase().includes(searchTerm);
    const idMatch = student.id.toLowerCase().includes(searchTerm);
    
    const classMatch = !selectedClass || student.grade === selectedClass;
    const yearMatch = !selectedYear || student.year === selectedYear;
    // const termMatch = !selectedTerm || student.term === selectedTerm; 
    
    return (nameMatch || idMatch) && classMatch && yearMatch;
  });
  
  // Render the results
  renderStudentTable(filteredStudents);
}

function handleClearFilters() {
  // form.reset() is handled by the 'reset' event type
  // We just need to clear the table and show the default message
  if (studentTableBody) {
    studentTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="no-results">
          Please apply filters or search to display student data.
        </td>
      </tr>
    `;
  }
}

function handleViewProfile(e) {
  const studentId = e.currentTarget.dataset.studentid;
  console.log(`Opening profile for student ${studentId}.`);
  // alert(`Opening profile for student ${studentId}. \n(This would navigate to the full 'Student Profile' view.)`);
  
  // In a real app, you would:
  // 1. Fetch detailed data for this studentId
  // 2. Populate the 'student-view-module' (the other HTML) with this data
  // 3. Call handleNavigate('student-view');
}


// --- 4. HELPER FUNCTIONS ---

function showStep(stepIndex) {
  // Safety check if wizard elements exist
  if (!steps || steps.length === 0 || !stepIndicators || stepIndicators.length === 0) return;

  // Hide all steps
  steps.forEach((step, index) => {
    step.classList.toggle('active', index === stepIndex);
  });

  // Update step indicators
  stepIndicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === stepIndex);
    if (index < stepIndex) {
      indicator.classList.add('completed'); 
    } else {
      indicator.classList.remove('completed');
    }
  });

  // Update button visibility and text (if buttons exist)
  if (prevBtn) prevBtn.disabled = (stepIndex === 0);
  if (nextBtn) nextBtn.textContent = (stepIndex === steps.length - 1) ? 'Submit' : 'Next';
}

function validateStep(stepIndex) {
  const currentStepElement = steps[stepIndex];
  if (!currentStepElement) return false; 
  
  const inputs = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
  
  for (let input of inputs) {
    if (input.type === 'checkbox') {
      if (!input.checked) return false; 
    } else if (!input.value.trim()) {
      return false; 
    }
  }
  return true; 
}

// *** NEW: STUDENT LIST RENDER FUNCTION ***
function renderStudentTable(students) {
  if (!studentTableBody) return; // Safety check
  
  // Clear current results
  studentTableBody.innerHTML = '';
  
  if (students.length === 0) {
    studentTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="no-results">
          No students found matching your criteria.
        </td>
      </tr>
    `;
    return;
  }
  
  // Populate with new results
  students.forEach(student => {
    // Manually map grade value to text for display
    let gradeText = student.grade;
    if (student.grade === 'grade-9') gradeText = 'Grade 9';
    if (student.grade === 'grade-10') gradeText = 'Grade 10';
    if (student.grade === 'grade-11') gradeText = 'Grade 11';
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${gradeText}</td>
      <td>${student.year}</td>
      <td>${student.contact}</td>
      <td>
        <button class="btn btn-small view-profile-btn" data-studentid="${student.id}">
          View Profile
        </button>
      </td>
    `;
    studentTableBody.appendChild(row);
  });
  
  // *** NEW: Add event listeners for the new "View Profile" buttons ***
  studentTableBody.querySelectorAll('.view-profile-btn').forEach(btn => {
    btn.addEventListener('click', handleViewProfile);
  });
}


// --- 5. INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
  // Bind core event listeners
  menuToggle.addEventListener('click', toggleSidebar); 
  mobileOverlay.addEventListener('click', toggleSidebar); 
  
  settingsBtn.addEventListener('click', toggleSettings);
  settingsCloseBtn.addEventListener('click', toggleSettings);
  themeToggleBtn.addEventListener('click', toggleTheme);
  fullscreenBtn.addEventListener('click', toggleFullscreen);

  // Bind navigation listeners
  mainItems.forEach(item => {
    item.addEventListener('click', handleAccordion);
  });
  
  // Bind sub-menu links
  document.querySelectorAll('.sub-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
      
      // *** UPDATED: Check if the link is to another page ***
      const href = e.currentTarget.getAttribute('href');
      if (href && href.includes('.html')) {
          // This is a link to another page (e.g., studentmanagement.html#...).
          // Allow the default browser navigation.
          return;
      }

      // If it's not an external link, it's an SPA link (like Fees, Expenses).
      // Use the original logic.
      e.preventDefault(); 
      const targetId = e.currentTarget.id;
      
      let targetModule = null;

      // Note: Student links will now only be handled by this
      // if they are clicked *again* on the student page.
      if (targetId === 'addstudent') {
        targetModule = 'admission';
      }
      else if (targetId === 'viewstudent') {
        targetModule = 'student-list';
      } 
      else if (['summary', 'migrate', 'quickedit', 'academicedit', 'searchstudent', 'studentaccounts', 'oldstudentdebt', 'oldstudentrec'].includes(targetId)) {
        targetModule = targetId;
      }
      else {
        // This is a non-student link (e.g., 'feescate', 'newrequi')
        console.warn(`Module for link ID '${targetId}' not found on this page.`);
      }
      
      if (targetModule) {
        handleNavigate(targetModule);
      }
    });
  });

  // Bind wizard listeners (if they exist on this page)
  if (nextBtn && prevBtn && popupCloseBtn) {
    nextBtn.addEventListener('click', handleNextStep);
    prevBtn.addEventListener('click', handlePrevStep);
    popupCloseBtn.addEventListener('click', handleClosePopup);
    
    admissionPopup.addEventListener('click', (e) => {
        if (e.target === admissionPopup) { 
            handleClosePopup();
        }
    });
  }


  // *** NEW: Bind student filter listeners (if they exist) ***
  if (studentFilterForm) {
    studentFilterForm.addEventListener('submit', handleFilterStudents);
    studentFilterForm.addEventListener('reset', handleClearFilters);
  }

  // Set initial desktop/mobile state
  if (window.innerWidth <= 768) {
    isSidebarOpen = false;
    sidebar.classList.remove('open');
    mobileOverlay.classList.remove('active');
    menuIcon.className = 'fa fa-bars';
  } else {
    isSidebarOpen = true;
    sidebar.classList.remove('collapsed');
    content.classList.remove('collapsed');
    menuIcon.className = 'fa fa-chevron-left';
  }
  
  // *** UPDATED: Set initial module based on page and hash ***
  const hash = window.location.hash.substring(1);
  if (hash) {
    handleNavigate(hash); // Show module from hash (e.g., #admission)
  } else {
    // If no hash, check which page we're on
    if (document.getElementById('dashboard-module')) {
      handleNavigate('dashboard'); // We are on home.html
    } else if (document.getElementById('admission-module')) {
      handleNavigate('admission'); // We are on studentmanagement.html, default to 'admission'
    } else {
      handleNavigate('dashboard'); // Fallback
    }
  }
  
  // *** NEW: Also listen for hash changes (e.g., clicking sub-links on student page) ***
  window.addEventListener('hashchange', () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
          handleNavigate(hash);
      }
  });
  
  // Set initial wizard step
  showStep(0);
  
  // *** NEW: Set initial student table state ***
  handleClearFilters(); // Use this to set the default "Please apply filters" message
  
  // Set initial theme
  body.classList.add(currentTheme + '-theme');
  
  // Logic for attractive file inputs
  document.querySelectorAll('input[type="file"]').forEach(fileInput => {
    // Check if the span already exists
    if (fileInput.previousElementSibling.classList.contains('file-name-label')) {
        const fileNameSpan = document.createElement('span');
        fileNameSpan.className = 'file-name';
        fileNameSpan.textContent = 'No file selected';
        fileInput.previousElementSibling.insertAdjacentElement('afterend', fileNameSpan);

        fileInput.addEventListener('change', (e) => {
          if (e.target.files && e.target.files.length > 0) { 
            fileNameSpan.textContent = [...e.target.files].map(f => f.name).join(', ');
          } else {
            fileNameSpan.textContent = 'No file selected';
          }
        });
    }
  });
});