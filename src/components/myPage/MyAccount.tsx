import { forwardRef, useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import { format } from "date-fns";
import Balloon from "../system/Balloon";
import IconCross from "../../icons/IconCross";

interface MyProps {
    id : number,
    userId : string,
    email : string,
    name : string,
    phoneNumber : string,
    birthDate : Date | null,
}

function MyAccount () {
    const navigate = useNavigate();
    const [ disabled, setDisaabled ] = useState(true);
    const [ data, setData ] = useState({
        id : 0,
        userId : '',
        email : '',
        name : '',
        phoneNumber : '',
        birthDate : null as Date | null,
    })

    function getData () {
        axiosInstance
        .get('/user/my-page/details')
        .then((res) => {
            if ( res.data.success === true ) {
                const data = res.data.data;
                setData(data);
            }
        })
        .catch((err) => { if ( err.status === 401 ) navigate('/expired'); else { alert('오류가 발생했습니다'); console.log(err);} })
    }

    useEffect(()=>{
        getData();
    }, [])

    const BirthDate = forwardRef<HTMLInputElement, any>(
        ({ value, onClick }, ref) => (
            <input
                type="text"
                value={value || ""}
                onClick={onClick}
                ref={ref}
                placeholder="시작일 선택"
                maxLength={11}
                readOnly
            />
        )
    );

    // 이메일 확인
    const [ emailValid, setEmailValid ] = useState(true);
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setData({...data, email : value});
        const regex = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/;
        setEmailValid(regex.test(value));
    };

    const [ balloon, setBalloon ] = useState(0);
    function handleSave(){
        if ( data.name === '' ) { setBalloon(1); return false; }
        if ( data.email === '' ) { setBalloon(2); return false; }
        if ( data.phoneNumber === '' || data.phoneNumber.length !== 11 ) { setBalloon(3); return false; }

        setBalloon(0)

        if ( !window.confirm('회원정보를 수정하시겠습니까?') ) return;

        axiosInstance
        .patch('/user', {
            name : data.name,
            phoneNumber : data.phoneNumber,
            email : data.email,
            birthDate : data.birthDate,
        })
        .then((res) => { if ( res.data.success === true ) { alert('저장되었습니다'); window.location.reload(); }})
        .catch((err) => { if ( err.status === 401 ) navigate('/expired'); else { alert('오류가 발생했습니다'); console.log(err);} })
    }

    const [ passPop, setPassPop ] = useState(false);
    function newPassword () {
        if ( !window.confirm('비밀번호를 변경하시겠습니까?') ) return;

        setPassPop(true);
    }

    const [ password, setPassword ] = useState({
        newPassword : '',
        confirmPassword: '',
    })

    function logOut (){
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("roleCode");
        navigate("/member/login", { replace: true });
        window.location.reload();
    }

    function changePassword () {
        if ( password.newPassword === '' ) { alert('새 비밀번호를 입력해주세요.'); return false }
        if ( password.confirmPassword === '' ) { alert('비밀번호 확인을 입력해주세요.'); return false }
        if ( password.newPassword !== password.confirmPassword ) { alert('비밀번호가 일치하지 않습니다.'); return false }
        
        axiosInstance
        .patch(`/user/password/${data.id}`, { newPassword : password.newPassword, confirmPassword : password.confirmPassword })
        .then((res) => { if ( res.data.success === true ) { alert('비밀번호가 변경되었습니다.\n다시 로그인해주세요'); logOut(); }})
        .catch((err) => { 
            if ( err.status === 401 ) navigate('/expired')
            else if ( err.status === 400 ) { alert('비밀번호는 4자 이상, 20자 이하로 설정해주세요'); return false; }
            else { alert('오류가 발생했습니다'); console.log(err);}
        })
    }

    // 회원탈퇴
    function handleRemove(){
        if ( !window.confirm('탈퇴하면 모든 정보가 사라집니다.\n정말로 탈퇴하시겠습니까?') ) return;

        axiosInstance
        .delete('/user')
        .then((res) => { if ( res.data.success === true ) { 
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("roleCode");
            alert('탈퇴했습니다');
            window.location.href = '/';
        } })
        .catch((err) => { alert('오류가 발생했습니다'); console.log(err); })
    }





    return (
        <div className="pages inner" id="pages-myaccount">
            { passPop ? 
                <div className="popup" id="popup-password">
                    <div className="popup-background" onClick={()=>{setPassPop(false)}}></div>

                    <div className="popup-contents">
                        <div className="popup-header">
                            <h3>비밀번호 변경</h3>
                            <div className="close-btn" onClick={()=>{setPassPop(false)}}>
                                <IconCross color='var(--color-white)'/>
                            </div>
                        </div>
                
                        <div className="popup-body">
                            <div className="popup-contents">
                                <ul>
                                    <li>
                                        <span className="popup-title">새 비밀번호</span>
                            
                                        <div className="input-area">
                                            <input type="password" placeholder="비밀번호 입력" onChange={(e) => { setPassword({ ...password, newPassword : e.target.value }) }}/>
                                        </div>
                                    </li>

                                    <li>
                                        <span className="popup-title">비밀번호 확인</span>
                            
                                        <div className="input-area">
                                            <input type="password" placeholder="비밀번호 확인" onChange={(e) => { setPassword({ ...password, confirmPassword : e.target.value }) }}/>
                                        </div>
                                    </li>
                                </ul>

                                <div className="btns">
                                    <button type="button" className="blackBtn" onClick={changePassword}>비밀번호 변경하기</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            : null }

            <h1 className="page-title">회원정보 수정</h1>

            <form className="pages-form">
                <input type="text" value={data.id} hidden/>
                <ul>
                    <li>
                        <span className="pages-form-title">아이디</span>
                            
                        <div className="input-area">
                            <input
                                type="text"
                                value={data.userId}
                                disabled
                            />
                        </div>
                    </li>

                    <li>
                        { balloon === 1 && <Balloon text={'이름을 확인해주세요.'} status={'notice'} /> }
                        <span className="pages-form-title">이름</span>
                            
                        <div className="input-area">
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => { setData({ ...data, name : e.target.value }); setDisaabled(false); }}
                            />
                        </div>
                    </li>

                    <li>
                        <span className="pages-form-title">비밀번호</span>
                            
                        <div className="input-area">
                            <button type="button" className="blackBtn form-btn" onClick={newPassword}>비밀번호 변경</button>
                        </div>
                    </li>

                    <li>
                        <span className="pages-form-title">생년월일</span>
                            
                        <div className="input-area">
                            <DatePicker
                                selected={data.birthDate}
                                onChange={(date) => {setData({ ...data, birthDate: date }); setDisaabled(false);}}
                                dateFormat="yyyy-MM-dd"
                                locale={ko}
                                openToDate={new Date(new Date().setFullYear(new Date().getFullYear() - 20))}
                                maxDate={new Date()}
                                showPopperArrow={false}
                                isClearable={false}
                                customInput={<BirthDate />}
                            />
                        </div>
                    </li>

                    <li>
                        { balloon === 2 && <Balloon text={'이메일을 확인해주세요.'} status={'notice'} /> }
                        <span className="pages-form-title">이메일 주소</span>
                            
                        <div className="input-area">
                            <input
                                type="text"
                                value={data.email}
                                maxLength={11}
                                placeholder="(-없이)"
                                onChange={(e) => { handleEmailChange(e); setDisaabled(false); }}
                            />
                        </div>
                    </li>

                    <li>
                        { balloon === 3 && <Balloon text={'번호를 확인해주세요.'} status={'notice'} /> }
                        <span className="pages-form-title">휴대폰 번호</span>
                            
                        <div className="input-area">
                            <input
                                type="text"
                                value={data.phoneNumber}
                                maxLength={11}
                                placeholder="(-없이)"
                                onChange={(e) => { setData({ ...data, phoneNumber : e.target.value }); setDisaabled(false); }}
                            />
                        </div>
                    </li>
                </ul>

                <div className="btns">
                    <button type="button" className="primaryBtn" disabled={disabled} onClick={handleSave}>저장하기</button>
                    <button type="button" className="blackBtn" onClick={() => { navigate(-1) }}>뒤로가기</button>
                </div>
                <p className="member-out" onClick={handleRemove}>회원탈퇴</p>
            </form>
        </div>
    )
}

export default MyAccount;