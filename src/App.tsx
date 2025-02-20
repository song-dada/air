import React from 'react';
// import './App.css'
// import './dageom/sass/lay.scss';
import './dageom/sass/lay.scss'

import Da from './lay';
import { KakaoMap } from './jaekyeong/KakaoMap';
import Header from './hyomin/header/header';
import Content from './content';

const App = () => {
  return (
    <>
      <Header></Header>
      <body>
        <Content/>
      </body>
    </>
    // <div className="App">
    //   {/* APP화면 */}
    //   <Da></Da>
    //   {/* <KakaoMap/> */}
    // </div>
  );
}

export default App;
