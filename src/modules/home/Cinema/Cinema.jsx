import { Box, Button, Card, CardActions, CardContent, CardMedia, Container, Grid, Skeleton, Stack, Tab, Tabs, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { getTheaterSystemInfo, getTheaterInfo, getShowtimeInfo } from '../../../apis/cinemaAPI';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import Slider from "react-slick";
import { red } from '@mui/material/colors';



// Ở đầy dùng Vertical tabs của MUI
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "red" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "green" }}
      onClick={onClick}
    />
  );
}

const Cinema = () => {

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    swipeToSlide: true,
    slidesToScroll: 3,
    vertical: true,
    verticalSwiping: true,
    beforeChange: function (currentSlide, nextSlide) {
      console.log("before change", currentSlide, nextSlide);
    },
    afterChange: function (currentSlide) {
      console.log("after change", currentSlide);
    }
  };

  const typographySettings = {
    // gutterbottom: true,
    variant: "h6",
    // marginBottom: 2,
    style: {
      fontSize: 20,
      fontWeight: 700,
      textAlign: "left",
    }
  }


  const navigate = useNavigate()


  const [theaterSystemId, setTheaterSystemId] = useState("");
  const [theaterId, setTheaterId] = useState("");
  const [showtimeInfo, setShowtimeInfo] = useState("");


  const { data: theaterSystemData, isLoading: isLoadingTheaterSysytem } = useQuery({
    queryKey: ["TheaterSystemInfo"],
    // queryFn ko truyền vào tham số thì gọi thế này(nếu có truyền tham số thì phải gọi bằng 1 callback)
    queryFn: getTheaterSystemInfo,
  });
  const theaterSystem = theaterSystemData || [];


  const { data: theaterData, isLoading: isLoadingTheaterInfo } = useQuery({
    queryKey: ["TheaterInfo", theaterSystemId],
    // queryFn có truyền vào tham số thì gọi kiểu callback
    queryFn: () => getTheaterInfo(theaterSystemId),
    enabled: !!theaterSystemId,
  });
  const theater = theaterData || [];
  console.log('theater: ', theater);
  console.log('theater[0].maCumRap: ', theater[0]?.maCumRap);


  const { data: showtimeData, isLoading: isLoadingShowtimeInfo } = useQuery({
    queryKey: ["ShowtimeInfo", theaterSystemId],
    // queryFn có truyền vào tham số thì gọi kiểu callback
    queryFn: () => getShowtimeInfo(theaterSystemId),
    enabled: !!theaterSystemId,
  });
  const showtime = showtimeData || [];
  console.log('showtime: ', showtime);
  console.log('showtime[0].lstCumRap: ', showtime[0]?.lstCumRap);



  const handleChangeTheaterSystemId = (newValue) => {
    setTheaterSystemId(newValue);
  };


  const handleChangeTheaterId = (newValue) => {
    setTheaterId(newValue);
    handleChangeShowtimeInfo(newValue);
  }
  console.log('theaterId: ', theaterId);


  const handleChangeShowtimeInfo = (newValue) => {
    var showtimeList = [];
    for (let i in showtime[0]?.lstCumRap) {
      if (newValue === showtime[0]?.lstCumRap[i].maCumRap) {
        for (let j in showtime[0]?.lstCumRap[i].danhSachPhim) {
          showtimeList.push(showtime[0]?.lstCumRap[i].danhSachPhim[j]);
        }
        break;
      }
    }
    setShowtimeInfo(showtimeList);
    console.log('showtimeInfo: ', showtimeInfo);
  }


  // khi theaterSystem thay đổi (>0) thì mặc định render ra thằng đầu tiên
  useEffect(() => {
    if (theaterSystem.length > 0) {
      setTheaterSystemId(theaterSystem[0].maHeThongRap);
    }
  }, [theaterSystem]);

  useEffect(() => {
    if (theater.length > 0) {
      setTheaterId(theater[0].maCumRap);
      handleChangeShowtimeInfo(theater[0].maCumRap);
      console.log("Được rồi nha 1");
    }
  }, [theater]);

  useEffect(() => {
    if (showtime[0]?.lstCumRap.length > 0) {
      handleChangeShowtimeInfo(theater[0].maCumRap);
      console.log("Được rồi nha 2");
    }
  }, [showtime[0]?.lstCumRap]);


  return (
    <Container maxWidth="xl" sx={{ marginBottom: 100 }}>
      <Grid container spacing={2}>
        <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
          <Tabs
            orientation="vertical"
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: "divider" }}
            // truyền thêm prop value vào, cái value này tương đương với value trong Tab bên dưới
            value={theaterSystemId}
            onChange={(event, newValue) => {
              // console.log("newValue", newValue);
              // console.log("event", event);
              handleChangeTheaterSystemId(newValue);
            }}
          >
            {theaterSystem.map((item) => {
              return (
                <Tab
                  key={item.maHeThongRap}
                  // onClick={() => handleChangeTheaterSystemId(item.maHeThongRap)}
                  label={<img src={item.logo} style={{ width: 100 }} />}
                  // {...a11yProps(item.maHeThongRap)}
                  // truyền thêm prop value vào, tương ứng với value trên Tabs
                  value={item.maHeThongRap}
                />
              );
            })}
          </Tabs>
          {/* {theaterSystems.map((item) => (
            <TabPanel value={theaterSystemsValue} index={item.maHeThongRap}>

            </TabPanel>
          ))} */}
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
          <Tabs
            orientation="vertical"
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: "divider" }}
            // truyền thêm prop value vào, cái value này tương đương với value trong Tab bên dưới
            value={theaterId}
            onChange={(event, newValue) => {
              handleChangeTheaterId(newValue);
            }}
          >
            {theater?.map((item) => {
              return (
                <Tab
                  key={item.maCumRap}
                  // onClick={() => handleChangeTheaterId(item.maCumRap)}
                  label={
                    <Box textAlign="left">
                      <Typography {...typographySettings}>
                        {item.tenCumRap}
                      </Typography>
                      <Typography {...typographySettings}>
                        Địa Chỉ: {item.diaChi}
                      </Typography>
                      <Typography sx={{ color: "red" }}>
                        [Xem chi tiết]
                      </Typography>
                    </Box>
                  }
                  // truyền thêm prop value vào, tương ứng với value trên Tabs
                  value={item.maCumRap}
                />
              );
            })}
          </Tabs>
          {/* {theaterInfo.map((item) => (
            <TabPanel value={theaterInfoValue} index={item.maCumRap}>

            </TabPanel>
          ))} */}
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <Tabs
            orientation="vertical"
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: "divider" }}
            // truyền thêm prop value vào
            value={theaterSystemId}
          // onChange={(event, newValue) => {
          //   setShowtimeInfo(newValue);
          // }}
          >
            {
              showtimeInfo ? (
                <Slider {...settings}>
                  {
                    showtimeInfo.map((item) => {
                      return (
                        <Card sx={{ maxWidth: 600 }}>
                          <CardMedia
                            sx={{ height: 300 }}
                            image={item.hinhAnh}
                            title="green iguana"
                          />
                          <CardContent>
                            <Typography 
                            gutterBottom 
                            variant="h4" 
                            component="div"
                            {...typographySettings}
                            sx={{
                              fontSize: 40,
                            }}
                            >
                            {item.tenPhim}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Lizards are a widespread group of squamate reptiles, with over 6,000
                              species, ranging across all continents except Antarctica
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <Button
                              variant="contained"
                              style={{
                                backgroundColor: `${red[500]}`,
                                display: "flex",
                                width: 200,
                                height: 50,
                                fontSize: 24,
                                margin: "auto",
                              }}
                              onClick={() => {
                                navigate(`movie/${item.maPhim}`)
                              }}>
                              Mua vé
                            </Button>
                          </CardActions>
                        </Card>
                      );
                    })
                  }
                </Slider>
              ) : (
                <Box maxWidth="md">
                  <Grid container spacing={2}>
                    <Grid xs={6} lg={6}>
                      <Skeleton variant="rounded" sx={{ height: 500 }} animation="wave" style={{ margin: 10 }} />
                    </Grid>
                    <Grid xs={6} lg={6}>
                      <Skeleton animation="wave" height={25} width="60%" style={{ margin: 10 }} />
                      <Skeleton variant="rounded" sx={{ height: 50 }} animation="wave" style={{ margin: 10 }} />
                      <Skeleton animation="wave" height={25} width="60%" style={{ margin: 10 }} />
                      <Skeleton animation="wave" height={25} width="60%" style={{ margin: 10 }} />
                      <Skeleton variant="rounded" sx={{ height: 50 }} width="60%" animation="wave" style={{ margin: 10 }} />
                    </Grid>
                  </Grid>
                </Box>
              )
            }


          </Tabs>
          {/* {showtimeInfo.map((item) => (
            <TabPanel value={showtimeInfoValue} index={item.maHeThongRap}>

            </TabPanel>
          ))} */}
        </Grid>
      </Grid>
    </Container >
  )
}

export default Cinema