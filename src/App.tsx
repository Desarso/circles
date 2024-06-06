import type { Component } from 'solid-js';
import MainSvg from './components/MainSvg';
import './style.css'
import Circle from './components/Circle';
import RandomPic from './components/RandomPic';


const App: Component = () => {
  return (
    <div class='app-container'>
      <Circle/>
      {/* <RandomPic/> */}
    </div>
      
  );
};

export default App;
