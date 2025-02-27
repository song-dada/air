import React from 'react';
import Header from './header/header';
import Content from './content/content';
import Footer from './footer/footer';
import './app.scss';

const App = () => {
  return (
    <>
      <body>
      <Header/>
        <div className='body'>
          <Content/>
        </div>
      <Footer/>
      </body>
    </>
  );
}

export default App;
