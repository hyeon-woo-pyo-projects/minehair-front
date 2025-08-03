

import { Link } from "react-router-dom";

import '../../../style/admin/adminHeader.css';
import { useState } from "react";

function AdminFixHeader () {
    const [ openMenu, setOpenMenu ] = useState(false);
    const toggleMenu = () => { setOpenMenu(!openMenu) }

    return (
        <>
            <div id="admin-header">
                <button type='button' id='menuBtn' className={openMenu ? 'show' : ''} onClick={toggleMenu}>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                </button>

                <h5>관리자 페이지</h5>
                <div className="btns">
                    <button type="button" className="saveBtn">저장하기</button>
                    <Link to={'/'}><button type="button" className="exitBtn">나가기</button></Link>
                </div>
            </div>

            <div id="admin-menu" className={ openMenu === true ? 'show' : '' }>
                
            </div>
        </>
    )
}

export default AdminFixHeader;