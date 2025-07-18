import React from 'react';
import './App.css';

import HeaderBanner from './components/layouts/HeaderBanner';
import Header from './components/layouts/Header';
import Landing from './components/index/Landing';
import FixBanner from './components/layouts/FixBanner';

function App() {
  return (
    <div className="App">
      <HeaderBanner/>
      <Header/>
      <Landing/>
      <FixBanner/>
    </div>
  );
}

export default App;
