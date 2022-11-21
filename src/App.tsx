import type { Component } from 'solid-js';
import MainSvg from './components/MainSvg';
import '../css/style.css'


const App: Component = () => {
  return (
    <div class='app-container'>
      <MainSvg/>
    </div>
      
  );
};

export default App;
