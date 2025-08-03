import { Link } from 'react-router-dom';

import '../../style/member/member.css'
import { useState } from 'react';
import Balloon from '../system/Balloon';
import MemberNav from './MemberNav';

type LoginProps = {
    id : string;
    password: string;
}

function Login () {
    // 유효성 검사
    const [ balloonChk, setBalloonChk ] = useState(0);
    const [ login, setLogin ] = useState<LoginProps>({
        id : '',
        password: '',
    });
    const submitLogin = () => {
        if ( login.id.trim() === '' ) { setBalloonChk(1); return; }
        if ( login.password.trim() === '' ) { setBalloonChk(2); return; }
        setBalloonChk(0);
    }

    return (
        <div id="page-login" className='membersComponents'>
            <div className="wrapper">
                <MemberNav/>

                <div className="inner">
                    <h1 className='innerTitle'>로그인</h1>

                    <form id='loginForm' className='membersForm'>
                        <li>
                            { balloonChk === 1 && <Balloon text={'아이디를 입력해주세요.'} status={'notice'} /> }
                            <label htmlFor="loginId" className='formTitle'>아이디</label>
                            <input type="text" placeholder='아이디' id='loginId' onChange={ e => setLogin({...login, id : e.target.value})}/>
                        </li>

                        <li>
                            { balloonChk === 2 && <Balloon text={'비밀번호를 입력해주세요.'} status={'notice'} /> }
                            <label htmlFor="loginPassword" className='formTitle'>비밀번호</label>
                            <input type="password" placeholder='비밀번호' id='loginPassword'onChange={ e => setLogin({...login, password : e.target.value})}/>
                        </li>

                        <li>
                            <label htmlFor='' className='formTitle'></label>

                            <div>
                                <input type="checkbox" id='autoLogin'/>
                                <label htmlFor="autoLogin">자동로그인</label>
                            </div>
                        </li>

                        <div className="btns">
                            <button type='button' className='blackBtn' onClick={submitLogin}>로그인</button>
                        </div>
                    </form>

                    <div className="members">
                        <Link to={'/member/register'}>회원가입</Link>
                        <Link to={'/member/forgot'}>아이디/비밀번호 찾기</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;