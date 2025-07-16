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
        // 맨 상단 배너
        <a href="#" id="fixedHeader">이벤트 배너</a>
    )
}

export default FixedHeader;