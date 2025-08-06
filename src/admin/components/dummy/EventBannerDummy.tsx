import '../../../style/admin/dummy.css';

interface bannerProps {
    content : string,
    textColor : string,
    color : string,
    link : string,
    isPost? : boolean
}

function EventBannerDummy ({content, textColor, color, link, isPost}:bannerProps) {
    return (
        <div className={isPost === true ? 'active' : ''} id="header-banner-dummy" style={{ backgroundColor: color ?? 'var(--color-gray)'}}><p style={{ color: textColor ?? 'var(--color-black)' }}>{content}</p></div>
    )
}

export default EventBannerDummy;