import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";

interface DataProps {
    id: number;
    componentType: string;
    linkUrl: string;
    content: string;
    imageUrl: string;
}

function CounsultationIconDummy() {
    const [data, setData] = useState<DataProps[]>([]);

    function getData() {
        axiosInstance
            .get("/homepage/component/HEADER_CONSULTING_INNER_BUTTON")
            .then((res) => {
                if (res.data.success === true) {
                    const data = res.data.data;
                    const logoData = data.filter(
                        (el: DataProps) =>
                            el.componentType === "HEADER_CONSULTING_INNER_BUTTON"
                    );
                    setData(logoData);
                }
            });
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="consultation-menu">
            <ul className="consultation-body">
                {data.map((el) => (
                    <li key={el.id} style={{ cursor: "pointer" }}>
                        <a
                            href={el.linkUrl?.startsWith('http') 
                            ? el.linkUrl 
                            : `https://${el.linkUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img src={el.imageUrl} alt="퀵 이미지" />
                            <p>{el.content}</p>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CounsultationIconDummy;
