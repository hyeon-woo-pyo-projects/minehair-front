import React, { useEffect, useState, useRef } from "react";
import { SaveOptions } from "../../../components/common/UseSave";
import AdminWidget from "../layouts/AdminWidget";
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

/** --- 타입 정의 --- */
interface MenuProps {
    id: number; // DB PK (component 내부에서 사용하는 id)
    menuId: number; // 실제 메뉴 식별자 (서버 ID)
    menuName: string;
    newPath: string; // 링크 이름 (short)
    menuPath: string; // full path like /parent/child/slug
    menuOrderNo: number; // 순서
    menuType: "MAJOR" | "MINOR" | "SUB" | string;
    menuVisible: "true" | "false" | string;
    parentId: number | null; // parent menuId
    imageUrl?: string;
    // 기타 필드 존재 시 확장 가능
}

/** saveData 타입 (AdminWidget에 전달할 형태) */
interface SaveProps extends SaveOptions {
    menuId: number;
    parentId: number | null;
    menuName: string;
    menuPath: string;
    imageUrl?: string;
    menuVisible: string;
    menuType: string;
    orderNo: number;
    roles?: number[]; // 필요 시
    // 순서 변경이 있을 경우 서버에 전달할 batch 정보도 포함할 수 있음
    orderChanges?: { menuId: number; menuOrderNo: number }[];
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

/** --- 컴포넌트 --- */
function AdminCategory() {
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
        id: 0,
        menuName: "새 메뉴",
        menuPath: "",
        newPath: "",
        menuVisible: "true",
        menuType: "",
        selection01: "",
        selection02: "",
        selection03: "",
        imageUrl: "",
    };
    const [form, setForm] = useState<typeof initialForm>(initialForm);
    const [disabled, setDisabled] = useState(true);

    // 저장 버튼 활성화 상태: AdminWidget에 전달
    const [saveFlag, setSaveFlag] = useState(false);

    // 이미지 파일을 임시로 가지고 있을 경우 (업로드용)
    const [imageFile, setImageFile] = useState<File | null>(null);

    // DnD sensors
    const sensors = useSensors(useSensor(PointerSensor));

    // 초기 로드: 메뉴 불러오기
    useEffect(() => {
        fetchMenu();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function fetchMenu() {
        try {
            const res = await axiosInstance.get("/role-menus/admin");
            if (res.data && res.data.success) {
                const data: MenuProps[] = res.data.data;
                console.log(res)
                // 분류
                const majors = data.filter((d) => d.menuType === "MAJOR" && d.parentId === null);
                const minors = data.filter((d) => d.menuType === "MINOR" && d.parentId !== null);
                const subs = data.filter((d) => d.menuType === "SUB" && d.parentId !== null);

                setWholeMenu(data);
                setMajorMenu(majors);
                setMinorMenu(minors);
                setSubMenu(subs);

                setMajorMenuSorted(majors);
                setMinorMenuSorted(minors);
                setSubMenuSorted(subs);
            } else {
                console.error("role-menus/admin 응답이 성공이 아닙니다.", res.data);
            }
        } catch (err) {
            console.error(err);
        }
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
                id: selectedMenu.id ?? 0,
                menuName: selectedMenu.menuName ?? "",
                menuPath: selectedMenu.menuPath ?? "",
                newPath,
                menuVisible: selectedMenu.menuVisible ?? "true",
                menuType: selectedMenu.menuType ?? "",
                selection01: selectedMenu.menuType ?? "",
                selection02,
                selection03,
                imageUrl: selectedMenu.imageUrl ?? "",
            });
        } else {
            setForm(initialForm);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMenu, minorMenu]);

    function handleMenuChangeMode() {
        setChangeMenu((prev) => !prev);
    }

    function menuClicked(menu: MenuProps) {
        setSelectedMenu(menu);
        setDisabled(false);
        setSaveFlag(false);
        setImageFile(null);
    }

    function handleFormChange(changes: Partial<typeof form>) {
        setForm((prev) => ({ ...prev, ...changes }));
        setSaveFlag(true); // 변경 시 저장 활성화
    }

    /** 이미지 파일 선택 */
    function handleImageSelect(file: File | null) {
        setImageFile(file);
        setSaveFlag(true);
    }

    /** 드래그 오버 (중간에 위치 변경 보이기 용) */
    function handleDragOver(event: DragOverEvent, level: "major" | "minor" | "sub", parentMenuId?: number) {
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
            const filtered = minorMenuSorted.filter((m) => m.parentId === parentMenuId);
            const other = minorMenuSorted.filter((m) => m.parentId !== parentMenuId);
            const oldIndex = filtered.findIndex((item) => item.id === active.id);
            const newIndex = filtered.findIndex((item) => item.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                const newFiltered = arrayMove(filtered, oldIndex, newIndex);
                setMinorMenuSorted([...other, ...newFiltered]);
            }
        }

        if (level === "sub") {
            const filtered = subMenuSorted.filter((m) => m.parentId === parentMenuId);
            const other = subMenuSorted.filter((m) => m.parentId !== parentMenuId);
            const oldIndex = filtered.findIndex((item) => item.id === active.id);
            const newIndex = filtered.findIndex((item) => item.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                const newFiltered = arrayMove(filtered, oldIndex, newIndex);
                setSubMenuSorted([...other, ...newFiltered]);
            }
        }
    }

    /** 드래그 끝났을 때 실제 reorder 반영 (드래그모드일 때만) */
    function handleDragEnd(event: DragEndEvent, level: "major" | "minor" | "sub", parentMenuId?: number) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        let changed = false;

        if (level === "major") {
            const oldIndex = majorMenuSorted.findIndex((item) => item.id === active.id);
            const newIndex = majorMenuSorted.findIndex((item) => item.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                setMajorMenuSorted((prev) => {
                    const next = arrayMove(prev, oldIndex, newIndex);
                    return next;
                });
                changed = true;
            }
        }

        if (level === "minor") {
            const filtered = minorMenuSorted.filter((m) => m.parentId === parentMenuId);
            const other = minorMenuSorted.filter((m) => m.parentId !== parentMenuId);
            const oldIndex = filtered.findIndex((item) => item.id === active.id);
            const newIndex = filtered.findIndex((item) => item.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                const newFiltered = arrayMove(filtered, oldIndex, newIndex);
                setMinorMenuSorted([...other, ...newFiltered]);
                changed = true;
            }
        }

        if (level === "sub") {
            const filtered = subMenuSorted.filter((m) => m.parentId === parentMenuId);
            const other = subMenuSorted.filter((m) => m.parentId !== parentMenuId);
            const oldIndex = filtered.findIndex((item) => item.id === active.id);
            const newIndex = filtered.findIndex((item) => item.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                const newFiltered = arrayMove(filtered, oldIndex, newIndex);
                setSubMenuSorted([...other, ...newFiltered]);
                changed = true;
            }
        }

        if (changed) {
            // 순서 변경은 saveFlag로 표시 -> 저장 버튼 활성화
            setSaveFlag(true);
        }
    }

    /** image upload helper (AdminWidget에 전달할 것) */
    const uploadImageFile = async (file: File): Promise<string | null> => {
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await axiosInstance.post("/upload", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // 서버 응답에서 URL 경로가 달라질 수 있으니 확인 필요
            return res.data?.url ?? res.data?.data?.url ?? null;
        } catch (err) {
            console.error("이미지 업로드 실패", err);
            return null;
        }
    };
    
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

    /** AdminWidget에 전달할 saveData (선택 메뉴에 기반) */
    const saveData: SaveProps | null = selectedMenu
        ? {
              menuId: selectedMenu.menuId,
              parentId:
                  form.selection01 === "MAJOR"
                      ? null
                      : form.selection01 === "MINOR"
                      ? Number(form.selection02 || null)
                      : Number(form.selection03 || null),
              menuName: form.menuName,
              menuPath:
                  form.selection01 === "MAJOR"
                      ? `/${form.newPath}`
                      : form.selection01 === "MINOR"
                      ? `/${majorMenu.find((m) => m.menuId === Number(form.selection02))?.newPath ?? ""}/${form.newPath}`
                      : `/${majorMenu.find((m) => m.menuId === Number(form.selection02))?.newPath ?? ""}/${
                            minorMenu.find((m) => m.menuId === Number(form.selection03))?.newPath ?? ""
                        }/${form.newPath}`,
              imageUrl: form.imageUrl ?? "",
              menuVisible: form.menuVisible,
              menuType: form.selection01,
              orderNo: selectedMenu.menuOrderNo,
              roles: [],
              // orderChanges는 별도 엔드포인트 없는 경우에도 포함시켜서 서버가 처리하게 할 수 있음
              orderChanges: [], // 주된 순서 저장은 saveOrderChanges에서 따로 처리
          }
        : null;

    /** AdminWidget이 Save 버튼 눌렀을 때 먼저 호출될 콜백
     * (AdminWidget은 이 콜백을 호출하고 true를 반환 받을 때 계속 진행한다고 가정)
     */
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
        setSaveFlag(true);
    };

    /** 이미지 삭제 (폼의 imageUrl 제거) */
    const handleDeleteImageFromForm = () => {
        setForm((prev) => ({ ...prev, imageUrl: "" }));
        setImageFile(null);
        setSaveFlag(true);
    };

    return (
        <div className="admin-page menu-category">
            <AdminWidget<SaveProps>
                title="헤더 메뉴"
                status={saveFlag}
                saveData={saveData}
                imageFile={imageFile}
                uploadImageFile={uploadImageFile}
                onUploadSuccess={(uploadedUrl) => setForm((prev) => (prev ? { ...prev, imageUrl: uploadedUrl } : prev))}
                onClearImageFile={() => setImageFile(null)}
                setSave={setSaveFlag}
                onSave={handleBeforeSave} // AdminWidget이 저장 전 콜백으로 호출해야 함
            />

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
                            onClick={handleMenuChangeMode}
                        >
                            <i className="ball"></i>
                        </button>
                    </div>
                </div>

                <div className="menu-bar">
                    {/* 대메뉴 DnD 컨텍스트 */}
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragOver={(e) => handleDragOver(e, "major")} onDragEnd={(e) => handleDragEnd(e, "major")}>
                        <SortableContext items={majorMenuSorted.map((m) => m.id)} strategy={verticalListSortingStrategy}>
                            {majorMenuSorted.map((major) => (
                                <ul key={major.id}>
                                    <SortableItem id={major.id} disabled={!changeMenu}>
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
                                        <SortableContext items={minorMenuSorted.filter((m) => m.parentId === major.menuId).map((m) => m.id)} strategy={verticalListSortingStrategy}>
                                            {minorMenuSorted
                                                .filter((minor) => minor.parentId === major.menuId)
                                                .map((minor) => (
                                                    <div key={minor.id}>
                                                        <SortableItem id={minor.id} disabled={!changeMenu}>
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
                                                            <SortableContext items={subMenuSorted.filter((s) => s.parentId === minor.menuId).map((s) => s.id)} strategy={verticalListSortingStrategy}>
                                                                {subMenuSorted
                                                                    .filter((sub) => sub.parentId === minor.menuId)
                                                                    .map((sub) => (
                                                                        <SortableItem id={sub.id} key={sub.id} disabled={!changeMenu}>
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
                                <input id="menuName" type="text" placeholder="메뉴 이름" value={form.menuName} onChange={(e) => handleFormChange({ menuName: e.target.value })} disabled={disabled} />
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">링크명</span>
                            <div className="input-area">
                                <input id="menuPath" type="text" placeholder="링크명" value={form.newPath} onChange={(e) => handleFormChange({ newPath: e.target.value })} disabled={disabled} />
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
                    </ul>
                </form>
            </div>
        </div>
    );
}

export default AdminCategory;
