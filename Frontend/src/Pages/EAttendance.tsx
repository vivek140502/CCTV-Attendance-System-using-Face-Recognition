import React, { useState, useEffect } from 'react';
import { Button, Paper, Typography, Alert } from '@mui/material';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  attendance: {
    clockIn: string[];
    clockOut: string[];
  };
}

const EAttendancePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [employeeData, setEmployeeData] = useState<Employee[]>([]);
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const loggedInUserEmail = sessionStorage.getItem('loginEmail');


  const fetchAttendanceData = async (date: string) => {
    try {
      if (!loggedInUserEmail) return;

      const response = await fetch(`http://127.0.0.1:8000/attendance_using_email/?email=${loggedInUserEmail}&date=${date}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched data:', data);

        if (Array.isArray(data)) {
          const updatedData = data.map(employee => ({
            ...employee,
            attendance: {
              clockIn: employee.attendance.clockIn.length === 0 ? ['No clock-in data'] : employee.attendance.clockIn,
              clockOut: employee.attendance.clockOut.length === 0 ? ['No clock-out data'] : employee.attendance.clockOut
            }
          }));
          setEmployeeData(updatedData);
        } else if (typeof data === 'object') {
          const updatedData = [data];
          setEmployeeData(updatedData);
        } else {
          console.error('Error fetching employee data: Invalid data format');
        }
      } else {
        console.error('Error fetching employee data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  useEffect(() => {
    fetchAttendanceData(selectedDate);
    // eslint-disable-next-line
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredDate = e.target.value;
    const isValidDate = new Date(enteredDate) <= new Date();
    if (!isValidDate) {
      setShowErrorAlert(true);
      setSelectedDate(new Date().toISOString().split('T')[0]);
    } else {
      setSelectedDate(enteredDate);
      setShowErrorAlert(false);
    }
  };

  const handleSearchButtonClick = async () => {
    fetchAttendanceData(selectedDate);
    setButtonClicked(true); // Set buttonClicked state to true when the button is clicked
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('attendance-table');
    if (element) {
      html2pdf().from(element).save();
    }
  };

  const preparePieChartData = () => {
    let clockInCount = 0;
    let clockOutCount = 0;

    employeeData.forEach(employee => {
      clockInCount += employee.attendance.clockIn.length;
      clockOutCount += employee.attendance.clockOut.length;
    });

    const data = [
      { name: 'Clock In', value: clockInCount },
      { name: 'Clock Out', value: clockOutCount }
    ];

    return data;
  };

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Paper elevation={8} style={{ padding: 20, maxWidth: '1000px', marginTop: '100px', marginLeft: '300px', marginRight: 'auto', border: "5px solid #0f4c82" }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
            <Typography variant="h6" style={{ marginRight: 20 }}>Select Date</Typography>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              max={new Date().toISOString().split('T')[0]}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginRight: 20 }}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ height: '56px', textTransform: 'none' }}
              onClick={handleSearchButtonClick}
            >
              SUBMIT
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={{ height: '56px', marginLeft: 10, textTransform: 'none' }}
              onClick={handleDownloadPDF}
            >
              <CloudDownloadIcon style={{ marginRight: 5 }} />
              DOWNLOAD PDF
            </Button>
          </div>
          {showErrorAlert && (
            <Alert severity="error" style={{ marginBottom: 10 }}>
              Please select a date on or before the current date.
            </Alert>
          )}
          <TableContainer component={Paper} style={{ marginTop: 10 }} id="attendance-table">
            <Table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <TableHead>
                <TableRow style={{ backgroundColor: '#f0f0f0' }}>
                  <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '20px', border: '3px solid black', padding: '8px', fontFamily: 'monospace' }}>Name</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '20px', border: '3px solid black', padding: '8px', fontFamily: 'monospace' }}>Clock-In</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '20px', border: '3px solid black', padding: '8px', fontFamily: 'monospace' }}>Clock-Out</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employeeData.map((employee, index) => (
                  <TableRow key={index} style={{ cursor: 'pointer' }} hover>
                    <TableCell align="center" style={{ border: '3px solid black', padding: '18px', verticalAlign: 'top', fontWeight: 'bold', fontSize: '15px' }}>{`${employee.first_name} ${employee.last_name}`}</TableCell>
                    <TableCell align="center" style={{ border: '3px solid black', padding: '18px', verticalAlign: 'top' }}>
                      {employee.attendance.clockIn.map((time, i) => (
                        <Typography key={i} style={{ display: 'block', borderBottom: employee.attendance.clockIn.length > 1 ? '1px solid black' : undefined, padding: '4px 0', fontWeight: 'bold' }}>{time}</Typography>
                      ))}
                    </TableCell>
                    <TableCell align="center" style={{ border: '3px solid black', padding: '18px', verticalAlign: 'top' }}>
                      {employee.attendance.clockOut.map((time, i) => (
                        <Typography key={i} style={{ display: 'block', borderBottom: employee.attendance.clockOut.length > 1 ? '1px solid black' : undefined, padding: '4px 0', fontWeight: 'bold' }}>{time}</Typography>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {buttonClicked && (
          <Paper elevation={5} style={{ padding: 20, maxWidth: '600px', marginTop: '100px', marginLeft: '60px', marginRight: 'auto', border: "5px solid #0f4c82" }}>
            <Typography variant="h6" style={{ marginBottom: 20, textAlign: 'center', fontFamily: 'cursive', fontSize: '2rem', color: '#4CAF50', fontWeight: 'bold' }}>STATISTICS</Typography>

            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <PieChart width={400} height={400}>
                <Pie
                  data={preparePieChartData()}
                  cx={200}
                  cy={200}
                  labelLine={false}
                  outerRadius={160}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {preparePieChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#82ca9d', '#8884d8'][index % 2]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </Paper>
        )}
      </div>
    </div>
  );
};

export default EAttendancePage;
