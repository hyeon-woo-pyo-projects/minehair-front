import { Link } from 'react-router-dom';
import '../style/common.css'
import '../style/admin/admin.css'

function AdminIndex () {
    return (
        <div className="admin-index">
            <section>
                <h3 className="admin-title">공통 레이아웃</h3>

                <ul className="admin-contents">
                    <li><Link to={'/admin/admin-banner'}>이벤트 배너</Link></li>
                    <li><Link to={'/admin/admin-category'}>헤더 메뉴</Link></li>
                    <li><Link to={'/admin/admin-logo'}>로고 관리</Link></li>
                    <li><Link to={'/admin/admin-preview'}>미리보기 링크</Link></li>
                    <li><Link to={'/admin/admin-consulation'}>상담 카테고리</Link></li>
                </ul>
            </section>
        </div>
    )
}

export default AdminIndex;