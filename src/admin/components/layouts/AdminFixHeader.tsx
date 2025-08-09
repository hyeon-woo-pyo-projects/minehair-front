

import { Link } from "react-router-dom";

import '../../../style/admin/adminHeader.css';
import { useState } from "react";
import AdminNavagation from "./AdminNavigation";

function AdminFixHeader () {
    const [ openMenu, setOpenMenu ] = useState(false);
    const toggleMenu = () => { setOpenMenu(!openMenu) }

    return (
        <>
            <div id="admin-header">
                <button type='button' id='menu-btn' className={openMenu ? 'show' : ''} onClick={toggleMenu}>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                </button>

                <h5>관리자 페이지</h5>
                <div className="btns">
                    <Link to={'/'}><button type="button" className="exit-btn">나가기</button></Link>
                </div>
            </div>

            <AdminNavagation openMenu={openMenu}/>
        </>
    )
}

export default AdminFixHeader;