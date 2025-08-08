// 상단 import는 동일
import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import AdminWidget from "../layouts/AdminWidget";
import {
    DndContext,
    closestCenter,
    DragEndEvent,
    DragOverlay,
} from "@dnd-kit/core";
import {
    useSortable,
    SortableContext,
    arrayMove,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import "../../../style/admin/admin.css";
import IconCirclePlus from "../../../icons/IconCirclePlus";
import IconPencil from "../../../icons/IconPencil";
import IconTrash from "../../../icons/IconTrash";

interface MenuProps {
    imgUrl: string;
    menuId: string;
    menuName: string;
    menuOrderNo: number;
    menuPath: string;
    menuVisible: boolean;
    parentId: string | null;
    status: string;
}

interface SubMenuProps {
    parent: string;
    menuId: string;
    title: string;
    link: string;
}

interface GrandChildProps {
    parent: string;
    menuId: string;
    title: string;
    link: string;
}

// ------------------------------------
// 대메뉴용 컴포넌트
function SortableItem({
    item,
    isEditing,
    editingText,
    onClick,
    onChange,
    onConfirm,
    dragEnabled,
    onEditClick,
    onDeleteClick,
}: {
    item: MenuProps;
    isEditing: boolean;
    editingText: string;
    onClick: () => void;
    onChange: (value: string) => void;
    onConfirm: () => void;
    dragEnabled: boolean;
    onEditClick: () => void;
    onDeleteClick: () => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item.menuId });

    const [hovered, setHovered] = useState(false);

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        position: "relative",
    };

    return (
        <div
            ref={setNodeRef}
            className="bar-contents"
            style={style}
            {...(dragEnabled ? { ...attributes, ...listeners } : {})}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {isEditing ? (
                <input
                    className="edit-input"
                    value={editingText}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onConfirm}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") onConfirm();
                    }}
                    autoFocus
                />
            ) : (
                <>
                    <button type="button">{item.menuName}</button>
                    {hovered && !dragEnabled && (
                        <div className="action-icons" onClick={e => e.stopPropagation()}>
                            <button type="button" className="icon-btn" onClick={onEditClick}>
                                <IconPencil color="var(--color-black)" />
                            </button>
                            <button type="button" className="icon-btn" onClick={onDeleteClick}>
                                <IconTrash color="var(--color-black)" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// ------------------------------------
// 중메뉴용 컴포넌트
function SubMenuItem({
    item,
    isEditing,
    editingText,
    onClick,
    onChange,
    onConfirm,
    onEditClick,
    onDeleteClick,
}: {
    item: SubMenuProps;
    isEditing: boolean;
    editingText: string;
    onClick: () => void;
    onChange: (value: string) => void;
    onConfirm: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="bar-contents children"
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {isEditing ? (
                <input
                    className="edit-input"
                    value={editingText}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onConfirm}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") onConfirm();
                    }}
                    autoFocus
                />
            ) : (
                <>
                    <button type="button">{item.title}</button>
                    {hovered && (
                        <div className="action-icons" onClick={e => e.stopPropagation()}>
                            <button type="button" className="icon-btn" onClick={onEditClick}>
                                <IconPencil color="var(--color-black)" />
                            </button>
                            <button type="button" className="icon-btn" onClick={onDeleteClick}>
                                <IconTrash color="var(--color-black)" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// ------------------------------------
// 소메뉴용 컴포넌트
function GrandChildItem({
    item,
    isEditing,
    editingText,
    onClick,
    onChange,
    onConfirm,
    onEditClick,
    onDeleteClick,
}: {
    item: SubMenuProps;
    isEditing: boolean;
    editingText: string;
    onClick: () => void;
    onChange: (value: string) => void;
    onConfirm: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="bar-contents grandChild"
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {isEditing ? (
                <input
                    className="edit-input"
                    value={editingText}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onConfirm}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") onConfirm();
                    }}
                    autoFocus
                />
            ) : (
                <>
                    <button type="button">{item.title}</button>
                    {hovered && (
                        <div className="action-icons" onClick={e => e.stopPropagation()}>
                            <button type="button" className="icon-btn" onClick={onEditClick}>
                                <IconPencil color="var(--color-black)" />
                            </button>
                            <button type="button" className="icon-btn" onClick={onDeleteClick}>
                                <IconTrash color="var(--color-black)" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}


// ------------------------------------
// 메인 컴포넌트
function MenuCategory() {
    const [menus, setMenus] = useState<MenuProps[]>([]);
    const [subMenus, setSubMenus] = useState<SubMenuProps[]>([]);
    const [grandChildMenus, setGrandChildMenus] = useState<GrandChildProps[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [dragEnabled, setDragEnabled] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState<string>("");

    const handleEditClick = (id: string, name: string) => {
        if (!dragEnabled) {
            setEditingId(id);
            setEditingText(name);
        }
    };

    const handleDeleteClick = (id: string) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            setMenus(prev => prev.filter(menu => menu.menuId !== id));
            setSubMenus(prev => prev.filter(menu => menu.menuId !== id));
            if (editingId === id) {
                setEditingId(null);
                setEditingText("");
            }
        }
    };

    const getMenu = () => {
        axiosInstance.get("/role-menus").then((response) => {
            if (response.data.success === true) {
                const rawMenu: MenuProps[] = response.data.data;
                const mainMenus = rawMenu.filter((el) => el.parentId === null);
                const mainMenuIds = mainMenus.map((m) => m.menuId);
                const subs = rawMenu.filter((el) => el.parentId && mainMenuIds.includes(el.parentId));
                const formattedSubs: SubMenuProps[] = subs.map((el) => ({
                    parent: el.parentId!,
                    menuId: el.menuId,
                    title: el.menuName,
                    link: el.menuPath,
                }));
                console.log(rawMenu)
                setMenus(mainMenus);
                setSubMenus(formattedSubs);
            }
        });
    };

    useEffect(() => {
        getMenu();
    }, []);

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;
        if (active.id !== over.id) {
            const oldIndex = menus.findIndex((item) => item.menuId === active.id);
            const newIndex = menus.findIndex((item) => item.menuId === over.id);
            setMenus((items) => arrayMove(items, oldIndex, newIndex));
        }
        setActiveId(null);
    };

    const handleClick = (item: MenuProps | SubMenuProps) => {
        if (!dragEnabled) {
            setEditingId(item.menuId);
            setEditingText("menuName" in item ? item.menuName : item.title);
        }
    };

    const handleEditConfirm = (id: string) => {
        setMenus(prev => prev.map(m => m.menuId === id ? { ...m, menuName: editingText } : m));
        setSubMenus(prev => prev.map(m => m.menuId === id ? { ...m, title: editingText } : m));
        setEditingId(null);
    };

    const handleAddMenu = () => {
        const newMenuId = `new-${Date.now()}`;
        const newMenu: MenuProps = {
            imgUrl: "",
            menuId: newMenuId,
            menuName: "새 메뉴",
            menuOrderNo: menus.length + 1,
            menuPath: "",
            menuVisible: true,
            parentId: null,
            status: "new",
        };
        setMenus((prev) => [...prev, newMenu]);
        setEditingId(newMenuId);
        setEditingText("새 메뉴");
    };

    // form
    const [ menuName, setMenuName ] = useState<string>('');
    const [ menuLink, setMenuLink ] = useState<string>('');

    return (
        <div className="admin-page menu-category">
            <AdminWidget title="헤더 메뉴" />
            <div className="admin-body wrapper">
                <div className="admin-body-header">
                    {dragEnabled ? (
                        <span className="noticeText">드래그 하여 움직여주세요</span>
                    ) : <div />}
                    <div className="publish">
                        <label htmlFor="publish-toggle">순서변경</label>
                        <button id="publish-toggle" className={dragEnabled ? 'publish-btn active' : 'publish-btn'} onClick={() => setDragEnabled(!dragEnabled)}>
                            <i className="ball"></i>
                        </button>
                    </div>
                </div>

                <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    <SortableContext items={menus.map((item) => item.menuId)} strategy={horizontalListSortingStrategy}>
                        <div className="menu-bar">
                            {menus.map((item) => (
                                <ul key={item.menuId}>
                                    <li>
                                        <SortableItem
                                            item={item}
                                            isEditing={editingId === item.menuId}
                                            editingText={editingText}
                                            onClick={() => handleClick(item)}
                                            onChange={setEditingText}
                                            onConfirm={() => handleEditConfirm(item.menuId)}
                                            dragEnabled={dragEnabled}
                                            onEditClick={() => handleEditClick(item.menuId, item.menuName)}
                                            onDeleteClick={() => handleDeleteClick(item.menuId)}
                                        />
                                    </li>

                                    {subMenus.some(sub => sub.parent === item.menuId) && (
                                        subMenus.filter(sub => sub.parent === item.menuId).map((sub) => (
                                            <li key={sub.menuId}>
                                                <SubMenuItem
                                                    item={sub}
                                                    isEditing={editingId === sub.menuId}
                                                    editingText={editingText}
                                                    onClick={() => handleClick(sub)}
                                                    onChange={setEditingText}
                                                    onConfirm={() => handleEditConfirm(sub.menuId)}
                                                    onEditClick={() => handleEditClick(sub.menuId, sub.title)}
                                                    onDeleteClick={() => handleDeleteClick(sub.menuId)}
                                                />
                                            </li>
                                        ))
                                    )}
                                </ul>
                            ))}

                            <ul>
                                <li>
                                    <div className="bar-contents">
                                        <button type="button" className="add-btn" onClick={handleAddMenu}>
                                            <IconCirclePlus color="var(--color-white)" />
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </SortableContext>

                    <DragOverlay>
                        {activeId !== null && (
                            <div className="moving">
                                <p><span>{menus.find((item) => item.menuId === activeId)?.menuName}</span></p>
                            </div>
                        )}
                    </DragOverlay>
                </DndContext>

                <div className="admin-form" id="menu-category-form">
                    <ul>
                        <li>
                            <span className="admin-form-title">메뉴 이름</span>

                            <div className="input-area">
                                <input type="text" placeholder="메뉴 이름"/>
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">영어 이름</span>

                            <div className="input-area">
                                <input type="text" placeholder="영어 이름"/>
                            </div>
                        </li>
                        
                        <li>
                            <span className="admin-form-title">노출</span>

                            <div className="input-area">
                                <select name="" id="">
                                    <option value="true">노출</option>
                                    <option value="false">숨김</option>
                                </select>
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">노출 권한</span>

                            <div className="input-area">
                                <select name="" id="">
                                    <option value="0">방문회원</option>
                                    <option value="0">로그인회원</option>
                                    <option value="0">관리자</option>
                                </select>
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">메뉴 구분</span>

                            <div className="input-area">
                                <select name="" id="">
                                    <option value="0">대메뉴</option>
                                    <option value="0">중메뉴</option>
                                    <option value="0">소메뉴</option>
                                </select>
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">최상위 메뉴</span>

                            <div className="input-area">
                                <select name="" id="">
                                    <option value="0">대메뉴</option>
                                    <option value="0">중메뉴</option>
                                    <option value="0">소메뉴</option>
                                </select>
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">상위 메뉴</span>

                            <div className="input-area">
                                <select name="" id="">
                                    <option value="0">대메뉴</option>
                                    <option value="0">중메뉴</option>
                                    <option value="0">소메뉴</option>
                                </select>
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">메뉴 삭제</span>

                            <div className="input-area">
                                <button type="button" className="blackBtn"><IconTrash color="var(--color-white)"/>삭제하기</button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default MenuCategory;
