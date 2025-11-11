import React, { useState } from 'react';

// --- Main App Component (Unchanged) ---
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleToggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };
  const handleToggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  const handleNavigate = (moduleName) => {
    setActiveModule(moduleName);
  };

  return (
    <div className={`layout-wrapper ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <Navbar
        onToggleSidebar={handleToggleSidebar}
        onToggleSettings={handleToggleSettings}
      />
      <div className="layout">
        <Sidebar
          isOpen={isSidebarOpen}
          onNavigate={handleNavigate}
          onToggle={handleToggleSidebar} 
        />
        <div className="content">
          {activeModule === 'dashboard' && <DashboardModule />}
          {activeModule === 'admissions' && <AdmissionModule onNavigate={handleNavigate} />}
        </div>
      </div>
      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={handleToggleSettings}
        currentTheme={theme}
        onToggleTheme={handleToggleTheme}
      />
    </div>
  );
}

// --- Navbar Component (Unchanged) ---
const Navbar = ({ onToggleSidebar, onToggleSettings }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  return (
    <div className="navbar">
      <div className="left">
        <button onClick={onToggleSidebar} aria-label="Toggle menu"><i className="fa fa-bars"></i></button>
        <button aria-label="User profile"><i className="fa fa-user"></i></button>
      </div>
      <div className="center"><h1>Montfort School</h1></div>
      <div className="right">
        <button id="fullscreen-btn" onClick={handleFullscreen} aria-label="Toggle fullscreen">
          <i className={`fa ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
        </button>
        <button onClick={onToggleSettings} aria-label="Toggle settings"><i className="fa fa-cog"></i></button>
      </div>
    </div>
  );
};

// --- Sidebar Component (Unchanged) ---
const Sidebar = ({ isOpen, onNavigate, onToggle }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const handleMenuClick = (menuName) => {
    if (isOpen) {
      setOpenMenu(openMenu === menuName ? null : menuName);
    } else {
      onToggle(); 
      setOpenMenu(menuName);
    }
  };
  return (
    <div className={`sidebar ${!isOpen ? 'collapsed' : ''}`}>
      <ul>
        <li>
          <button className="main-item" onClick={() => handleMenuClick('dashboard')}>
            <span><i className="fa fa-chart-bar"></i> Dashboard Overview</span>
            <i className={`fa fa-chevron-down ${openMenu === 'dashboard' ? 'rotate' : ''}`}></i>
          </button>
          <ul className={`sub-menu ${openMenu === 'dashboard' ? 'show' : ''}`}>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }}>Quick Stats</a></li>
            <li><a href="#">Recent Activity</a></li>
            <li><a href="#">Notifications</a></li>
          </ul>
        </li>
        <li>
          <button className="main-item" onClick={() => handleMenuClick('admin')}>
            <span><i className="fa fa-school"></i> Administration</span>
            <i className={`fa fa-chevron-down ${openMenu === 'admin' ? 'rotate' : ''}`}></i>
          </button>
          <ul className={`sub-menu ${openMenu === 'admin' ? 'show' : ''}`}>
            <li><a href="#">Staff Directory</a></li>
            <li><a href="#">Roles & Permissions</a></li>
            <li><a href="#">School Calendar</a></li>
          </ul>
        </li>
        <li>
          <button className="main-item" onClick={() => handleMenuClick('student')}>
            <span><i className="fa fa-user-graduate"></i> Student Management</span>
            <i className={`fa fa-chevron-down ${openMenu === 'student' ? 'rotate' : ''}`}></i>
          </button>
          <ul className={`sub-menu ${openMenu === 'student' ? 'show' : ''}`}>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('admissions'); }}>Admissions</a></li>
            <li><a href="#">Attendance Tracker</a></li>
            <li><a href="#">Gradebook & Reports</a></li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

// --- Settings Panel Component (Unchanged) ---
const SettingsPanel = ({ isOpen, onClose, currentTheme, onToggleTheme }) => {
  return (
    <div className={`settings-panel ${isOpen ? 'show' : ''}`}>
      <div className="settings-header">
        <h3>Settings</h3>
        <button onClick={onClose} className="close-btn" aria-label="Close settings">&times;</button>
      </div>
      <div className="settings-item theme-toggle">
        <strong>Theme</strong>
        <button onClick={onToggleTheme}>
          {currentTheme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
        </button>
      </div>
      <div className="settings-item">
        <strong>Language</strong>
        <span>English</span>
      </div>
      <div className="settings-item">
        <strong>Notifications</strong>
        <span>Enabled</span>
      </div>
    </div>
  );
};

// --- Dashboard Module (Unchanged) ---
const DashboardModule = () => {
  return (
    <div id="dashboard-welcome">
      <h2>Welcome, Administrator 👋</h2>
      <p>Here are some quick stats and reports for Montfort School:</p>
      <div className="cards">
        <div className="card"><i className="fa fa-users"></i><h3>Total Students</h3><p>1,240 Enrolled</p></div>
        <div className="card"><i className="fa fa-user-tie"></i><h3>Faculty Members</h3><p>85 Active</p></div>
        <div className="card"><i className="fa fa-bus"></i><h3>Transport Vehicles</h3><p>12 Operational</p></div>
        <div className="card"><i className="fa fa-book"></i><h3>Library Books</h3><p>8,500 Available</p></div>
      </div>
    </div>
  );
};

// --- Admission Popup Component (MODIFIED) ---
// All inline styles have been removed and replaced with classNames.
// The CSS file will handle the rest.
const AdmissionPopup = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h2>Success!</h2>
        <p>Your admission is succesfully completed.</p>
        <button onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

// --- Admission Wizard Module (Unchanged) ---
const AdmissionModule = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const totalSteps = 3;

  const nextStep = () => { if (currentStep < totalSteps) setCurrentStep(currentStep + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };
  const handleSubmit = () => { setIsPopupOpen(true); };
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setCurrentStep(1);
    if (onNavigate) onNavigate('dashboard');
  };

  return (
    <>
      <div id="admission-module">
        <div className="wizard-container">
          <h2>New Student Admission</h2>
          <ul className="step-indicator">
            <li className={currentStep === 1 ? 'active' : ''}><span>1</span> Personal Details</li>
            <li className={currentStep === 2 ? 'active' : ''}><span>2</span> Guardian Info</li>
            <li className={currentStep === 3 ? 'active' : ''}><span>3</span> Review & Submit</li>
          </ul>
          <div className="step-content">
            <div className={`step ${currentStep === 1 ? 'active' : ''}`}>
              <h3>Step 1: Personal Details</h3>
              <div className="form-group"><label htmlFor="first-name">First Name</label><input type="text" id="first-name" placeholder="Enter first name" /></div>
              <div className="form-group"><label htmlFor="last-name">Last Name</label><input type="text" id="last-name" placeholder="Enter last name" /></div>
            </div>
            <div className={`step ${currentStep === 2 ? 'active' : ''}`}>
              <h3>Step 2: Guardian Information</h3>
              <div className="form-group"><label htmlFor="guardian-name">Guardian Name</label><input type="text" id="guardian-name" placeholder="Enter guardian's full name" /></div>
              <div className="form-group"><label htmlFor="guardian-phone">Guardian Phone</label><input type="tel" id="guardian-phone" placeholder="Enter phone number" /></div>
            </div>
            <div className={`step ${currentStep === 3 ? 'active' : ''}`}>
              <h3>Step 3: Review and Submit</h3><p>Please review all details before submitting.</p>
            </div>
          </div>
          <div className="step-navigation">
            <button id="prev-btn" onClick={prevStep} disabled={currentStep === 1}>Previous</button>
            <button id="next-btn" onClick={currentStep === totalSteps ? handleSubmit : nextStep}>
              {currentStep === totalSteps ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      </div>
      <AdmissionPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
    </>
  );
};

export default App;