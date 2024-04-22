// import React, { useState, useEffect } from "react";
// import { TextField, Button, Alert, Paper, Typography, InputAdornment, IconButton } from "@mui/material";
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Visibility, VisibilityOff } from "@mui/icons-material";

// interface ChangePasswordFormProps {
//   onCancel: () => void;
//   onUpdate: () => void;
// }

// const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
//   onCancel,
//   onUpdate,
// }) => {
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showAlert, setShowAlert] = useState(false);
//   const [userEmail, setUserEmail] = useState<string | null>(null);
//   const [showPassword, setShowPassword] = useState<{[key: string]: boolean}>({
//     current: false,
//     new: false,
//     confirm: false,
//   });

//   useEffect(() => {
//     const storedUserEmail = sessionStorage.getItem("loginEmail");
//     setUserEmail(storedUserEmail);
//   }, []);

//   const handleReset = () => {
//     setOldPassword("");
//     setNewPassword("");
//     setConfirmPassword("");
//     setShowAlert(false);
//   };

//   const validatePassword = (password: string): boolean => {
//     return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
//       password
//     );
//   };

//   const handleUpdate = async () => {
//     try {
//       // Validate passwords
//       if (!validatePassword(newPassword)) {
//         toast.error(
//           "Invalid password. Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character."
//         );
//         return;
//       }
  
//       if (newPassword !== confirmPassword) {
//         toast.error("Passwords do not match. Please try again.");
//         return;
//       }
  
//       // Make API call to update password
//       const payload = {
//         current_password: oldPassword,
//         new_password: newPassword,
//         confirm_password: confirmPassword,
//         email: userEmail,
//       };
  
//       const response = await fetch("http://127.0.0.1:8000/change_password/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });
  
//       if (response.ok) {
//         const data =await response.json()
//         // Password updated successfully
//         if( data.message === "password updated successfully"){
//           toast.success('Password updated successfully!');
//           onUpdate(); 
//         }
//         else{
//           toast.error(data.message);
//         }
       
//       } else {
//         // Handle error response
//         const errorData = await response.json();
//         console.error("Error updating password:", errorData);
//         toast.error('Failed to update password. Please try again.');
//       }
//     } catch (error) {
//       // Display error message
//       console.error("An error occurred:", error);
//       toast.error('An error occurred. Please try again.');
//     }
//   };

//   const handleShowPassword = (field: string) => {
//     setShowPassword(prevState => ({
//       ...prevState,
//       [field]: !prevState[field],
//     }));
//   };

//   return (
//     <div style={{marginTop:'100px'}}>
//       <Paper elevation={10} style={{ padding: "1.5rem", marginLeft: '19rem', border:'2px solid #0f4c82', borderRadius:'30px' }}>
//         <Typography variant="h4" gutterBottom style={{ textAlign: "center", color: "#1976d2", fontWeight:'bold', fontSize: '1.6rem' }}>
//           Change Password
//         </Typography>
//         <form>
//           <TextField
//             label="Current Password"
//             type={showPassword.current ? "text" : "password"}
//             fullWidth
//             margin="normal"
//             value={oldPassword}
//             onChange={(e) => setOldPassword(e.target.value)}
//             required
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton onClick={() => handleShowPassword('current')}>
//                     {showPassword.current ? <Visibility /> : <VisibilityOff />}
//                   </IconButton>
//                 </InputAdornment>
//               )
//             }}
//           />
//           <TextField
//             label="New Password"
//             type={showPassword.new ? "text" : "password"}
//             fullWidth
//             margin="normal"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             required
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton onClick={() => handleShowPassword('new')}>
//                     {showPassword.new ? <Visibility /> : <VisibilityOff />}
//                   </IconButton>
//                 </InputAdornment>
//               )
//             }}
//           />
//           <TextField
//             label="Confirm New Password"
//             type={showPassword.confirm ? "text" : "password"}
//             fullWidth
//             margin="normal"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton onClick={() => handleShowPassword('confirm')}>
//                     {showPassword.confirm ? <Visibility /> : <VisibilityOff />}
//                   </IconButton>
//                 </InputAdornment>
//               )
//             }}
//           />
//           <div style={{ marginTop: "1rem" }}>
//             {showAlert && (
//               <Alert severity="error">
//                 Passwords do not match. Please try again.
//               </Alert>
//             )}
//           </div>
//           <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
//             <Button variant="contained" color="primary" onClick={handleUpdate}>
//               Update
//             </Button>
//             <Button variant="outlined" color="primary" onClick={handleReset} style={{ marginLeft: '1rem' }}>
//               Reset
//             </Button>
//           </div>
//         </form>
//       </Paper>
//       <ToastContainer position="top-center" autoClose={6000} />
//     </div>
//   );
// };

// export default ChangePasswordForm;

import React, { useState, useEffect } from "react";
import { TextField, Button, Alert, Paper, Typography, InputAdornment, IconButton } from "@mui/material";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface ChangePasswordFormProps {
  onCancel: () => void;
  onUpdate: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onCancel,
  onUpdate,
}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<{[key: string]: boolean}>({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const storedUserEmail = sessionStorage.getItem("loginEmail");
    setUserEmail(storedUserEmail);
  }, []);

  const handleReset = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowAlert(false);
  };

  const validatePassword = (password: string): boolean => {
    return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
      password
    );
  };

  const handleUpdate = async () => {
    try {
      // Validate passwords
      if (!validatePassword(newPassword)) {
        toast.error(
          "Invalid password. Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character."
        );
        return;
      }
  
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match. Please try again.");
        return;
      }
  
      // Make API call to update password
      const payload = {
        current_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
        email: userEmail,
      };
  
      const response = await fetch("http://127.0.0.1:8000/change_password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const data =await response.json()
        // Password updated successfully
        if( data.message === "password updated successfully"){
          toast.success('Password updated successfully!');
          onUpdate(); 
        }
        else{
          toast.error(data.message);
        }
       
      } else {
        // Handle error response
        const errorData = await response.json();
        console.error("Error updating password:", errorData);
        toast.error('Failed to update password. Please try again.');
      }
    } catch (error) {
      // Display error message
      console.error("An error occurred:", error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleShowPassword = (field: string) => {
    setShowPassword(prevState => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <div style={{marginTop:'150px', width:'1010px'}}>
      <Paper elevation={10} style={{ padding: "1.5rem", marginLeft: '19rem', border:'2px solid #0f4c82', borderRadius:'30px' }}>
        <Typography variant="h4" gutterBottom style={{ textAlign: "center", color: "#1976d2", fontWeight:'bold', fontSize: '1.6rem' }}>
          Change Password
        </Typography>
        <form>
          <TextField
            label="Current Password"
            type={showPassword.current ? "text" : "password"}
            fullWidth
            margin="normal"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleShowPassword('current')}>
                    {showPassword.current ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            label="New Password"
            type={showPassword.new ? "text" : "password"}
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleShowPassword('new')}>
                    {showPassword.new ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            label="Confirm New Password"
            type={showPassword.confirm ? "text" : "password"}
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleShowPassword('confirm')}>
                    {showPassword.confirm ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <div style={{ marginTop: "1rem" }}>
            {showAlert && (
              <Alert severity="error">
                Passwords do not match. Please try again.
              </Alert>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Update
            </Button>
            <Button variant="outlined" color="primary" onClick={handleReset} style={{ marginLeft: '1rem' }}>
              Reset
            </Button>
          </div>
        </form>
      </Paper>
      <ToastContainer position="top-center" autoClose={6000} />
    </div>
  );
};

export default ChangePasswordForm;
