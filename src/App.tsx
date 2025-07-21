import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from './components/layouts/Header';
import Landing from './components/index/Landing';
import FixBanner from './components/layouts/FixBanner';
import Login from './components/member/Login';

import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header/>

        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/member/login" element={<Login/>} />
        </Routes>

        <FixBanner/>
      </BrowserRouter>
    </div>
  );
}

export default App;
