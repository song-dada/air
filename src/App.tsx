import React from 'react';
import './App.css'
import Da from './dageom/lay';
import { KakaoMap } from './jaekyeong/KakaoMap';

const App = () => {
  return (
    <div className="App">
      {/* APP화면 */}
      <Da></Da>
      <KakaoMap/>
    </div>
  );
}

export default App;
