import { Link } from 'react-router-dom';

import '../../style/member/member.css'
import { useState } from 'react';
import MemberNav from './MemberNav';

function Register () {
    // 유효성 검사
    const [ id, setId ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ passwordChk, setPasswordChk ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ certi, setCerti ] = useState('');

    // 약관 전체 동의
    const [ terms, setTerms ] = useState({
        chk01 : false,
        chk02 : false,
    });
    const allChk = (chk : boolean) => {
        setTerms({
            chk01: chk,
            chk02: chk,
        })
    }

    return (
        <div id="page-register" className='membersComponents'>
            <div className="wrapper">
                <MemberNav/>

                <div className="inner">
                    <h1 className='innerTitle'>회원가입</h1>

                    <form id='registerForm' className='membersForm'>
                        <li>
                            <label htmlFor="registerId" className='formTitle'>아이디</label>
                            <input type="text" placeholder='아이디' id='registerId'/>
                        </li>

                        <li>
                            <label htmlFor="registerPassword" className='formTitle'>비밀번호</label>
                            <input type="password" placeholder='비밀번호' id='registerPassword'/>
                        </li>

                        <li>
                            <label htmlFor="registerPasswordChk" className='formTitle'>비밀번호 확인</label>
                            <input type="password" placeholder='비밀번호 확인' id='registerPasswordChk'/>
                        </li>

                        <li>
                            <label htmlFor="phone" className='formTitle'>휴대폰번호</label>

                            <div>
                                <input type="text" placeholder='"-"없이' id='phone' maxLength={11} />
                                <button type='button'>인증번호 받기</button>
                            </div>
                        </li>

                        <li>
                            <label htmlFor="certiNum" className='formTitle'></label>
                            <input type="text" placeholder='인증번호' id='certiNum' maxLength={6} />
                        </li>

                        <div className='registerTerms'>
                            <div>
                                <label htmlFor="" className='formTitle'>약관동의</label>
                                <li>
                                    <input type="checkbox" id='allChk' checked={terms.chk01 && terms.chk02} onChange={(e) => allChk(e.target.checked)}/>
                                    <label htmlFor="allChk">전체동의</label>
                                </li>
                            </div>
                            
                            <ul>
                                <li>
                                    <input type="checkbox" id='chk01' className='termsCheck' checked={terms.chk01} onChange={(e) => setTerms(prev => ({...prev, chk01: e.target.checked}))}/>
                                    <label htmlFor="chk01">이용약관 동의 <span>[필수]</span></label>
                                    <Link to={'/'}>자세히보기</Link>
                                </li>

                                <li>
                                    <input type="checkbox" id='chk02' className='termsCheck' checked={terms.chk02} onChange={(e) => setTerms(prev => ({...prev, chk02: e.target.checked}))}/>
                                    <label htmlFor="chk02">개인정보처리방침 동의 <span>[필수]</span></label>
                                    <Link to={'/'}>자세히보기</Link>
                                </li>
                            </ul>
                        </div>

                        <div className="btns">
                            <button type='button' className='disabledBtn'>회원가입</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register;