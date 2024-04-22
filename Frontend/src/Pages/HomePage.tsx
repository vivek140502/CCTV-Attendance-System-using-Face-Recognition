import React, { useState, useEffect } from "react";
import { Container, Grid, Card, CardContent, Typography, Box, Dialog, DialogTitle, List, ListItem, ListItemText } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const GreetingsCard: React.FC<{ userName: string }> = ({ userName }) => {
  const [greetingMessage, setGreetingMessage] = useState<string>('');
  const [icon, setIcon] = useState<string>("");

  useEffect(() => {
    const currentTime = new Date().getHours();
    let greeting = "";
    let iconImage = "";
    if (currentTime >= 5 && currentTime < 12) {
      greeting = "GOOD MORNING!";
      iconImage = "https://i.pinimg.com/originals/c5/c0/b4/c5c0b4feed08d1a0504635d6eed1bd16.gif";
    } else if (currentTime >= 12 && currentTime < 16) {
      greeting = "GOOD AFTERNOON!";
      iconImage = "https://i.pinimg.com/564x/f9/99/b1/f999b1d001425ae297671c1c67ef15d2.jpg";
    } else {
      greeting = "GOOD EVENING!";
      iconImage = "https://i.pinimg.com/originals/2d/44/e9/2d44e965dff94b7aa7a51fb42f25faf8.gif";
    }
    setGreetingMessage(greeting);
    setIcon(iconImage);
  }, []);

  const messageStyles: React.CSSProperties = {
    position: 'absolute',
    top: '-15px',
    left: '-10px',
    color: 'white',
    backgroundColor: '#0f4c82',
    padding: '10px',
    borderRadius: '8px',
    zIndex: 1,
  };

  const imageStyles: React.CSSProperties = {
    width: "410px",
    height: "334px",
    top: '-10px',
    position: 'absolute',
    left: '-7px',
    borderRadius: '8px',
    border: '2px solid white',
  };

  return (
    <div style={{ position: 'relative' }}>
      <CardContent style={messageStyles} >
        <Typography variant="h4" fontFamily={"inherit"} fontSize={"1.5rem"}>{greetingMessage} </Typography>
        <Typography variant="h6" fontFamily={"inherit"} fontWeight={"bold"} fontSize={"1rem"}> {userName}</Typography>
      </CardContent>
      <img src={icon} alt="Greeting Icon" style={{ ...imageStyles, marginTop: "70px" }} />
    </div>
  );
};

const HomePage: React.FC = () => {
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [insideOffice, setInsideOffice] = useState<number>(0);
  const [outsideOffice, setOutsideOffice] = useState<number>(0);
  const [onLeave, setOnLeave] = useState<number>(0);
  const [userName, setUserName] = useState("");
  // eslint-disable-next-line
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [departmentData, setDepartmentData] = useState<{ name: string; count: number }[] | null>(null);

  // eslint-disable-next-line
  const [maleEmployees, setMaleEmployees] = useState<number>(0);
  // eslint-disable-next-line
  const [femaleEmployees, setFemaleEmployees] = useState<number>(0);
  const [outsideOfficeEmployees, setOutsideOfficeEmployees] = useState<string[]>([]);
  const [onLeaveEmployees, setOnLeaveEmployees] = useState<string[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  // eslint-disable-next-line
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [snackbarMessage, setSnackbarMessage] = useState(""); const [outsideOfficeDialogOpen, setOutsideOfficeDialogOpen] = useState<boolean>(false);
  const [onLeaveDialogOpen, setOnLeaveDialogOpen] = useState<boolean>(false);
  // eslint-disable-next-line
  const [tooltipData, setTooltipData] = useState<any>(null);

  // const renderTooltip = (props: any) => {
  //   const { active, payload } = props;

  //   if (active && payload && payload.length) {
  //     const { name, value } = payload[0].payload;
  //     setTooltipData({ name, value });
  //   } else {
  //     setTooltipData(null);
  //   }

  //   return null;
  // };

  useEffect(() => {
    const fetchClockedInData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/female_male_ratio/`); // M/F API
        const data = await response.json();

        const maleCount = data.maleClockedInCount;
        const femaleCount = data.femaleClockedInCount;

        setMaleEmployees(maleCount);
        setFemaleEmployees(femaleCount);
      } catch (error) {
        console.error("Error fetching clocked in data:", error);
      }
    };

    fetchClockedInData();
  }, []);

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/department_clock_in_counts/");
        if (!response.ok) {
          throw new Error("Failed to fetch department data");
        }
        const data = await response.json();
        const departments = data.department.name;
        const counts = data.department.count;
        const formattedData = departments.map((name: string, index: number) => ({
          name: name,
          count: counts[index]
        }));
        setDepartmentData(formattedData);
        console.log(departmentData);

      } catch (error) {
        console.error("Error fetching department data:", error);
        setSnackbarMessage("Failed to fetch department data");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchDepartmentData();
    // eslint-disable-next-line
  }, []);

  const handleOutsideOfficeClick = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/names_outside_office/`);
      const data = await response.json();
      if (data.names.length === 0) {
        setSnackbarMessage("No employees are currently outside the office.");
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
      } else {
        setOutsideOfficeEmployees(data.names);
        setOutsideOfficeDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching outside office employees:", error);
    }
  };

  const handleOnLeaveClick = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/names_on_leaves/`);
      const data = await response.json();
      if (data.names.length === 0) {
        setSnackbarMessage("No employees are currently on leave.");
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
      } else {
        setOnLeaveEmployees(data.names);
        setOnLeaveDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching on leave employees:", error);
    }
  };

  const handleCloseOutsideOfficeDialog = () => {
    setOutsideOfficeDialogOpen(false);
  };

  const handleCloseOnLeaveDialog = () => {
    setOnLeaveDialogOpen(false);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/counts`);
        const data = await response.json();

        setTotalEmployees(data.total_employees);
        setInsideOffice(data.inside_office);
        setOutsideOffice(data.outside_office);
        setOnLeave(data.live_counts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const storedUserEmail = sessionStorage.getItem("loginEmail");
    setUserEmail(storedUserEmail);
    const fetchUserName = async () => {
      try {
        if (storedUserEmail) {
          const response = await fetch(`http://127.0.0.1:8000/username/?email=${storedUserEmail}`); //username
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


  const hoverStyles: React.CSSProperties = {
    transform: 'scale(1.05)',
    transition: 'transform 0.3s ease-in-out',
  };

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const iconUrls = [
    "https://i.pinimg.com/564x/ff/e9/c2/ffe9c24f4d9c1fff3f68c9f33c59db35.jpg",
    "https://i.pinimg.com/564x/48/ac/be/48acbee2831f9186335645d6f3bc88ec.jpg",
    "https://i.pinimg.com/564x/cd/26/fb/cd26fb049532d4eb7f8eb00eeea6c507.jpg",
    "https://i.pinimg.com/564x/1a/d7/dd/1ad7dd8827b44172653766b7421b25fa.jpg"
  ];

  const departmentColors = ['#FFC700', '#02CCFE', '#FF3EA5', '#332FD0', '#54E346', '#F58634', '#7E30E1', '#8C6A5D '];

  return (
    <Container>
      <Grid container spacing={3} style={{ marginTop: '60px', marginLeft: '245px' }}>
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: "#0f4c82", minHeight: "180px", borderRadius: "8px", marginLeft: '10px' }}>
            <CardContent>
              <Grid container spacing={3}>

                <Grid item xs={3}>
                  <Card
                    sx={{ backgroundColor: "white", minHeight: "150px", borderRadius: "8px", position: "relative" }}
                    style={hoverIndex === 0 ? hoverStyles : undefined}
                    onMouseEnter={() => setHoverIndex(0)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <CardContent>
                      <Typography variant="h6" color="textPrimary" fontSize={"1.5rem"}>Total Employees</Typography>
                      <Typography variant="h4">{totalEmployees}</Typography>
                    </CardContent>

                    <Box position="absolute" bottom={8} right={8}>
                      <img src={iconUrls[0]} alt="Icon" style={{ width: 130, height: 90 }} />
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={3}>
                  <Card
                    sx={{ backgroundColor: "white", minHeight: "150px", borderRadius: "8px", position: 'relative' }}
                    style={hoverIndex === 1 ? hoverStyles : undefined}
                    onMouseEnter={() => setHoverIndex(1)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <CardContent>
                      <Typography variant="h6" color="textPrimary" fontSize={"1.5rem"}>Inside Office</Typography>
                      <Typography variant="h4">{insideOffice}</Typography>
                    </CardContent>

                    <Box position="absolute" bottom={8} right={8}>
                      <img src={iconUrls[1]} alt="Icon" style={{ width: 90, height: 70, }} />
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={3}>
                  <Card
                    sx={{
                      backgroundColor: "white",
                      minHeight: "150px",
                      borderRadius: "8px",
                      position: "relative",
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      }
                    }}
                    onClick={handleOutsideOfficeClick}
                  >
                    <CardContent>
                      <Typography variant="h6" color="textPrimary" fontSize={"1.5rem"}>Outside Office</Typography>
                      <Typography variant="h4">{outsideOffice}</Typography>
                    </CardContent>

                    <Box position="absolute" bottom={8} right={8}>
                      <img src={iconUrls[2]} alt="Icon" style={{ width: 130, height: 90 }} />
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={3}>
                  <Card
                    sx={{
                      backgroundColor: "white",
                      minHeight: "150px",
                      borderRadius: "8px",
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      }
                    }}
                    onClick={handleOnLeaveClick}
                  >
                    <CardContent>
                      <Typography variant="h6" color="textPrimary" fontSize={"1.5rem"}>On Leave</Typography>
                      <Typography variant="h4">{onLeave}</Typography>
                    </CardContent>

                    <Box position="absolute" bottom={8} right={8}>
                      <img src={iconUrls[3]} alt="Icon" style={{ width: 110, height: 90 }} />
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Dialog
          open={outsideOfficeDialogOpen}
          onClose={handleCloseOutsideOfficeDialog}
          PaperProps={{
            sx: {
              borderRadius: '0px',
              width: '300px',
              height: '400px',
              marginLeft: '500px',
              marginTop: '250px',
              textAlign: 'center'
            }
          }}
        >
          <DialogTitle sx={{ backgroundColor: '#1e81b0', color: 'white', borderBottom: '2px solid #ddd' }}>Outside Office</DialogTitle>
          <List sx={{ padding: '20px' }}>
            {outsideOfficeEmployees.map((employee, index) => (
              <ListItem key={index} sx={{ borderBottom: '1px solid #ddd' }}>
                <ListItemText primary={employee} />
              </ListItem>
            ))}
          </List>
        </Dialog>

        <Dialog
          open={onLeaveDialogOpen}
          onClose={handleCloseOnLeaveDialog}
          PaperProps={{
            sx: {
              borderRadius: '0px',
              width: '300px',
              height: '400px',
              marginLeft: '1100px',
              marginTop: '250px',
              textAlign: 'center'
            }
          }}
        >
          <DialogTitle sx={{ backgroundColor: '#1e81b0', color: 'white', borderBottom: '2px solid #ddd', alignItems: "center", fontSize: '1.4rem' }}>On Leave</DialogTitle>
          <List sx={{ padding: '20px' }}>
            {onLeaveEmployees.map((employee, index) => (
              <ListItem key={index} sx={{ borderBottom: '1px solid #ddd' }}>
                <ListItemText primary={employee} />
              </ListItem>
            ))}
          </List>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <MuiAlert elevation={10} variant="filled" onClose={() => setSnackbarOpen(false)} severity="error">
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>

        <Grid item xs={6} md={4} lg={3} style={{ height: '100%' }}>
          <Card sx={{ backgroundColor: "#0f4c82", minHeight: "425px", minWidth: "430px", borderRadius: "20px", marginLeft: "-30px" }}>
            <CardContent style={{ marginTop: '5px' }}>
              <GreetingsCard userName={userName} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} md={4} lg={3}>
          <Card sx={{ backgroundColor: "white", minHeight: "400px", minWidth: "355px", borderRadius: "30px", marginLeft: "118px", border: '5px solid #0f4c82' }}>
            <CardContent>
              <Typography variant="h5" fontSize={"1.4rem"} fontFamily={"sans-serif"} align="center">Male & Female Ratio</Typography>
              <Box borderBottom="1px solid #ccc" width="100%" my={1} />
              <PieChart width={290} height={290}>
                <Tooltip
                  cursor={{ stroke: 'black', strokeWidth: 1 }}
                  content={({ payload }) => {
                    if (payload && payload.length > 0) {
                      const departmentName = payload[0].payload.name;
                      const departmentCount = payload[0].payload.value;
                      return (
                        <div style={{ backgroundColor: '#0f4c82', padding: '5px', borderRadius: '5px', color: 'white', textAlign: 'center' }}>
                          <p style={{ marginBottom: '0px' }}>{departmentName}</p>
                          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0px' }}>{departmentCount}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Pie
                  data={[
                    { name: 'Male', value: maleEmployees },
                    { name: 'Female', value: femaleEmployees }
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="54%"
                  cy="55%"
                  outerRadius={125}
                  innerRadius={55}
                  fill="#8884d8"
                  label
                >
                  {[
                    { value: maleEmployees, fill: '#0088FE' },
                    { value: femaleEmployees, fill: '#F62FAE' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
              <Box display="flex" justifyContent="center" mt={2}>
                <Box display="flex" alignItems="center" mr={2}>
                  <Box width={12} height={12} mr={1} bgcolor="#0088FE" borderRadius={6} />
                  <Typography variant="body1" color="textSecondary">Male</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Box width={12} height={12} mr={1} bgcolor="#F62FAE" borderRadius={6} />
                  <Typography variant="body1" color="textSecondary">Female</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} md={4} lg={3} style={{ height: '100%' }}>
          <Card sx={{ backgroundColor: "white", minHeight: "425px", minWidth: "430px", borderRadius: "30px", marginLeft: "192px", border: '5px solid #0f4c82', marginBottom: '0px' }}>
            <CardContent style={{ marginTop: '0px' }}>
              <Typography variant="h5" align="center" fontFamily={"sans-serif"} fontSize={"1.4rem"}>Department Statistics</Typography>
              <Box borderBottom="1px solid #ccc" width="100%" my={1} />
              {departmentData && departmentData.length > 0 && (
                <PieChart width={400} height={310}>
                  <Tooltip
                    cursor={{ stroke: 'black', strokeWidth: 1 }}
                    content={({ payload }) => {
                      if (payload && payload.length > 0) {
                        const departmentName = payload[0].payload.name;
                        const departmentCount = payload[0].payload.count;
                        return (
                          <div style={{ backgroundColor: '#0f4c82', padding: '5px', borderRadius: '5px', color: 'white', textAlign: 'center'}}>
                            <p style={{ marginBottom: '0px' }}>{departmentName}</p>
                            <p style={{ marginBottom: '0px' }}>{departmentCount}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={departmentData}
                    dataKey="count"
                    nameKey="name"
                    cx="49%"
                    cy="53%"
                    outerRadius={135}
                    fill="#8884d8"
                    label
                  >
                    {departmentData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={departmentColors[index % departmentColors.length]}
                        onMouseEnter={(e) => {
                          if (e.target instanceof SVGPathElement) {
                            e.target.style.transition = 'transform 0.3s ease-in-out';
                            e.target.style.transform = 'translateY(-10px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (e.target instanceof SVGPathElement) {
                            e.target.style.transition = 'transform 0.3s ease-in-out';
                            e.target.style.transform = 'translateY(0px)';
                          }
                        }}
                      />
                    ))}
                  </Pie>
                </PieChart>

              )}
              {(!departmentData || departmentData.length === 0) && (
                <Typography variant="body1">No department data available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
