import React, { useState, useEffect } from "react";
import { Container, Grid, Card, CardContent, Typography, CircularProgress, LinearProgress, Modal, Box } from "@mui/material";

const MAX_REGULAR_HOURS = 8.5;

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
    top: '-20px',
    left: '-10px',
    color: 'white',
    fontWeight: 'bold'
  };

  const imageStyles: React.CSSProperties = {
    width: "410px",
    height: "310px",
    top: '-16px',
    position: 'absolute',
    left: '-6px',
    borderRadius: '10px',
    border: '2px solid white'
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

const RemainingTimeCard: React.FC<{ remainingTime: string }> = ({ remainingTime }) => {
  const [hours, minutes] = remainingTime ? remainingTime.split(":").map(Number) : [0, 0];
  const totalRemainingHours = hours + minutes / 60;
  const completionPercentage = (totalRemainingHours / MAX_REGULAR_HOURS) * 100;

  const cardStyles: React.CSSProperties = {
    padding: '20px',
    borderRadius: '35px',
    textAlign: 'center',
    backgroundColor: 'white',
    border: "3.5px solid #0f4c82",
    color: '#333',
    minWidth: '300px',
    minHeight: '340px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '120px'
  };

  return (
    <Card sx={cardStyles}>
      <CardContent>
        <Typography variant="h1" fontFamily={"inherit"} fontSize={"1.6rem"} fontWeight={"bold"} color={"#0f4c82"}>
          {hours} Hours {minutes} Mins
          <Box borderBottom="1px solid #ccc" width="100%" my={1} />
        </Typography>
      </CardContent>
      <CircularProgress
        variant="determinate"
        value={completionPercentage <= 100 ? completionPercentage : 100}
        size={220}
        thickness={11}
        style={{ color: "#0088FE", marginTop: "50px" }}
      />
    </Card>
  );
};

const EmployeeHomePage: React.FC = () => {
  // const totalWorkingHoursFixed = "8:30";
  const currentDate = new Date();
  const currentDateString = currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const currentTimeString = currentDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric', hour12: true });
  const [totalClockedIn, setTotalClockedIn] = useState<number>(0);
  const [totalClockedOut, setTotalClockedOut] = useState<number>(0);

  const [remainingTime, setRemainingTime] = useState<string>("00:00");
  // eslint-disable-next-line
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [clockInTime, setClockInTime] = useState<string>("");
  const [clockOutTime, setClockOutTime] = useState<string>("");
  const [statisticsData, setStatisticsData] = useState<any>({
    today: { hours: 0, totalHours: 8.5 },
    thisWeek: { hours: 0, totalHours: 42.5 },
    thisMonth: { hours: 0, totalHours: 0 },
    overtime: 0
  });

  const fetchClockTimes = async (type: string) => {
    try {
      const userEmail = sessionStorage.getItem("loginEmail");
      if (userEmail) {
        let url = '';
        if (type === "in") {
          url = `http://127.0.0.1:8000/clockIn/?email=${userEmail}`;
        } else if (type === "out") {
          url = `http://127.0.0.1:8000/clockOut/?email=${userEmail}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        if (type === "in") {
          setClockInTime(data.clockTime);
        } else if (type === "out") {
          setClockOutTime(data.clockTime);
        }
        setIsModalOpen(true); // Open the modal
      }
    } catch (error) {
      console.error("Error fetching clock times:", error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userEmail = sessionStorage.getItem("loginEmail");
        if (userEmail) {
          const response = await fetch(`http://127.0.0.1:8000/employee/?email=${userEmail}`); //top 3 boxes API
          const data = await response.json();
          const { totalClockedIn, totalClockedOut } = data;


          setTotalClockedIn(totalClockedIn);
          setTotalClockedOut(totalClockedOut);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchRemainingTime = async () => {
      try {
        const userEmail = sessionStorage.getItem("loginEmail");
        if (userEmail) {
          const response = await fetch(`http://127.0.0.1:8000/total_working_hours_minutes/?email=${userEmail}`);  //remaining time in hrs and mins
          const data = await response.json();
          setRemainingTime(data.remainingTime);
        }
      } catch (error) {
        console.error("Error fetching remaining time:", error);
      }
    };

    fetchRemainingTime();
  }, []);

  useEffect(() => {
    const fetchStatisticsData = async () => {
      try {
        const userEmail = sessionStorage.getItem("loginEmail");
        if (userEmail) {
          const response = await fetch(`http://127.0.0.1:8000/total_working_hours/?email=${userEmail}`);
          const data = await response.json();

          // Calculate overtime
          const overtimeHours = data.today.hours > MAX_REGULAR_HOURS ? data.today.hours - MAX_REGULAR_HOURS : 0;
          const overtimeMinutes = data.today.minutes > 0 ? data.today.minutes : 0;

          // Set overtime in hours and minutes format
          const overtimeHoursFormatted = Math.floor(overtimeHours);
          const overtimeMinutesFormatted = Math.floor((overtimeHours - overtimeHoursFormatted) * 60);

          setStatisticsData({
            today: data.today,
            thisWeek: data.thisWeek,
            thisMonth: data.thisMonth,
            overtime: data.overtime // Set overtime
          });
        }
      } catch (error) {
        console.error("Error fetching statistics data:", error);
      }
    };

    fetchStatisticsData();
  }, []);

  const getWorkingDaysInMonth = (year: number, month: number) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    let workingDays = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month - 1, day).getDay();
      if (currentDay !== 0 && currentDay !== 6) {
        workingDays++;
      }
    }
    return workingDays;
  };

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


  const boxImages = [
    "https://i.pinimg.com/564x/16/21/ba/1621bab5404ce9cb06516e30db47dcd7.jpg",
    "https://cdn-icons-png.flaticon.com/128/12148/12148705.png",
    "https://cdn-icons-png.flaticon.com/128/10035/10035159.png"
  ];

  const boxStyles: React.CSSProperties[] = [
    {
      borderRadius: "8px",
      minHeight: "100px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.8)",
      transition: "transform 0.3s",
      backgroundImage: `url(${boxImages[0]})`,
      backgroundSize: "100px 100px",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "bottom right"
    },
    {
      borderRadius: "8px",
      minHeight: "160px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.8)",
      transition: "transform 0.3s",
      cursor: "pointer",
      backgroundImage: `url(${boxImages[1]})`,
      backgroundSize: "110px 110px",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "bottom right"
    },
    {
      borderRadius: "8px",
      minHeight: "160px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.8)",
      transition: "transform 0.3s",
      cursor: "pointer",
      backgroundImage: `url(${boxImages[2]})`,
      backgroundSize: "100px 100px",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "bottom right"
    }
  ];

  const boxContentStyles: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  };

  const hoverStyles: React.CSSProperties = {
    transform: 'scale(1.03)'
  };

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handlemodelclose = () => {
    setIsModalOpen(false);
    window.location.reload();
  }

  return (
    <Container>
      <Grid container spacing={3} style={{ marginTop: '60px', marginLeft: '245px', }}>
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: "#0f4c82", minHeight: "190px", borderRadius: "8px", marginLeft: '10px' }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Card sx={{ ...boxStyles[0], ...(hoverIndex === 0 && hoverStyles) }} onMouseEnter={() => setHoverIndex(0)} onMouseLeave={() => setHoverIndex(null)}>
                    <CardContent sx={boxContentStyles}>
                      <Typography variant="h6" color={"black"} fontFamily={"initial"} fontSize={"1.7rem"} >{currentDateString}</Typography>
                      <Typography variant="body2" color={"black"} fontFamily={"initial"} fontSize={"2rem"} >{currentTimeString}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card sx={{ ...boxStyles[1], ...(hoverIndex === 1 && hoverStyles) }} onMouseEnter={() => setHoverIndex(1)} onMouseLeave={() => setHoverIndex(null)}
                    onClick={() => fetchClockTimes("in")}>
                    <CardContent sx={boxContentStyles}>
                      <Typography variant="h6" color={"black"} fontFamily={"initial"} fontSize={"1.8rem"} >Clocked In</Typography>
                      <Typography variant="body2" color={"black"} fontFamily={"initial"} fontSize={"2rem"} fontWeight={"bold"}>{totalClockedIn}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card sx={{ ...boxStyles[2], ...(hoverIndex === 2 && hoverStyles) }} onMouseEnter={() => setHoverIndex(2)} onMouseLeave={() => setHoverIndex(null)}
                    onClick={() => fetchClockTimes("out")}>
                    <CardContent sx={boxContentStyles}>
                      <Typography variant="h6" color={"black"} fontFamily={"initial"} fontSize={"1.8rem"} >Clocked Out</Typography>
                      <Typography variant="body2" color={"black"} fontFamily={"initial"} fontSize={"2rem"} fontWeight={"bold"}>{totalClockedOut}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} md={4} lg={3} style={{ height: '100%' }}>
          <Card sx={{ backgroundColor: "#0f4c82", minHeight: "395px", minWidth: "430px", borderRadius: "30px", marginLeft: "-30px" }}>
            <CardContent style={{ marginTop: '5px' }}>
              <GreetingsCard userName={userName} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} md={4} lg={3} style={{ height: '100%' }}>
          <RemainingTimeCard remainingTime={remainingTime} />
        </Grid>

        <Grid item xs={6} md={4} lg={3}>
          <Card sx={{ backgroundColor: "white", minHeight: "200px", minWidth: "475px", borderRadius: "35px", marginLeft: "140px", border: "3.5px solid #0f4c82" }}>
            <CardContent>
              <Typography variant="h5" fontFamily={"initial"} fontWeight={"bold"} color={"#063970"} fontSize={"1.6rem"}>
                Statistics
              </Typography>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>

                {/* Today */}
                <div style={{ border: "3px solid #0f4c82", padding: "8px", borderRadius: "5px" }}>
                  <Typography variant="body2" color={"#333"} fontFamily={"initial"} fontWeight={"bold"} fontSize={"1rem"}>
                    Today
                  </Typography>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <LinearProgress
                      variant="determinate"
                      value={statisticsData.today ? (statisticsData.today.hours / MAX_REGULAR_HOURS) * 100 : 0}
                      style={{ flex: 1, height: "10px", borderRadius: "5px", backgroundColor: "rgba(0, 0, 0, 0.5)", marginRight: "10px" }}
                    />
                    <Typography variant="body2" color={"#333"} fontFamily={"initial"} fontWeight={"bold"} fontSize={"1rem"}>
                      {statisticsData.today ? `${statisticsData.today.hours} hrs / ${MAX_REGULAR_HOURS} hrs` : '0 hrs / 0 hrs'}
                    </Typography>
                  </div>
                </div>

                {/* This Week */}
                <div style={{ border: "3px solid #0f4c82", padding: "8px", borderRadius: "5px", marginTop: "10px" }}>
                  <Typography variant="body2" color={"black"} fontFamily={"initial"} fontWeight={"bold"} fontSize={"1rem"}>
                    This Week
                  </Typography>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <LinearProgress
                      variant="determinate"
                      value={statisticsData.thisWeek ? (statisticsData.thisWeek.hours / statisticsData.thisWeek.totalHours) * 100 : 0}
                      style={{ flex: 1, height: "10px", borderRadius: "5px", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    />
                    <Typography variant="body2" color={"black"} fontFamily={"initial"} fontSize={"1rem"} fontWeight={"bold"} style={{ marginLeft: "10px" }}>
                      {statisticsData.thisWeek ? `${statisticsData.thisWeek.hours} hrs / ${statisticsData.thisWeek.totalHours} hrs` : '0 hrs / 0 hrs'}
                    </Typography>
                  </div>
                </div>

                {/* This Month */}
                <div style={{ border: "3px solid #0f4c82", padding: "8px", borderRadius: "5px", marginTop: "10px" }}>
                  <Typography variant="body2" color={"black"} fontFamily={"initial"} fontWeight={"bold"} fontSize={"1rem"}>
                    This Month
                  </Typography>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <LinearProgress
                      variant="determinate"
                      value={statisticsData.thisMonth ? (statisticsData.thisMonth.hours / statisticsData.thisMonth.totalHours) * 100 : 0}
                      style={{ flex: 1, height: "10px", borderRadius: "5px", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    />
                    <Typography variant="body2" color={"black"} fontFamily={"initial"} fontWeight={"bold"} fontSize={"1rem"} style={{ marginLeft: "10px" }}>
                      {statisticsData.thisMonth ? `${statisticsData.thisMonth.hours} hrs / ${statisticsData.thisMonth.totalHours} hrs` : '0 hrs / 0 hrs'}
                    </Typography>
                  </div>
                </div>

                {/* {/ Overtime /} */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                  <Typography variant="body2" color={"black"} fontFamily={"initial"} fontWeight={"bold"} fontSize={"1.1rem"}>
                    Overtime
                  </Typography>
                  <Typography variant="body2" color={"black"} fontWeight={"bold"} fontFamily={"sans-serif"} fontSize={"1rem"}>
                    {`${statisticsData.overtime.hours} hrs ${statisticsData.overtime.minutes} mins`}
                  </Typography>
                </div>
                <LinearProgress
                  variant="determinate"
                  value={(statisticsData.overtime.hours * 60 + statisticsData.overtime.minutes) / (MAX_REGULAR_HOURS * 60) * 100}
                  style={{ height: "10px", borderRadius: "5px", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                />
              </div>

              <Modal open={isModalOpen} onClose={() => handlemodelclose()}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
                  <Typography variant="h6">Clock {clockInTime ? "In" : "Out"} Time</Typography>
                  <Typography variant="body1">{clockInTime ? clockInTime : clockOutTime}</Typography>
                </div>
              </Modal>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EmployeeHomePage;
