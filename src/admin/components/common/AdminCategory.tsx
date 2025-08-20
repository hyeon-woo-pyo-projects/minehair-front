import React, { useEffect, useState } from "react";
import { SaveOptions } from "../../../components/common/UseSave";
import {
    DndContext,
    closestCenter,
    DragEndEvent,
    DragOverEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    useSortable,
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import axiosInstance from "../../../api/axiosInstance";

import IconCirclePlus from "../../../icons/IconCirclePlus";
import IconUpload from "../../../icons/IconUpload";
import IconTrash from "../../../icons/IconTrash";

import "../../../style/admin/admin.css";
import { useNavigate } from "react-router-dom";

interface MenuProps {
    menuId: number;
    menuName: string;
    newPath: string;
    menuPath: string; 
    menuOrderNo: number; // 순서
    menuType: "MAJOR" | "MINOR" | "SUB" | string;
    menuVisible: "true" | "false" | string;
    parentId: number | null;
    imageUrl?: string;
    roles : []
}

/** Sortable wrapper */
function SortableItem({
    id,
    disabled,
    children,
}: {
    id: number | string;
    disabled: boolean;
    children: React.ReactNode;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: disabled ? "default" : "grab",
        zIndex: isDragging ? 9999 : undefined,
        boxShadow: isDragging ? "0 10px 20px rgba(0,0,0,0.15)" : undefined,
        borderRadius: isDragging ? 4 : undefined,
        backgroundColor: isDragging ? "#fff" : undefined,
        position: isDragging ? ("relative" as React.CSSProperties["position"]) : undefined,
    };

    return (
        <div ref={setNodeRef} style={style} {...(!disabled ? { ...attributes, ...listeners } : {})}>
            {children}
        </div>
    );
}

function AdminCategory() {
    const [ save, setSave ] = useState(false);
    const navigate = useNavigate();

    // 전체 raw 메뉴 (서버에서 받은)
    const [wholeMenu, setWholeMenu] = useState<MenuProps[]>([]);

    // 분류별 메뉴
    const [majorMenu, setMajorMenu] = useState<MenuProps[]>([]);
    const [minorMenu, setMinorMenu] = useState<MenuProps[]>([]);
    const [subMenu, setSubMenu] = useState<MenuProps[]>([]);

    // 드래그용 정렬 상태 (렌더 순서 제어)
    const [majorMenuSorted, setMajorMenuSorted] = useState<MenuProps[]>([]);
    const [minorMenuSorted, setMinorMenuSorted] = useState<MenuProps[]>([]);
    const [subMenuSorted, setSubMenuSorted] = useState<MenuProps[]>([]);

    const [changeMenu, setChangeMenu] = useState(false); // 모드: 수정 or 순서변경
    const [selectedMenu, setSelectedMenu] = useState<MenuProps | null>(null);

    const initialForm = {
        menuName: "새 메뉴",
        menuPath: "",
        newPath: "",
        menuVisible: "true",
        menuType: "",
        selection01: "",
        selection02: "",
        selection03: "",
        imageUrl: "",
        roles: []
    };
    const [form, setForm] = useState<typeof initialForm>(initialForm);
    const [disabled, setDisabled] = useState(true);

    // 이미지 파일을 임시로 가지고 있을 경우 (업로드용)
    const [imageFile, setImageFile] = useState<File | null>(null);

    // DnD sensors
    const sensors = useSensors(useSensor(PointerSensor));

    // 메뉴 불러오기
    useEffect(() => {
        fetchMenu();
    }, []);

    function fetchMenu() {
        axiosInstance
        .get('role-menus/admin')
        .then((result)=>{
            if ( result.data.success === true ) {
                const data = result.data.data;
                console.log(data)

                const majors = data.filter((el) => el.menuType === 'MAJOR' );
                const minors = data.filter((el) => el.menuType === 'MINOR' );
                const subs = data.filter((el) => el.menuType === 'SUB' );

                setWholeMenu(data);
                setMajorMenu(majors);
                setMinorMenu(minors);
                setSubMenu(subs);

                setMajorMenuSorted(majors);
                setMinorMenuSorted(minors);
                setSubMenuSorted(subs);
            }
        })
        .catch((err)=>{
            alert('오류가 발생했습니다');
            console.log(err);
        })
    }

    // selectedMenu가 변경되면 form 초기화
    useEffect(() => {
        if (selectedMenu) {
            const getPath = selectedMenu.menuPath ? selectedMenu.menuPath.split("/") : [];
            let newPath = "";
            if (selectedMenu.menuType === "MAJOR") newPath = getPath[1] ?? "";
            else if (selectedMenu.menuType === "MINOR") newPath = getPath[2] ?? "";
            else if (selectedMenu.menuType === "SUB") newPath = getPath[3] ?? "";

            let selection02 = "";
            let selection03 = "";

            if (selectedMenu.menuType === "MINOR") {
                selection02 = selectedMenu.parentId?.toString() ?? "";
            }
            if (selectedMenu.menuType === "SUB") {
                selection03 = selectedMenu.parentId?.toString() ?? "";
                const parentMinor = minorMenu.find((m) => m.menuId === selectedMenu.parentId);
                selection02 = parentMinor?.parentId?.toString() ?? "";
            }

            setForm({
                menuName: selectedMenu.menuName ?? "",
                menuPath: selectedMenu.menuPath ?? "",
                newPath,
                menuVisible: selectedMenu.menuVisible ?? "true",
                menuType: selectedMenu.menuType ?? "",
                selection01: selectedMenu.menuType ?? "",
                selection02,
                selection03,
                imageUrl: selectedMenu.imageUrl ?? "",
                roles : selectedMenu.roles
            });
        } else {
            setForm(initialForm);
        }
    }, [selectedMenu, minorMenu]);

    function handleMenuChangeMode() {
        setChangeMenu((prev) => !prev);
    }

    function menuClicked(menu: MenuProps) {
        setSelectedMenu(menu);
        setDisabled(false);
        setSave(false);
        setImageFile(null);
    }

    function handleFormChange(changes: Partial<typeof form>) {
        setForm((prev) => ({ ...prev, ...changes }));
        setSave(true);
    }

    /** 이미지 파일 선택 */
    function handleImageSelect(file: File | null) {
        setImageFile(file);
        setSave(true);
    }

    /** 드래그 오버 (중간에 위치 변경 보이기 용) */
    function handleDragOver(event: DragOverEvent, level: "major" | "minor" | "sub", parentMenuId?: number) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        if (level === "major") {
            const oldIndex = majorMenuSorted.findIndex((item) => item.menuId === active.id);
            const newIndex = majorMenuSorted.findIndex((item) => item.menuId === over.id);
            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                setMajorMenuSorted(arrayMove(majorMenuSorted, oldIndex, newIndex));
            }
        }

        if (level === "minor") {
            const filtered = minorMenuSorted.filter((m) => m.parentId === parentMenuId);
            const other = minorMenuSorted.filter((m) => m.parentId !== parentMenuId);
            const oldIndex = filtered.findIndex((item) => item.menuId === active.id);
            const newIndex = filtered.findIndex((item) => item.menuId === over.id);
            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                const newFiltered = arrayMove(filtered, oldIndex, newIndex);
                setMinorMenuSorted([...other, ...newFiltered]);
            }
        }

        if (level === "sub") {
            const filtered = subMenuSorted.filter((m) => m.parentId === parentMenuId);
            const other = subMenuSorted.filter((m) => m.parentId !== parentMenuId);
            const oldIndex = filtered.findIndex((item) => item.menuId === active.id);
            const newIndex = filtered.findIndex((item) => item.menuId === over.id);
            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                const newFiltered = arrayMove(filtered, oldIndex, newIndex);
                setSubMenuSorted([...other, ...newFiltered]);
            }
        }
    }

    /** 드래그 끝났을 때 */
    function handleDragEnd(event: DragEndEvent, level: "major" | "minor" | "sub", parentMenuId?: number) {
        setSave(true);
    }
    
    const saveOrderChanges = async (): Promise<boolean> => {
        try {
            const updates: { 
                menuId: number; 
                menuOrderNo: number;
            }[] = [];
            
            majorMenuSorted.forEach((m, idx) => {
                const newOrder = idx + 1;
                if (m.menuOrderNo !== newOrder) updates.push({ menuId: m.menuId, menuOrderNo: newOrder });
            });
            
            const minorByParent = new Map<number, MenuProps[]>();
            minorMenuSorted.forEach((m) => {
                if (m.parentId == null) return;
                const arr = minorByParent.get(m.parentId) ?? [];
                arr.push(m);
                minorByParent.set(m.parentId, arr);
            });
            minorByParent.forEach((list) => {
                list.forEach((m, idx) => {
                    const newOrder = idx + 1;
                    if (m.menuOrderNo !== newOrder) updates.push({ menuId: m.menuId, menuOrderNo: newOrder });
                });
            });
            
            const subByParent = new Map<number, MenuProps[]>();
            subMenuSorted.forEach((m) => {
                if (m.parentId == null) return;
                const arr = subByParent.get(m.parentId) ?? [];
                arr.push(m);
                subByParent.set(m.parentId, arr);
            });
            subByParent.forEach((list) => {
                list.forEach((m, idx) => {
                    const newOrder = idx + 1;
                    if (m.menuOrderNo !== newOrder) updates.push({ menuId: m.menuId, menuOrderNo: newOrder });
                });
            });

            if (updates.length === 0) return true;

            await Promise.all(
                updates.map((u) =>
                    axiosInstance.patch(`/role-menus/${u.menuId}`, {
                        menuOrderNo: u.menuOrderNo,
                    })
                )
            );

            await fetchMenu();
            return true;
        } catch (err) {
            console.error("순서 저장 실패", err);
            alert("메뉴 순서 저장 중 오류가 발생했습니다.");
            return false;
        }
    };
    const handleBeforeSave = async (): Promise<boolean> => {
        // 1) 순서 변경이 있는지 판단: saveFlag가 true이고, 순서 관련 상태가 변경되었으면 서버에 반영
        // 여기서는 단순히 항상 saveOrderChanges를 호출해서 변경이 있으면 반영하도록 함.
        const ok = await saveOrderChanges();
        return ok;
    };

    /** Admin form에서 '메뉴 생성' 버튼 동작 (새 메뉴로 폼 초기화) */
    const handleCreateNew = () => {
        setForm(initialForm);
        setSelectedMenu(null);
        setDisabled(false);
        setSave(true);
    };

    /** 이미지 삭제 (폼의 imageUrl 제거) */
    const handleDeleteImageFromForm = () => {
        setForm((prev) => ({ ...prev, imageUrl: "" }));
        setImageFile(null);
        setSave(true);
    };

    // 전체 선택
    const [ checkers, setCheckers ] = useState({
        selector01 : false,
        selector02 : false,
        selector03 : false,
    })

    const allCheck = (chk : boolean) => {
        setCheckers({
            selector01: chk,
            selector02: chk,
            selector03: chk,
        })
    }

    function saveHandle () {
        console.log(form)
        // if ( saveData !== null ) {
        //     const menuId = saveData.menuId;

        //     console.log(saveData);

        //     axiosInstance
        //     .patch(`/role-menus/${menuId}`)
        //     .then((result)=>{
        //         alert('저장이 완료되었습니다!');
        //         setSave(false);
        //     })
        //     .catch((err)=>{
        //         alert('오류가 발생했습니다.');
        //         console.log(err);
        //     })
        // }
    }

    return (
        <div className="admin-page menu-category">
            <div className="admin-body wrapper">
                <h1 className="admin-title">헤더 메뉴</h1>

                <div className="admin-body-header">
                    <p className="pulblish-status active">
                        {changeMenu ? "순서 변경 모드 (메뉴를 드래그 해주세요)" : "메뉴 입력 모드 (메뉴를 클릭해주세요)"}
                    </p>
                    <div className="publish">
                        <label htmlFor="publish-toggle">모드변경</label>
                        <button
                            id="publish-toggle"
                            className={changeMenu ? "publish-btn active" : "publish-btn"}
                            onClick={handleMenuChangeMode}
                        >
                            <i className="ball"></i>
                        </button>
                    </div>
                </div>

                <div className="menu-bar">
                    {/* 대메뉴 DnD 컨텍스트 */}
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragOver={(e) => handleDragOver(e, "major")} onDragEnd={(e) => handleDragEnd(e, "major")}>
                        <SortableContext items={majorMenuSorted.map((m) => m.menuId)} strategy={verticalListSortingStrategy}>
                            {majorMenuSorted.map((major) => (
                                <ul key={major.menuId}>
                                    <SortableItem id={major.menuId} disabled={!changeMenu}>
                                        <li className="top-menu">
                                            <div className="bar-contents">
                                                <button type="button" onClick={() => menuClicked(major)} disabled={changeMenu}>
                                                    {major.menuName}
                                                </button>
                                            </div>
                                        </li>
                                    </SortableItem>

                                    {/* 중메뉴 컨텍스트 (각 major별) */}
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragOver={(e) => handleDragOver(e, "minor", major.menuId)}
                                        onDragEnd={(e) => handleDragEnd(e, "minor", major.menuId)}
                                    >
                                        <SortableContext items={minorMenuSorted.filter((m) => m.parentId === major.menuId).map((m) => m.menuId)} strategy={verticalListSortingStrategy}>
                                            {minorMenuSorted
                                                .filter((minor) => minor.parentId === major.menuId)
                                                .map((minor) => (
                                                    <div key={minor.menuId}>
                                                        <SortableItem id={minor.menuId} disabled={!changeMenu}>
                                                            <li className="middle-menu">
                                                                <div className="bar-contents children">
                                                                    <button type="button" onClick={() => menuClicked(minor)} disabled={changeMenu}>
                                                                        {minor.menuName}
                                                                    </button>
                                                                </div>
                                                            </li>
                                                        </SortableItem>

                                                        {/* 소메뉴 컨텍스트 (각 minor별) */}
                                                        <DndContext
                                                            sensors={sensors}
                                                            collisionDetection={closestCenter}
                                                            onDragOver={(e) => handleDragOver(e, "sub", minor.menuId)}
                                                            onDragEnd={(e) => handleDragEnd(e, "sub", minor.menuId)}
                                                        >
                                                            <SortableContext items={subMenuSorted.filter((s) => s.parentId === minor.menuId).map((s) => s.menuId)} strategy={verticalListSortingStrategy}>
                                                                {subMenuSorted
                                                                    .filter((sub) => sub.parentId === minor.menuId)
                                                                    .map((sub) => (
                                                                        <SortableItem id={sub.menuId} key={sub.menuId} disabled={!changeMenu}>
                                                                            <li className="bottom-menu">
                                                                                <div className="bar-contents grandChild">
                                                                                    <button type="button" onClick={() => menuClicked(sub)} disabled={changeMenu}>
                                                                                        {sub.menuName}
                                                                                    </button>
                                                                                </div>
                                                                            </li>
                                                                        </SortableItem>
                                                                    ))}
                                                            </SortableContext>
                                                        </DndContext>
                                                    </div>
                                                ))}
                                        </SortableContext>
                                    </DndContext>
                                </ul>
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>

                <form className="admin-form" id="menu-category-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="center-menu">
                        <button
                            type="button"
                            className="add-btn"
                            onClick={handleCreateNew}
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
                                    value={form.menuName}
                                    disabled={disabled}
                                    onChange={(e) => { handleFormChange({ menuName: e.target.value }); }}
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
                                    value={form.menuPath} 
                                    disabled={disabled} 
                                    onChange={(e) => { handleFormChange({ menuPath: e.target.value }); }} 
                                />
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">노출 설정</span>
                            <div className="input-area">
                                <select name="category-form" id="menuVisible" value={form.menuVisible} onChange={(e) => handleFormChange({ menuVisible: e.target.value })} disabled={disabled}>
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
                                        <input type="checkbox" id="all" checked={checkers.selector01 && checkers.selector02 && checkers.selector03} onChange={(e) => allCheck(e.target.checked)} disabled={disabled}/>
                                        <label htmlFor="all">전체</label>
                                    </div>

                                    <div className="checkbox-child">
                                        <input type="checkbox" id="visit" disabled={disabled} checked={checkers.selector01} onChange={(e) => setCheckers(prev => ({...prev, selector01: e.target.checked}))}/>
                                        <label htmlFor="visit">비회원</label>
                                    </div>

                                    <div className="checkbox-child">
                                        <input type="checkbox" id="member" disabled={disabled}  checked={checkers.selector02} onChange={(e) => setCheckers(prev => ({...prev, selector02: e.target.checked}))}/>
                                        <label htmlFor="member">회원</label>
                                    </div>

                                    <div className="checkbox-child">
                                        <input type="checkbox" id="admin" disabled={disabled}  checked={checkers.selector03} onChange={(e) => setCheckers(prev => ({...prev, selector03: e.target.checked}))}/>
                                        <label htmlFor="admin">관리자</label>
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">메뉴 구분</span>
                            <div className="input-area">
                                <select id="menu-division" value={form.selection01} onChange={(e) => handleFormChange({ selection01: e.target.value })} disabled={disabled}>
                                    <option value="">선택</option>
                                    <option value="MAJOR">대메뉴</option>
                                    <option value="MINOR">중메뉴</option>
                                    <option value="SUB">소메뉴</option>
                                </select>
                            </div>
                        </li>

                        {(form.selection01 === "MINOR" || form.selection01 === "SUB") && (
                            <li>
                                <span className="admin-form-title">최상위 메뉴</span>
                                <div className="input-area">
                                    <select id="menu-major" value={form.selection02} onChange={(e) => handleFormChange({ selection02: e.target.value })} disabled={disabled}>
                                        <option value="">선택</option>
                                        {majorMenu.map((data) => (
                                            <option key={data.menuId} value={data.menuId}>
                                                {data.menuName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </li>
                        )}

                        {form.selection01 === "SUB" && (
                            <li>
                                <span className="admin-form-title">상위 메뉴</span>
                                <div className="input-area">
                                    <select id="menu-minor" value={form.selection03} onChange={(e) => handleFormChange({ selection03: e.target.value })} disabled={disabled}>
                                        <option value="">선택</option>
                                        {minorMenu
                                            .filter((data) => Number(form.selection02) === data.parentId)
                                            .map((data) => (
                                                <option key={data.menuId} value={data.menuId}>
                                                    {data.menuName}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </li>
                        )}

                        { form.selection01 === 'MAJOR' ? 
                            <li>
                                <span className="admin-form-title">메뉴 이미지</span>
                                <div className="input-area">
                                    <div className="image-upload">
                                        <input type="file" id="image-upload" disabled={disabled} onChange={(e) => { if (e.target.files && e.target.files[0]) handleImageSelect(e.target.files[0]); }} />
                                        <label htmlFor="image-upload">
                                            <IconUpload color="var(--color-white)" />
                                            이미지 업로드
                                        </label>
                                    </div>
                                    <button type="button" className="blackBtn" disabled={disabled} onClick={handleDeleteImageFromForm}>
                                        <IconTrash color="var(--color-white)" />
                                        삭제하기
                                    </button>
                                    {form.imageUrl && <div style={{ marginTop: 8 }}><img src={form.imageUrl} alt="menu" style={{ maxWidth: 120 }} /></div>}
                                </div>
                            </li>
                        : null}
                    </ul>
                </form>

                <div className="admin-btns">
                    <button className="blackBtn" type="button" onClick={() => navigate(-1)}>뒤로가기</button>
                    <button className="primaryBtn" type="button" onClick={saveHandle} disabled={save ? false : true}>저장하기</button>
                </div>
            </div>
        </div>
    );
}

export default AdminCategory;
