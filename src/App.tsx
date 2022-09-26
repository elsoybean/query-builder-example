import React from 'react';
import Demo from './Demo';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme();

theme.typography.h5 = {
  ...theme.typography.h5,
  paddingTop: '2rem',
  paddingBottom: '0.5rem',
};

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Demo />
      </ThemeProvider>
    </div>
  );
}

export default App;
