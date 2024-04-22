import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Paper,
  Grid,
  TextField,
} from "@mui/material";
import { Alert } from "@mui/lab";
import { SelectChangeEvent } from "@mui/material";

import DragAndDropArea from "./DragDrop";

interface PersonData {
  Employee_id: number;
  first_name: string;
  last_name: string;
}

const PhotoUploadForm: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [personData, setPersonData] = useState<PersonData[]>([]);
  const [selectedFirstName, setSelectedFirstName] = useState<string>("");
  const [selectedLastName, setSelectedLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/upload_new/");
        const data = await response.json();
        setPersonData(data);
      } catch (error) {
        console.error("Error fetching person data:", error);
      }
    };

    fetchData();
  }, []);

  const handleIdChange = (e: SelectChangeEvent<string>) => {
    const selectedId = parseInt(e.target.value, 10);
    const selectedPerson = personData.find(
      (person) => person.Employee_id === selectedId
    );

    if (selectedPerson) {
      setSelectedId(selectedPerson.Employee_id);
      setSelectedFirstName(selectedPerson.first_name);
      setSelectedLastName(selectedPerson.last_name);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const fileInput = e.target;
    if (fileInput.files && fileInput.files[0]) {
      const fileName = fileInput.files[0].name;
      const fileFormat = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
      const allowedFormats = [".png", ".jpg", ".jpeg"];

      if (!allowedFormats.includes(fileFormat)) {
        setShowAlert(true);
        setAlertMessage("Please select a file with PNG, JPG, or JPEG format.");
        fileInput.value = "";
      } else {
        setShowAlert(false);
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === "string") {
            const newPreviews = [...photoPreviews];
            newPreviews[index] = event.target.result;
            setPhotoPreviews(newPreviews);
          }
        };
        reader.readAsDataURL(fileInput.files[0]);
        const newPhotos = [...photos];
        newPhotos[index] = fileInput.files[0];
        setPhotos(newPhotos);
      }
    }
  };

  const handleFileDrop = (file: File) => {
    const fileType = file.type;
    if (fileType === "image/png" || fileType === "image/jpeg" || fileType === "image/jpg") {
      const newPhotos = [...photos];
      const newPhotoPreviews = [...photoPreviews];
      const emptySlotIndex = newPhotos.findIndex((photo) => !photo);
  
      if (emptySlotIndex !== -1) {
        // If there's an empty slot, directly insert the file
        newPhotos[emptySlotIndex] = file;
        setPhotos(newPhotos);
  
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === "string") {
            newPhotoPreviews[emptySlotIndex] = event.target.result;
            setPhotoPreviews(newPhotoPreviews);
          }
        };
        reader.readAsDataURL(file);
      } else {
        // If no empty slot is found, increase the size of the photos array and append the file
        const newIndex = newPhotos.length;
        newPhotos.push(file);
        setPhotos(newPhotos);
  
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === "string") {
            newPhotoPreviews[newIndex] = event.target.result;
            setPhotoPreviews(newPhotoPreviews);
          }
        };
        reader.readAsDataURL(file);
      }
    } else {
      console.log("Unsupported file format. Only PNG, JPG, and JPEG are allowed.");
    }
  };
  
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("id", selectedId?.toString() || "");
    formData.append("first_name", selectedFirstName);
    formData.append("last_name", selectedLastName);

    photos.forEach((photo, index) => {
      formData.append(`photo${index + 1}`, photo);
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/upload_photos/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setAlertMessage("Photos uploaded successfully!");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      } else {
        console.error("Error uploading photos:", response.statusText)
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
    }
  };

  const handleCancel = () => {
    setEmail("");
    setPhotos([]);
    setPhotoPreviews([]);
    setShowAlert(false);
    setAlertMessage("");
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input: any) => {
      input.value = null;
    });
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: "100vh" }}>
      <Grid item xs={12} sm={10} md={6}>
        <Paper elevation={10} style={{ padding: "15px", maxWidth: "60rem", marginLeft:'260px', marginTop:'70px', border:"2px solid #0f4c82", borderRadius:'30px' }}>
        <Typography variant="h4" gutterBottom style={{ textAlign: "center", color: "#1976d2", fontWeight:'bold', fontSize: '1.6rem' }}>
            Upload Photos
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="formIdLabel">Select ID</InputLabel>
              <Select
                label="formIdLabel"
                id="formId"
                value={selectedId !== null ? selectedId.toString() : ""}
                onChange={handleIdChange}
              >
                <MenuItem value="" disabled>
                  Click to select ID...
                </MenuItem>
                {personData.map((person) => (
                  <MenuItem key={person.Employee_id} value={person.Employee_id.toString()}>
                    {person.Employee_id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="First Name"
              value={selectedFirstName}
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              fullWidth
              label="Last Name"
              value={selectedLastName}
              InputProps={{
                readOnly: true,
              }}
              style={{ marginTop: 10 }} 
            />

            {[1, 2, 3, 4, 5].map((index) => (
              <FormControl fullWidth key={index} style={{ marginTop: 10 }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {photoPreviews[index] && (
                    <img
                      src={photoPreviews[index]}
                      alt={`Preview ${index + 1}`}
                      style={{ width: 50, height: 50, borderRadius: "50%", marginRight: 10 }}
                    />
                  )}
                  <input
                    id={`formPhoto${index}`}
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    onChange={(e) => handlePhotoChange(e, index)}
                    required
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      padding: "10px",
                      backgroundColor: "white",
                      cursor: "pointer",
                      flex: 1, 
                    }}
                  />
                </div>
              </FormControl>
            ))}

            {showAlert && <Alert severity="success">{alertMessage}</Alert>}

            <div style={{ display: "flex", justifyContent: "center", marginTop : 20 }}>
              <Button type="submit" variant="contained" color="primary">
                Upload
                </Button>
              <Button
                type="button"
                variant="outlined"
                color="primary"
                onClick={handleCancel}
                style={{ marginLeft: 10 }}
              >
                Clear
              </Button>
            </div>
          </form>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={10} md={6}>
      <DragAndDropArea onFileDrop={handleFileDrop} />
      </Grid>
    </Grid>
  );
};

export default PhotoUploadForm;

