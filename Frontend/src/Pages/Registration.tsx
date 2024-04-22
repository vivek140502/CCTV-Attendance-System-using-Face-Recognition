// import React, { useState, useEffect } from 'react';
// import Select from "react-select";
// //import 'bootstrap/dist/css/bootstrap.min.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
// //import "./registration.css";
// import { Country, State, City } from "country-state-city";
// import { Paper, Typography, Button } from '@mui/material';

// interface RegistrationFormData {
//   first_name: string;
//   last_name: string;
//   email: string;
//   phone_number: string;
//   department: string;
//   gender: string;
//   date_of_birth: string;
//   address: string;
//   country: string;
//   state: string;
//   city: string;
//   pincode: string;
//   password: string;
//   confirmPassword: string;
//   photo: File | null;
//   isAdmin: boolean;
// }

// const initialFormData: RegistrationFormData = {
//   first_name: '',
//   last_name: '',
//   email: '',
//   phone_number: '',
//   department: '',
//   gender: '',
//   date_of_birth: '',
//   address: '',
//   country: 'Select Country',
//   state: '',
//   city: '',
//   pincode: '',
//   password: '',
//   confirmPassword: '',
//   photo: null,
//   isAdmin: false,
// };

// const RegistrationForm: React.FC = () => {
//   const [formData, setFormData] = useState<RegistrationFormData>(initialFormData);
//   const [passwordError, setPasswordError] = useState<string>('');
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
//   const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
//   const [phoneNumberError, setPhoneNumberError] = useState<string>('');
//   const [isAdmin, setIsAdmin] = useState<boolean>(false);
//   const [maxDate, setMaxDate] = useState<string>('');

//   const handleReset = () => {
//     setFormData(initialFormData);
//     setSelectedCountry(null);
//     setSelectedState(null);
//     setSelectedCity(null);
//   };

//   useEffect(() => {
//     setMaxDate(getMaxDate());
//   }, []);

//   const getMaxDate = (): string => {
//     const today = new Date();
//     const eighteenYearsAgo = new Date();
//     eighteenYearsAgo.setFullYear(today.getFullYear() - 18);

//     const year = eighteenYearsAgo.getFullYear();
//     let month: string | number = eighteenYearsAgo.getMonth() + 1;
//     let day: string | number = eighteenYearsAgo.getDate();

//     // Add leading zero for single-digit months and days
//     if (month < 10) {
//       month = `0${month}`;
//     }
//     if (day < 10) {
//       // day = `0${day}`;
//     }

//     return `${year}-${month}-${day}`;
//   };

//   // eslint-disable-next-line
//   const [states, setStates] = useState<string[]>([]);
//   const [selectedCountry, setSelectedCountry] = useState<any>(null);
//   const [selectedState, setSelectedState] = useState<any>(null);
//   const [selectedCity, setSelectedCity] = useState<any>(null);
//   const [countryOptions, setCountryOptions] = useState<any[]>([]);
//   const [stateOptions, setStateOptions] = useState<any[]>([]);
//   const [cityOptions, setCityOptions] = useState<any[]>([]);
//   // eslint-disable-next-line
//   const [errors, setErrors] = React.useState<Partial<FormData>>({});


//   useEffect(() => {
//     const fetchCountries = async () => {
//       const countries: any = await Country.getAllCountries();
//       const formattedCountries = countries.map((country: any) => ({
//         value: country.isoCode,
//         label: country.name,
//       }));
//       setCountryOptions(formattedCountries);
//     };
//     fetchCountries();
//   }, []);


//   const handleCountryChange = async (selectedOption: any) => {
//     setSelectedCountry(selectedOption);
//     const states: any = await State.getStatesOfCountry(selectedOption.value);
//     const formattedStates = states.map((state: any) => ({
//       value: state.isoCode,
//       label: state.name,
//     }));
//     setStateOptions(formattedStates);
//     setSelectedState(null);
//     setCityOptions([]);
//     setSelectedCity(null);

//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       country: selectedOption.label,
//       state: "",
//       city: "",
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       country: "",
//       state: "",
//       city: "",
//     }));
//   };

//   const handleStateChange = async (selectedOption: any) => {
//     setSelectedState(selectedOption);
//     console.log("Selected State:", selectedOption);
//     console.log("Selected Country:", selectedCountry);

//     if (selectedCountry && selectedOption) {
//       const cities: any = await City.getCitiesOfState(
//         selectedCountry.value,
//         selectedOption.value
//       );
//       console.log("Cities:", cities);
//       const formattedCities = cities.map((city: any) => ({
//         value: city.name,
//         label: city.name,
//       }));
//       setCityOptions(formattedCities);
//       setSelectedCity(null);
//     }
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       state: selectedOption.label,

//       city: "",
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       country: "",
//       state: "",
//       city: "",
//     }));
//   };

//   const handleCityChange = (selectedOption: any) => {
//     setSelectedCity(selectedOption);

//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       city: selectedOption.label,
//     }));

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       country: "",
//       state: "",
//       city: "",
//     }));
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value, type } = e.target;

//     if (name === 'password' || name === 'confirmPassword') {
//       setPasswordError('');
//     }

//     if (name === 'first_name' || name === 'last_name') {

//       const isValidName = /^[a-zA-Z\s]*$/.test(value);
//       if (!isValidName) {
//         alert(`Invalid ${name}. Only letters and spaces are allowed.`);
//         return;
//       }

//       if (name === 'last_name' && value.toLowerCase() === formData.first_name.toLowerCase()) {
//         alert("First name and last name cannot be the same.");
//         return;
//       }
//     }

//     if (name === 'phone_number') {
//       const isValidPhone = /^\d{10}$/.test(value);
//       if (!isValidPhone) {
//         setPhoneNumberError('Phone number must be a valid 10-digit number.');
//       } else {
//         setPhoneNumberError('');
//       }
//     }

//     if (name === 'date_of_birth') {
//       const enteredDate = new Date(value);
//       const today = new Date();
//       const eighteenYearsAgo = new Date();
//       eighteenYearsAgo.setFullYear(today.getFullYear() - 18);

//       if (enteredDate > eighteenYearsAgo) {
//         alert('You must be 18 years or older to register.');
//         return;
//       }
//       setFormData((prevData) => ({
//         ...prevData,
//         date_of_birth: value,
//       }));
//     }

//     if (name === 'pincode') {
//       let isValidPincode: boolean;

//       switch (formData.country) {
//         case 'India':
//           isValidPincode = /^\d{0,6}$/.test(value);
//           break;
//         case 'USA':
//           isValidPincode = /^\d{0,5}$/.test(value);
//           break;
//         case 'Australia':
//           isValidPincode = /^\d{0,4}$/.test(value);
//           break;
//         default:
//           isValidPincode = /^\d{0,6}$/.test(value);
//       }

//       if (!isValidPincode) {
//         setFormData((prevData) => ({
//           ...prevData,
//           pincode: value.replace(/[^0-9]/g, '').slice(0, 6),
//         }));
//         alert(`Pincode should be a valid for ${formData.country}.`);
//         return;
//       }
//     }
//     if (name === 'country') {
//       setFormData((prevData) => ({
//         ...prevData,
//         country: value,
//         state: '',
//       }));
//     }

//     if (type === 'checkbox' && name === 'isAdmin') {
//       setIsAdmin((e.target as HTMLInputElement).checked);
//     }

//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleBlur = (name: string) => {
//     if (name === 'password') {
//       const isPasswordValid =
//         /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(formData.password);

//       if (!isPasswordValid) {
//         const passwordErrorMessage =
//           'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character.';
//         alert(passwordErrorMessage);
//       }
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setPasswordError('Passwords do not match.');
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;

//     if (file) {
//       const formatsAllowed = ['image/png', 'image/jpg', 'image/jpeg'];
//       if (formatsAllowed.includes(file.type)) {
//         setFormData((prevData) => ({
//           ...prevData,
//           photo: file,
//         }));
//       } else {
//         alert('Please upload a valid PNG, JPG, or JPEG file.');
//         e.target.value = '';
//       }
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const isPasswordValid =
//       /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(formData.password);

//     if (!isPasswordValid) {
//       const passwordErrorMessage =
//         'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character.';
//       alert(passwordErrorMessage);
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setPasswordError('Passwords do not match.');
//       return;
//     }

//     if (!agreeTerms) {
//       alert('Please agree to the terms and conditions.');
//       return;
//     }

//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append('first_name', formData.first_name);
//       formDataToSend.append('last_name', formData.last_name);
//       formDataToSend.append('email', formData.email);
//       formDataToSend.append('phone_number', formData.phone_number);
//       formDataToSend.append('address', formData.address);
//       formDataToSend.append('department', formData.department);
//       formDataToSend.append('gender', formData.gender);
//       formDataToSend.append('date_of_birth', formData.date_of_birth);
//       formDataToSend.append('password', formData.password);
//       if (formData.photo) {
//         formDataToSend.append('photo', formData.photo, formData.photo.name);
//         formDataToSend.append('isAdmin', String(isAdmin));
//       }
//       formDataToSend.append('country', formData.country);
//       formDataToSend.append('state', formData.state);
//       formDataToSend.append('city', formData.city);
//       formDataToSend.append('pincode', formData.pincode);

//       const response = await fetch('http://127.0.0.1:8000/form_with_photo/', {
//         method: 'POST',
//         body: formDataToSend,
//       });

//       if (response.ok) {
//         window.alert('Registration successful!');
//         console.log('Registration successful');
//         setFormData({
//           first_name: '',
//           last_name: '',
//           email: '',
//           phone_number: '',
//           department: '',
//           gender: '',
//           date_of_birth: '',
//           address: '',
//           country: 'Select Country',
//           state: '',
//           city: '',
//           pincode: '',
//           password: '',
//           confirmPassword: '',
//           photo: null,
//           isAdmin: false,
//         });
//       } else {
//         const errorResponse = await response.json();

//         if (errorResponse && errorResponse.detail === 'Email already exists') {
//           window.alert('Email already exists. Please use a different email.');
//         } else {
//           console.error('Registration failed:', errorResponse);
//         }
//       }
//     } catch (error) {
//       console.error('Error during registration:', error);
//     }
//   };

//   const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
//     if (field === 'password') {
//       setShowPassword(!showPassword);
//     } else {
//       setShowConfirmPassword(!showConfirmPassword);
//     }
//   };

//   return (
//     <div style={{ width: '1000px', margin: '20px auto' }}>
//       <div className="registration-page">
//         <Paper elevation={10} style={{ padding: '20px', maxWidth: '1000px', marginLeft: '350px', marginTop: '90px', border: '2px solid #0f4c82', borderRadius: '30px' }}>
//           <div className="card-body">
//             <Typography variant="h4" gutterBottom style={{ textAlign: "center", color: "#1976d2", fontWeight: 'bold', fontSize: '1.6rem' }}>
//               Employee Registration
//             </Typography>
//             <form onSubmit={handleSubmit}>
//               <div className="row">
//                 <div className="col-md-6">
//                   <div className="mb-3 form-floating">
//                     <input
//                       placeholder="First Name"
//                       type="text"
//                       id="first_name"
//                       name="first_name"
//                       value={formData.first_name}
//                       onChange={handleChange}
//                       required
//                       className="form-control"
//                     />
//                     <label htmlFor="first_name">First Name*</label>
//                   </div>
//                 </div>
//                 <div className="col-md-6">
//                   <div className="mb-3 form-floating">
//                     <input
//                       placeholder="Last Name"
//                       type="text"
//                       id="last_name"
//                       name="last_name"
//                       value={formData.last_name}
//                       onChange={handleChange}
//                       required
//                       className="form-control"
//                     />
//                     <label htmlFor="last_name">Last Name*</label>
//                   </div>
//                 </div>
//               </div>

//               <div className="mb-3 form-floating">
//                 <input
//                   placeholder="Email"
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   className="form-control"
//                 />
//                 <label htmlFor="email">Email*</label>
//               </div>
//               <div className="mb-3 form-floating">
//                 <input
//                   placeholder="Phone Number"
//                   type="text"
//                   id="phone_number"
//                   name="phone_number"
//                   value={formData.phone_number}
//                   onChange={handleChange}
//                   required
//                   className="form-control"
//                 />
//                 <label htmlFor="phone_number">Phone Number*</label>
//                 {phoneNumberError && <div className="error-message">{phoneNumberError}</div>}
//               </div>
//               <div className="mb-3 form-floating">
//                 <select
//                   id="department"
//                   name="department"
//                   value={formData.department}
//                   onChange={handleChange}
//                   required
//                   className="form-select"
//                 >
//                   <option value="" disabled>Select Department*</option>
//                   <option value="React JS and Nest JS Developer">React JS and Nest JS Developer</option>
//                   <option value="Dot Net and Angular Developer">Dot Net and Angular Developer</option>
//                   <option value="Python Developer">Python Developer</option>
//                   <option value="Digital Marketing">Digital Marketing</option>
//                   <option value="BDE">BDE</option>
//                   <option value="QA">QA</option>
//                   <option value="Accounts">Accounts</option>
//                   <option value="Finance">Finance</option>
//                 </select>
//                 <label htmlFor="department">Department</label>
//               </div>
//               <div className="mb-3">
//                 <label htmlFor="gender" className="form-label">Gender*</label>
//                 <div className="row">
//                   <div className="col-auto">
//                     <div className="form-check">
//                       <input
//                         type="radio"
//                         id="male"
//                         name="gender"
//                         value="male"
//                         onChange={handleChange}
//                         required
//                         className="form-check-input"
//                       />
//                       <label htmlFor="male" className="form-check-label">Male</label>
//                     </div>
//                   </div>
//                   <div className="col-auto">
//                     <div className="form-check">
//                       <input
//                         type="radio"
//                         id="female"
//                         name="gender"
//                         value="female"
//                         onChange={handleChange}
//                         required
//                         className="form-check-input"
//                       />
//                       <label htmlFor="female" className="form-check-label">Female</label>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="mb-3 form-floating">
//                 <input
//                   placeholder="Date of Birth"
//                   type="date"
//                   id="date_of_birth"
//                   name="date_of_birth"
//                   value={formData.date_of_birth}
//                   onChange={handleChange}
//                   required
//                   className="form-control"
//                   max={maxDate}
//                 />
//                 <label htmlFor="date_of_birth">Date of Birth*</label>
//               </div>
//               <div className="mb-3 form-floating" style={{ maxHeight: '100px', overflowY: 'auto' }}>
//                 <textarea
//                   placeholder="Address"
//                   id="address"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleChange}
//                   required
//                   className="form-control"
//                 />
//                 <label htmlFor="address">Address*</label>
//               </div>

//               <div className="row g-2">
//                 {/* Country */}
//                 <div className="col-md-6">
//                   <div style={{ height: '40px' }}>
//                     <Select
//                       options={countryOptions}
//                       value={selectedCountry}
//                       onChange={handleCountryChange}
//                       placeholder="Select Country"
//                       styles={{
//                         control: (provided) => ({
//                           ...provided,
//                           height: '100%',
//                           backgroundColor: 'transparent',
//                         }),
//                       }}
//                       menuPortalTarget={null}
//                     />

//                   </div>
//                 </div>
//                 {/* State */}
//                 <div className="col-md-6">
//                   <div style={{ height: '40px' }}>
//                     <Select
//                       options={stateOptions}
//                       value={selectedState}
//                       onChange={handleStateChange}
//                       placeholder="Select State"
//                       styles={{
//                         control: (provided) => ({
//                           ...provided,
//                           height: '100%',
//                           backgroundColor: 'transparent',
//                         }),
//                       }}
//                       menuPortalTarget={null}
//                     />

//                   </div>
//                 </div>
//                 {/* City */}
//                 <div className="col-md-6">
//                   <div style={{ height: '40px' }}>
//                     <Select
//                       options={cityOptions}
//                       value={selectedCity}
//                       onChange={handleCityChange}
//                       placeholder="Select City"
//                       styles={{
//                         control: (provided) => ({
//                           ...provided,
//                           height: '100%',
//                           backgroundColor: 'transparent',
//                         }),
//                       }}
//                       menuPortalTarget={null}
//                     />
//                   </div>
//                 </div>

//                 <div className="col-md-6">
//                   <div className="mb-2 form-floating" style={{ maxHeight: '100px', overflowY: 'auto' }}>
//                     <input
//                       placeholder="Pincode"
//                       type="text"
//                       id="pincode"
//                       name="pincode"
//                       value={formData.pincode}
//                       onChange={handleChange}
//                       required
//                       className="form-control"
//                     />
//                     <label htmlFor="pincode">Pincode*</label>
//                   </div>
//                 </div>
//               </div>

//               <div className="mb-3 form-floating position-relative">
//                 <input
//                   placeholder="Create Password"
//                   type={showPassword ? 'text' : 'password'}
//                   id="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   onBlur={() => handleBlur('password')}
//                   required
//                   className="form-control"
//                 />
//                 <label htmlFor="password">Create Password*</label>
//                 <div
//                   className="password-toggle"
//                   onClick={() => togglePasswordVisibility('password')}
//                 >
//                   <FontAwesomeIcon
//                     icon={showPassword ? faEye : faEyeSlash}
//                     className="position-absolute end-0 top-50 translate-middle-y me-2"
//                   />
//                 </div>
//               </div>
//               <div className="mb-3 form-floating position-relative">
//                 <input
//                   placeholder="Confirm Password"
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   onBlur={() => handleBlur('confirmPassword')}
//                   required
//                   className="form-control"
//                 />
//                 <label htmlFor="confirmPassword">Confirm Password*</label>
//                 <div
//                   className="password-toggle"
//                   onClick={() => togglePasswordVisibility('confirmPassword')}
//                 >
//                   <FontAwesomeIcon
//                     icon={showConfirmPassword ? faEye : faEyeSlash}
//                     className="position-absolute end-0 top-50 translate-middle-y me-2"
//                   />
//                 </div>
//                 {passwordError && <div className="error-message">{passwordError}</div>}
//               </div>

//               <div className="mb-3">
//               <label htmlFor="photo" style={{ fontWeight: 'bold', color: 'black', fontSize: '1rem', marginLeft:'2px' }}>Upload Photo*</label>
//                 <input
//                   type="file"
//                   id="photo"
//                   name="photo"
//                   onChange={handleFileChange}
//                   accept="image/png, image/jpg, image/jpeg"
//                   className="form-control"
//                 />
//               </div>

//               <div className="mb-3 form-check">
//                 <input
//                   type="checkbox"
//                   id="agree_terms"
//                   name="agree_terms"
//                   checked={agreeTerms}
//                   onChange={() => setAgreeTerms(!agreeTerms)}
//                   className="form-check-input"
//                 />
//                 <label htmlFor="agree_terms" className="form-check-label">
//                   I agree to the terms and conditions*
//                 </label>
//               </div>
//               <div className="mb-3 form-check">
//                 <input
//                   type="checkbox"
//                   id="isAdmin"
//                   name="isAdmin"
//                   checked={isAdmin}
//                   onChange={handleChange}
//                   className="form-check-input"
//                 />
//                 <label htmlFor="isAdmin" className="form-check-label">
//                   Register as Admin
//                 </label>
//               </div>
  
//               <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
//           <Button variant="contained" color="primary" >
//             Register
//           </Button>
//           <Button variant="outlined" color="primary" onClick={handleReset} style={{ marginLeft: '1rem' }}>
//             Reset
//           </Button>
//         </div>
//             </form>
//           </div>
//         </Paper>
//       </div>
//     </div>
//   );
// };

// export default RegistrationForm;

import React, { useState, useEffect } from 'react';
import Select from "react-select";
//import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
//import "./registration.css";
import { Country, State, City } from "country-state-city";
import { Paper, Typography, Button } from '@mui/material';

interface RegistrationFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  department: string;
  gender: string;
  date_of_birth: string;
  address: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  password: string;
  confirmPassword: string;
  photo: File | null;
  isAdmin: boolean;
}

const initialFormData: RegistrationFormData = {
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  department: '',
  gender: '',
  date_of_birth: '',
  address: '',
  country: 'Select Country',
  state: '',
  city: '',
  pincode: '',
  password: '',
  confirmPassword: '',
  photo: null,
  isAdmin: false,
};

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData);
  const [passwordError, setPasswordError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [phoneNumberError, setPhoneNumberError] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [maxDate, setMaxDate] = useState<string>('');

  const handleReset = () => {
    setFormData(initialFormData);
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
    setAgreeTerms(false);
    setIsAdmin(false);

    const fileInput = document.getElementById('photo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; 
    }
  };

  useEffect(() => {
    setMaxDate(getMaxDate());
  }, []);

  const getMaxDate = (): string => {
    const today = new Date();
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(today.getFullYear() - 18);

    const year = eighteenYearsAgo.getFullYear();
    let month: string | number = eighteenYearsAgo.getMonth() + 1;
    let day: string | number = eighteenYearsAgo.getDate();

    // Add leading zero for single-digit months and days
    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      // day = `0${day}`;
    }

    return `${year}-${month}-${day}`;
  };

  // eslint-disable-next-line
  const [states, setStates] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [countryOptions, setCountryOptions] = useState<any[]>([]);
  const [stateOptions, setStateOptions] = useState<any[]>([]);
  const [cityOptions, setCityOptions] = useState<any[]>([]);
  // eslint-disable-next-line
  const [errors, setErrors] = React.useState<Partial<FormData>>({});


  useEffect(() => {
    const fetchCountries = async () => {
      const countries: any = await Country.getAllCountries();
      const formattedCountries = countries.map((country: any) => ({
        value: country.isoCode,
        label: country.name,
      }));
      setCountryOptions(formattedCountries);
    };
    fetchCountries();
  }, []);


  const handleCountryChange = async (selectedOption: any) => {
    setSelectedCountry(selectedOption);
    const states: any = await State.getStatesOfCountry(selectedOption.value);
    const formattedStates = states.map((state: any) => ({
      value: state.isoCode,
      label: state.name,
    }));
    setStateOptions(formattedStates);
    setSelectedState(null);
    setCityOptions([]);
    setSelectedCity(null);

    setFormData((prevFormData) => ({
      ...prevFormData,
      country: selectedOption.label,
      state: "",
      city: "",
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      country: "",
      state: "",
      city: "",
    }));
  };

  const handleStateChange = async (selectedOption: any) => {
    setSelectedState(selectedOption);
    console.log("Selected State:", selectedOption);
    console.log("Selected Country:", selectedCountry);

    if (selectedCountry && selectedOption) {
      const cities: any = await City.getCitiesOfState(
        selectedCountry.value,
        selectedOption.value
      );
      console.log("Cities:", cities);
      const formattedCities = cities.map((city: any) => ({
        value: city.name,
        label: city.name,
      }));
      setCityOptions(formattedCities);
      setSelectedCity(null);
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      state: selectedOption.label,

      city: "",
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      country: "",
      state: "",
      city: "",
    }));
  };

  const handleCityChange = (selectedOption: any) => {
    setSelectedCity(selectedOption);

    setFormData((prevFormData) => ({
      ...prevFormData,
      city: selectedOption.label,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      country: "",
      state: "",
      city: "",
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }

    if (name === 'first_name' || name === 'last_name') {

      const isValidName = /^[a-zA-Z\s]*$/.test(value);
      if (!isValidName) {
        alert(`Invalid ${name}. Only letters and spaces are allowed.`);
        return;
      }

      if (name === 'last_name' && value.toLowerCase() === formData.first_name.toLowerCase()) {
        alert("First name and last name cannot be the same.");
        return;
      }
    }

    if (name === 'phone_number') {
      const isValidPhone = /^\d{10}$/.test(value);
      if (!isValidPhone) {
        setPhoneNumberError('Phone number must be a valid 10-digit number.');
      } else {
        setPhoneNumberError('');
      }
    }

    if (name === 'date_of_birth') {
      const enteredDate = new Date(value);
      const today = new Date();
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(today.getFullYear() - 18);

      if (enteredDate > eighteenYearsAgo) {
        alert('You must be 18 years or older to register.');
        return;
      }
      setFormData((prevData) => ({
        ...prevData,
        date_of_birth: value,
      }));
    }

    if (name === 'pincode') {
      let isValidPincode: boolean;

      switch (formData.country) {
        case 'India':
          isValidPincode = /^\d{0,6}$/.test(value);
          break;
        case 'USA':
          isValidPincode = /^\d{0,5}$/.test(value);
          break;
        case 'Australia':
          isValidPincode = /^\d{0,4}$/.test(value);
          break;
        default:
          isValidPincode = /^\d{0,6}$/.test(value);
      }

      if (!isValidPincode) {
        setFormData((prevData) => ({
          ...prevData,
          pincode: value.replace(/[^0-9]/g, '').slice(0, 6),
        }));
        alert(`Pincode should be a valid for ${formData.country}.`);
        return;
      }
    }
    if (name === 'country') {
      setFormData((prevData) => ({
        ...prevData,
        country: value,
        state: '',
      }));
    }

    if (type === 'checkbox' && name === 'isAdmin') {
      setIsAdmin((e.target as HTMLInputElement).checked);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBlur = (name: string) => {
    if (name === 'password') {
      const isPasswordValid =
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(formData.password);

      if (!isPasswordValid) {
        const passwordErrorMessage =
          'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character.';
        alert(passwordErrorMessage);
      }
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      const formatsAllowed = ['image/png', 'image/jpg', 'image/jpeg'];
      if (formatsAllowed.includes(file.type)) {
        setFormData((prevData) => ({
          ...prevData,
          photo: file,
        }));
      } else {
        alert('Please upload a valid PNG, JPG, or JPEG file.');
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isPasswordValid =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(formData.password);

    if (!isPasswordValid) {
      const passwordErrorMessage =
        'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character.';
      alert(passwordErrorMessage);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      alert('Please agree to the terms and conditions.');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone_number', formData.phone_number);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('department', formData.department);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('date_of_birth', formData.date_of_birth);
      formDataToSend.append('password', formData.password);
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo, formData.photo.name);
        formDataToSend.append('isAdmin', String(isAdmin));
      }
      formDataToSend.append('country', formData.country);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('pincode', formData.pincode);

      const response = await fetch('http://127.0.0.1:8000/form_with_photo/', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        window.alert('Registration successful!');
        console.log('Registration successful');
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone_number: '',
          department: '',
          gender: '',
          date_of_birth: '',
          address: '',
          country: 'Select Country',
          state: '',
          city: '',
          pincode: '',
          password: '',
          confirmPassword: '',
          photo: null,
          isAdmin: false,
        });
      } else {
        const errorResponse = await response.json();

        if (errorResponse && errorResponse.detail === 'Email already exists') {
          window.alert('Email already exists. Please use a different email.');
        } else {
          console.error('Registration failed:', errorResponse);
        }
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div style={{ width: '1000px', margin: '20px auto' }}>
      <div className="registration-page">
        <Paper elevation={10} style={{ padding: '20px', maxWidth: '1000px', marginLeft: '350px', marginTop: '90px', border: '2px solid #0f4c82', borderRadius: '30px' }}>
          <div className="card-body">
            <Typography variant="h4" gutterBottom style={{ textAlign: "center", color: "#1976d2", fontWeight: 'bold', fontSize: '1.6rem' }}>
              Employee Registration
            </Typography>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3 form-floating">
                    <input
                      placeholder="First Name"
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                    <label htmlFor="first_name">First Name*</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3 form-floating">
                    <input
                      placeholder="Last Name"
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                    <label htmlFor="last_name">Last Name*</label>
                  </div>
                </div>
              </div>

              <div className="mb-3 form-floating">
                <input
                  placeholder="Email"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
                <label htmlFor="email">Email*</label>
              </div>
              <div className="mb-3 form-floating">
                <input
                  placeholder="Phone Number"
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
                <label htmlFor="phone_number">Phone Number*</label>
                {phoneNumberError && <div className="error-message">{phoneNumberError}</div>}
              </div>
              <div className="mb-3 form-floating">
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="" disabled>Select Department*</option>
                  <option value="React JS and Nest JS Developer">React JS and Nest JS Developer</option>
                  <option value="Dot Net and Angular Developer">Dot Net and Angular Developer</option>
                  <option value="Python Developer">Python Developer</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="BDE">BDE</option>
                  <option value="QA">QA</option>
                  <option value="Accounts">Accounts</option>
                  <option value="Finance">Finance</option>
                </select>
                <label htmlFor="department">Department</label>
              </div>
              <div className="mb-3">
                <label htmlFor="gender" className="form-label">Gender*</label>
                <div className="row">
                  <div className="col-auto">
                    <div className="form-check">
                      <input
                        type="radio"
                        id="male"
                        name="gender"
                        value="male"
                        onChange={handleChange}
                        required
                        className="form-check-input"
                      />
                      <label htmlFor="male" className="form-check-label">Male</label>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="form-check">
                      <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="female"
                        onChange={handleChange}
                        required
                        className="form-check-input"
                      />
                      <label htmlFor="female" className="form-check-label">Female</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-3 form-floating">
                <input
                  placeholder="Date of Birth"
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                  className="form-control"
                  max={maxDate}
                />
                <label htmlFor="date_of_birth">Date of Birth*</label>
              </div>
              <div className="mb-3 form-floating position-relative">
                <input
                  placeholder='Create Password'
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  required
                  className="form-control"
                />
                <label htmlFor="password">Create Password*</label>
                <div
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('password')}
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEye : faEyeSlash}
                    className="position-absolute end-0 top-50 translate-middle-y me-2"
                  />
                </div>
              </div>
              <div className="mb-3 form-floating position-relative">
                <input
                  placeholder="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur('confirmPassword')}
                  required
                  className="form-control"
                />
                <label htmlFor="confirmPassword">Confirm Password*</label>
                <div
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                >
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEye : faEyeSlash}
                    className="position-absolute end-0 top-50 translate-middle-y me-2"
                  />
                </div>
                {passwordError && <div className="error-message">{passwordError}</div>}
              </div>
              <div className="mb-3 form-floating" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                <textarea
                  placeholder="Address"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
                <label htmlFor="address">Address*</label>
              </div>

              <div className="row g-2">
                {/* Country */}
                <div className="col-md-6">
                  <div style={{ height: '40px' }}>
                    <Select
                      options={countryOptions}
                      value={selectedCountry}
                      onChange={handleCountryChange}
                      placeholder="Select Country"
                      // styles={{
                      //   control: (provided) => ({
                      //     ...provided,
                      //     height: '100%',
                      //     // backgroundColor: 'transparent',
                      //   }),
                      // }}
                      menuPortalTarget={null}
                    />

                  </div>
                </div>
                {/* State */}
                <div className="col-md-6">
                  <div style={{ height: '40px' }}>
                    <Select
                      options={stateOptions}
                      value={selectedState}
                      onChange={handleStateChange}
                      placeholder="Select State"
                      // styles={{
                      //   control: (provided) => ({
                      //     ...provided,
                      //     height: '100%',
                      //     backgroundColor: 'transparent',
                      //   }),
                      // }}
                      menuPortalTarget={null}
                    />

                  </div>
                </div>
                {/* City */}
                <div className="col-md-6">
                  <div style={{ height: '40px' }}>
                    <Select
                      options={cityOptions}
                      value={selectedCity}
                      onChange={handleCityChange}
                      placeholder="Select City"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          height: '100%',
                          backgroundColor: 'transparent',
                        }),
                      }}
                      menuPortalTarget={null}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  {/* <div className="mb-2 form-floating" style={{ maxHeight: '100px' }}> */}
                    <input
                      placeholder="Pincode"
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                    {/* <label htmlFor="pincode">Pincode*</label> */}
                  {/* </div> */}
                </div>
              </div>

             

              <div className="mb-3">
              <label htmlFor="photo" style={{ fontWeight: 'bold', color: 'black', fontSize: '1rem', marginLeft:'2px' }}>Upload Photo*</label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  onChange={handleFileChange}
                  accept="image/png, image/jpg, image/jpeg"
                  className="form-control"
                />
              </div>

              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  id="agree_terms"
                  name="agree_terms"
                  checked={agreeTerms}
                  onChange={() => setAgreeTerms(!agreeTerms)}
                  className="form-check-input"
                />
                <label htmlFor="agree_terms" className="form-check-label">
                  I agree to the terms and conditions*
                </label>
              </div>
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  id="isAdmin"
                  name="isAdmin"
                  checked={isAdmin}
                  onChange={handleChange}
                  className="form-check-input"
                />
                <label htmlFor="isAdmin" className="form-check-label">
                  Register as Admin
                </label>
              </div>
  
              <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
          <Button variant="contained" color="primary" >
            Register
          </Button>
          <Button variant="outlined" color="primary" onClick={handleReset} style={{ marginLeft: '1rem' }}>
            Reset
          </Button>
        </div>
            </form>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default RegistrationForm;

