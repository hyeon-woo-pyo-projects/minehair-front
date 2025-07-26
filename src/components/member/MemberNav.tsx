import { NavLink, NavLinkProps } from 'react-router-dom';

import '../../style/member/member.css';

function MemberNav () {
    return (
        <nav className='memberNav'>
            <NavLink className={({ isActive }) => (isActive ? 'current' : '')} to={'/member/login'}>로그인</NavLink>
            <NavLink className={({ isActive }) => (isActive ? 'current' : '')} to={'/member/register'}>회원가입</NavLink>
            <NavLink className={({ isActive }) => (isActive ? 'current' : '')} to={'/member/forgot'}>아이디/비밀번호 찾기</NavLink>
            <NavLink className={({ isActive }) => (isActive ? 'current' : '')} to={'/member/terms'}>이용약관</NavLink>
            <NavLink className={({ isActive }) => (isActive ? 'current' : '')} to={'/member/privacy'}>개인정보처리방침</NavLink>
        </nav>
    )
}

export default MemberNav;