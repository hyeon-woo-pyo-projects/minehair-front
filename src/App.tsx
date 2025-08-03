import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from './components/layouts/Header';
import Landing from './components/index/Landing';
import Login from './components/member/Login';
import Register from './components/member/Register';
import Forgot from './components/member/Forgot';
import Terms from './components/member/Terms';
import Privacy from './components/member/Privacy';
import AdminIndex from './admin/AdminIndex';

import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Admin 전용 라우트 - Header 없음 */}
          <Route path="/admin/index" element={<AdminIndex />} />

          {/* 일반 사용자 레이아웃 - Header 포함 */}
          <Route
            path="*"
            element={
              <>
                <Header />
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/member/login" element={<Login />} />
                  <Route path="/member/register" element={<Register />} />
                  <Route path="/member/forgot" element={<Forgot />} />
                  <Route path="/member/terms" element={<Terms />} />
                  <Route path="/member/privacy" element={<Privacy />} />
                </Routes>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
