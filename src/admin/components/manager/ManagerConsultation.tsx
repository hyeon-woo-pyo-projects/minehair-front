import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

interface DataProps {
    id: number;
    name: string;
    phone: string;
}

interface CategoryProps {
    id: number;
    code: string;
    description: string;
    name: string;
}

function ManagerConsultation() {
    const [data, setData] = useState<DataProps[]>([]);
    const [getCategory, setGetCategory] = useState<CategoryProps[]>([]);

    // 카테고리 목록 가져오기
    function category() {
        return axiosInstance
            .get("/consultation/categories")
            .then((result) => {
                if (result.data.success === true) {
                    setGetCategory(result.data.data);
                }
            })
            .catch((err) => {
                console.error("카테고리 불러오기 오류:", err);
            });
    }

    // 상담 접수 데이터 가져오기
    function getData() {
        return axiosInstance
            .get("/consultation/reception")
            .then((result) => {
                if (result.data.success === true) {
                    setData(result.data.data);
                }
            })
            .catch((err) => {
                console.error("상담 데이터 불러오기 오류:", err);
            });
    }

    // 순서 보장: 카테고리 먼저, 데이터 나중
    useEffect(() => {
        category().then(() => {
            getData();
        });
    }, []);

    const navigate = useNavigate();

    return (
        <div className="admin-page" id="manager-consultation">
            <div className="admin-body inner">
                <h1 className="admin-title">상담 신청자 조회</h1>

                <table id="consultation-table">
                    <colgroup>
                        <col width={'33%'}></col>
                        <col width={'33%'}></col>
                        <col width={'33%'}></col>
                    </colgroup>

                    <thead>
                        <tr>
                            <th>이름</th>
                            <th>전화번호</th>
                            <th>상담시술</th>
                        </tr>
                    </thead>
                </table>
                
                <div className="table-body">
                    <table>
                        <colgroup>
                        { data.length !== 0 ?
                            <>
                                <col width={'33%'}></col>
                                <col width={'33%'}></col>
                                <col width={'33%'}></col>
                            </>
                        :
                            <col width={'100%'}></col>
                        }
                        </colgroup>

                        <tbody>
                            { data.length !== 0 ? 
                                ( data.map((el, index) => {
                                    const matchedCategory = getCategory.find(
                                        (item) => item.id === el.id
                                    );
                                    return (
                                        <tr key={index}>
                                            <td>{el.name}</td>
                                            <td>
                                                <a href={`tel:${el.phone}`}>{el.phone}</a>
                                            </td>
                                            <td>{matchedCategory?.name || "카테고리 없음"}</td>
                                        </tr>
                                    );
                                }))    
                            : 
                                <tr>
                                    <td>데이터가 없습니다.</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>

                <div className="admin-btns">
                    <button className="blackBtn" type="button" onClick={() => navigate(-1)}>뒤로가기</button>
                </div>
            </div>
        </div>
    );
}

export default ManagerConsultation;
