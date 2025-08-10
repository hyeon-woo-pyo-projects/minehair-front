import AdminWidget from "../layouts/AdminWidget";
import {
    DndContext,
    closestCenter,
    DragEndEvent,
    DragOverEvent,
} from "@dnd-kit/core";
import {
    useSortable,
    SortableContext,
    arrayMove,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import IconCirclePlus from "../../../icons/IconCirclePlus";
import IconTrash from "../../../icons/IconTrash";

import "../../../style/admin/admin.css";
import axiosInstance from "../../../api/axiosInstance";
import { useEffect, useState } from "react";
import IconUpload from "../../../icons/IconUpload";

interface MenuProps {
    id : number;
    imageUrl : string;
    menuId : number;
    menuName : string;
    newPath : string;
    menuOrderNo : number;
    menuPath : string;
    menuType : string;
    menuVisible : string;
    parentId : number | null;
    status : string;
    apiUrl : string;
    call : string;
}

interface SaveProps {
    parentId : number;
    menuName : string;
    menuPath : string;
    imageUrl : string;
    isVisible : true;
    menuType : string;
    orderNo : 0;
    roles : [
        0
    ];
    apiUrl : string;
    call : string;
}

function SortableItem({ id, children, changeMenu }: { id: number | string; children: React.ReactNode; changeMenu: boolean }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled: !changeMenu });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: changeMenu ? "grab" : "default",
        zIndex: isDragging ? 9999 : undefined,
        boxShadow: isDragging ? "0 10px 20px rgba(0,0,0,0.2)" : undefined,
        borderRadius: isDragging ? 4 : undefined,
        backgroundColor: isDragging ? "white" : undefined,
        position: isDragging ? ('relative' as React.CSSProperties['position']) : undefined,
    };

    return (
        <div ref={setNodeRef} style={style} {...(changeMenu ? { ...attributes, ...listeners } : {})}>
            {children}
        </div>
    );
}

function AdminCategory2() {
    const [wholeMenu, setWholeMenu] = useState<MenuProps[]>([]);
    const [majorMenu, setMajorMenu] = useState<MenuProps[]>([]);
    const [minorMenu, setMinorMenu] = useState<MenuProps[]>([]);
    const [subMenu, setSubMenu] = useState<MenuProps[]>([]);

    const [majorMenuSorted, setMajorMenuSorted] = useState<MenuProps[]>([]);
    const [minorMenuSorted, setMinorMenuSorted] = useState<MenuProps[]>([]);
    const [subMenuSorted, setSubMenuSorted] = useState<MenuProps[]>([]);

    const [changeMenu, setChangeMenu] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<MenuProps | null>(null);

    const initialForm = {
        id: 0,
        menuName: "새 메뉴",
        menuPath: "",
        newPath: "",
        menuVisible: "true",
        menuType: "",
        selection01: "",
        selection02: "",
        selection03: "",
        imageUrl: ""
    };
    const [form, setForm] = useState(initialForm);
    const [disabled, setDisabled] = useState(true);

    function getMenu() {
        axiosInstance
            .get("/role-menus")
            .then((response) => {
                if (response.data.success) {
                    const wholeMenu = response.data.data;
                    const majorMenu = wholeMenu.filter(
                        (d: MenuProps) => d.menuType === "MAJOR" && d.parentId === null
                    );
                    const minorMenu = wholeMenu.filter(
                        (d: MenuProps) => d.menuType === "MINOR" && d.parentId !== null
                    );
                    const subMenu = wholeMenu.filter(
                        (d: MenuProps) => d.menuType === "SUB" && d.parentId !== null
                    );

                    setWholeMenu(wholeMenu);
                    setMajorMenu(majorMenu);
                    setMinorMenu(minorMenu);
                    setSubMenu(subMenu);

                    setMajorMenuSorted(majorMenu);
                    setMinorMenuSorted(minorMenu);
                    setSubMenuSorted(subMenu);
                }
            })
            .catch(console.error);
    }

    useEffect(() => {
        getMenu();
    }, []);

    useEffect(() => {
        if (selectedMenu) {
            const getPath = selectedMenu.menuPath.split("/");
            let newPath = "";
            if (selectedMenu.menuType === "MAJOR") newPath = getPath[1];
            else if (selectedMenu.menuType === "MINOR") newPath = getPath[2];
            else if (selectedMenu.menuType === "SUB") newPath = getPath[3];

            let selection02 = "";
            let selection03 = "";

            if (selectedMenu.menuType === "MINOR") {
                selection02 = selectedMenu.parentId?.toString() ?? "";
            }
            if (selectedMenu.menuType === "SUB") {
                selection03 = selectedMenu.parentId?.toString() ?? "";
                const parentMinor = minorMenu.find(
                    (m) => m.menuId === selectedMenu.parentId
                );
                selection02 = parentMinor?.parentId?.toString() ?? "";
            }

            setForm({
                id: selectedMenu.id ?? 0,
                menuName: selectedMenu.menuName ?? "",
                menuPath: selectedMenu.menuPath ?? "",
                newPath: newPath,
                menuVisible: selectedMenu.menuVisible ?? "true",
                menuType: selectedMenu.menuType ?? "",
                selection01: selectedMenu.menuType ?? "",
                selection02: selection02,
                selection03: selection03,
                imageUrl: selectedMenu.imageUrl ?? ""
            });
        }
    }, [selectedMenu, minorMenu]);

    function handleMenuChange() {
        setChangeMenu(!changeMenu);
    }

    function menuClicked(menu: MenuProps) {
        setSelectedMenu(menu);
        setDisabled(false);
    }

    function handleFormChange(changes: Partial<typeof form>) {
        setForm((prev) => ({ ...prev, ...changes }));
    }

    function handleDragOver(event: DragOverEvent, level: "major" | "minor" | "sub", parentId?: number) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        if (level === "major") {
            const oldIndex = majorMenuSorted.findIndex((item) => item.id === active.id);
            const newIndex = majorMenuSorted.findIndex((item) => item.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                setMajorMenuSorted(arrayMove(majorMenuSorted, oldIndex, newIndex));
            }
        }

        if (level === "minor") {
            const filtered = minorMenuSorted.filter((m) => m.parentId === parentId);
            const other = minorMenuSorted.filter((m) => m.parentId !== parentId);
            const oldIndex = filtered.findIndex((item) => item.id === active.id);
            const newIndex = filtered.findIndex((item) => item.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                const newFiltered = arrayMove(filtered, oldIndex, newIndex);
                setMinorMenuSorted([...other, ...newFiltered]);
            }
        }

        if (level === "sub") {
            const filtered = subMenuSorted.filter((m) => m.parentId === parentId);
            const other = subMenuSorted.filter((m) => m.parentId !== parentId);
            const oldIndex = filtered.findIndex((item) => item.id === active.id);
            const newIndex = filtered.findIndex((item) => item.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                const newFiltered = arrayMove(filtered, oldIndex, newIndex);
                setSubMenuSorted([...other, ...newFiltered]);
            }
        }
    }

    function handleDragEnd(event: DragEndEvent, level: "major" | "minor" | "sub", parentId?: number) {
        handleDragOver(event, level, parentId);
        // API 호출 또는 저장 처리 여기에 추가 가능
    }

    return (
        <div className="admin-page menu-category">
            <AdminWidget<SaveProps> title="헤더 메뉴" status={false} saveData={null} />

            <div className="admin-body wrapper">
                <div className="admin-body-header">
                    <p className="pulblish-status active">
                        {changeMenu ? "순서 변경 모드 (메뉴를 드래그 해주세요)" : "메뉴 입력 모드 (메뉴를 클릭해주세요)"}
                    </p>
                    <div className="publish">
                        <label htmlFor="publish-toggle">모드변경</label>
                        <button
                            id="publish-toggle"
                            className={changeMenu ? "publish-btn active" : "publish-btn"}
                            onClick={handleMenuChange}
                        >
                            <i className="ball"></i>
                        </button>
                    </div>
                </div>

                <div className="menu-bar">
                    <DndContext
                        collisionDetection={closestCenter}
                        onDragOver={(event) => handleDragOver(event, "major")}
                        onDragEnd={(event) => handleDragEnd(event, "major")}
                    >
                        <SortableContext items={majorMenuSorted.map((m) => m.id)} strategy={verticalListSortingStrategy}>
                            {majorMenuSorted.map((major) => (
                                <ul key={major.id}>
                                    <SortableItem id={major.id} changeMenu={changeMenu}>
                                        <li className="top-menu">
                                            <div className="bar-contents">
                                                <button type="button" onClick={() => { menuClicked(major); }} disabled={changeMenu}>
                                                    {major.menuName}
                                                </button>
                                            </div>
                                        </li>
                                    </SortableItem>

                                    <DndContext
                                        collisionDetection={closestCenter}
                                        onDragOver={(event) => handleDragOver(event, "minor", major.menuId)}
                                        onDragEnd={(event) => handleDragEnd(event, "minor", major.menuId)}
                                    >
                                        <SortableContext
                                            items={minorMenuSorted.filter((m) => m.parentId === major.menuId).map((m) => m.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {minorMenuSorted
                                                .filter((minor) => minor.parentId === major.menuId)
                                                .map((minor) => (
                                                    <div key={minor.id}>
                                                        <SortableItem id={minor.id} changeMenu={changeMenu}>
                                                            <li className="middle-menu">
                                                                <div className="bar-contents children">
                                                                    <button type="button" onClick={() => { menuClicked(minor); }} disabled={changeMenu}>
                                                                        {minor.menuName}
                                                                    </button>
                                                                </div>
                                                            </li>
                                                        </SortableItem>

                                                        <DndContext
                                                            collisionDetection={closestCenter}
                                                            onDragOver={(event) => handleDragOver(event, "sub", minor.menuId)}
                                                            onDragEnd={(event) => handleDragEnd(event, "sub", minor.menuId)}
                                                        >
                                                            <SortableContext
                                                                items={subMenuSorted.filter((s) => s.parentId === minor.menuId).map((s) => s.id)}
                                                                strategy={verticalListSortingStrategy}
                                                            >
                                                                {subMenuSorted
                                                                    .filter((sub) => sub.parentId === minor.menuId)
                                                                    .map((sub) => (
                                                                        <SortableItem id={sub.id} key={sub.id} changeMenu={changeMenu}>
                                                                            <li className="bottom-menu">
                                                                                <div className="bar-contents grandChild">
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => { menuClicked(sub); }}
                                                                                        disabled={changeMenu}
                                                                                    >
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

                <form className="admin-form" id="menu-category-form">
                    <div className="center-menu">
                        <button
                            type="button"
                            className="add-btn"
                            onClick={() => {
                                setForm({
                                    id: 0,
                                    menuName: "새 메뉴",
                                    menuPath: "",
                                    newPath: "",
                                    menuVisible: "true",
                                    menuType: "",
                                    selection01: "",
                                    selection02: "",
                                    selection03: "",
                                    imageUrl: ""
                                });
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
                                    value={form.menuName}
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
                                    value={form.newPath}
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
                                    value={form.menuVisible}
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
                                        <input type="checkbox" id="all" disabled={disabled} />
                                        <label htmlFor="all">전체</label>
                                    </div>

                                    <div className="checkbox-child">
                                        <input type="checkbox" id="member" disabled={disabled} />
                                        <label htmlFor="member">회원</label>
                                    </div>

                                    <div className="checkbox-child">
                                        <input type="checkbox" id="admin" disabled={disabled} />
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

                        {(form.selection01 === "MINOR" || form.selection01 === "SUB") && (
                            <li>
                                <span className="admin-form-title">최상위 메뉴</span>
                                <div className="input-area">
                                    <select
                                        name="category-form"
                                        id="menu-major"
                                        value={form.selection02}
                                        onChange={(e) => handleFormChange({ selection02: e.target.value })}
                                        disabled={disabled}
                                    >
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
                                    <select
                                        name="category-form"
                                        id="menu-minor"
                                        value={form.selection03}
                                        onChange={(e) => handleFormChange({ selection03: e.target.value })}
                                        disabled={disabled}
                                    >
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

                        <li>
                            <span className="admin-form-title">메뉴 이미지</span>
                            <div className="input-area">
                                <div className="image-upload">
                                    <input type="file" id="image-upload" disabled={disabled} />
                                    <label htmlFor="image-upload">
                                        <IconUpload color="var(--color-white)" />
                                        이미지 업로드
                                    </label>
                                </div>
                                <button type="button" className="blackBtn" disabled={disabled}>
                                    <IconTrash color="var(--color-white)" />
                                    삭제하기
                                </button>
                            </div>
                        </li>
                    </ul>
                </form>
            </div>
        </div>
    );
}

export default AdminCategory2;
