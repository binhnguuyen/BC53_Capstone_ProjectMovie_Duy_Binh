import React from "react";
import Banner from "./Banner";
import Cinema from "./Cinema";
import Showing from "./Showing";
import { Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import DarkModeToggle from '../../components/DarkModeToggle/DarkModeToggle';
import { useDarkMode } from "../../contexts/UserContext/UserContext";
import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material";

// thư viện Lottie
import Lottie from 'react-lottie';
import animationData from "../../Lotties/Aniki Hamster.json"

const Home = () => {
  const { isDarkMode } = useDarkMode();
  let theme = createTheme();
  theme = responsiveFontSizes(theme);

  // thư viện Lottie
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
  };

  // const {isLoading} = useQuery({
  //   // key để caching lại data
  //   queryKey: [],
  //   // function nhận 1 cái async function, cái async function đc viết bên movieApi để tăng tính tái sử dụng
  //   queryFn: "",
  // });

  // if (isLoading) {
  //   return (
  //     // thư viện Lottie
  //     <Lottie options={defaultOptions} width={300} height={300}/>
  //   );
  // }

  return (
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <ThemeProvider theme={theme}>
        <Banner />
        <Showing />
        <Cinema />
      </ThemeProvider>
    </div>
  );
};

export default Home;
