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
    menuVisible : string,
    parentId : number,
    status : string,
    apiUrl : string,
    call : string,
}

interface SaveProps {
    parentId : number,
    menuName : string,
    menuPath : string,
    imageUrl : string,
    isVisible : true,
    menuType : string,
    orderNo : 0,
    roles : [
        0
    ],
    apiUrl : string,
    call : string
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
        setDisabled(false)
    }

    // 폼 값
    const initialForm = {
        id : 0,
        menuName : '새 메뉴',
        menuPath : '',
        newPath : '',
        menuVisible : 'true',
        menuType : '',
        selection01 : '',
        selection02 : '',
        selection03 : '',
        imageUrl : ''
    }
    const [ form, setForm ] = useState(initialForm);
    
    useEffect(() => {
        if (selectedMenu) {
            const getPath = selectedMenu.menuPath.split('/');
            let newPath = '';
            if (selectedMenu.menuType === 'MAJOR') newPath = getPath[1];
            else if (selectedMenu.menuType === 'MINOR') newPath = getPath[2];
            else if (selectedMenu.menuType === 'SUB') newPath = getPath[3];

            // 부모 메뉴 id 할당용 변수
            let selection02 = '';
            let selection03 = '';

            if (selectedMenu.menuType === 'MINOR') {
                selection02 = selectedMenu.parentId?.toString() ?? '';
            }
            if (selectedMenu.menuType === 'SUB') {
                // 소메뉴인 경우 상위 메뉴는 parentId, 최상위 메뉴는 부모 메뉴(중메뉴)의 parentId
                selection03 = selectedMenu.parentId?.toString() ?? '';

                // 소메뉴의 부모(중메뉴)를 찾아서 그 부모Id를 최상위 메뉴로 넣기
                const parentMinor = minorMenu.find((m) => m.menuId === selectedMenu.parentId);
                selection02 = parentMinor?.parentId?.toString() ?? '';
            }

            setForm({
                id : selectedMenu.id ?? '',
                menuName: selectedMenu.menuName ?? '',
                menuPath: selectedMenu.menuPath ?? '',
                newPath: newPath,
                menuVisible: selectedMenu.menuVisible ?? 'true',
                menuType: selectedMenu.menuType ?? '',
                selection01: selectedMenu.menuType ?? '',
                selection02: selection02,
                selection03: selection03,
                imageUrl: selectedMenu.imageUrl ?? '',
            });
        }
    }, [selectedMenu, minorMenu]);

    // 상태 변경
    const [ save, setSave ] = useState(false);
    const [ saveForm, setSaveForm ] = useState<SaveProps | null>(null);
    const [ disabled, setDisabled ] = useState(true);
    
    function handleFormChange(changes: Partial<typeof form>) {
        setSave(true);
        
        setForm((prev) => {
            const updatedForm = { ...prev, ...changes };

            // 메뉴 이름이 바뀌면 wholeMenu도 업데이트
            if (changes.menuName && selectedMenu) {
                setWholeMenu((prevWholeMenu) =>
                    prevWholeMenu.map((menu) =>
                    menu.menuId === selectedMenu.menuId
                        ? { ...menu, menuName: changes.menuName! }
                        : menu
                    )
                );

                // selectedMenu도 같이 업데이트
                setSelectedMenu((prev) =>
                    prev ? { ...prev, menuName: changes.menuName! } : prev
                );
            }

            return updatedForm;
        });
    }

    useEffect(()=>{
        getMenu();
    }, []);

    return (
        <div className="admin-page menu-category">
            <AdminWidget<SaveProps> title="헤더 메뉴" status={save} saveData={saveForm} />

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
                            onClick={() => {
                                setForm(initialForm);
                                setSelectedMenu(null);
                                setDisabled(false);
                            }}
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
                                    onChange={(e) => handleFormChange({ menuName: e.target.value })}
                                    disabled={disabled}
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
                                    onChange={(e) => handleFormChange({ newPath: e.target.value })}
                                    disabled={disabled}
                                />
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">노출 설정</span>
                            <div className="input-area">
                                <select
                                    name="category-form"
                                    id="menuVisible"
                                    onChange={(e) => handleFormChange({ menuVisible: e.target.value })}
                                    disabled={disabled}
                                >
                                    <option value="true">노출</option>
                                    <option value="false">숨김</option>
                                </select>
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">노출 권한</span>
                            <div className="input-area">
                                <div className="checkboxs">
                                    <div className="checkbox-child">
                                        <input type="checkbox" id="all" disabled={disabled}/>
                                        <label htmlFor="all">전체</label>
                                    </div>

                                    <div className="checkbox-child">
                                        <input type="checkbox" id="member" disabled={disabled}/>
                                        <label htmlFor="member">회원</label>
                                    </div>

                                    <div className="checkbox-child">
                                        <input type="checkbox" id="admin" disabled={disabled}/>
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
                                    value={form.selection01}
                                    onChange={(e) => handleFormChange({ selection01: e.target.value })}
                                    disabled={disabled}
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
                                        value={form.selection02}
                                        onChange={(e) => handleFormChange({ selection02: e.target.value })}
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
                                        value={form.selection03}
                                        onChange={(e) => handleFormChange({ selection03: e.target.value })}
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