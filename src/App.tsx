import Header from './header/header';
import Content from './content/content';
// import Footer from './footer/footer';
import { StationProvider } from './context/StationContext';
import './app.scss'

import React, { Suspense, lazy } from 'react';
import { isMobile } from 'react-device-detect';

const MobileApp = lazy(() => import('./m_src/App'));

const Pc_page =()=>{
  return (
    <>
      <StationProvider>
      <body>
      <Header></Header>
      <div className='body'>
          <Content/>
      </div>
      </body>
      </StationProvider>
    </>
  )
  }

const App = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        {isMobile? <MobileApp  /> : <Pc_page />  }
      </Suspense>
    </div>
  );
}

export default App;

