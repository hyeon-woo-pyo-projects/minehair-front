import { Link } from "react-router-dom";
import IconArrowDown from "../../../icons/IconArrowDown";


function AdminNavagation ({openMenu}) {
    return(
        <div id="admin-menu" className={ openMenu === true ? 'show' : '' }>
            <section>
                <div className="main-switch">
                    <p>공통 레이아웃</p>
                    <IconArrowDown color="var(--color-white)"/>
                </div>

                <div className="sub-switch">
                    <ul>
                        <li>
                            <Link to={'/admin/admin-banner'}>이벤트 배너</Link>
                        </li>

                        <li>
                            <Link to={'/admin/admin-category'}>헤더 매뉴</Link>
                        </li>

                        <li>
                            <Link to={'/admin/admin-logo'}>로고 관리</Link>
                        </li>

                        <li>
                            <Link to={'/admin/admin-preview'}>미리보기 링크</Link>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    )
}

export default AdminNavagation;