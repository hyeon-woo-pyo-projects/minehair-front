import { Link } from 'react-router-dom';
import '../style/common.css'
import '../style/admin/admin.css'
import Loading from '../components/system/Loading';

function AdminIndex () {
    return (
        <div className="admin-index">
            <section>
                <h3 className="admin-title">공통 레이아웃</h3>

                <ul className="admin-contents">
                    <li><Link to={'/admin/event-banner'}>이벤트 배너</Link></li>
                    <li><Link to={'/admin/menu-category'}>헤더 메뉴</Link></li>
                </ul>
            </section>
        </div>
    )
}

export default AdminIndex;