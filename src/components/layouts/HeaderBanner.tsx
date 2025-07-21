import { BrowserRouter, Link } from 'react-router-dom';
import "../../style/layouts/headerBanner.css"

interface BannerSettings {
    bannerBg : string;
    bannerText : string;
    textColor: string;
    textBold : string;
    fontSize: number;
    link: string;
}

function HeaderBanner() {
    return (
        <>
            {/* 맨 상단 배너 */}
            <Link to="/" id="headerBanner">이벤트 배너</Link>
        </>
    )
}

export default HeaderBanner;