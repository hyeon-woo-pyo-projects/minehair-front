import { useNavigate } from "react-router-dom";
import IconCirclePlus from "../../../icons/IconCirclePlus";
import { useEffect, useState } from "react";
import Balloon from "../../../components/system/Balloon";
import IconUpload from "../../../icons/IconUpload";
import IconPicture from "../../../icons/IconPicture";
import IconTrash from "../../../icons/IconTrash";
import axiosInstance from "../../../api/axiosInstance";

interface DataProps {
    id : number,
    logoId : number,
    orderNo : number,
    imageUrl : string,
    linkUrl : string,
}

interface LogoProps {
    id : number,
    logoType : string,
    description : string,
    imageUrl : string,
}

function AdminSns () {
    const navigate = useNavigate();
    const [ balloon, setBalloon ] = useState(0);
    const [ disabled, setDisabled ] = useState(true);
    const [ save, setSave ] = useState(false);
    const [ deleteBtn, setDeleteBtn ] = useState(false);
    const [ clickedData, setClickedData ] = useState({
        id: 0,
        logoId : 0,
        orderNo : 0,
        imageUrl : '',
        linkUrl : ''
    })
    
    const [ data, setData ] = useState<DataProps[]>([]);
    const [ logoData, setLogoData ] = useState<LogoProps[]>([]);

    function test () {
        navigate('/expired');
    }

    function getData () {
        // 로고 가져오기
        axiosInstance
        .get('/logo')
        .then((res) => {
            if ( res.data.success === true ) {
                const data = res.data.data;
                const logoData = data.filter((el) => el.logoType === 'NAVIGATION');

                console.log(logoData);
            }
        })
        .catch((err) => {
            if ( err.status === 401 ) {
                navigate('/expired');
            }else {
                alert('오류가 발생했습니다');
                console.log(err);
            }
        })

        axiosInstance
        .get('/sns/platform')
        .then((res) => {
            if ( res.data.success === true ) {
                const data = res.data.data;
                setData(data);
            }
        })
        .catch((err) => {
            alert('오류가 발생했습니다');
            console.log(err);
        })
    }

    useEffect(()=>{
        getData();
    }, []);

    // 파일 입력 핸들러
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 이미지 파일 체크
        if (!file.type.includes("image")) {
            alert("이미지 형식만 업로드 가능합니다.");
            return;
        }
        // 10MB 제한
        if (file.size > 10485760) {
            alert("10MB 이하의 파일만 업로드 가능합니다.");
            return;
        }
        

        // FormData 생성
        const formData = new FormData();
        formData.append("imageFile", file);

        try {
            const response = await fetch("https://minehair401.com/api/image/upload/BANNER", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`, // 토큰 필요 시
                },
            });

            if (!response.ok) {
                throw new Error("업로드 실패");
            }

            const data = await response.json();
            setClickedData({ ...clickedData, imageUrl : data.data.imageUrl });
            setSave(true);
        } catch (error) {
            console.error("에러 발생:", error);
            alert("업로드 중 에러가 발생했습니다.");
        }
    };

    /** 이미지 삭제 (폼의 imageUrl 제거) */
    const handleDeleteImageFromForm = () => {
        if ( !window.confirm('이미지를 삭제하시겠습니까?') ) return;

        setClickedData((prev) => ({ ...prev, imageUrl: "" }));
        setSave(true);
    };

    // 새로 생성
    const [ section, setSection ] = useState(false);
    function handleNewSection () {
        setSection(true);
        setDisabled(false);
        setDeleteBtn(false);
    }

    // 저장하기
    function handleSave () {
        // if ( clickedData.linkUrl === '' ) { setBalloon(1); return false; }
        // if ( clickedData.linkUrl === '' ) { setBalloon(2); return false; }
        // if ( clickedData.imageUrl === '' ) { setBalloon(3); return false; }

        if ( section === true ) {
            if ( !clickedData.imageUrl ) { setBalloon(1); return false; }
            
            axiosInstance
            .post('/logo', {
                logoType : 'NAVIGATION',
                description : '',
                imageUrl : clickedData.imageUrl,
            })
            .then((res) => { if ( res.data.success === true ) { alert('저장되었습니다'); getData(); }})
            .catch((err) => { alert('오류가 발생했습니다'); console.log(err)})
        }

        // if ( section === true ) {
        //     axiosInstance
        //     .patch(`/sns/platform/${clickedData.id}`, {
        //         logoId : clickedData.logoId,
        //         orderNo : clickedData.orderNo,
        //         imageUrl : clickedData.imageUrl,
        //         linkUrl : clickedData.linkUrl
        //     })
        //     .then((res) => { if ( res.data.success === true ) { alert('수정되었습니다'); window.location.reload(); } })
        //     .catch((err) => { alert('오류가 발생했습니다'); console.log(err) });
        // } else {
        //     axiosInstance
        //     .post('/sns/platform', {
        //         id : clickedData.id,
        //         logoId : clickedData.logoId,
        //         orderNo: clickedData.orderNo,
        //         imageUrl : clickedData.imageUrl,
        //         linkUrl : clickedData.linkUrl,
        //     })
        //     .then((res) => { if ( res.data.success === true ) { setBalloon(0); alert('저장되었습니다'); window.location.reload(); } })
        //     .catch((err) => { alert('오류가 발생했습니다'); console.log(err); })
        // }
    }

    // 클릭
    function handleClick (clickedData : DataProps) {
        setClickedData({...clickedData});
        setDisabled(false);
        setSection(true);
        setSave(false);
        setDeleteBtn(true);
        setBalloon(0);
    }

    // 삭제
    function handleDelete () {
        if ( !window.confirm('삭제하시겠습니까?') ) return;

        axiosInstance
        .delete(`/sns/platform/${clickedData.id}`)
        .then((res)=>{ if ( res.data.success === true ) { alert('삭제되었습니다'); window.location.reload(); }})
        .catch((err) => { alert('오류가 발생했습니다'); console.log(err) });
    }

    return (
        <div className="admin-page" id="admin-sns">
            <div className="admin-body inner">
                <h1 className="admin-title">SNS 플랫폼</h1>

                <button type="button" onClick={test}>tes</button>

                <div className="contents-view">
                    { logoData.length > 0 ?
                        logoData.map((el) => {
                            return (
                                <section key={el.id}>
                                    <div className="main-logo">
                                        <img src={el.imageUrl} alt="섹션 메인 로고"/>
                                    </div>
                                </section>
                            )
                        })
                    :
                        <p className="empty-notice">데이터가 없습니다.</p>
                    }
                </div>

                <form className="admin-form">
                    <input type="text" value={clickedData.id} hidden disabled/>
                    <input type="text" value={clickedData.logoId} hidden disabled/>
                    <input type="text" value={clickedData.orderNo} hidden disabled/>

                    <div className="center-menu">
                        <button className="add-btn" type="button" onClick={handleNewSection}>
                            <IconCirclePlus color="var(--color-black)" />
                            섹션 추가
                        </button>
                    </div>

                    <ul className="child-3">
                        { section === true ? 
                            <li>
                                { balloon === 1 && <Balloon text={'이미지를 등록해주세요'} status="notice" /> }
                                <span className="admin-form-title">메인 로고</span>

                                <div className="input-area">
                                    <div className="seperate-item">
                                        { clickedData.imageUrl === '' ?
                                        <>
                                            <input
                                                type="file"
                                                id="sns-logo"
                                                onChange={handleFileChange}
                                                disabled={disabled}
                                            />
                                            <label htmlFor="sns-logo">
                                                <IconUpload color="var(--color-white)" width={17} height={17} />
                                                이미지 업로드
                                            </label>
                                        </>
                                        :
                                            <a 
                                                className="image-preview"
                                                rel="noreferrer"
                                                target="_blank"
                                                href={clickedData.imageUrl}
                                            >
                                                <IconPicture color="var(--color-white)"/>
                                                <span>사진 보기</span>
                                            </a>
                                        }
                                    </div>
                                    
                                    { clickedData.imageUrl !== '' &&
                                        <button type="button" className="red-btn" disabled={disabled} onClick={handleDeleteImageFromForm}>
                                            <IconTrash color="var(--color-white)" width={17} height={17} />
                                            이미지 삭제
                                        </button>
                                    }
                                </div>
                            </li>
                        : null}
                        
                        {/* <li>
                            { balloon === 3 && <Balloon text={'링크를 입력해주세요'} status="notice" /> }
                            <span className="admin-form-title">링크</span>

                            <div className="input-area">
                                <input
                                    type="text"
                                    value={clickedData.linkUrl}
                                    onChange={(e) => { setClickedData({...clickedData, linkUrl : e.target.value}); setSave(true); }}
                                    disabled={disabled}
                                />
                            </div>
                        </li> */}

                        {/* <li>
                            { balloon === 4 && <Balloon text={'이미지를 등록해주세요'} status="notice" /> }
                            <span className="admin-form-title">이미지</span>

                            <div className="input-area">
                                <div className="seperate-item">
                                    { clickedData.imageUrl === '' ?
                                    <>
                                        <input
                                            type="file"
                                            id="event-sns-upload"
                                            onChange={handleFileChange}
                                            disabled={disabled}
                                        />
                                        <label htmlFor="event-sns-upload">
                                            <IconUpload color="var(--color-white)" width={17} height={17} />
                                            이미지 업로드
                                        </label>
                                    </>
                                    :
                                        <a 
                                            className="image-preview"
                                            rel="noreferrer"
                                            target="_blank"
                                            href={clickedData.imageUrl}
                                        >
                                            <IconPicture color="var(--color-white)"/>
                                            <span>사진 보기</span>
                                        </a>
                                    }
                                </div>
                                
                                { clickedData.imageUrl !== '' &&
                                    <button type="button" className="red-btn" disabled={disabled} onClick={handleDeleteImageFromForm}>
                                        <IconTrash color="var(--color-white)" width={17} height={17} />
                                        이미지 삭제
                                    </button>
                                }
                            </div>
                        </li> */}

                        { deleteBtn === true &&
                            <li>
                                <span className="admin-form-title">삭제하기</span>

                                <div className="input-area">
                                    <button type="button" className="red-btn" disabled={disabled} onClick={handleDelete}>
                                        <IconTrash color="var(--color-white)" width={17} height={17} />
                                        삭제하기
                                    </button>
                                </div>
                            </li>
                        }
                    </ul>
                </form>

                <div className="admin-btns">
                    <button className="blackBtn" type="button" onClick={() => navigate(-1)}>뒤로가기</button>
                    <button className="primaryBtn" type="button" disabled={!save} onClick={handleSave}>저장하기</button>
                </div>
            </div>
        </div>
    )
}

export default AdminSns;