import * as Font from "expo-font";
import { useEffect } from "react";

export const fonts = {
  body: "Oswald_400Regular",
  heading: "Lato_400Regular",
  monospace: "Oswald_400Regular",
};

export const fontWeights = {
  regular: 400,
  medium: 500,
  bold: 700,
};

export const fontSizes = {
  caption: "12px",
  button: "14px",
  body: "16px",
  title: "20px",
  h5: "24px",
  h4: "34px",
  h3: "45px",
  h2: "56px",
  h1: "112px",
};

export const useFonts = () => {
  useEffect(() => {
    Font.loadAsync({
      Oswald_400Regular: require("../../../assets/fonts/Oswald-Regular.ttf"),
      Lato_400Regular: require("../../../assets/fonts/Lato-Regular.ttf"),
    });
  }, []);
};
