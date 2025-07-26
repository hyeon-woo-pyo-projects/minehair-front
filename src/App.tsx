import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from './components/layouts/Header';
import Landing from './components/index/Landing';
import Login from './components/member/Login';

import './App.css';
import Register from './components/member/Register';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header/>

        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/member/login" element={<Login/>} />
          <Route path="/member/register" element={<Register/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
