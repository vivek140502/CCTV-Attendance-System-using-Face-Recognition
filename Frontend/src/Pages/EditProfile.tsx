import React, { useState, useEffect, ChangeEvent } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button, Typography, Paper } from '@mui/material';

interface EditProfileData {
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

const countries = [
  'Select Country',
  'India',
  'Australia',
  'USA',
];

const countryStateMap: Record<string, string[]> = {
  'India': ['Select State', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Maharashtra', 'Madhya Pradesh', 'Manipur', 'Meghalaya', ' Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Tripura', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman & Nicobar (UT)', 'Chandigarh (UT)', 'Dadra & Nagar Haveli and Daman & Diu (UT)', 'Delhi', 'Jammu & Kashmir (UT)', 'Ladakh (UT)', 'Lakshadweep (UT)',
    'Puducherry (UT)'],
  'Australia': ['Select State', 'New South Wales', 'Queensland', 'South Australia', 'Tasmania', 'Victoria', 'Western Australia', 'Australian Capital Territory', 'Northern Territory'],
  'USA': ['Select State', 'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
    'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin',
    'Wyoming'],
};

const EditProfile: React.FC = () => {
  const [formData, setFormData] = useState<EditProfileData>({
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
    country: 'Select Country',
    state: '',
    city: '',
    pincode: '',
  });

  const [phoneNumberError, setPhoneNumberError] = useState<string>('');
  const [states, setStates] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const handleReset = () => {
    setFormData({
      first_name: '',
      last_name: '',
      phone_number: '',
      address: '',
      country: 'Select Country',
      state: '',
      city: '',
      pincode: '',
    });

    setPhoneNumberError('');
  };

  useEffect(() => {
    const storedUserEmail = sessionStorage.getItem("loginEmail");
    setUserEmail(storedUserEmail);

    const fetchData = async () => {
      try {
        if (storedUserEmail) {
          const response = await fetch(`http://127.0.0.1:8000/edit_profile_get/?email=${storedUserEmail}`);

          if (response.ok) {
            const userDetails = await response.json();
            setFormData({
              first_name: userDetails.first_name,
              last_name: userDetails.last_name,
              phone_number: userDetails.phone_number,
              address: userDetails.address,
              country: userDetails.country,
              state: userDetails.state,
              city: userDetails.city,
              pincode: userDetails.pincode,
            });

            if (userDetails.country && countryStateMap[userDetails.country]) {
              setStates(countryStateMap[userDetails.country]);
            }
          } else {
            console.error('Failed to fetch user details:', response.statusText);
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (formData.country && countryStateMap[formData.country]) {
      setStates(countryStateMap[formData.country]);
    }
  }, [formData.country]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCountryChange = (e: SelectChangeEvent<string>) => {
    const countryValue = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      country: countryValue,
    }));
  };
  
  const handleStateChange = (e: SelectChangeEvent<string>) => {
    const stateValue = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      state: stateValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name);
      formDataToSend.append('phone_number', formData.phone_number);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('country', formData.country);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('pincode', formData.pincode);
      formDataToSend.append('email', userEmail || '');

      const response = await fetch('http://127.0.0.1:8000/edit_profile/', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const userDetails = await response.json();
        const userEmail = userDetails.email;

        console.log('User Email:', userEmail);

        window.alert('Profile Edited successfully');
        console.log('Profile Edited successfully');

        setFormData({
          first_name: '',
          last_name: '',
          phone_number: '',
          address: '',
          country: 'Select Country',
          state: '',
          city: '',
          pincode: '',
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

  return (
    <Paper elevation={10} style={{ padding: "25px", maxWidth: "45rem", marginLeft: '260px', marginTop: '105px', border: "2px solid #0f4c82", borderRadius:'30px' }}>
      <Typography variant="h4" gutterBottom style={{ textAlign: "center", color: "#1976d2", fontWeight: 'bold', fontSize: '1.6rem' }}>
        Edit Profile
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="email"
              name="email"
              value={userEmail || ''}
              label="Email"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="first_name"
              name="first_name"
              value={formData.first_name}
              label="First Name"
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="last_name"
              name="last_name"
              value={formData.last_name}
              label="Last Name"
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              label="Phone Number"
              onChange={handleChange}
              required
              error={!!phoneNumberError}
              helperText={phoneNumberError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="address"
              name="address"
              value={formData.address}
              label="Address"
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
  {/* <Typography variant="body1" style={{ color: '#6b6b6b', marginBottom: '1px' }}>Country</Typography> */}
  <FormControl fullWidth>
    <InputLabel id="country-label" disabled>Country</InputLabel>
    <Select
      label="country"
      name="country"
      value={formData.country}
      onChange={handleCountryChange} 
      required
      labelId="country-label"
    >
      {countries.map((country, index) => (
        <MenuItem key={index} value={country}>
          {country}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>

<Grid item xs={6}>
  {/* <Typography variant="body1" style={{ color: '#6b6b6b', marginBottom: '1px' }}>State</Typography> */}
  <FormControl fullWidth>
    <InputLabel id="state-label" disabled> State</InputLabel>
    <Select
      label="state"
      name="state"
      value={formData.state}
      onChange={handleStateChange}
      required
      labelId="state-label"
    >
      {states.map((state, index) => (
        <MenuItem key={index} value={state}>
          {state}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              id="city"
              name="city"
              value={formData.city}
              label="City"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="pincode"
              name="pincode"
              value={formData.pincode}
              label="Pincode"
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
          <Button variant="contained" color="primary" type="submit">
            Update
          </Button>
          <Button variant="outlined" color="primary" onClick={handleReset} style={{ marginLeft: '1rem' }}>
            Reset
          </Button>
        </div>
      </form>
    </Paper>
  );
};

export default EditProfile;
