import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import AdminWidget from "../layouts/AdminWidget";
import { useNavigate } from "react-router-dom";
import IconTrash from "../../../icons/IconTrash";
import IconCirclePlus from "../../../icons/IconCirclePlus";

interface getDataProps {
    id: number;
    code: string;
    description: string;
    name: string;
}

function AdminConsultation() {
    const [save, setSave] = useState(false);
    const navigate = useNavigate();
    const [current, setCurrent] = useState<getDataProps[]>([]);
    const [deleteItems, setDeleteItems] = useState<number[]>([]); // 삭제할 id 배열
    const [newItems, setNewItems] = useState<string[]>([]); // 새로 추가할 name 배열

    function getData() {
        axiosInstance.get("/consultation/categories")
        .then((response) => {
            if (response.data.success === true) {
                setCurrent(response.data.data);
            }
        });
    }

    useEffect(() => {
        getData();
    }, []);

    function removeItems(data: getDataProps) {
        if (!window.confirm("삭제하시겠습니까?\n(삭제 후 저장하기를 눌러주세요)")) return;

        // UI에서 즉시 제거
        setCurrent((prev) => prev.filter((item) => item.id !== data.id));

        // 삭제 목록 누적
        setDeleteItems((prev) => [...prev, data.id]);

        // 저장 버튼 활성화
        setSave(true);
    }

    function addItem() {
        setNewItems((prev) => [...prev, ""]);
        setSave(true);
    }

    function handleNewItemChange(index: number, value: string) {
        const updated = [...newItems];
        updated[index] = value;
        setNewItems(updated);
    }

    async function handleSave() {
        if (!window.confirm("저장 하시겠습니까?")) return;

        try {
            // 삭제 처리
            if (deleteItems.length > 0) {
                await Promise.all(
                    deleteItems.map((el) =>
                        axiosInstance.delete(`/consultation/categories/${el}`)
                    )
                );
                setDeleteItems([]);
            }

            // 추가 처리
            if (newItems.length > 0) {
                await Promise.all(
                    newItems.map((el) =>
                        axiosInstance.post(`/consultation/categories`, {
                            code: el,
                            name: el,
                        })
                    )
                );
                setNewItems([]);
            }

            alert("저장이 완료되었습니다.");
            setSave(false);

            // 저장 끝난 뒤 데이터 갱신
            await getData();
        } catch (err) {
            alert("저장 중 오류가 발생했습니다.");
        }
    }

    return (
        <div className="admin-page" id="admin-consulation">
            <div className="admin-body inner">
                <h1 className="admin-title">상담 카테고리</h1>

                <div className="admin-body-header">
                    <span className="admin-form-title">현재 목록</span>
                </div>

                <form className="admin-form" id="admin-consulation-form">
                    <ul>
                        <li>
                            <div className="input-area">
                                <div className="consultation-items">
                                    {current.map((data) => (
                                        <p key={data.id}>
                                            {data.name}
                                            <i onClick={() => removeItems(data)}>
                                                <IconTrash color="var(--color-red)" />
                                            </i>
                                        </p>
                                    ))}

                                    {newItems.map((item, index) => (
                                        <p key={`new-${index}`}>
                                            <input
                                                type="text"
                                                value={item}
                                                placeholder="새 카테고리 입력"
                                                onChange={(e) =>
                                                    handleNewItemChange(index, e.target.value)
                                                }
                                            />
                                        </p>
                                    ))}

                                    <p onClick={addItem} style={{ cursor: "pointer" }}>
                                        <IconCirclePlus color="var(--color-black)" />
                                    </p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </form>

                <div className="admin-btns">
                    <button className="blackBtn" type="button" onClick={() => navigate(-1)}>
                        뒤로가기
                    </button>
                    <button
                        className="primaryBtn"
                        type="button"
                        onClick={handleSave}
                        disabled={!save}
                    >
                        저장하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminConsultation;
