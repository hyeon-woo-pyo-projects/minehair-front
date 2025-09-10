import { Link } from 'react-router-dom';
import '../style/common.css'
import '../style/admin/admin.css'

function AdminIndex () {
    return (
        <div className="admin-index">
            <section>
                <h3 className="admin-title">공통 레이아웃</h3>

                <ul className="admin-contents">
                    <li><Link to={'/admin/admin-banner'}>메인 배너</Link></li>
                    <li><Link to={'/admin/admin-category'}>헤더 메뉴</Link></li>
                    <li><Link to={'/admin/admin-consultation'}>상담 카테고리</Link></li>
                    <li><Link to={'/admin/admin-slide'}>홈 슬라이드</Link></li>
                    <li><Link to={'/admin/admin-sns'}>SNS</Link></li>
                    <li><Link to={'/admin/admin-quick'}>퀵 메뉴</Link></li>
                </ul>
            </section>

            <section>
                <h3 className="admin-title">관리자</h3>

                <ul className="admin-contents">
                    <li><Link to={'/admin/manager-consultation'}>상담 신청자</Link></li>
                    <li><Link to={'/admin/manager-coupon'}>쿠폰 관리</Link></li>
                </ul>
            </section>

            <section>
                <h3 className="admin-title">페이지</h3>

                <ul className="admin-contents">
                    <li><Link to={'/admin/page-eventpage'}>이벤트</Link></li>
                </ul>
            </section>
        </div>
    )
}

export default AdminIndex;