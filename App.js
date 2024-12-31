import React from "react";
import { ThemeProvider } from "styled-components/native";
import { StatusBar } from "expo-status-bar";
import { colors } from "./src/infrastructure/theme/colors";
import { theme } from "./src/infrastructure/theme";
import { Navigation } from "./src/infrastructure/navigation/index";
export default function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Navigation />
      </ThemeProvider>
      <StatusBar style="light" backgroundColor={colors.bg.primary} />
    </>
  );
}
