import { Link, useNavigate } from 'react-router-dom';

import '../../style/member/member.css'
import { useEffect, useState } from 'react';
import MemberNav from './MemberNav';
import axiosInstance from '../../api/axiosInstance';

function Register () {
    // 유효성 검사
    const [ id, setId ] = useState('');
    const [ name, setName ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ passwordChk, setPasswordChk ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ certi, setCerti ] = useState('');
    const [ btnActive, setBtnActive ] = useState(false);
    const [emailValid, setEmailValid] = useState(true);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        const regex = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/;
        setEmailValid(regex.test(value));
    };

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

    useEffect(() => {
        const isValid =
            ( id !== '' && id.length > 3 ) &&
            ( name !== '' && name.length > 2 ) &&
            ( password !== '' && password.length > 3 )&&
            ( passwordChk !== '' && password === passwordChk ) &&
            ( email !== '' && emailValid ) &&
            ( phone !== '' && phone.replaceAll('-', '').length === 11 && /^\d+$/.test(phone.replaceAll('-', '')) ) &&
            certi === '000' &&
            terms.chk01 === true && terms.chk02 === true;

        setBtnActive(isValid);
    }, [id, password, passwordChk, email, emailValid, phone, certi, terms]);

    const navigate = useNavigate();

    const register = () => {
        axiosInstance
        .post('/user', {
            userId : id,
            password : password,
            confirmPassword : passwordChk,
            name : name,
            phone : phone,
            email : email,
        })
        .then((response) => {
            if ( response.data.success === true ) {
                alert('회원가입이 완료되었습니다.')
                navigate('/member/login');
            }
        })
        .catch((error) => {
            alert(error.response.data.error.message);
            console.log('error');
        })
    }

    return (
        <div id="page-register" className='membersComponents'>
            <div className="wrapper">
                <MemberNav/>

                <div className="inner">
                    <h1 className='innerTitle'>회원가입</h1>

                    <form id='registerForm' className='membersForm' noValidate>
                        <li>
                            <label htmlFor="registerId" className='formTitle'>아이디</label>
                            <input type="text" placeholder='아이디' id='registerId' onChange={(e) => setId(e.target.value) }/>
                        </li>

                        <li>
                            <label htmlFor="registerName" className='formTitle'>이름</label>
                            <input type="text" placeholder='이름' id='registerName' onChange={(e) => setName(e.target.value) }/>
                        </li>

                        <li>
                            <label htmlFor="registerPassword" className='formTitle'>비밀번호</label>
                            <input type="password" placeholder='비밀번호' id='registerPassword' onChange={(e) => setPassword(e.target.value) } />
                        </li>

                        <li>
                            <label htmlFor="registerPasswordChk" className='formTitle'>비밀번호 확인</label>
                            <input type="password" placeholder='비밀번호 확인' id='registerPasswordChk' onChange={(e) => setPasswordChk(e.target.value) }/>
                        </li>

                        <li>
                            <label htmlFor="registerEmail" className='formTitle'>이메일 주소</label>
                            <input type="email" placeholder='이메일 주소' id='registerEmail' onChange={handleEmailChange}/>
                        </li>

                        <li>
                            <label htmlFor="phone" className='formTitle'>휴대폰번호</label>

                            <div>
                                <input type="text" placeholder='"-"없이' id='phone' maxLength={11} onChange={(e) => setPhone(e.target.value) }/>
                                <button type='button'>인증번호 받기</button>
                            </div>
                        </li>

                        <li>
                            <label htmlFor="certiNum" className='formTitle'></label>
                            <input type="text" placeholder='인증번호 (000 고정)' id='certiNum' maxLength={6} onChange={(e) => setCerti(e.target.value) }/>
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
                            <button type='button' className={ btnActive === false ? 'disabledBtn' : 'primaryBtn' } disabled={ btnActive === false ? true : false } onClick={register}>회원가입</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register;