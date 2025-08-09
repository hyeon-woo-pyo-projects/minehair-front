import { Link, useNavigate } from 'react-router-dom';

import '../../style/member/member.css'
import { useState } from 'react';
import Balloon from '../system/Balloon';
import MemberNav from './MemberNav';
import axiosInstance from '../../api/axiosInstance';

type LoginProps = {
    userId : string;
    password: string;
}

function Login () {
    // 유효성 검사
    const [ balloonChk, setBalloonChk ] = useState(0);
    const [ login, setLogin ] = useState<LoginProps>({
        userId : '',
        password: '',
    });

    const submitLogin = () => {
        if ( login.userId.trim() === '' ) { setBalloonChk(1); return; }
        if ( login.password.trim() === '' ) { setBalloonChk(2); return; }
        setBalloonChk(0);
        getLogin();
    }

    const [ errMsg, setErrMsg ] = useState(false);
    const navigate = useNavigate();

    const getLogin = () => {
        axiosInstance
            .post('/auth/login', { userId: login.userId.trim(), password: login.password.trim() })
            .then((response) => {
                if (response.data.success === true) {
                    const { accessToken, refreshToken, roleCode } = response.data.data;

                    const now = new Date().getTime();
                    const expiryTime = now + 24 * 60 * 60 * 1000;

                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    localStorage.setItem('roleCode', roleCode);
                    localStorage.setItem('loginExpiry', String(expiryTime));

                    setErrMsg(false);

                    navigate('/');
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.log('error');
                setErrMsg(true);
            });
    };

    return (
        <div id="page-login" className='membersComponents'>
            <div className="wrapper">
                <MemberNav/>

                <div className="inner">
                    <h1 className='innerTitle'>로그인</h1>

                    <form id='loginForm' className='membersForm' onSubmit={(e) => { e.preventDefault(); submitLogin(); }}>
                        <li>
                            { balloonChk === 1 && <Balloon text={'아이디를 입력해주세요.'} status={'notice'} /> }
                            <label htmlFor="loginId" className='formTitle'>아이디</label>
                            <input type="text" placeholder='아이디' id='loginId' onChange={ e => setLogin({...login, userId : e.target.value})}/>
                        </li>

                        <li>
                            { balloonChk === 2 && <Balloon text={'비밀번호를 입력해주세요.'} status={'notice'} /> }
                            <label htmlFor="loginPassword" className='formTitle'>비밀번호</label>
                            <input type="password" placeholder='비밀번호' id='loginPassword'onChange={ e => setLogin({...login, password : e.target.value})}/>
                        </li>

                        {/* <li>
                            <label htmlFor='' className='formTitle'></label>

                            <div>
                                <input type="checkbox" id='autoLogin'/>
                                <label htmlFor="autoLogin">자동로그인</label>
                            </div>
                        </li> */}

                        <div className="btns">
                            { errMsg === true ? <span className='noticeText'>아이디와 비밀번호를 다시 확인해주세요.</span> : null }
                            <button type='submit' className='blackBtn' onClick={submitLogin}>로그인</button>
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