import 'primereact/resources/themes/lara-light-indigo/theme.css'; // this is active theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '../styles/layout/layout.scss';
import '../styles/adjustments.css';

import '../layout/demo/TimelineDemo.css' // >>> remove after testing

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../store/reducers/rootReducer';
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;

