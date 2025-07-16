import { BrowserRouter, Link } from 'react-router-dom';
import "../../style/layouts/fixedHeader.css"

interface BannerSettings {
    bannerBg : string;
    bannerText : string;
    textColor: string;
    textBold : string;
    fontSize: number;
    link: string;
}

function FixedHeader() {
    return (
        <BrowserRouter>
            {/* 맨 상단 배너 */}
            <Link to="#" id="fixedHeader">이벤트 배너</Link>
        </BrowserRouter>
    )
}

export default FixedHeader;