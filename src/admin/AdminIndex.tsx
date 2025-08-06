import { Link } from 'react-router-dom';
import '../style/admin/admin.css'

function AdminIndex () {
    return (
        <div className="admin-index">
            <section>
                <h3 className="admin-title">공통 레이아웃</h3>

                <ul className="admin-contents">
                    <li><Link to={'/admin/event-banner'}>이벤트 배너</Link></li>
                </ul>
            </section>
        </div>
    )
}

export default AdminIndex;