import React, { useState } from "react";
import { Paper, Typography, Grid, LinearProgress } from "@mui/material";

interface DragAndDropAreaProps {
  onFileDrop: (file: File) => void;
}

const DragAndDropArea: React.FC<DragAndDropAreaProps> = ({ onFileDrop }) => {
  const [dragging, setDragging] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [droppedFileName, setDroppedFileName] = useState<string>("");

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("Drag enter");
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("Drag leave");
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("Drag over");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("Drop");
    setDragging(false);

    const file = e.dataTransfer.files[0];
    console.log("Dropped file:", file);
    if (file) {
      // Set the dropped file name
      setDroppedFileName(file.name);

      // Initialize progress slightly above 0 to start the progress immediately
      let progress = 1;
      setProgress(progress);

      // Simulate upload progress
      const interval = setInterval(() => {
        // Increment progress based on upload progress
        progress += Math.random() * 5; // Adjust increment as needed
        setProgress(Math.min(progress, 100)); // Ensure progress doesn't exceed 100%
        if (progress >= 100) {
          clearInterval(interval);
          // Upload the image once the progress reaches 100%
          onFileDrop(file);
        }
      }, 200); // Example: Update every 200 milliseconds
    }
  };

  return (
    <Grid item xs={12} sm={10} md={6}>
      <Paper
        elevation={10}
        style={{
          padding: "215px",
          paddingRight: "280px",
          height: "50%",
          maxWidth: "80px",
          marginLeft: "60px",
          marginTop: "185px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `4px dashed ${dragging ? "black" : "gray"}`,
          borderRadius: "20px",
          backgroundColor: dragging ? "#f0f0f0" : "transparent",
          backgroundImage: "url('https://i.pinimg.com/736x/50/ff/1b/50ff1b45b56f24e9dc7b5c02f0426cf2.jpg')",
          backgroundSize: '110px 110px',
          backgroundPosition: '11.5rem 7rem',
          backgroundRepeat: 'no-repeat',
          position: 'relative', // Added for positioning
        }}
        className={`drag-drop-area ${dragging ? "dragging" : ""}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {progress > 0 && (
          <div style={{ position: "absolute", bottom: "120px", width: "80%", marginLeft: '65px', height: '20px' }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              style={{ height: '8px', borderRadius: "30px", color: 'green' }}
            />
          </div>
        )}
        <Typography variant="h5" style={{ whiteSpace: 'nowrap', marginTop: "65px", marginLeft: "55px", position: "absolute", fontSize: '1.5rem', fontFamily: "initial" }}>
          Drag & Drop Your Images Here!
        </Typography>
        {droppedFileName && (
          <Typography variant="body1" style={{ position: "absolute", bottom: "90px", marginLeft: "55px", fontSize: '1rem', fontFamily: "initial" }}>
            {droppedFileName}
          </Typography>
        )}
      </Paper>
    </Grid>
  );
};

export default DragAndDropArea;
