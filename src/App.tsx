// App.tsx
import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom';

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
import QnA from './components/pages/QnA';
import ManagerCoupon from './admin/components/manager/ManagerCoupon';
import EventGrid from './admin/components/pages/event/EventGrid';
import QnaDetails from './components/pages/QnaDetails';
import QnaWriter from './components/pages/QnaWriter';
import AdminSns from './admin/components/common/AdminSns';
import Event from './components/pages/Event';
import EventPage from './admin/components/pages/EventPage';
import MyPageLanding from './components/myPage/MyPageLanding';
import MyCoupon from './components/myPage/MyCoupon';
import Expired from './components/system/Expired';
import { useEffect } from 'react';
import AdminQuick from './admin/components/common/AdminQuick';
import ManagerQna from './admin/components/manager/ManagerQna';
import MyAccount from './components/myPage/MyAccount';

function AppRoutes() {
  const navigate = useNavigate();

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

  // 401시 이동 처리
  useEffect(() => {
    const handleUnauthorized = () => {
      navigate("/expired");
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, [navigate]);

  return (
    <Routes>
      {/* Admin 전용 라우트 */}
      <Route path="admin" element={<AdminRouter />}>
        <Route path="index" element={<AdminIndex />} />
        <Route path="admin-banner" element={<AdminBanner />} />
        <Route path="admin-category" element={<AdminCategory />} />
        <Route path="admin-logo" element={<AdminLogo />} />
        <Route path="admin-preview" element={<AdminPreview />} />
        <Route path="admin-consultation" element={<AdminConsulation />} />
        <Route path="admin-slide" element={<AdminSlider />} />
        <Route path="admin-sns" element={<AdminSns />} />
        <Route path="admin-quick" element={<AdminQuick />} />

        {/* 관리자 */}
        <Route path="manager-consultation" element={<ManagerConsultation />} />
        <Route path="manager-coupon" element={<ManagerCoupon />} />
        <Route path="manager-qna" element={<ManagerQna />} />

        {/* 페이지 */}
        <Route path="page-eventpage" element={<EventPage />} />
        <Route path="page-eventgrid" element={<EventGrid />} />
      </Route>

      {/* 일반 사용자 레이아웃 */}
      <Route
        path="*"
        element={
          <>
            <Header />
            <Routes>
              <Route path="/" element={<Landing />} />

              {/* 시스템 */}
              <Route path="expired" element={<Expired />} />

              {/* 멤버 관련 */}
              <Route path="/member/login" element={<Login />} />
              <Route path="/member/register" element={<Register />} />
              <Route path="/member/forgot" element={<Forgot />} />
              <Route path="/member/terms" element={<Terms />} />
              <Route path="/member/privacy" element={<Privacy />} />

              {/* 마이페이지 */}
              <Route path="/mypage/*" element={<MyPageLanding />} />
              <Route path="/mypage/coupon" element={<MyCoupon />} />
              <Route path="/mypage/account" element={<MyAccount />} />

              {/* 페이지 */}
              <Route path="/pages/*" element={<DefaultPages />} />
              <Route path="/pages/qna" element={<QnA />} />
              <Route path="/pages/qna-writer" element={<QnaWriter />} />
              <Route path="/pages/qna-details" element={<QnaDetails />} />
              <Route path="/pages/event" element={<Event />} />
            </Routes>
          </>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </div>
  );
}

export default App;
