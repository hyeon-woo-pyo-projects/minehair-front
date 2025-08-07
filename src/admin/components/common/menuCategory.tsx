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

interface SubSubMenuProps {
    parent: string;
    title: string;
    link: string;
}

function SortableItem({
    item,
    isEditing,
    editingText,
    onClick,
    onChange,
    onConfirm,
    dragEnabled,
}: {
    item: MenuProps;
    isEditing: boolean;
    editingText: string;
    onClick: () => void;
    onChange: (value: string) => void;
    onConfirm: () => void;
    dragEnabled: boolean;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        isOver,
    } = useSortable({ id: item.menuId });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: "10px",
        border: "1px solid #ccc",
        marginRight: "8px",
        borderRadius: "4px",
        backgroundColor: isDragging ? "#f0f8ff" : "#fff",
        boxShadow: isDragging ? "0 4px 12px rgba(0,0,0,0.2)" : "none",
        opacity: isDragging ? 0.9 : 1,
        position: "relative",
        cursor: dragEnabled ? "grab" : "default",
        userSelect: "none",
        whiteSpace: "nowrap",
    };

    return (
        <div ref={setNodeRef} style={style} {...(dragEnabled ? { ...attributes, ...listeners } : {})} onClick={onClick} >
            {isEditing ? (
                <input
                value={editingText}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onConfirm}
                onKeyDown={(e) => {
                    if (e.key === "Enter") onConfirm();
                }}
                autoFocus
                />
            ) : (
                <button type="button">{item.menuName}</button>
            )}

            {isOver && !isDragging && (
                <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: "4px",
                    width: "100%",
                    backgroundColor: "#3498db",
                }}
                />
            )}
        </div>
    );
}

function MenuCategory() {
    const [menus, setMenus] = useState<MenuProps[]>([]);
    const [subMenus, setSubMenus] = useState<SubMenuProps[]>([]);
    const [subSubMenus, setSubSubMenus] = useState<SubSubMenuProps[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [dragEnabled, setDragEnabled] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState<string>("");

    const getMenu = () => {
        axiosInstance.get("/role-menus").then((response) => {
        if (response.data.success === true) {
            const rawMenu: MenuProps[] = response.data.data;
            const mainMenus = rawMenu.filter((el) => el.parentId === null);
            const mainMenuIds = mainMenus.map((m) => m.menuId);
            const subs = rawMenu.filter(
            (el) => el.parentId !== null && mainMenuIds.includes(el.parentId!)
            );
            const formattedSubs: SubMenuProps[] = subs.map((el) => ({
            parent: el.parentId!,
            menuId: el.menuId,
            title: el.menuName,
            link: el.menuPath,
            }));
            const subMenuIds = subs.map((m) => m.menuId);
            const subSubsRaw = rawMenu.filter(
            (el) => el.parentId !== null && subMenuIds.includes(el.parentId!)
            );
            const formattedSubSubs: SubSubMenuProps[] = subSubsRaw.map((el) => ({
            parent: el.parentId!,
            title: el.menuName,
            link: el.menuPath,
            }));
            setMenus(mainMenus);
            setSubMenus(formattedSubs);
            setSubSubMenus(formattedSubSubs);
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

    const handleClick = (item: MenuProps) => {
        if (!dragEnabled) {
        setEditingId(item.menuId);
        setEditingText(item.menuName);
        }
    };

    const handleEditConfirm = (id: string) => {
        setMenus((prev) =>
        prev.map((m) => (m.menuId === id ? { ...m, menuName: editingText } : m))
        );
        setEditingId(null);
    };

    return (
        <div className="admin-page menu-category">
            <AdminWidget title="헤더 메뉴" />
            <div className="admin-body wrapper">
                <button className={dragEnabled ? 'active' : '' } onClick={() => setDragEnabled(!dragEnabled)}>순서 변경</button>

                <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={menus.map((item) => item.menuId)}
                        strategy={horizontalListSortingStrategy}
                    >
                        <div className="menu-bar">
                        {menus.map((item) => (
                            <SortableItem
                            key={item.menuId}
                            item={item}
                            isEditing={editingId === item.menuId}
                            editingText={editingText}
                            onClick={() => handleClick(item)}
                            onChange={setEditingText}
                            onConfirm={() => handleEditConfirm(item.menuId)}
                            dragEnabled={dragEnabled}
                            />
                        ))}
                        </div>
                    </SortableContext>

                    <DragOverlay>
                        {activeId !== null && (
                        <div
                            style={{
                            padding: "10px",
                            border: "1px solid #aaa",
                            backgroundColor: "#e0e0e0",
                            borderRadius: "4px",
                            whiteSpace: "nowrap",
                            }}
                        >
                            {menus.find((item) => item.menuId === activeId)?.menuName}
                        </div>
                        )}
                    </DragOverlay>
                </DndContext>

                <div style={{ marginTop: 20 }}>
                    <h3>SubMenus</h3>
                    <pre>{JSON.stringify(subMenus, null, 2)}</pre>

                    <h3>SubSubMenus</h3>
                    <pre>{JSON.stringify(subSubMenus, null, 2)}</pre>
                </div>
            </div>
        </div>
    );
}

export default MenuCategory;