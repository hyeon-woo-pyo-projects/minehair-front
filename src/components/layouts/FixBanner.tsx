import { useEffect, useState } from "react";
import '../../style/layouts/fixBanner.css'
import Balloon from "../system/Balloon";
import axiosInstance from "../../api/axiosInstance";

type Consulting = {
    name: string;
    phone: string;
    category : string;
    agree : boolean;
}

interface selectionProps {
    code : string,
    description : string,
    id : number,
    name : string,
}

function FixBanner () {
    // 하단 간편상담신청 show/hide
    const [showFixBanner, setShowFixBanner] = useState(false);
    
    // 카테고리 선택
    const [selectValue, setSelectValue] = useState<selectionProps[]>([]);
    function getSelect () {
        axiosInstance
        .get('/consultation/categories')
        .then((response)=>{
            if ( response.data.success === true ) {
                setSelectValue(response.data.data)
            }
        })
    }

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

        axiosInstance
        .post('/consultation/reception', {
            name : consultForm.name,
            phoneNumber : consultForm.phone,
            consultationCategoryId : Number(consultForm.category)
        })
        .then ((result) => {
            if ( result.data.success === true ) {
                alert('상담 신청이 완료되었습니다.');
                window.location.reload();
            }
        })
        .catch ((err)=>{
            alert('신청란을 다시 확인해주세요');
            console.log(err);
        })

        setBalloonChk(0);
    }

    useEffect(()=>{
        const handleScroll = () => {
            const scrollY = window.scrollY;

            if ( scrollY > 100 ) {setShowFixBanner(true)} else {setShowFixBanner(false)}
        }

        handleScroll();
        getSelect();
        
        window.addEventListener('scroll', handleScroll);
    }, []);

    return (
        <div id="fixedBanner" className={showFixBanner ? 'show' : ''}>
            <div className="wrapper">
                <h5>간편상담신청</h5>

                <form>
                    <div>
                        { balloonChk === 1 && <Balloon text={'이름을 입력해주세요.'} status={'notice'} /> }
                        <input type="text" placeholder="이름" maxLength={10} value={consultForm.name} onChange={ e => setConsultForm({...consultForm, name : e.target.value})}/> 
                    </div>

                    <div>
                        { balloonChk === 2 && <Balloon text={'연락처를 확인해주세요.'} status={'notice'} /> }
                        <input type="text" placeholder="연락처" maxLength={11} value={consultForm.phone} onChange={ e => setConsultForm({...consultForm, phone : e.target.value})}/>
                    </div>

                    <div>
                        { balloonChk === 3 && <Balloon text={'카테고리를 선택해주세요.'} status={'notice'} /> }
                        <select defaultValue='' value={consultForm.category} onChange={ e => setConsultForm({...consultForm, category : e.target.value})}>
                            <option value=''>선택</option>
                            { selectValue.map((data)=>{
                                return  <option key={data.code} value={data.id}>{data.name}</option>
                            }) }
                        </select>
                    </div>

                    <div className="pc-show">
                        { balloonChk === 4 && <Balloon text={'동의해주세요.'} status={'notice'} /> }
                        <input type="checkbox" id="agreeChk" onChange={ e => setConsultForm({...consultForm, agree : e.target.checked})}/>
                        <label htmlFor="agreeChk">
                            개인정보처리방침 동의
                        </label>
                    </div>
                </form>

                <div className="fixBanner-btns">
                    <div className="mo-show">
                        { balloonChk === 4 && <Balloon text={'동의해주세요.'} status={'notice'} /> }
                        <input type="checkbox" id="agreeChk2" onChange={ e => setConsultForm({...consultForm, agree : e.target.checked})}/>
                        <label htmlFor="agreeChk2">
                            개인정보처리방침 동의
                        </label>
                    </div>
                    
                    <button id="sendCall" onClick={submitConsulting}>상담신청</button>
                </div>
            </div>
        </div>
    )
}

export default FixBanner;