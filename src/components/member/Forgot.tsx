import MemberNav from './MemberNav';

import '../../style/member/member.css'
import Balloon from '../system/Balloon';
import { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

type FindIdProps = {
    name : string;
    phone: string;
}

type FindPasswordProps = {
    name : string;
    id : string;
    email: string;
}

function Forgot () {
    const [ balloonChk1, setBalloonChk1 ] = useState(0);
    const [ balloonChk2, setBalloonChk2 ] = useState(0);
    const [ findId, setFindId ] = useState<FindIdProps> ({
        name : '',
        phone : '',
    });

    const [ findPasword, setFindPassword ] = useState<FindPasswordProps> ({
        name : '',
        id : '',
        email : '',
    });

    function handleId () {
        if ( findId.name === '' ) { setBalloonChk1(1); return false; }
        if ( findId.phone === '' || findId.phone.length < 11 ) { setBalloonChk1(2); return false; }

        axiosInstance
        .get('/user/user-id', {
            params: {
                name: findId.name,
                phone: findId.phone,
            }
        })
        .then((res) => { if ( res.data.success === true ) { console.log(res) } })
        .catch((err) => { alert('오류가 발생했습니다'); console.log(err); })


        setBalloonChk1(0);
    }

    return (
        <div id="page-forgot" className="membersComponents">
            <div className="wrapper">
                <MemberNav/>
            </div>

            <div className="inner">
                <div className="childs">
                    <h1 className='innerTitle'>아이디 찾기</h1>

                    <form id='findIdForm' className='membersForm'>
                        <ul>
                            <li>
                                { balloonChk1 === 1 && <Balloon text={'아이디를 입력해주세요.'} status={'notice'} /> }
                                <label htmlFor="forgorId_name" className='formTitle'>이름</label>
                                <input type="text" placeholder='이름' id='forgorId_name' onChange={ e => setFindId({...findId, name : e.target.value})}/>
                            </li>

                            <li>
                                { balloonChk1 === 2 && <Balloon text={'휴대폰 번호를 확인해주세요.'} status={'notice'} /> }
                                <label htmlFor="forgotId_Phone" className='formTitle'>휴대폰 번호</label>
                                <input type="email" placeholder='휴대폰 번호(-없이)' id='forgotId_Phone' maxLength={11} onChange={ e => setFindId({...findId, phone : e.target.value})}/>
                            </li>
                        </ul>

                        <div className="btns">
                            <button type='button' id='findIdBtn' className='blackBtn' onClick={handleId}>아이디 찾기</button>
                        </div>
                    </form>
                </div>

                <div className="childs">
                    <h1 className='innerTitle'>비밀번호 찾기</h1>

                    <form id='findPassForm' className='membersForm'>
                        <ul>
                            <li>
                                { balloonChk2 === 1 && <Balloon text={'이름을 입력해주세요.'} status={'notice'} /> }
                                <label htmlFor="forgorPassword_name" className='formTitle'>이름</label>
                                <input type="text" placeholder='이름' id='forgorPassword_name' onChange={ e => setFindPassword({...findPasword, name : e.target.value})}/>
                            </li>

                            <li>
                                { balloonChk2 === 2 && <Balloon text={'아이디를 입력해주세요.'} status={'notice'} /> }
                                <label htmlFor="forgorPassword_id" className='formTitle'>아이디</label>
                                <input type="text" placeholder='아이디' id='forgorPassword_id' onChange={ e => setFindPassword({...findPasword, id : e.target.value})}/>
                            </li>

                            <li>
                                <label htmlFor="forgorPassword_Email" className='formTitle'>이메일 주소</label>
                                <input type="email" placeholder='이메일 주소' id='forgorPassword_Email'/>
                            </li>
                        </ul>

                        <div className="btns">
                            <button type='button' id='findPasswordBtn' className='blackBtn'>비밀번호 찾기</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Forgot;