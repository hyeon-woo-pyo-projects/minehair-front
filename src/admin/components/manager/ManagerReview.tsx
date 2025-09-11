import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import IconCirclePlus from "../../../icons/IconCirclePlus";
import Balloon from "../../../components/system/Balloon";
import IconTrash from "../../../icons/IconTrash";

interface DataProps {
    id: number;
    name: string;
    orderNo: number;
}

function ManagerReview() {
    const navigate = useNavigate();
    const [data, setData] = useState<DataProps[]>([]); // 카테고리 리스트
    const [balloon, setBalloon] = useState(0);
    const [disabled, setDisabled] = useState(true);
    const [edit, setEdit] = useState(false);

    // 입력값 (id 포함)
    const [formData, setFormData] = useState<{ id?: number; name: string }>({
        name: "",
    });

    function getData() {
        axiosInstance
            .get("/board/review/category")
            .then((res) => {
                if (res.data.success === true) {
                    setData(res.data.data);
                }
            })
            .catch((err) => {
                if (err.status === 401) navigate("/expired");
                else {
                    alert("오류가 발생했습니다");
                    console.log(err);
                }
            });
    }

    function handleNew() {
        setDisabled(false);
        setFormData({ name: "" });
        setEdit(false);
    }

    function handleEdit(item: DataProps) {
        setDisabled(false);
        setFormData({ id: item.id, name: item.name });
        setEdit(true);
    }

    function handleSave() {
        if (!formData.name.trim()) {
            setBalloon(1);
            return;
        }

        const apiCall = edit
            ? axiosInstance.patch(`/board/review/category/${formData.id}`, formData) // 수정
            : axiosInstance.post("/board/review/category", formData); // 신규

        apiCall
            .then((res) => {
                if (res.data.success) {
                    getData();
                    setDisabled(true);
                    setBalloon(0);
                    setEdit(false);
                    alert(edit ? "수정했습니다." : "저장했습니다.");
                }
            })
            .catch((err) => {
                if (err.status === 401) navigate("/expired");
                else {
                    alert("저장 중 오류가 발생했습니다.");
                    console.log(err);
                }
            });
    }

    function handleDelete(){
        if ( !window.confirm('삭제하시겠습니까?') ) return;

        axiosInstance
        .delete(`/board/review/category/${formData.id}`)
        .then((res) => { if ( res.data.success === true ) { alert('삭제되었습니다'); window.location.reload(); }})
        .catch((err) => { if (err.status === 401) navigate("/expired"); else { alert("저장 중 오류가 발생했습니다."); console.log(err); }});
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="admin-page" id="manager-review">
            <div className="admin-body inner">
                <h1 className="admin-title">리뷰 카테고리 관리</h1>

                {data.length > 0 ? (
                    <nav className="contents-view nav-view">
                        {data.map((el) => (
                            <li key={el.id} onClick={() => handleEdit(el)}>
                                {el.name}
                            </li>
                        ))}
                    </nav>
                ) : (
                    <p className="empty-notice">데이터가 없습니다.</p>
                )}

                <form className="admin-form">
                    <div className="center-menu">
                        <button
                            className="add-btn"
                            type="button"
                            onClick={handleNew}
                        >
                            <IconCirclePlus color="var(--color-black)" />
                            카테고리 생성
                        </button>
                    </div>

                    <ul>
                        <li className="w-48">
                            {balloon === 1 && (
                                <Balloon
                                    text={"카테고리를 입력해주세요."}
                                    status={"notice"}
                                />
                            )}
                            <span className="admin-form-title">카테고리</span>

                            <div className="input-area">
                                <input
                                    type="text"
                                    placeholder="카테고리"
                                    disabled={disabled}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    value={formData.name}
                                />
                            </div>
                        </li>

                        { edit === true &&
                            <li className="w-48">
                                <span className="admin-form-title">카테고리 삭제</span>

                                <div className="input-area">
                                    <button type="button" className="red-btn" onClick={handleDelete}>
                                        <IconTrash color="var(--color-white"/>
                                        삭제하기
                                    </button>
                                </div>
                            </li>
                        }
                    </ul>

                    <div className="admin-btns">
                        <button
                            className="blackBtn"
                            type="button"
                            onClick={() => navigate(-1)}
                        >
                            뒤로가기
                        </button>
                        <button
                            className="primaryBtn"
                            type="button"
                            disabled={disabled}
                            onClick={handleSave}
                        >
                            저장하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ManagerReview;
