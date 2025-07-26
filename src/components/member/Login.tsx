import { Link } from 'react-router-dom';

import '../../style/member/member.css'

function Login () {
    return (
        <div id="page-login" className='membersComponents'>
            <div className="wrapper">
                <nav className='memberNav'>
                    <Link className='current' to={'/member/login'}>로그인</Link>
                    <Link to={'/member/register'}>회원가입</Link>
                    <Link to={'/'}>아이디/비밀번호 찾기</Link>
                    <Link to={'/'}>이용약관</Link>
                    <Link to={'/'}>개인정보처리방침</Link>
                </nav>

                <div className="inner">
                    <h1 className='innerTitle'>로그인</h1>

                    <form id='loginForm' className='membersForm'>
                        <li>
                            <label htmlFor="loginId" className='formTitle'>아이디</label>
                            <input type="text" placeholder='아이디' id='loginId'/>
                        </li>

                        <li>
                            <label htmlFor="loginPassword" className='formTitle'>비밀번호</label>
                            <input type="password" placeholder='비밀번호' id='loginPassword'/>
                        </li>

                        <li>
                            <label htmlFor='' className='formTitle'></label>

                            <div>
                                <input type="checkbox" id='autoLogin'/>
                                <label htmlFor="autoLogin">자동로그인</label>
                            </div>
                        </li>

                        <div className="btns">
                            <button type='button' className='blackBtn'>로그인</button>
                        </div>
                    </form>

                    <div className="members">
                        <Link to={'/member/register'}>회원가입</Link>
                        <Link to={'/'}>아이디/비밀번호 찾기</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;