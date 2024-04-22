// import React, { useState, useEffect } from "react";
// import "./Login.css";
// import "bootstrap/dist/css/bootstrap.css";
// import { useNavigate } from "react-router";
// import Footer from "./Footer";

// interface Props {}

// const LoginPage = (props: Props) => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);

//   useEffect(() => {
//     const storedEmail = localStorage.getItem("loginEmail");
//     const storedPassword = localStorage.getItem("loginPassword");
//     const storedRememberMe = localStorage.getItem("rememberMe");

//     if (storedRememberMe === "true" && storedEmail && storedPassword) {
//       setEmail(storedEmail);
//       setPassword(storedPassword);
//       setRememberMe(true);
//     }
//   }, []);

//   const validation = (email: string) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const validate = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!email || !password) {
//       alert("Please Enter The Required Fields");
//     } else if (!validation(email)) {
//       alert("Please Enter a Valid Email Address");
//     } else if (email === "admin@gmail.com" && password === "hi@1") {
//       localStorage.setItem("authenticated", "true");

//       if (rememberMe) {
//         localStorage.setItem("loginEmail", email);
//         localStorage.setItem("loginPassword", password);
//         localStorage.setItem("rememberMe", "true");
//       } else {
//         localStorage.removeItem("loginEmail");
//         localStorage.removeItem("loginPassword");
//         localStorage.removeItem("rememberMe");
//       }

//       navigate("/registration");
//     } else {
//       alert("Incorrect email or password");
//     }
//   };

//   return (
//     <div>
//       <header className="fixed-top">
//         <div className="website-name">
//         <h2 className="display-5 fw-bold text-primary">SUV Attendance Management System</h2>
//         </div>
//       </header>
//       <div className="login-container">
//         <div className="side-cover-image"></div>
//         <div className="content">
//           <h1>Login</h1>
//           <form onSubmit={validate}>
//             <div className="form-floating mb-4">
//               <input
//                 type="email"
//                 className="form-control"
//                 id="floatingInput"
//                 placeholder="name@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//               <label htmlFor="floatingInput">Email address</label>
//             </div>
//             <div className="mb-4 form-floating position-relative">
//               <input
//                 type="password"
//                 className="form-control"
//                 id="floatingPassword"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <label htmlFor="floatingPassword">Password</label>
//             </div>
//             <div className="mb-3 form-check">
//               <input
//                 type="checkbox"
//                 className="form-check-input"
//                 id="check"
//                 checked={rememberMe}
//                 onChange={() => setRememberMe(!rememberMe)}
//               />
//               <label className="form-check-label" htmlFor="check">
//                 Remember Me
//               </label>
//             </div>
//             <div className="d-grid">
//               <button className="btn btn-primary" type="submit">
//                 Login
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//       <div className="footer">
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


// import React, { useState } from "react";
// import { useNavigate } from "react-router";
// import Footer from "./Footer";
// import './Login.css';

// interface Props {}

// const LoginPage = (props: Props) => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);

//   const validation = (email: string) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const validate = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!email || !password) {
//       alert("Please Enter The Required Fields");
//       return;
//     } else if (!validation(email)) {
//       alert("Please Enter a Valid Email Address");
//       return;
//     }

//     try {
//       const response = await fetch("http://127.0.0.1:8000/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       if (response.ok) {
//         const userData = await response.json();

//         localStorage.setItem("authenticated", "true");

//         if (rememberMe) {
//           localStorage.setItem("loginEmail", email);
//           localStorage.setItem("loginPassword", password);
//           localStorage.setItem("rememberMe", "true");
//         } else {
//           localStorage.removeItem("loginEmail");
//           localStorage.removeItem("loginPassword");
//           localStorage.removeItem("rememberMe");
//         }

//        if (userData.role === "admin") {
//         navigate("/registration");
//       } else if (userData.role === "employee") {
//         navigate("/welcome");
//       } else {
//         alert("Unknown user role. Redirecting to a default page.");
//         navigate("/default");
//       };
//       } else {
//         const errorData = await response.json();
//         alert(`Error: ${errorData.detail}`);
//       }
//     } catch (error) {
//       console.error("Error during login:", error);
//       alert("Error during login. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <header className="fixed-top">
//         <div className="website-name">
//           <h2 className="display-5 fw-bold text-primary">
//             SUV Attendance Management System
//           </h2>
//         </div>
//       </header>
//       <div className="login-container">
//         <div className="side-cover-image"></div>
//         <div className="content">
//           <h1>Login</h1>
//           <form onSubmit={validate}>
//             <div className="form-floating mb-4">
//               <input
//                 type="email"
//                 className="form-control"
//                 id="floatingInput"
//                 placeholder="name@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//               <label htmlFor="floatingInput">Email address</label>
//             </div>
//             <div className="mb-4 form-floating position-relative">
//               <input
//                 type="password"
//                 className="form-control"
//                 id="floatingPassword"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <label htmlFor="floatingPassword">Password</label>
//             </div>
//             <div className="mb-3 form-check">
//               <input
//                 type="checkbox"
//                 className="form-check-input"
//                 id="check"
//                 checked={rememberMe}
//                 onChange={() => setRememberMe(!rememberMe)}
//               />
//               <label className="form-check-label" htmlFor="check">
//                 Remember Me
//               </label>
//             </div>
//             <div className="d-grid">
//               <button className="btn btn-primary" type="submit">
//                 Login
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//       <div className="footer">
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


// import React, { useState } from "react";
// import { useNavigate } from "react-router";
// import Footer from "./Footer";
// import './Login.css';

// interface Props {}

// const LoginPage = (props: Props) => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);

//   const handleLogin = () => {
//     sessionStorage.setItem('loginEmail', email);
//     sessionStorage.setItem('loginPassword', password); 
//   };

//   const validation = (email: string) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const validate = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!email || !password) {
//       alert("Please Enter The Required Fields");
//       return;
//     } else if (!validation(email)) {
//       alert("Please Enter a Valid Email Address");
//       return;
//     }

//     try {
//       const response = await fetch("http://127.0.0.1:8000/login/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       if (response.ok) {
//         const userData = await response.json();

//         sessionStorage.setItem('authenticated', 'true');
//         sessionStorage.setItem('loginEmail', email);

//         if (rememberMe) {
//           localStorage.setItem("loginEmail", email);
//           localStorage.setItem("loginPassword", password);
//           localStorage.setItem("rememberMe", "true");
//         } else {
//           localStorage.removeItem("loginEmail");
//           localStorage.removeItem("loginPassword");
//           localStorage.removeItem("rememberMe");
//         }

//         if (userData["message"] === "Admin Login Successfully") {
//           navigate("/admin-dashboard");
//         } else if (userData["message"] === "Employee Login Successfully") {
//           navigate("/user-dashboard");
//         } else {
//           alert("Unknown user role. Redirecting to a default page.");
//         }
//       } else {
//         const errorData = await response.json();
//         alert(`Error: ${errorData.detail}`);
//       }
//     } catch (error) {
//       console.error("Error during login:", error);
//       alert("Error during login. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <header className="fixed-top">
//         <div className="website-name">
//           <h2 className="display-5 fw-bold text-primary">
//             SUV Attendance Management System
//           </h2>
//         </div>
//       </header>
//       <div className="login-container">
//         <div className="side-cover-image"></div>
//         <div className="content">
//           <h1>Login</h1>
//           <form onSubmit={validate}>
//             <div className="form-floating mb-4">
//               <input
//                 type="email"
//                 className="form-control"
//                 id="floatingInput"
//                 placeholder="name@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//               <label htmlFor="floatingInput">Email address</label>
//             </div>
//             <div className="mb-4 form-floating position-relative">
//               <input
//                 type="password"
//                 className="form-control"
//                 id="floatingPassword"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <label htmlFor="floatingPassword">Password</label>
//             </div>
//             <div className="mb-3 form-check">
//               <input
//                 type="checkbox"
//                 className="form-check-input"
//                 id="check"
//                 checked={rememberMe}
//                 onChange={() => setRememberMe(!rememberMe)}
//               />
//               <label className="form-check-label" htmlFor="check">
//                 Remember Me
//               </label>
//             </div>
//             <div className="d-grid">
//               <button className="btn btn-primary" type="submit" onClick={handleLogin}>
//                 Login
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//       <div className="footer">
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

// LoginPage.tsx

// LoginPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Avatar, Box, Button, Checkbox, CssBaseline, FormControlLabel, Grid, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Email, Lock, Security } from '@mui/icons-material';

const customTheme = createTheme({
  palette: {
    error: {
      main: '#f44336',
    },
  },
});

interface Props {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  return <MuiAlert elevation={10} ref={ref} variant="filled" {...props} />;
});

const LoginPage = (props: Props) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorOutline, setErrorOutline] = useState({ email: false, password: false });

  const handleAlertClose = () => {
    setOpenAlert(false);
    setErrorOutline({ email: false, password: false });
  };

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setOpenAlert(true);
    setErrorOutline({ email: true, password: true });
  };

  const validation = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validate = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!email || !password) {
      showAlert('Please Enter The Required Fields');
      return;
    } else if (!validation(email)) {
      showAlert('Please Enter a Valid Email Address');
      return;
    }
  
    try {
      const response = await fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const userData = await response.json();
  
        sessionStorage.setItem('authenticated', 'true');
        sessionStorage.setItem('loginEmail', email);
  
        if (rememberMe) {
          localStorage.setItem('loginEmail', email);
          localStorage.setItem('loginPassword', password);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('loginEmail');
          localStorage.removeItem('loginPassword');
          localStorage.removeItem('rememberMe');
        }
  
        if (userData['message'] === 'Admin Login Successfully') {
          navigate('/admin-dashboard');
        } else if (userData['message'] === 'Employee Login Successfully') {
          navigate('/user-dashboard');
        } else {
          showAlert('Unknown user role. Redirecting to a default page.');
        }
      } else {
        const errorData = await response.json();
        showAlert(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      showAlert('Error during login. Please try again.');
    }
  };
  
useEffect(() => {
    // Redirect to login page if not authenticated
    const isAuthenticated = sessionStorage.getItem('authenticated');
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, []);

  useEffect(() => {
    const storedRememberMe = localStorage.getItem('rememberMe') === 'true';
    setRememberMe(storedRememberMe);
  
    if (storedRememberMe) {
      const storedEmail = localStorage.getItem('loginEmail') || '';
      const storedPassword = localStorage.getItem('loginPassword') || '';
      setEmail(storedEmail);
      setPassword(storedPassword);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('rememberMe', rememberMe.toString());
    if (rememberMe) {
      localStorage.setItem('loginEmail', email);
      localStorage.setItem('loginPassword', password);
    } else {
      localStorage.removeItem('loginEmail');
      localStorage.removeItem('loginPassword');
    }
  }, [email, password, rememberMe]);
  

  return (
    <ThemeProvider theme={customTheme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.5rem',
          backgroundColor: '#0f4c82',
          color: 'white',
          boxShadow: '20',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50px',
          }}
        >
          <Security style={{ height: '40px', width: '40px', marginRight: '10px' }} />
          <Typography variant="h6" sx={{ fontFamily: '-moz-initial', fontSize: '1.6rem', textAlign: 'center' }}>
            <span style={{fontFamily:'sans-serif'  }}>SUV ATTENDANCE MANAGEMENT SYSTEM</span>
          </Typography>
        </Box>
      </Box>

      <Grid container component="main" sx={{ height: 'calc(100vh - 50px)' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://i.pinimg.com/564x/44/94/64/44946421aa304c9fc0fb213b750ffc27.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: 'white',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={10} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: '#0e4b81' }}>
              <LockOutlinedIcon />
            </Avatar>

            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box component="form" noValidate onSubmit={validate} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errorOutline.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errorOutline.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControlLabel
                control={<Checkbox value={rememberMe} color="primary" onChange={() => setRememberMe(!rememberMe)} />}
                label="Remember me"
              />
              <Button type="submit"  fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                LOGIN
              </Button>
            </Box>
            <Box
              sx={{
                position: 'sticky',
                bottom: 0,
                py: 2,
                color: 'black',
                textAlign: 'center',
                width: '100%',
              }}
            >
              <Typography variant="body2" color="gray">
                SUV © {new Date().getFullYear()}. All rights reserved.
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleAlertClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleAlertClose} severity="error">
          {alertMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default LoginPage;


