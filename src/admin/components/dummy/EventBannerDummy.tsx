import '../../../style/admin/dummy.css';

interface bannerProps {
    title : string
}

function EventBannerDummy ({title}:bannerProps) {
    return (
        <div id="header-banner-dummy">{title}</div>
    )
}

export default EventBannerDummy;