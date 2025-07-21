import { useEffect, useState } from "react";
import '../../style/layouts/fixBanner.css'
import Balloon from "../system/Balloon";

type Consulting = {
    name: string;
    phone: string;
    category : string;
    agree : boolean;
}

function FixBanner () {
    // 하단 간편상담신청 show/hide
    const [showFixBanner, setShowFixBanner] = useState(false);

    useEffect(()=>{
        const handleScroll = () => {
            const scrollY = window.scrollY;

            if ( scrollY > 100 ) {setShowFixBanner(true)} else {setShowFixBanner(false)}
        }

        handleScroll();
        
        window.addEventListener('scroll', handleScroll);
    }, []);

    // 카테고리 선택
    const [selectValue, setSelectValue] = useState('');

    // 유효성 검사
    const [consultForm, setConsultForm] = useState<Consulting>({
        name: '',
        phone: '',
        category : '',
        agree : false
    });

    const [balloonChk, setBalloonChk] = useState(0);
    
    const submitConsulting = () => {
        if ( consultForm.name.trim() === '' ) {
            setBalloonChk(1);
            return;
        }else if ( consultForm.phone.trim() === '' || consultForm.phone.length < 11 ) {
            setBalloonChk(2);
            return;
        }else if ( consultForm.category === '' ) {
            setBalloonChk(3);
            return;
        }else if ( consultForm.agree === false ) {
            setBalloonChk(4);
            return;
        }

        setBalloonChk(0);
    }

    return (
        <div id="fixedBanner" className={showFixBanner ? 'show' : ''}>
            <div className="inner">
                <h5>간편상담신청</h5>

                <form>
                    <div>
                        { balloonChk === 1 && <Balloon text={'이름을 입력해주세요.'} status={'notice'} /> }
                        <input type="text" placeholder="이름" maxLength={10} value={consultForm.name} onChange={ e => setConsultForm({...consultForm, name : e.target.value})}/> 
                    </div>

                    <div>
                        { balloonChk === 2 && <Balloon text={'연락처를 확인해주세요.'} status={'notice'} /> }
                        <input type="text" placeholder="연락처(-없이)" maxLength={11} value={consultForm.phone} onChange={ e => setConsultForm({...consultForm, phone : e.target.value})}/>
                    </div>

                    <div>
                        { balloonChk === 3 && <Balloon text={'카테고리를 선택해주세요.'} status={'notice'} /> }
                        <select defaultValue='' value={consultForm.category} onChange={ e => setConsultForm({...consultForm, category : e.target.value})}>
                            <option value='' hidden>선택</option>
                            <option value="1">as</option>
                        </select>
                    </div>

                    <div>
                        { balloonChk === 4 && <Balloon text={'동의해주세요.'} status={'notice'} /> }
                        <input type="checkbox" id="agreeChk" onChange={ e => setConsultForm({...consultForm, agree : e.target.checked})}/>
                        <label htmlFor="agreeChk">
                            개인정보처리방침 동의
                        </label>
                    </div>
                </form>

                <button id="sendCall" onClick={submitConsulting}>상담신청</button>
            </div>
        </div>
    )
}

export default FixBanner;