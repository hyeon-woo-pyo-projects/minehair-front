
import { useNavigate } from "react-router-dom";
import { useSave, SaveOptions } from "../../../components/common/UseSave";
import IconArrowLeft from "../../../icons/IconArrowLeft";
import { useState, useEffect } from "react";

interface BannerProps {
    content: string;
    textColor: string;
    color: string;
    link: string;
    imgUrl: string;
    isPost: boolean;
}

interface WidgetProps {
    title: string;
    status?: boolean;
    saveData?: BannerProps | null;
}

function AdminWidget({ title, status = false, saveData }: WidgetProps) {
    const navigate = useNavigate();

    type BannerSaveData = BannerProps & SaveOptions;
    const { save } = useSave<BannerSaveData>();

    // 버튼 활성/비활성 관리
    const [canSave, setCanSave] = useState(status && !!saveData);

    // 외부 status 변경 시 내부 동기화
    useEffect(() => {
        setCanSave(status && !!saveData);
    }, [status, saveData]);

    const handleSave = async () => {
        if (!saveData) return;
        if (!window.confirm("저장 하시겠습니까?")) return;

        const payload = { ...saveData };
        const dataToSave: BannerSaveData = {
            ...payload,
            call: "patch",
            apiUrl: `/api/banner/0`,
            payload,
        };

        const success = await save(dataToSave);
        if (success) {
            setCanSave(false); // 성공 시에만 버튼 비활성화
        }
    };

    return (
        <div className="admin-widget">
            <button className="back-btn" onClick={() => navigate(-1)}>
                <IconArrowLeft color="var(--color-black)" width={30} />
            </button>

            <h3>{title}</h3>

            <button
                type="button"
                className="save-btn"
                disabled={!canSave}
                onClick={handleSave}
            >
                저장하기
            </button>
        </div>
    );
}

export default AdminWidget;
