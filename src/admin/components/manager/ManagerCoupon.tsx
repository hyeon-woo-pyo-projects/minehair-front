import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import { forwardRef, useEffect, useState } from "react";
import IconCirclePlus from "../../../icons/IconCirclePlus";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import '../../../style/admin/manager.css';
import "react-datepicker/dist/react-datepicker.css";
import IconTrash from "../../../icons/IconTrash";
import Balloon from "../../../components/system/Balloon";

interface CouponProps {
    id : number,
    content: string,
    conditionType : string,
    discountType : string,
    discountAmount : number,
    periodStart : Date | null,
    periodEnd : Date | null,
    isPost : boolean,
}

function ManagerCoupon () {
    const navigate = useNavigate();

    const [ couponList, setCouponList ] = useState<CouponProps[]>([]);
    const [ saveActive, setSaveActive ] = useState(false);
    const [ newMenu, setNewMenu ] = useState(false);
    const [ disabled, setDisabled ] = useState(true);
    const [ deleteBtn, setDeleteBtn ] = useState(false);

    const [ balloonChk, setBalloonChk ] = useState(0);
    
    // 폼 데이터
    const [ formData, setFormData ] = useState({
        id : 0,
        content : '',
        conditionType : 'PURCHASE',
        discountType : 'PRICE',
        discountAmount : 0,
        periodStart : null as Date | null,
        periodEnd : null as Date | null,
        isPost : false,
    });

    function handleChange (change: Partial<typeof formData>) {
        setFormData((prev) => ({...prev, ...change}))
        setSaveActive(true);
    }
    
    const StartDate = forwardRef<HTMLInputElement, any>(
        ({ value, onClick }, ref) => (
            <input
            type="text"
            value={value || ""}
            onClick={onClick}
            ref={ref}
            placeholder="시작일 선택"
            maxLength={11}
            disabled={disabled}
            readOnly
            />
        )
    );

    const EndDate = forwardRef<HTMLInputElement, any>(
        ({ value, onClick }, ref) => (
            <input
                type="text"
                value={value || ""}
                onClick={onClick}
                ref={ref}
                placeholder="마감일 선택"
                maxLength={11}
                disabled={disabled}
                readOnly
            />
        )
    );
    
    function getData () {
        axiosInstance
        .get('/coupon')
        .then((res)=>{
            if ( res.data.success === true ) {
                const data = res.data.data;

                setCouponList(data);
            }
        })
        .catch((err)=>{
            alert('에러가 발생했습니다');
            console.log(err);
        })
    }

    useEffect(()=>{
        getData();
    },[]);
    
    function handleClick (coupon : CouponProps) {
        setFormData({
            ...coupon,
            periodStart: coupon.periodStart ? new Date(coupon.periodStart) : null,
            periodEnd: coupon.periodEnd ? new Date(coupon.periodEnd) : null,
        });
        setNewMenu(false);
        setDisabled(false);
        setDeleteBtn(true);
    }

    // 쿠폰 생성
    function handleNew () {
        setNewMenu(true);
        setDisabled(false);
        setDeleteBtn(false);
        setSaveActive(false);

        // form 초기화
        setFormData({
            id: 0,
            content: '',
            conditionType: 'PURCHASE',
            discountType: 'PRICE',
            discountAmount: 0,
            periodStart: null,
            periodEnd: null,
            isPost: false,
        });
    }
    
    // 저장하기
    function handleSave () {
        // 유효성 검사
        if ( !formData.content ) { setBalloonChk(1); return false; }
        if ( !formData.periodStart ) { setBalloonChk(2); return false; }
        if ( !formData.periodEnd ) { setBalloonChk(3); return false; }

        if ( newMenu === true ) {
            axiosInstance
            .post('/coupon', {
                content : formData.content,
                conditionType : formData.conditionType,
                discountType : formData.discountType,
                discountAmount : formData.discountAmount,
                periodStart: formData.periodStart?.toISOString().split('T')[0],
                periodEnd: formData.periodEnd?.toISOString().split('T')[0],
                isPost : formData.isPost,
            })
            .then((res) => {
                alert('저장되었습니다');
                window.location.reload();
            })
            .catch((err)=>{
                alert('에러가 발생했습니다');
                console.log(err);
            });
        } else {
            let couponId = formData.id;
            
            axiosInstance
            .patch(`/coupon/${couponId}`, {
                content: formData.content,
                conditionType: formData.conditionType,
                discountType: formData.discountType,
                discountAmount: formData.discountAmount,
                periodStart: formData.periodStart?.toISOString().split('T')[0],
                periodEnd: formData.periodEnd?.toISOString().split('T')[0],
                isPost: formData.isPost,
            })
            .then((res)=>{ alert('저장되었습니다'); window.location.reload()})
            .catch((err)=>{ alert('에러가 발생했습니다'); console.log(err)});
        }

        setBalloonChk(0);
    }

    function handleDelete () {
        let idVal = Number(formData.id);
        
        if ( idVal ) {
            if ( !window.confirm('해당 쿠폰을 삭제 하시겠습니까?') ) return;
            
            axiosInstance
            .delete(`/coupon/${idVal}`)
            .then((res) => { alert('삭제가 완료되었습니다'); window.location.reload();})
            .catch((err) => { alert('오류가 발생했습니다'); console.log(err)});
        }
    }

    // 날짜 포맷
    function formatDate(date: Date | null) {
        if (!date) return '-';
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0~11이므로 +1
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}.${m}.${d}`;
    }

    return (
        <div className="admin-page" id="manager-coupon">
            <div className="admin-body wrapper">
                <h1 className="admin-title">쿠폰 관리</h1>

                <div className="admin-body-header">
                    <p className="admin-form-title">쿠폰 리스트</p>
                </div>
                

                <form className="admin-form" id="admin-slider">
                    { couponList.length > 0 ?
                        <ul>
                            { couponList.map((el) => {
                                return (
                                    <li className={`sliderChild${el.isPost ? '' : ' hide'}`} onClick={() => handleClick(el)}>
                                        <div className="coupon">
                                            <h2 className="coupon-title">{el.content}</h2>
                                            <p className="coupon-price">할인 : {el.discountAmount}{el.discountType === 'PRICE' ? '원' : '%'}</p>
                                            <span className="coupon-period">
                                                {formatDate(el.periodStart ? new Date(el.periodStart) : null)} ~ 
                                                {formatDate(el.periodEnd ? new Date(el.periodEnd) : null)}
                                            </span>
                                        </div>
                                    </li>
                                )
                            }) }
                        </ul>
                    :
                        <p className="empty-notice">쿠폰이 없습니다.</p>
                    }
                </form>

                <form className="admin-form">
                    <input type="text" id="coupon-id" value={formData.id} hidden/>

                    <div className="center-menu">
                        <button className="add-btn" type="button" onClick={handleNew}>
                            <IconCirclePlus color="var(--color-black)" />
                            쿠폰 생성
                        </button>
                    </div>

                    <ul>
                        <li>
                            { balloonChk === 1 && <Balloon text={'쿠폰명을 확인해주세요.'} status={'notice'} /> }
                            <span className="admin-form-title">쿠폰명</span>

                            <div className="input-area">
                                <input 
                                    type="text" 
                                    id="coupon-name" 
                                    placeholder="쿠폰명" 
                                    value={formData.content}
                                    onChange={(e) => { handleChange({ content : e.target.value }) }}
                                    disabled={disabled}
                                />
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">쿠폰 타입</span>
                            
                            <div className="input-area">
                                <div className="radios">
                                    <div className="radio-child">
                                        <input
                                            type="radio"
                                            id="coupon-type1"
                                            name="coupon-type"
                                            value={formData.conditionType}
                                            checked={formData.conditionType === 'PURCHASE'}
                                            onChange={() => { handleChange({ conditionType : 'PURCHASE' }) }}
                                            disabled={disabled}
                                        />
                                        <label htmlFor="coupon-type1">구매</label>
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">할인 타입</span>

                            <div className="input-area">
                                <div className="radios">
                                    <div className="radio-child">
                                        <input 
                                            type="radio" 
                                            id="discount-type1" 
                                            name="discount-type" 
                                            value="PRICE"
                                            checked={formData.discountType === 'PRICE'}
                                            onChange={() => handleChange({ discountType: 'PRICE', discountAmount : 0  })}
                                            disabled={disabled}
                                        />
                                        <label htmlFor="discount-type1">금액</label>
                                    </div>

                                    <div className="radio-child">
                                        <input 
                                            type="radio" 
                                            id="discount-type2" 
                                            name="discount-type" 
                                            value="PERCENTAGE"
                                            checked={formData.discountType === 'PERCENTAGE'}
                                            onChange={() => handleChange({ discountType: 'PERCENTAGE', discountAmount : 0 })}
                                            disabled={disabled}
                                        />
                                        <label htmlFor="discount-type2">할인률</label>
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">할인</span>

                            <div className="input-area">
                                { formData.discountType === 'PRICE' ?
                                    <input 
                                        type="text" 
                                        id="discount-amount"
                                        value={formData.discountAmount}
                                        maxLength={6}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                            handleChange({ discountAmount: Number(value) });
                                            }
                                        }}
                                        disabled={disabled}
                                    />
                                :
                                    <input 
                                        type="text" 
                                        id="discount-amount"
                                        value={formData.discountAmount > 100 ? 100 : formData.discountAmount}
                                        maxLength={3}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^\d*$/.test(value)) {
                                                let numberValue = Number(value);
                                                
                                                if (numberValue > 100) { numberValue = 100; }
                                                handleChange({ discountAmount: numberValue });
                                            }
                                        }}
                                        disabled={disabled}
                                    />
                                }

                                <span className="appendix">
                                    { formData.discountType === 'PRICE' ? '원' : '%' }
                                </span>
                            </div>
                        </li>

                        <li>
                            { balloonChk === 2 && <Balloon text={'시작일을 확인해주세요.'} status={'notice'} /> }
                            <span className="admin-form-title">시작일</span>

                            <div className="input-area">
                                <DatePicker
                                    selected={formData.periodStart}
                                    onChange={(date) => handleChange({ periodStart: date, periodEnd : null })}
                                    dateFormat="yyyy-MM-dd"
                                    locale={ko}
                                    minDate={new Date()}
                                    showPopperArrow={false}
                                    isClearable={false}
                                    customInput={<StartDate />}
                                />
                            </div>
                        </li>

                        <li>
                            { balloonChk === 3 && <Balloon text={'마감명을 확인해주세요.'} status={'notice'} /> }
                            <span className="admin-form-title">마감일</span>

                            <div className="input-area">
                                <DatePicker
                                    selected={formData.periodEnd}
                                    onChange={(date) => handleChange({ periodEnd: date })}
                                    dateFormat="yyyy-MM-dd"
                                    locale={ko}
                                    minDate={formData.periodStart || new Date()} 
                                    showPopperArrow={false}
                                    isClearable={false}
                                    customInput={<EndDate />}
                                />
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">노출 상태</span>
                            
                            <div className="input-area">
                                <div className="radios">
                                    <div className="radio-child">
                                        <input 
                                            type="radio" 
                                            id="post-show" 
                                            name="isPost" 
                                            checked={formData.isPost === true}
                                            onChange={() => { handleChange({ isPost : true }) }}
                                            disabled={disabled}
                                        />
                                        <label htmlFor="post-show">노출</label>
                                    </div>

                                    <div className="radio-child">
                                        <input 
                                            type="radio" 
                                            id="post-hide"
                                            name="isPost" 
                                            checked={formData.isPost === false}
                                            onChange={() => { handleChange({ isPost : false }) }}
                                            disabled={disabled}
                                        />
                                        <label htmlFor="post-hide">숨김</label>
                                    </div>
                                </div>
                            </div>
                        </li>

                        { deleteBtn ?
                            <li>
                                <span className="admin-form-title">쿠폰 삭제</span>
                                
                                <div className="input-area">
                                    <button type="button" className="red-btn" onClick={handleDelete}>
                                        <IconTrash color="var(--color-white"/>
                                        쿠폰 삭제하기
                                    </button>
                                </div>
                            </li>
                        : '' }
                    </ul>
                </form>
            </div>

            <div className="admin-btns">
                <button className="blackBtn" type="button" onClick={() => navigate(-1)}>뒤로가기</button>
                <button className="primaryBtn" type="button" disabled={!saveActive} onClick={handleSave}>저장하기</button>
            </div>
        </div>
    )
}

export default ManagerCoupon;