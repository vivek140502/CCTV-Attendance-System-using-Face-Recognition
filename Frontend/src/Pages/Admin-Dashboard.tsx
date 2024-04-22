import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, Box, Typography, Modal, ListItemIcon, ListItemText } from '@mui/material';
import { Menu as MenuIcon, AccountCircle, ExitToApp, Security, Home, CalendarToday, PersonAdd, Person, Lock, Help, CloudUpload } from "@mui/icons-material";
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from "react-router-dom";
import PhotoUploadForm from "./PhotoUpload";
import ChangePasswordForm from "./ChangePass";
import EditProfile from "./EditProfile";
import RegistrationForm from "./Registration";
import FAQs from "./FAQ";
import HomePage from "./HomePage";
import AttendancePage from './Attendance';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showHomePage, setShowHomePage] = useState(true);
  const [showFAQs, setShowFAQs] = useState(false);
  const [showAttendancePage, setShowAttendancePage] = useState(false);
  // eslint-disable-next-line
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  // eslint-disable-next-line
  const [showBackgroundImage, setShowBackgroundImage] = useState(false);
  const [showEditProfileImage, setShowEditProfileImage] = useState(false);
  const [showChangePasswordImage, setShowChangePasswordImage] = useState(false);
  const [showFAQsImage, setShowFAQsImage] = useState(false);
  const [showUploadPhotosImage, setShowUploadPhotosImage] = useState(false);
  const [showRegistrationImage, setShowRegistrationImage] = useState(false);

  const handleMenuOptionClick = async (index: number) => {
    // Close all forms and pages
    setShowRegistrationForm(false);
    setShowEditProfile(false);
    setShowUploadForm(false);
    setShowChangePasswordForm(false);
    setShowFAQs(false);
    setShowHomePage(false);
    setShowAttendancePage(false);
  
    // Close all background images
    setShowBackgroundImage(false);
    setShowEditProfileImage(false);
    setShowChangePasswordImage(false);
    setShowFAQsImage(false);
    setShowUploadPhotosImage(false);
    setShowRegistrationImage(false);
  
    // Show the selected page/form and its related background image
    switch (index) {
      case 0: // Home Page
        setShowHomePage(true);
        break;
      case 1: // Attendance & Reports 
        setShowAttendancePage(true);
        break;
      case 2: // Registration
        setShowRegistrationForm(true);
        setShowRegistrationImage(true);
        setShowBackgroundImage(true);
        break;
      case 3: // Edit Profile
        setShowEditProfile(true);
        setShowEditProfileImage(true);
        setShowBackgroundImage(true);
        break;
      case 4: // Upload Photos
        setShowUploadForm(true);
        setShowUploadPhotosImage(true);
        setShowBackgroundImage(true);
        break;
      case 5: // Change Password
        setShowChangePasswordForm(true);
        setShowChangePasswordImage(true);
       
        break;
      case 6: // Support & FAQs
        setShowFAQs(true);
        setShowFAQsImage(true);
        setShowBackgroundImage(true);
        break;
      default:
        break;
    }
  
    // Ensure menu remains open
    setMenuOpen(true);
  };

  const handleOpenUserProfile = () => {
    // Logic to open user profile modal
  };

  const handleUpdatePassword = () => {
    console.log("Password updated!");
    setShowChangePasswordForm(true);
    setShowBackgroundImage(true);
  };

  useEffect(() => {
    const storedUserEmail = sessionStorage.getItem("loginEmail");
    setUserEmail(storedUserEmail);
    const fetchUserName = async () => {
      try {
        if (storedUserEmail) {
          const response = await fetch(`http://127.0.0.1:8000/username/?email=${storedUserEmail}`);
          const data = await response.json();

          setUserName(data.userName);
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    fetchUserName();
    // eslint-disable-next-line
  }, [sessionStorage.getItem("loginEmail")]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    sessionStorage.removeItem("loginEmail");
    navigate("/");
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleUploadPhotos = () => {
    setShowUploadForm(true);
  };

  const menuOptions = [
    { label: "Dashboard", icon: <Home />, action: () => setShowHomePage(true) },
    { label: "Attendance & Reports", icon: <CalendarToday /> },
    { label: "Employee Registration", icon: <PersonAdd />, action: () => setShowRegistrationForm(true) },
    { label: "Edit Profile", icon: <Person />, action: () => setShowEditProfile(true) },
    { label: "Upload Photos", icon: <CloudUpload />, action: handleUploadPhotos },
    { label: "Change Password", icon: <Lock />, action: handleOpenUserProfile },
    { label: "Support & FAQs", icon: <Help />, action: () => handleMenuOptionClick(6) },
  ];

  const toggleMenu = () => {
    if (!showHomePage) {
      setMenuOpen(!menuOpen);
    }
  };

  return (
    <div className={`dashboard ${menuOpen ? "menu-open" : ""} `}
      style={{
        backgroundImage: (showChangePasswordImage ? `url('https://i.pinimg.com/564x/20/21/35/20213585795b1d232af28c9106038247.jpg')` : (showEditProfileImage ? `url('https://img.freepik.com/premium-vector/profile-filling-presentation-man-people-flat-illustration_553411-214.jpg')` : (showFAQsImage ? `url('https://i.pinimg.com/564x/98/f3/03/98f30343e980b3850c75a641bb0f689d.jpg')`:(showUploadPhotosImage ? `url('https://cdn-icons-png.flaticon.com/128/2716/2716054.png')` : (showRegistrationImage ? `url('https://i.pinimg.com/564x/7f/f5/c3/7ff5c3f9e0029683e2dd0069f36b6e6a.jpg')` : 'none'))))),
        backgroundSize: showRegistrationImage ? '400px 400px' : showUploadPhotosImage ?'200px 200px': showFAQsImage ? '570px 570px' : showEditProfileImage ? '550px 570px' : '550px 550px',
        backgroundPosition: showRegistrationImage ? '65rem 4rem' :  showUploadPhotosImage ? '61rem 3rem': showFAQsImage ? '61rem 10rem' : showEditProfileImage ? '61rem 6rem' : '65rem 5rem',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed', 
      }}
    >

      <header className="top-navbar" style={{ backgroundColor: "#0f4c82" }}>
        <div className="menu-toggle" onClick={toggleMenu}>
          <MenuIcon />
        </div>
        <div className="website-info">
          <h2>
            <Security style={{ fontSize: 32, marginBottom: '5px', marginLeft: '130px' }} />
            SUV Attendance Management System
          </h2>
        </div>
        <div className="user-info" style={{ display: "flex", alignItems: "center" }}>
          <div className="account-icon" style={{ display: "flex", flexDirection: "row", alignItems: "center", marginRight: "10px" }}>
            <AccountCircle sx={{ fontSize: 29 }} onClick={handleOpenUserProfile} />
            <Typography variant="body2" style={{ color: "white", marginLeft: "0px" }}>
              {userName}
            </Typography>
          </div>
          <Tooltip title="Logout" arrow>
            <div className="logout-icon" onClick={handleLogout}>
              <ExitToApp sx={{ fontSize: 32, marginBottom: '5px' }} />
            </div>
          </Tooltip>
        </div>

      </header>
      <nav className={`left-menu ${menuOpen ? "open" : ""}`} style={{ backgroundColor: "#1a1a1a", paddingTop: "0px" }}>
        {menuOpen && (
          <div className="welcome-message" style={{ color: "white", textAlign: "center", marginBottom: "20px" }}>
            Welcome!
          </div>
        )}
        <List style={{ listStyle: "none", padding: 0 }}>
          {menuOptions.map((option, index) => (
            <ListItem
            key={index}
            onClick={() => handleMenuOptionClick(index)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "15px",
              cursor: "pointer",
              borderRadius: "8px",
              marginBottom: "5px",
              backgroundColor: showHomePage && index === 0 ? "#2e2e2e" : "transparent",
            }}
          >
            <ListItemIcon style={{ marginRight: "0px", color: "white" }}>
              {React.cloneElement(option.icon, { style: { fontSize: 32 } })}
            </ListItemIcon>
            <ListItemText primary={option.label} style={{ color: "white" }} />
          </ListItem>
          ))}
        </List>
      </nav>
      <div className="content-dash">
        {showHomePage && <HomePage />}
        {showFAQs && (
          <div className="form-container">
            <FAQs />
          </div>
        )}
        {showRegistrationForm && (
          <div className="form-container">
            <RegistrationForm />
          </div>
        )}
        {showEditProfile && (
          <div className="form-container">
            <EditProfile />
          </div>
        )}
        {showUploadForm && (
          <div className="form-container">
            <PhotoUploadForm />
          </div>
        )}
        {showChangePasswordForm && (
          <div className="form-container">
            <ChangePasswordForm
              onCancel={() => setShowChangePasswordForm(false)}
              onUpdate={handleUpdatePassword}
            />
          </div>
        )}
        {showAttendancePage && (
          <div className="form-container">
            <AttendancePage />
          </div>
        )}
      </div>

      <div className="logout-modal-container">
        <Modal
          open={showLogoutModal}
          onClose={handleLogoutCancel}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, bgcolor: 'white', boxShadow: 10, p: 4, borderRadius: 1 }}>
            <Typography id="modal-modal-title" variant="h6" component="h2" style={{ marginBottom: 2, fontWeight: 'bold' }}>
              Logout Confirmation
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2, color: 'rgba(0, 0, 0, 0.9)' }}>
              Are you sure you want to log out?
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button variant="contained" color="secondary" onClick={handleLogoutCancel} style={{ marginRight: 2, backgroundColor: '#808080' }}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleLogoutConfirm}>
                Logout
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;

