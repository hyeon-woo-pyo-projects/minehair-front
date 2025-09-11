import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../api/axiosInstance";

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

interface SettingNavProps {
    onChangePage: (menu: MenuProps | null) => void;
}

function SettingNav({ onChangePage }: SettingNavProps) {
    const navigate = useNavigate();
    const [menu, setMenu] = useState<MenuProps[]>([]);
    const [major, setMajor] = useState<MenuProps[]>([]);
    const [minor, setMinor] = useState<MenuProps[]>([]);
    const [sub, setSub] = useState<MenuProps[]>([]);
    const [selectedMenu, setSelectedMenu] = useState<MenuProps | null>(null);

    const handleClick = (menuItem: MenuProps) => {
        setSelectedMenu(menuItem);
        onChangePage(menuItem); // 선택한 메뉴 객체를 부모로 전달
    };

    // 컨텐츠 페이지 불러오기
    function getData() {
        axiosInstance
            .get("/role-menus/admin")
            .then((res) => {
                if (res.data.success === true) {
                    const data: MenuProps[] = res.data.data;
                    const contentsPage = data.filter((el) => el.isContents === true);
                    const major = contentsPage.filter((el) => el.menuType === "MAJOR");
                    const minor = contentsPage.filter((el) => el.menuType === "MINOR");
                    const sub = contentsPage.filter((el) => el.menuType === "SUB");
                    setMenu(contentsPage);
                    setMajor(major);
                    setMinor(minor);
                    setSub(sub);
                }
            })
            .catch((err) => { if (err.status === 401) navigate("/expired"); else { alert("오류가 발생했습니다."); console.log(err); }});
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <nav className="side-nav">
            <ul>
                {major.map((el) => (
                    <li key={el.menuId}>
                        <button onClick={() => handleClick(el)}>{el.menuName}</button>

                        <div>
                            {minor
                                .filter((ele) => ele.parentId === el.menuId)
                                .map((ele) => (
                                    <div key={ele.menuId}>
                                        <button className="minor" onClick={() => handleClick(ele)}>
                                            {ele.menuName}
                                        </button>

                                        <div className="sub-wrap">
                                            {sub
                                                .filter((elm) => elm.parentId === ele.menuId)
                                                .map((elm) => (
                                                    <button
                                                        className="sub"
                                                        onClick={() => handleClick(elm)}
                                                        key={elm.menuId}
                                                    >
                                                        {elm.menuName}
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </li>
                ))}
            </ul>

            <div className="side-footer">
                <button type="button" className="blackBtn" onClick={() => { navigate(-1); }}>뒤로가기</button>
            </div>
        </nav>
    );
}

export default SettingNav;
