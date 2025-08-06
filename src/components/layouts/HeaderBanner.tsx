import { Link } from 'react-router-dom';
import "../../style/layouts/headerBanner.css"
import { useEffect, useState } from 'react';


function HeaderBanner() {
    // 관리자 감지
    const [ admin, setAdmin ] = useState(false);

    useEffect(()=>{
        const role = localStorage.getItem('roleCode');
        if ( role === 'ROLE_ADMIN' ) { setAdmin(true) } else { setAdmin(false) }
    }, [])

    return (
        <>
            {/* 맨 상단 배너 */}
            { admin === true ? <Link to="/admin/index" id="adminBanner">관리자 페이지 바로가기</Link> : '' }
            <Link to="/" id="headerBanner">이벤트 배너</Link>
        </>
    )
}

export default HeaderBanner;