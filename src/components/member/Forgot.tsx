import MemberNav from './MemberNav';

import '../../style/member/member.css'
import Balloon from '../system/Balloon';
import { useState } from 'react';

type FindIdProps = {
    name : string;
    certiNum: string;
}


type FindPasswordProps = {
    name : string;
    id : string;
    certiNum: string;
}

function Forgot () {
    const [ balloonChk1, setBalloonChk1 ] = useState(0);
    const [ balloonChk2, setBalloonChk2 ] = useState(0);
    const [ findId, setFindId ] = useState<FindIdProps> ({
        name : '',
        certiNum : '',
    });

    const [ findPasword, setFindPassword ] = useState<FindPasswordProps> ({
        name : '',
        id : '',
        certiNum : '',
    });

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
                                <label htmlFor="forgorId_phone" className='formTitle'>휴대폰번호</label>

                                <div>
                                    <input type="text" placeholder='"-"없이' id='forgorId_phone' maxLength={11} />
                                    <button type='button'>인증번호 받기</button>
                                </div>
                            </li>

                            <li>
                                <label htmlFor="forgorId_certiNum" className='formTitle'></label>
                                <input type="text" placeholder='인증번호' id='forgorId_certiNum' maxLength={6} />
                            </li>
                        </ul>

                        <div className="btns">
                            <button type='button' id='findIdBtn' className='blackBtn'>아이디 찾기</button>
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
                                <label htmlFor="forgorPassword_phone" className='formTitle'>휴대폰번호</label>

                                <div>
                                    <input type="text" placeholder='"-"없이' id='forgorPassword_phone' maxLength={11} />
                                    <button type='button'>인증번호 받기</button>
                                </div>
                            </li>

                            <li>
                                <label htmlFor="forgorPassword_certiNum" className='formTitle'></label>
                                <input type="text" placeholder='인증번호' id='forgorPassword_certiNum' maxLength={6} />
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