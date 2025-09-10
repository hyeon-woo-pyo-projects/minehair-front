import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { id } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import MapDummy from "./MapDummy";

interface MenuProps {
    id: number;
    menuId: number;
    parentId: number;
    menuName: string;
    menuPath: string;
    imageUrl: string;
    menuVisible: boolean;
    menuType: string;
    menuOrderNo: number;
    roleIdList: number[];
    isContents: boolean;
}

interface PageDummyProps {
    selectedMenu: MenuProps | null;
}

interface ContentsProps {
    id: number,
    menuId : number,
    orderNo : number,
    pageUrl : string,
    contentsType : string,
    contentsUrl : string,
    videoBackGroundUrl : string,
    consultingBackGroundUrl : string,
}

function PageDummy({ selectedMenu }: PageDummyProps) {
    const navigate = useNavigate();
    const dataId = selectedMenu?.menuId || 1;
    const [ data, setData ] = useState({
        id: 0,
        menuId : 0,
        orderNo : 0,
        pageUrl : '',
        contentsType : '',
        contentsUrl : '',
        videoBackGroundUrl : '',
        consultingBackGroundUrl : '',
    })

    function getId(){
        axiosInstance
        .get(`/page/contents/${dataId}`)
        .then((res) => {
            if ( res.data.success === true ) {
                const data = res.data.data;
                setData({
                    id: data.id,
                    menuId : data.menuId,
                    orderNo : data.orderNo,
                    pageUrl : data.pageUrl,
                    contentsType : data.contentsType,
                    contentsUrl : data.contentsUrl,
                    videoBackGroundUrl : data.videoBackGroundUrl,
                    consultingBackGroundUrl : data.consultingBackGroundUrl,
                })
            }
        })
        .catch((err) => { if ( err.status === 401 ) navigate('/expired'); else { alert('오류가 발생했습니다'); console.log(err);} })
    }

    useEffect(() => {
        getId();
    },[dataId])
    return (
        <div className="page">
            {selectedMenu ? (
                <div>
                    <h3>{selectedMenu.menuName}</h3>
                    <p>Path: {selectedMenu.menuPath}</p>
                    <p>Type: {selectedMenu.menuType}</p>
                    {/* 필요하면 더 많은 필드 출력하거나 폼으로 표시 */}
                </div>
            ) : (
                <div>좌측 네비게이션에서 페이지를 선택하세요.</div>
            )}

            <MapDummy/>
        </div>
    );
}

export default PageDummy;
