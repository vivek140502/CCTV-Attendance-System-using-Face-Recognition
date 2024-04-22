import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button, List, ListItem, Paper, Typography, Alert } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { styled } from '@mui/system';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const StyledPaper = styled(Paper)({
  position: 'absolute',
  zIndex: 1,
  width: '20%',
  boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.5)',
  borderRadius: '4px',
  overflow: 'hidden',
});

const StyledList = styled(List)({
  padding: '0',
});

const StyledListItem = styled(ListItem)({
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
  cursor: 'pointer',
});

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  attendance: {
    clockIn: string[];
    clockOut: string[];
  };
}

const debounce = (func: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const AttendancePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [employeeData, setEmployeeData] = useState<Employee[]>([]);
  const [loggedInUserEmail, setLoggedInUserEmail] = useState<string | null>(null);
  const [loggedInUserName, setLoggedInUserName] = useState<string | null>(null);
  const [allUserNames, setAllUserNames] = useState<string[]>([]);
  const [suggestNames, setSuggestNames] = useState<string[]>([]);
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [barChartImage, setBarChartImage] = useState<string>('');
  const [showStatistics, setShowStatistics] = useState<boolean>(false);


  //   const fetchBarChartData = async (username: string) => {
  //     try {
  //       const response = await fetch(`http://127.0.0.1:8000/Counts_of_clock_in/?fullname=${username}`);
  //       if (response.ok) {
  //         const imageData = await response.text();
  //         setBarChartImage(`data:image/png;base64,${imageData}`);
  //       } else {
  //         console.error('Error fetching bar chart data:', response.statusText);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching bar chart data:', error);
  //     }
  // };
  const fetchBarChartData = async (username: string): Promise<void> => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/counts_clock_in/?fullname=${username}`);
      if (response.ok) {
        const imageData = await response.json();
        setBarChartImage(`data:image/png;base64,${imageData.image}`);
      } else {
        console.error('Error fetching bar chart data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  useEffect(() => {
    if (submitClicked) {
      fetchBarChartData(searchTerm);
    }
  }, [submitClicked, searchTerm]);

  useEffect(() => {
    const userEmail = sessionStorage.getItem('loginEmail');
    const userName = sessionStorage.getItem('loginUserName');
    setLoggedInUserEmail(userEmail);
    setLoggedInUserName(userName);
    setSearchTerm(userName || '');

    const fetchLoggedInUserAttendance = async () => {
      try {
        if (!loggedInUserEmail) return;
        const response = await fetch(`http://127.0.0.1:8000/attendance_using_email/?email=${loggedInUserEmail}&date=${selectedDate}`);
        if (response.ok) {
          const data = await response.json();
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
    fetchLoggedInUserAttendance();

    const fetchAllUserNames = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/advance_name_search/');
        if (response.ok) {
          const data: string[] = await response.json();
          setAllUserNames(data);
        } else {
          console.error('Error fetching all user names:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching all user names:', error);
      }
    };
    fetchAllUserNames();
  }, [selectedDate, loggedInUserEmail]);

  // eslint-disable-next-line
  const handleSearch = useCallback(
    debounce(async () => {
      try {
        const termToSearch = searchTerm || loggedInUserName || '';
        const encodedSearchTerm = encodeURIComponent(termToSearch);
        const response = await fetch(
          `http://127.0.0.1:8000/attendance/?name=${encodedSearchTerm}&date=${selectedDate}`
        );
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setEmployeeData(data);
          } else if (typeof data === 'object') {
            setEmployeeData([data]);
          } else {
            console.error('Error fetching employee data: Invalid data format');
          }
        } else {
          console.error('Error fetching employee data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    }, 500),
    [searchTerm, loggedInUserName, selectedDate]
  );

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

  const handleSearchButtonClick = () => {
    handleSearch();
    setSubmitClicked(true);
    setShowStatistics(true); // Show statistics card when submit button is clicked
  };

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    const filteredNames = allUserNames.filter(name =>
      name.toLowerCase().startsWith(value.toLowerCase())
    );
    setSuggestNames(filteredNames);
  };

  const handleSuggestionClick = (name: string) => {
    setSearchTerm(name);
    setSuggestNames([]);
    setSubmitClicked(false); // Reset submitClicked to false so that useEffect in fetchBarChartData will trigger again
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
      <Paper elevation={15} style={{ padding: 20, maxWidth: '1000px', marginTop: '100px', marginLeft: '270px', border: "5px solid #0f4c82" }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
          <TextField
            label="Select Date"
            type="date"
            variant="outlined"
            value={selectedDate}
            onChange={handleDateChange}
            onBlur={() => setShowErrorAlert(false)}
            inputProps={{
              max: new Date().toISOString().split('T')[0],
            }}
            style={{ marginRight: 10 }}
          />
          <TextField
            label="Search by Name"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => handleSearchTermChange(e.target.value)}
            fullWidth
            style={{ flex: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: 10, height: '56px' }}
            onClick={handleSearchButtonClick}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ height: '56px', marginLeft: 10, textTransform: 'none' }}
            onClick={handleDownloadPDF}
          >
            <CloudDownloadIcon style={{ marginRight: 5 }} />
            Download PDF
          </Button>
        </div>
        {showErrorAlert && (
          <Alert severity="error" style={{ marginBottom: 10 }}>
            Please Select a Date On or Before the Current Date.
          </Alert>
        )}
      </Paper>

      <Paper elevation={5} style={{ padding: 15, maxWidth: '1000px', marginTop: '50px', marginLeft: '270px', backgroundColor: 'white', border: "5px solid #0f4c82" }}>
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
              {Array.isArray(employeeData) && employeeData.map((employee, index) => (
                <TableRow key={index} style={{ cursor: 'pointer' }} hover>
                  <TableCell align="center" style={{ border: '3px solid black', padding: '18px', verticalAlign: 'top', fontWeight: 'bold', fontSize: '15px' }}>{`${employee.first_name} ${employee.last_name}`}</TableCell>
                  <TableCell align="center" style={{ border: '3px solid black', padding: '18px', verticalAlign: 'top' }}>
                    {employee.attendance.clockIn.map((time, i) => (
                      <Typography key={i} style={{ display: 'block', borderBottom: '1px solid black', padding: '4px 0', fontWeight: 'bold' }}>{time}</Typography>
                    ))}
                  </TableCell>
                  <TableCell align="center" style={{ border: '3px solid black', padding: '18px', verticalAlign: 'top' }}>
                    {employee.attendance.clockOut.map((time, i) => (
                      <Typography key={i} style={{ display: 'block', borderBottom: '1px solid black', padding: '4px 0', fontWeight: 'bold' }}>{time}</Typography>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {showStatistics && (
        <Paper elevation={5} style={{ padding: 20, maxWidth: '600px', marginTop: '95px', marginLeft: '1000px', marginRight: 'auto', border: "5px solid #0f4c82", position: 'absolute', top: '5px', borderRadius: '40px' }}>
          <Typography variant="h6" style={{ marginBottom: 20, textAlign: 'center', fontFamily: 'monospace', fontSize: '2rem', color: '#1976D2', fontWeight: 'bold' }}>
            <span style={{ borderBottom: '2px solid #ccc' }}>STATISTICS</span>
          </Typography>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <PieChart width={450} height={320}>
              <Pie
                data={preparePieChartData()}
                cx={220}
                cy={130}
                labelLine={false}
                outerRadius={135}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={500}
              >
                {preparePieChartData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#7FD349', '#6855A4'][index % 2]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </Paper>
      )}

      {searchTerm && submitClicked && (
        <div style={{ position: 'absolute', top: '550px', left: '330px' }}>
          {barChartImage && (
            <img src={barChartImage} alt="Bar Chart" style={{ width: '1000px', height: '550px' }} />
          )}
        </div>
      )}

      {searchTerm && suggestNames.length > 0 && (
        <StyledPaper style={{ top: '180px', left: '290px' }}>
          <StyledList>
            {suggestNames.map((name, index) => (
              <StyledListItem key={index} onClick={() => handleSuggestionClick(name)}>
                <Typography>{name}</Typography>
              </StyledListItem>
            ))}
          </StyledList>
        </StyledPaper>
      )}
    </div>

  );
};

export default AttendancePage;
