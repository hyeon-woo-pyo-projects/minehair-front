import { Link } from 'react-router-dom';

import '../../style/member/login.css'

function Login () {
    return (
        <div id="page-login">
            <div className="wrapper">
                <nav id='loginNav'>
                    <Link className='current' to={'/member/login'}>로그인</Link>
                    <Link to={'/'}>회원가입</Link>
                    <Link to={'/'}>아이디/비밀번호 찾기</Link>
                    <Link to={'/'}>이용약관</Link>
                    <Link to={'/'}>개인정보처리방침</Link>
                </nav>
            </div>
        </div>
    )
}

export default Login;