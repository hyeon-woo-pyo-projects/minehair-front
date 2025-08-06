// App.tsx
import { HashRouter, Route, Routes } from 'react-router-dom';

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
import Loading from './components/system/Loading';

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Loading/>
        <Routes>
          {/* Admin 전용 라우트: parent 경로는 "admin", children은 상대경로로 정의 */}
          <Route path="admin" element={<AdminRouter />}>
            <Route path="index" element={<AdminIndex />} />
            <Route path="event-banner" element={<EventBanner />} />
          </Route>

          {/* 일반 사용자 레이아웃: 모든 비-관리자 경로 처리 */}
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
      </HashRouter>
    </div>
  );
}

export default App;
