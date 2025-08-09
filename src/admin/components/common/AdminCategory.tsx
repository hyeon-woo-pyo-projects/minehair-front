import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
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
    authority : string
}

interface MenuProps2 {
    id : number,
    imageUrl : string,
    menuId : number,
    menuName : string,
    menuOrderNo : number,
    menuPath : string,
    menuType : string,
    menuVisible : boolean,
    parentId : number,
    status : string
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

function SortableItem({
    item,
    dragEnabled,
    onEditClick,
    onDeleteClick,
}: {
    item: MenuProps;
    dragEnabled: boolean;
    onEditClick: (item: MenuProps) => void;
    onDeleteClick: (id: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: `MAJOR:${item.menuId}`,
    });

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
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <button type="button">{item.menuName}</button>
            {hovered && !dragEnabled && (
                <div className="action-icons" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="icon-btn" onClick={() => onEditClick(item)}>
                        <IconPencil color="var(--color-black)" />
                    </button>
                    <button type="button" className="icon-btn" onClick={() => onDeleteClick(item.menuId)}>
                        <IconTrash color="var(--color-black)" />
                    </button>
                </div>
            )}
        </div>
    );
}

function SubMenuItem({
    item,
    dragEnabled,
    onEditClick,
    onDeleteClick,
}: {
    item: SubMenuProps;
    dragEnabled: boolean;
    onEditClick: (item: SubMenuProps) => void;
    onDeleteClick: (id: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: `MINOR:${item.menuId}`,
    });

    const [hovered, setHovered] = useState(false);

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        position: "relative",
    };

    return (
        <div
            ref={setNodeRef}
            className="bar-contents children"
            style={style}
            {...(dragEnabled ? { ...attributes, ...listeners } : {})}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <button type="button">{item.title}</button>
            {hovered && !dragEnabled && (
                <div className="action-icons" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="icon-btn" onClick={() => onEditClick(item)}>
                        <IconPencil color="var(--color-black)" />
                    </button>
                    <button type="button" className="icon-btn" onClick={() => onDeleteClick(item.menuId)}>
                        <IconTrash color="var(--color-black)" />
                    </button>
                </div>
            )}
        </div>
    );
}

function GrandChildItem({
    item,
    dragEnabled,
    onEditClick,
    onDeleteClick,
}: {
    item: GrandChildProps;
    dragEnabled: boolean;
    onEditClick: (item: GrandChildProps) => void;
    onDeleteClick: (id: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: `bottom:${item.menuId}`,
    });

    const [hovered, setHovered] = useState(false);

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        position: "relative",
    };

    return (
        <div
            ref={setNodeRef}
            className="bar-contents grandChild"
            style={style}
            {...(dragEnabled ? { ...attributes, ...listeners } : {})}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <button type="button">{item.title}</button>
            {hovered && !dragEnabled && (
                <div className="action-icons" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="icon-btn" onClick={() => onEditClick(item)}>
                        <IconPencil color="var(--color-black)" />
                    </button>
                    <button type="button" className="icon-btn" onClick={() => onDeleteClick(item.menuId)}>
                        <IconTrash color="var(--color-black)" />
                    </button>
                </div>
            )}
        </div>
    );
}

function AdminCategory() {
    const [menus, setMenus] = useState<MenuProps[]>([]);
    const [subMenus, setSubMenus] = useState<SubMenuProps[]>([]);
    const [grandChildMenus, setGrandChildMenus] = useState<GrandChildProps[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [dragEnabled, setDragEnabled] = useState<boolean>(false);
    const [selectedMenuData, setSelectedMenuData] = useState<{
        menuType: "MAJOR" | "MINOR" | "SUB" | null;
        data: MenuProps | SubMenuProps | GrandChildProps | null;
    }>({ menuType: null, data: null });

    const getMenu = () => {
        axiosInstance.get("/role-menus").then((response) => {
            if (response.data.success === true) {
                const rawMenu: MenuProps[] = response.data.data;

                const mainMenus = rawMenu.filter((el) => el.parentId === null);
                const mainMenuIds = mainMenus.map((m) => m.menuId);

                const subs = rawMenu.filter(
                    (el) => el.parentId !== null && mainMenuIds.includes(el.parentId!)
                );
                const subMenuIds = subs.map((s) => s.menuId);

                const grandChilds = rawMenu.filter(
                    (el) => el.parentId !== null && subMenuIds.includes(el.parentId!)
                );

                const formattedSubs: SubMenuProps[] = subs.map((el) => ({
                    parent: el.parentId!,
                    menuId: el.menuId,
                    title: el.menuName,
                    link: el.menuPath,
                }));

                const formattedGrandChildren: GrandChildProps[] = grandChilds.map((el) => ({
                    parent: el.parentId!,
                    menuId: el.menuId,
                    title: el.menuName,
                    link: el.menuPath,
                }));

                setMenus(mainMenus);
                setSubMenus(formattedSubs);
                setGrandChildMenus(formattedGrandChildren);
            }
        });
    };

    useEffect(() => {
        getMenu();
    }, []);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(String(event.active.id));
    };

    const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const activePrefix = active.id.split(":")[0];
    const overPrefix = over.id.split(":")[0];

    if (activePrefix !== overPrefix) return;

    if (activePrefix === "MAJOR") {
        const oldIndex = menus.findIndex(m => `MAJOR:${m.menuId}` === active.id);
        const newIndex = menus.findIndex(m => `MAJOR:${m.menuId}` === over.id);
        setMenus(arrayMove(menus, oldIndex, newIndex));
    }

    if (activePrefix === "MINOR") {
        const oldIndex = subMenus.findIndex(m => `MINOR:${m.menuId}` === active.id);
        const newIndex = subMenus.findIndex(m => `MINOR:${m.menuId}` === over.id);
        setSubMenus(arrayMove(subMenus, oldIndex, newIndex));
    }

    if (activePrefix === "SUB") {
        const oldIndex = grandChildMenus.findIndex(m => `SUB:${m.menuId}` === active.id);
        const newIndex = grandChildMenus.findIndex(m => `SUB:${m.menuId}` === over.id);
        setGrandChildMenus(arrayMove(grandChildMenus, oldIndex, newIndex));
    }

    setActiveId(null);
    };

    const handleEditClick = (item: MenuProps | SubMenuProps | GrandChildProps, menuType: "MAJOR" | "MINOR" | "SUB") => {
        if (!dragEnabled) {
            setSelectedMenuData({ menuType, data: item });
        }
    };

    const handleDeleteClick = (id: string) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            setMenus((prev) => prev.filter((menu) => menu.menuId !== id));
            setSubMenus((prev) => prev.filter((menu) => menu.menuId !== id));
            setGrandChildMenus((prev) => prev.filter((menu) => menu.menuId !== id));
            if ((selectedMenuData.data as any)?.menuId === id) {
                setSelectedMenuData({ menuType: null, data: null });
            }
        }
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
            authority : '',
        };

        setSelectedMenuData({ menuType: "MAJOR", data: newMenu });
    };

    const onFormChange = (field: string, value: any) => {
        if (!selectedMenuData.data) return;

        const { menuType, data } = selectedMenuData;

        if (field === "menuType") {
            setSelectedMenuData({ menuType: value, data });
            return;
        }
        
        const normalizedValue =
            field === "menuVisible" ? (value === "true" || value === true) : value;

        if (menuType === "MAJOR") {
            const updated = { ...(data as MenuProps), [field]: normalizedValue };
            setMenus((prev) =>
                prev.map((m) => (m.menuId === updated.menuId ? updated : m))
            );
            setSelectedMenuData({ menuType, data: updated });
            setCategoryChoose('MAJOR');
        } else if (menuType === "MINOR") {
            const updated = { ...(data as SubMenuProps), [field]: normalizedValue };
            setSubMenus((prev) =>
                prev.map((m) => (m.menuId === updated.menuId ? updated : m))
            );
            setSelectedMenuData({ menuType, data: updated });
            setCategoryChoose('MINOR');
        } else if (menuType === "SUB") {
            const updated = { ...(data as GrandChildProps), [field]: normalizedValue };
            setGrandChildMenus((prev) =>
                prev.map((m) => (m.menuId === updated.menuId ? updated : m))
            );
            setSelectedMenuData({ menuType, data: updated });
            setCategoryChoose('SUB');
        }
        
    };

    const handleDeleteFromForm = () => {
        if (!selectedMenuData.data) return;
        if (window.confirm("정말 삭제하시겠습니까?")) {
            const id = (selectedMenuData.data as any).menuId;
            setMenus((prev) => prev.filter((menu) => menu.menuId !== id));
            setSubMenus((prev) => prev.filter((menu) => menu.menuId !== id));
            setGrandChildMenus((prev) => prev.filter((menu) => menu.menuId !== id));
            setSelectedMenuData({ menuType: null, data: null });
        }
    };

    // 링크에서 영어만 가져오기
    type MenuDivision = "MAJOR" | "MINOR" | "SUB";

    function getEnglishNameByType(
        path: string | undefined,
        type: MenuDivision
    ) {
        if (!path) return "";
        const parts = path.split("/").filter(Boolean);
        switch (type) {
            case "MAJOR":
                return parts[0] ?? "";
            case "MINOR":
                return parts[1] ?? "";
            case "SUB":
                return parts[2] ?? "";
            default:
                return "";
        }
    }

    // 메뉴 구분 선택
    const [ categoryChoose, setCategoryChoose ] = useState('');
    const [ middleChoose, setMiddleChoose ] = useState('');

    // 링크명 부분
    

    return (
        <div className="admin-page menu-category">
            <AdminWidget title="헤더 메뉴" />
            <div className="admin-body wrapper">
                <div className="admin-body-header">
                    {dragEnabled ? (
                        <span className="noticeText">드래그하여 움직여주세요</span>
                    ) : (
                        <div />
                    )}
                    <div className="publish">
                        <label htmlFor="publish-toggle">순서변경</label>
                        <button
                            id="publish-toggle"
                            className={dragEnabled ? "publish-btn active" : "publish-btn"}
                            onClick={() => setDragEnabled(!dragEnabled)}
                        >
                            <i className="ball"></i>
                        </button>
                    </div>
                </div>

                <DndContext
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    {/* top 메뉴 SortableContext: MAJOR들만 */}
                    <SortableContext
                        items={menus.map((item) => `MAJOR:${item.menuId}`)}
                        strategy={horizontalListSortingStrategy}
                    >
                        <div className="menu-bar">
                            {menus.map((item) => (
                                <ul key={item.menuId}>
                                    {/* top 메뉴 */}
                                    <li className="top-menu">
                                        <SortableItem
                                            item={item}
                                            dragEnabled={dragEnabled}
                                            onEditClick={(it) => handleEditClick(it, "MAJOR")}
                                            onDeleteClick={handleDeleteClick}
                                        />
                                    </li>

                                    {/* middle 메뉴 SortableContext: 해당 top의 자식들만 */}
                                    <SortableContext
                                        items={subMenus
                                            .filter((sub) => sub.parent === item.menuId)
                                            .map((s) => `MINOR:${s.menuId}`)}
                                        strategy={horizontalListSortingStrategy}
                                    >
                                        {subMenus
                                            .filter((sub) => sub.parent === item.menuId)
                                            .map((sub) => (
                                                <div key={sub.menuId} className="middle-menu">
                                                    <SubMenuItem
                                                        item={sub}
                                                        dragEnabled={dragEnabled}
                                                        onEditClick={(it) => handleEditClick(it, "MINOR")}
                                                        onDeleteClick={handleDeleteClick}
                                                    />

                                                    {/* bottom 메뉴 SortableContext: 해당 middle의 자식들만 */}
                                                    <SortableContext
                                                        items={grandChildMenus
                                                            .filter((gc) => gc.parent === sub.menuId)
                                                            .map((g) => `SUB:${g.menuId}`)}
                                                        strategy={horizontalListSortingStrategy}
                                                    >
                                                        {grandChildMenus
                                                            .filter((gc) => gc.parent === sub.menuId)
                                                            .map((gc) => (
                                                                <li
                                                                    key={gc.menuId}
                                                                    className="bottom-menu"
                                                                >
                                                                    <GrandChildItem
                                                                        item={gc}
                                                                        dragEnabled={dragEnabled}
                                                                        onEditClick={(it) => handleEditClick(it, "SUB")}
                                                                        onDeleteClick={handleDeleteClick}
                                                                    />
                                                                </li>
                                                            ))}
                                                    </SortableContext>
                                                </div>
                                            ))}
                                    </SortableContext>
                                </ul>
                            ))}
                        </div>
                    </SortableContext>

                    <DragOverlay>
                        {activeId !== null && (
                            <div className="moving">
                                <p>
                                    <span>
                                        {menus.find((item) => Number(item.menuId) === Number(activeId.replaceAll('MAJOR:', '')))?.menuName ||
                                        subMenus.find((item) => Number(item.menuId) === Number(activeId.replaceAll('MINOR:', '')))?.title ||
                                        grandChildMenus.find((item) => Number(item.menuId) === Number(activeId.replaceAll('SUB:', '')))?.title}
                                    </span>
                                </p>
                            </div>
                        )}
                    </DragOverlay>
                </DndContext>

                <form className="admin-form" id="menu-category-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="center-menu">
                        <button
                            type="button"
                            className="add-btn"
                            onClick={handleAddMenu}
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
                                    value={
                                        selectedMenuData.data
                                            ? "menuName" in selectedMenuData.data
                                                ? (selectedMenuData.data as MenuProps).menuName
                                                : (selectedMenuData.data as SubMenuProps).title
                                            : ""
                                    }
                                    onChange={(e) =>
                                        onFormChange(
                                            "menuName" in (selectedMenuData.data ?? {})
                                                ? "menuName"
                                                : "title",
                                            e.target.value
                                        )
                                    }
                                    disabled={!selectedMenuData.data}
                                />
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">링크명</span>
                            <div className="input-area">
                                <input
                                    type="text"
                                    placeholder="링크명"
                                    disabled={!selectedMenuData.data}
                                />
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">노출</span>
                            <div className="input-area">
                                <select
                                    value={
                                        selectedMenuData.data && "status" in selectedMenuData.data
                                            ? (selectedMenuData.data as MenuProps).menuVisible
                                                ? "true"
                                                : "false"
                                            : "true"
                                    }
                                    onChange={(e) => onFormChange("menuVisible", e.target.value)}
                                    disabled={!selectedMenuData.data}
                                >
                                    <option value="true">노출</option>
                                    <option value="false">숨김</option>
                                </select>
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">노출 권한</span>
                            <div className="input-area">
                                <select
                                    value={
                                        selectedMenuData.data
                                            ? getEnglishNameByType(
                                                "authority" in selectedMenuData.data
                                                    ? (selectedMenuData.data as MenuProps).menuPath
                                                    : (selectedMenuData.data as SubMenuProps).link,
                                                selectedMenuData.menuType ?? "MAJOR"
                                            )
                                            : ""
                                    }
                                    onChange={(e) => onFormChange("authority", e.target.value)}
                                    disabled={!selectedMenuData.data}
                                >
                                    <option>전체</option>
                                    <option>로그인회원</option>
                                    <option>관리자</option>
                                </select>
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">메뉴 구분</span>
                            <div className="input-area">
                                <select
                                    id="menu-division"
                                    value={ selectedMenuData.menuType ?? '' }
                                    onChange={(e) => onFormChange("menuType", e.target.value)}
                                    disabled={!selectedMenuData.data}
                                >
                                    <option value={''}>선택</option>
                                    <option value={'MAJOR'}>대메뉴</option>
                                    <option value={'MINOR'}>중메뉴</option>
                                    <option value={'SUB'}>소메뉴</option>
                                </select>
                            </div>
                        </li>
                        
                        { categoryChoose === 'MINOR' || categoryChoose === 'SUB' ?
                            <li>
                                <span className="admin-form-title">최상위 메뉴</span>

                                <div className="input-area">
                                    <select
                                        value={
                                            selectedMenuData.data
                                                ? getEnglishNameByType(
                                                    "menuPath" in selectedMenuData.data
                                                        ? (selectedMenuData.data as MenuProps).menuPath
                                                        : (selectedMenuData.data as SubMenuProps).link,
                                                    selectedMenuData.menuType ?? "MAJOR"
                                                )
                                                : ""
                                        }
                                        onChange={(e) => {
                                            onFormChange(
                                                "menuPath" in (selectedMenuData.data ?? {})
                                                    ? "menuPath"
                                                    : "link",
                                                e.target.value
                                            );
                                            setMiddleChoose(e.target.value);
                                        }}
                                        disabled={!selectedMenuData.data}
                                    >
                                        { menus.map((data, index)=>{
                                            return (
                                                <option key={index} value={data.menuId}>{data.menuName}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </li>
                        : null}
                        

                        { categoryChoose === 'SUB' ? 
                            <li>
                                <span className="admin-form-title">상위 메뉴</span>
                                <div className="input-area">
                                    <select
                                        value={
                                            selectedMenuData.data
                                                ? getEnglishNameByType(
                                                    "menuPath" in selectedMenuData.data
                                                        ? (selectedMenuData.data as MenuProps).menuPath
                                                        : (selectedMenuData.data as SubMenuProps).link,
                                                    selectedMenuData.menuType ?? "MAJOR"
                                                )
                                                : ""
                                        }
                                        onChange={(e) =>
                                            onFormChange(
                                                "menuPath" in (selectedMenuData.data ?? {})
                                                    ? "menuPath"
                                                    : "link",
                                                e.target.value
                                            )
                                        }
                                        disabled={!selectedMenuData.data}
                                    >
                                        { subMenus.map((data, index)=>{
                                            if ( Number(data.parent) === Number(middleChoose) ) {
                                                return (
                                                    <option key={index} value={data.menuId}>{data.title}</option>
                                                )
                                            } else {
                                                return null;
                                            }
                                        })}
                                        <option value={''} hidden>상위 메뉴를 먼저 생성해주세요</option>
                                    </select>
                                </div>
                            </li>
                        : null}
                        
                        {selectedMenuData.data ? 
                            <li>
                                <span className="admin-form-title">메뉴 삭제</span>

                                <div className="input-area">
                                    <button
                                        type="button"
                                        className="blackBtn"
                                        disabled={!selectedMenuData.data}
                                        onClick={handleDeleteFromForm}
                                    >
                                        <IconTrash color="var(--color-white)" />
                                        삭제하기
                                    </button>
                                </div>
                            </li>
                        : null} 
                    </ul>
                </form>
            </div>
        </div>
    );
}

export default AdminCategory;
