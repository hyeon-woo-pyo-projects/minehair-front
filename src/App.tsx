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
import AdminRouter from './admin/AdminRouter';
import EventBanner from './admin/components/common/EventBanner';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Admin 전용 라우트 */}
          <Route path="/admin" element={<AdminRouter />}>
            <Route path="/admin/index" element={<AdminIndex />} />
            <Route path="/admin/event-banner" element={<EventBanner />} />
          </Route>
          
          

          {/* 일반 사용자 레이아웃 */}
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
