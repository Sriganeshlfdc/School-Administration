import React, { useState } from 'react';

// --- Main App Component (Holds all the state) ---
function App() {
  // State for toggling UI elements
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // State for navigation (which module to show)
  const [activeModule, setActiveModule] = useState('dashboard'); // 'dashboard' or 'admissions'

  // Handler functions to be passed as props
  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleToggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleNavigate = (moduleName) => {
    setActiveModule(moduleName);
  };

  return (
    <div className="layout-wrapper">
      <Navbar 
        onToggleSidebar={handleToggleSidebar} 
        onToggleSettings={handleToggleSettings} 
      />
      
      <div className="layout">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onNavigate={handleNavigate} 
        />
        
        <div className="content">
          {/* Conditional rendering based on state */}
          {activeModule === 'dashboard' && <DashboardModule />}
          {activeModule === 'admissions' && <AdmissionModule />}
        </div>
      </div>
      
      <SettingsPanel isOpen={isSettingsOpen} />
    </div>
  );
}

// --- Navbar Component ---
const Navbar = ({ onToggleSidebar, onToggleSettings }) => {
  return (
    <div className="navbar">
      <div className="left">
        <button onClick={onToggleSidebar} aria-label="Toggle menu">
          <i className="fa fa-bars"></i>
        </button>
        <button aria-label="User profile">
          <i className="fa fa-user"></i>
        </button>
      </div>
      <div className="center">
        <h1>Montfort School</h1>
      </div>
      <div className="right">
        <button id="fullscreen-btn" aria-label="Toggle fullscreen">
          <i className="fa fa-expand"></i>
        </button>
        <button onClick={onToggleSettings} aria-label="Toggle settings">
          <i className="fa fa-cog"></i>
        </button>
      </div>
    </div>
  );
};

// --- Sidebar Component ---
const Sidebar = ({ isOpen, onNavigate }) => {
  // State for managing the accordion menu
  const [openMenu, setOpenMenu] = useState(null); // 'dashboard', 'admin', 'student'

  const toggleSubMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  return (
    <div className={`sidebar ${!isOpen ? 'hidden' : ''}`}>
      <ul>
        <li>
          <button className="main-item" onClick={() => toggleSubMenu('dashboard')}>
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
          <button className="main-item" onClick={() => toggleSubMenu('admin')}>
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
          <button className="main-item" onClick={() => toggleSubMenu('student')}>
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

// --- Settings Panel Component ---
const SettingsPanel = ({ isOpen }) => {
  return (
    <div className={`settings-panel ${isOpen ? 'show' : ''}`}>
      <h3>Settings</h3>
      <p><strong>Theme:</strong> Light / Dark</p>
      <p><strong>Language:</strong> English</p>
      <p><strong>Notifications:</strong> Enabled</p>
    </div>
  );
};

// --- Dashboard Module (Main Content) ---
const DashboardModule = () => {
  return (
    <div id="dashboard-welcome">
      <h2>Welcome, Administrator 👋</h2>
      <p>Here are some quick stats and reports for Montfort School:</p>
      <div className="cards">
        <div className="card">
          <i className="fa fa-users"></i>
          <h3>Total Students</h3>
          <p>1,240 Enrolled</p>
        </div>
        <div className="card">
          <i className="fa fa-user-tie"></i>
          <h3>Faculty Members</h3>
          <p>85 Active</p>
        </div>
        <div className="card">
          <i className="fa fa-bus"></i>
          <h3>Transport Vehicles</h3>
          <p>12 Operational</p>
        </div>
        <div className="card">
          <i className="fa fa-book"></i>
          <h3>Library Books</h3>
          <p>8,500 Available</p>
        </div>
      </div>
    </div>
  );
};

// --- Admission Wizard Module ---
const AdmissionModule = () => {
  // This component manages its own internal state for the steps
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    alert("Admission form submitted successfully!");
    setCurrentStep(1); // Reset wizard
    // In a real app, you'd also call onNavigate('dashboard') here
  };

  return (
    <div id="admission-module">
      <div className="wizard-container">
        <h2>New Student Admission</h2>
        
        <ul className="step-indicator">
          <li className={currentStep === 1 ? 'active' : ''}><span>1</span> Personal Details</li>
          <li className={currentStep === 2 ? 'active' : ''}><span>2</span> Guardian Info</li>
          <li className={currentStep === 3 ? 'active' : ''}><span>3</span> Review & Submit</li>
        </ul>
        
        <div className="step-content">
          {/* Step 1 */}
          <div className={`step ${currentStep === 1 ? 'active' : ''}`}>
            <h3>Step 1: Personal Details</h3>
            <div className="form-group">
              <label htmlFor="first-name">First Name</label>
              <input type="text" id="first-name" placeholder="Enter first name" />
            </div>
            <div className="form-group">
              <label htmlFor="last-name">Last Name</label>
              <input type="text" id="last-name" placeholder="Enter last name" />
            </div>
          </div>
          
          {/* Step 2 */}
          <div className={`step ${currentStep === 2 ? 'active' : ''}`}>
            <h3>Step 2: Guardian Information</h3>
            <div className="form-group">
              <label htmlFor="guardian-name">Guardian Name</label>
              <input type="text" id="guardian-name" placeholder="Enter guardian's full name" />
            </div>
            <div className="form-group">
              <label htmlFor="guardian-phone">Guardian Phone</label>
              <input type="tel" id="guardian-phone" placeholder="Enter phone number" />
            </div>
          </div>
          
          {/* Step 3 */}
          <div className={`step ${currentStep === 3 ? 'active' : ''}`}>
            <h3>Step 3: Review and Submit</h3>
            <p>Please review all details before submitting.</p>
          </div>
        </div>
        
        <div className="step-navigation">
          <button id="prev-btn" onClick={prevStep} disabled={currentStep === 1}>
            Previous
          </button>
          <button id="next-btn" onClick={currentStep === totalSteps ? handleSubmit : nextStep}>
            {currentStep === totalSteps ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;