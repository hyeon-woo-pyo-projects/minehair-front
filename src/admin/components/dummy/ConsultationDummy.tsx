import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import IconUpload from "../../../icons/IconUpload";

interface CategoryProps {
    id: number;
    code: string;
    name: string;
}

function ConsultationDummy() {
    const navigate = useNavigate();

    // 상담 카테고리
    const [category, setCategory] = useState<CategoryProps[]>([]);

    // 배경 이미지 URL
    const [background, setBackground] = useState('');

    // 카테고리 가져오기
    function getCategory() {
        axiosInstance
            .get('/consultation/categories')
            .then((res) => {
                if (res.data.success) setCategory(res.data.data);
            })
            .catch((err) => {
                if (err.status === 401) navigate('/expired');
                else console.log(err);
            });
    }

    // 배경 이미지 가져오기
    function getBackground() {
        axiosInstance
            .get('/page/contents/type/CONSULTING_BACKGROUND')
            .then((res) => {
                if (res.data.success && res.data.data.length > 0) {
                    setBackground(res.data.data[0].contentsUrl);
                }
            })
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        getCategory();
        getBackground();
    }, []);

    return (
        <section
            className="consultation-section"
            style={background ? { backgroundImage: `url(${background})` } : {}}
        >
            <div className="inner-form">
                <div className="title-area">
                    <span className="effect-title">상담문의</span>
                    <h1 className="form-title">· 민이헤어 상담문의 ·</h1>
                </div>

                <form>
                    <ul>
                        <li>
                            <label htmlFor="consultation-name">이름</label>
                            <input type="text" id="consultation-name" placeholder="이름 입력" />
                        </li>

                        <li>
                            <label htmlFor="consultation-phone">연락처</label>
                            <input type="text" id="consultation-phone" placeholder="연락처(-없이)" maxLength={11} />
                        </li>

                        <li>
                            <label htmlFor="consultation-purpose">상담 목적</label>
                            <select name="consultation-purpose" id="consultation-purpose" className="w-100">
                                {category.map((el) => (
                                    <option value={el.code} key={el.id}>{el.name}</option>
                                ))}
                            </select>
                        </li>
                    </ul>

                    <button type="button" className="consultation-btn">상담 문의 남기기</button>
                </form>
            </div>
        </section>
    );
}

export default ConsultationDummy;
