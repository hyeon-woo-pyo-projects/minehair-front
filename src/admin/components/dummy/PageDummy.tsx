import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { id } from "date-fns/locale";
import { useLocation, useNavigate } from "react-router-dom";
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
    onClickItem: (data: ContentsProps) => void;
}

interface ContentsProps {
    menuId : number,
    pageUrl : string,
    contentsType : string,
    contentsUrl : string,
}

function PageDummy({ selectedMenu, onClickItem }: PageDummyProps) {
    const navigate = useNavigate();
    const dataId = selectedMenu?.menuId || 1;
    const [data, setData] = useState<ContentsProps[]>([]);

    const getId = () => {
        axiosInstance
            .get(`/page/contents/${dataId}`)
            .then((res) => {
                if (res.data.success === true) setData(res.data.data);
            })
            .catch((err) => {
                if (err.status === 401) navigate("/expired");
                else { alert("오류가 발생했습니다"); console.log(err); }
            });
    };

    useEffect(() => { getId(); }, [dataId]);

    return (
        <div className="page">
            {data.length > 0 ? (
                data.map((el, index) => (
                    <section
                        key={index}
                        className="page-section"
                        onClick={() => onClickItem(el)} // 상위로 전달
                    >
                        {el.contentsType === "IMAGE" &&
                            <div className="img-section"><img src={el.contentsUrl} alt="이미지"/></div>
                        }
                    </section>
                ))
            ) : (
                <div className="empty-notice">데이터가 없습니다.</div>
            )}
        </div>
    );
}


export default PageDummy;
