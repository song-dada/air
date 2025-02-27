import React from 'react';
import Header from './header/header';
import Content from './content/content';
import Footer from './footer/footer';
import './app.scss';

import { StationProvider } from './context/StationContext';
const App = () => {
  return (
    <StationProvider>
      <body>
      <Header></Header>
        <div className='body'>
          <Content/>
        </div>
      <Footer/>
      </body>
    </StationProvider>
  );
}

export default App;
