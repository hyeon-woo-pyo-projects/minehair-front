import { useState } from "react";
import SettingNav from "./setting/SettingNav";
import SettingContents from "./setting/SettingContents";

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

function SettingPage() {
    const [selectedMenu, setSelectedMenu] = useState<MenuProps | null>(null);

    return (
        <div className="admin-page" id="page-setting">
            <div className="admin-page navigator">
                <div className="nav-area">
                    <SettingNav onChangePage={setSelectedMenu} />
                </div>

                <div className="contents-area">
                    <SettingContents selectedMenu={selectedMenu} />
                </div>
            </div>
        </div>
    );
}

export default SettingPage;
