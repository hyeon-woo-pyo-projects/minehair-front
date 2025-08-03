import { BrowserRouter, Link } from 'react-router-dom';
import "../../style/layouts/headerBanner.css"
import { useState } from 'react';

interface BannerSettings {
    bannerBg : string;
    bannerText : string;
    textColor: string;
    textBold : string;
    fontSize: number;
    link: string;
}

function HeaderBanner() {
    // 관리자 감지
    const [ admin, setAdmin ] = useState(false);

    return (
        <>
            {/* 맨 상단 배너 */}
            { admin === false ? <Link to="/" id="adminBanner">관리자 페이지 바로가기</Link> : '' }
            <Link to="/" id="headerBanner">이벤트 배너</Link>
        </>
    )
}

export default HeaderBanner;