import '../../../style/admin/dummy.css';

interface bannerProps {
    content : string,
    textColor : string,
    color : string,
    link : string,
    isPost? : boolean,
    imgUrl? : string
}

function EventBannerDummy({ content, textColor, color, imgUrl, isPost }: bannerProps) {
    const backgroundStyle = {
        backgroundColor: color ?? "var(--color-gray)",
        backgroundImage: imgUrl ? `url(${imgUrl})` : undefined,
        color: textColor ?? "var(--color-white)",
        backgroundSize: "cover",
        backgroundPosition: "center"
    };

    return (
        <div
            className={isPost === true ? "active" : ""}
            id="header-banner-dummy"
            style={backgroundStyle}
        >
            {content}
        </div>
    );
}

export default EventBannerDummy;