import AdminWidget from "../layouts/AdminWidget";
import {
    DndContext,
    closestCenter,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
} from "@dnd-kit/core";
import {
    useSortable,
    SortableContext,
    arrayMove,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import IconCirclePlus from "../../../icons/IconCirclePlus";
import IconPencil from "../../../icons/IconPencil";
import IconTrash from "../../../icons/IconTrash";

import "../../../style/admin/admin.css";
import axiosInstance from "../../../api/axiosInstance";
import { useEffect, useState } from "react";
import IconUpload from "../../../icons/IconUpload";

interface MenuProps {
    id : number,
    imageUrl : string,
    menuId : number,
    menuName : string,
    newPath : string,
    menuOrderNo : number,
    menuPath : string,
    menuType : string,
    menuVisible : boolean,
    parentId : number,
    status : string
}

function AdminCategory2 () {
    // 각 메뉴
    const [ wholeMenu, setWholeMenu ] = useState<MenuProps[]>([]);
    const [ majorMenu, setMajorMenu ] = useState<MenuProps[]>([]);
    const [ minorMenu, setMinorMenu ] = useState<MenuProps[]>([]);
    const [ subMenu, setSubMenu ] = useState<MenuProps[]>([]);

    // API 호출
    function getMenu () {
        axiosInstance
        .get('/role-menus')
        .then((response)=>{
            if ( response.data.success === true ) {
                const wholeMenu = response.data.data;
                const majorMenu = wholeMenu.filter((data) => data.menuType === 'MAJOR' && data.parentId === null );
                const minorMenu = wholeMenu.filter((data) => data.menuType === 'MINOR' && data.parentId !== null );
                const subMenu = wholeMenu.filter((data) => data.menuType === 'SUB' && data.parentId !== null );

                console.log(wholeMenu)
                // 데이터 담기
                setWholeMenu(wholeMenu);
                setMajorMenu(majorMenu);
                setMinorMenu(minorMenu);
                setSubMenu(subMenu);
            }
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    // 순서 변경 버튼
    const [ changeMenu, setChangeMenu ] = useState(false);
    function handleMenuChange () {
        setChangeMenu(!changeMenu)
    }

    // 메뉴 클릭 시 이벤트
    const [ selectedMenu, setSelectedMenu ] = useState<MenuProps | null>(null);

    function menuClicked (menu : MenuProps) {
        setSelectedMenu(menu);
    }

    // 폼 값
    const [ form, setForm ] = useState({
        menuName : '새 메뉴',
        menuPath : '',
        newPath : '',
        menuVisible : true,
        menuType : '',
        selection01 : '',
        selection02 : '',
        selection03 : '',
        imageUrl : ''
    });

    useEffect(() => {
        if (selectedMenu) {
            // newPath 세팅
            const getPath = selectedMenu.menuPath.split('/');
            let newPath = '';
            if (selectedMenu.menuType === 'MAJOR') newPath = getPath[1];
            else if (selectedMenu.menuType === 'MINOR') newPath = getPath[2];
            else if (selectedMenu.menuType === 'SUB') newPath = getPath[3];

            setForm({
                menuName: selectedMenu.menuName ?? '',
                menuPath: selectedMenu.menuPath ?? '',
                newPath : newPath,
                menuVisible: selectedMenu.menuVisible ?? true,
                menuType: selectedMenu.menuType ?? '',
                selection01 : '',
                selection02 : '',
                selection03 : '',
                imageUrl: selectedMenu.imageUrl ?? '',
            });
        }
    }, [selectedMenu]);

    useEffect(()=>{
        getMenu();
    }, [])

    return (
        <div className="admin-page menu-category">
            <AdminWidget title="헤더 메뉴" />

            <div className="admin-body wrapper">
                <div className="admin-body-header">
                    <p className="pulblish-status active">{ changeMenu ?  '순서 변경 모드 (메뉴를 드래그 해주세요)' : '메뉴 입력 모드 (메뉴를 클릭해주세요)' }</p>
                    

                    <div className="publish">
                        <label htmlFor="publish-toggle">모드변경</label>
                        <button
                            id="publish-toggle"
                            className ={ changeMenu ? 'publish-btn active' : 'publish-btn' }
                            onClick={handleMenuChange}
                        >
                            <i className="ball"></i>
                        </button>
                    </div>
                </div>
                
                <div className="menu-bar">
                    {/* 대메뉴 세팅 */}
                    { majorMenu.map((major) => (
                        <ul key={major.id}>
                            <li className="top-menu" key={major.id + '-top'}>
                                <div className="bar-contents">
                                    <button type="button" onClick={()=>{menuClicked(major)}}>{major.menuName}</button>
                                </div>
                            </li>

                            {/* 중메뉴 세팅 */}
                            { minorMenu.map((minor) => (
                                major.menuId === minor.parentId ?
                                    <div className="middle-menu" key={minor.id}>
                                        <div className="bar-contents children">
                                            <button type="button" onClick={()=>{menuClicked(minor)}}>{minor.menuName}</button>
                                        </div>

                                        {/* 소메뉴 세팅 */}
                                        { subMenu.map((sub) => (
                                            minor.menuId === sub.parentId ?
                                                <li className="bottom-menu" key={sub.id}>
                                                    <div className="bar-contents grandChild">
                                                        <button type="button" onClick={()=>{menuClicked(sub)}}>{sub.menuName}</button>
                                                    </div>
                                                </li>
                                            : null
                                        ))}
                                    </div>
                                : null
                            ))}
                        </ul>
                    ))}
                </div>

                <form className="admin-form" id="menu-category-form">
                    <div className="center-menu">
                        <button
                            type="button"
                            className="add-btn"
                        >
                            <IconCirclePlus color="var(--color-black)" />
                            메뉴 생성
                        </button>
                    </div>

                    <ul>
                        <li>
                            <span className="admin-form-title">메뉴 이름</span>
                            <div className="input-area">
                                <input
                                    id="menuName"
                                    type="text"
                                    placeholder="메뉴 이름"
                                    value={ form.menuName }
                                    onChange={(e) => {
                                        setForm((prev) => ({
                                            ...prev,
                                            menuName : e.target.value
                                        }));
                                    }}
                                />
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">링크명</span>
                            <div className="input-area">
                                <input
                                    id="menuPath"
                                    type="text"
                                    placeholder="링크명"
                                    value={ form.newPath }
                                    onChange={(e) => {
                                        setForm((prev) => ({
                                            ...prev,
                                            newPath : e.target.value
                                        }));
                                    }}
                                />
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">노출 설정</span>
                            <div className="input-area">
                                <select name="category-form" id="menuVisible">
                                    <option value="">노출</option>
                                    <option value="">숨김</option>
                                </select>
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">노출 권한</span>
                            <div className="input-area">
                                <div className="checkboxs">
                                    <div className="checkbox-child">
                                        <input type="checkbox" id="all"/>
                                        <label htmlFor="all">전체</label>
                                    </div>

                                    <div className="checkbox-child">
                                        <input type="checkbox" id="member"/>
                                        <label htmlFor="member">회원</label>
                                    </div>

                                    <div className="checkbox-child">
                                        <input type="checkbox" id="admin"/>
                                        <label htmlFor="admin">관리자</label>
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">메뉴 구분</span>
                            <div className="input-area">
                                <select
                                    name="category-form"
                                    id="menu-division"
                                    onChange={(e)=>{
                                        setForm((prev) => ({
                                            ...prev,
                                            selection01 : e.target.value
                                        }));
                                    }}
                                >
                                    <option value="">선택</option>
                                    <option value="MAJOR">대메뉴</option>
                                    <option value="MINOR">중메뉴</option>
                                    <option value="SUB">소메뉴</option>
                                </select>
                            </div>
                        </li>

                        {form.selection01 === 'MINOR' || form.selection01 === 'SUB' ? 
                            <li>
                                <span className="admin-form-title">최상위 메뉴</span>
                                <div className="input-area">
                                    <select
                                        name="category-form"
                                        id="menu-major"
                                        onChange={(e)=>{
                                            setForm((prev) => ({
                                                ...prev,
                                                selection02 : e.target.value
                                            }));
                                        }}
                                    >
                                        { majorMenu.map((data) => (
                                            <option value={data.menuId}>{data.menuName}</option>
                                        ))}
                                    </select>
                                </div>
                            </li>
                        : null}
                        
                        { form.selection01 === 'SUB' ? 
                            <li>
                                <span className="admin-form-title">상위 메뉴</span>
                                <div className="input-area">
                                    <select 
                                        name="category-form" 
                                        id="menu-minor"
                                        onChange={(e)=>{
                                            setForm((prev) => ({
                                                ...prev,
                                                selection03 : e.target.value
                                            }));
                                        }}
                                    >
                                        { minorMenu.map((data) => (
                                            Number(form.selection02) === data.parentId ?
                                                <option value={data.menuId}>{data.menuName}</option>
                                            :
                                                <option value={data.menuId} hidden>생성된 상위 메뉴가 없습니다.</option>
                                        ))}
                                    </select>
                                </div>
                            </li>
                        : null }
                        
                        <li>
                            <span className="admin-form-title">메뉴</span>
                            <div className="input-area">
                                <div className="image-upload">
                                    <input type="file" id="image-upload"/>
                                    <label htmlFor="image-upload">
                                        <IconUpload color="var(--color-white)" />
                                        이미지 업로드
                                    </label>
                                
                                </div>

                                <button type="button" className="blackBtn">
                                    <IconTrash color="var(--color-white)" />
                                    삭제하기
                                </button>
                            </div>
                        </li>
                    </ul>
                </form>
            </div>
        </div>
    )
}

export default AdminCategory2;