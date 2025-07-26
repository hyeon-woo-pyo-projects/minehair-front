import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from './components/layouts/Header';
import Landing from './components/index/Landing';
import Login from './components/member/Login';

import './App.css';
import Register from './components/member/Register';
import Forgot from './components/member/Forgot';
import Terms from './components/member/Terms';
import Privacy from './components/member/Privacy';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header/>

        <Routes>
          <Route path="/" element={<Landing/>} />

          {/* member */}
          <Route path="/member/login" element={<Login/>} />
          <Route path="/member/register" element={<Register/>} />
          <Route path="/member/forgot" element={<Forgot/>} />
          <Route path="/member/terms" element={<Terms/>} />
          <Route path="/member/privacy" element={<Privacy/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
