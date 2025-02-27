import React, { Suspense, lazy } from 'react';
import { isMobile } from 'react-device-detect';

import Header from './header/header';
import Content from './content/content';
import { StationProvider } from './context/StationContext';
import './app.scss'

// import Footer from './footer/footer';

const MobileApp = lazy(() => import('./m_src/App'));
const Bdp = () =>{
  return (
    <>
      <StationProvider>
        <body>
        <Header/>
          <div className='body'>
              <Content/>
          </div>
        </body>
      </StationProvider>
    </>
  )
}

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        {isMobile ? <MobileApp  /> : <Bdp />  }
      </Suspense>
    </div>
  );
}

export default App;