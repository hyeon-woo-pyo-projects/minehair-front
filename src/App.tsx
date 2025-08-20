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
import AdminBanner from './admin/components/common/AdminBanner';
import AdminCategory from './admin/components/common/AdminCategory';
import AdminLogo from './admin/components/common/AdminLogo';
import AdminPreview from './admin/components/common/AdminPreview';
import DefaultPages from './components/pages/DefaultPages';
import AdminConsulation from './admin/components/common/AdminConsultation';
import ManagerConsultation from './admin/components/manager/ManagerConsultation';
import AdminSlider from './admin/components/common/AdminSlider';

function App() {
  // 토큰 체크
  const checkLoginExpiry = () => {
    const expiryTime = localStorage.getItem('loginExpiry');
    if (expiryTime && new Date().getTime() > Number(expiryTime)) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('roleCode');
        localStorage.removeItem('loginExpiry');
        console.log("로그인 정보가 만료되어 초기화되었습니다.");
    }
  };
  
  checkLoginExpiry();

  return (
    <div className="App">
      <HashRouter>
        <Routes>
          {/* Admin 전용 라우트: parent 경로는 "admin", children은 상대경로로 정의 */}
          <Route path="admin" element={<AdminRouter />}>
            {/* 공통 레이아웃 */}
            <Route path="index" element={<AdminIndex />} />
            <Route path="admin-banner" element={<AdminBanner />} />
            <Route path="admin-category" element={<AdminCategory />} />
            <Route path="admin-logo" element={<AdminLogo />} />
            <Route path="admin-preview" element={<AdminPreview />} />
            <Route path="admin-consultation" element={<AdminConsulation />} />
            <Route path="admin-slide" element={<AdminSlider />} />

            {/* 관리자 */}
            <Route path="manager-consultation" element={<ManagerConsultation />} />
          </Route>

          {/* 일반 사용자 레이아웃: 모든 비-관리자 경로 처리 */}
          <Route
            path="*"
            element={
              <>
                <Header />
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/pages/*" element={<DefaultPages />} />
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
