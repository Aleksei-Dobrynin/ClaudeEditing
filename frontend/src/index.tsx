import React, {Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "./assets/styles/variables.css";
import './i18n';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

function CircularIndeterminate() {
  return (
    <Box style={{width:'100%', height:"100vh"}} display="flex" justifyContent="center" alignItems="center">
      <CircularProgress />
    </Box>
  );
}

root.render(
    <Suspense fallback={<CircularIndeterminate />}>
      <App />
    </Suspense>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
