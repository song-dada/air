import React from 'react';
import Header from './header/header';
import Content from './content/content';
import Footer from './footer/footer';

const App = () => {
  return (
    <>
      <Header></Header>
      <body>
        <Content/>
      </body>
      <Footer/>
    </>
  );
}

export default App;
