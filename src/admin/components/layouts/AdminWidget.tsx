import { useNavigate } from "react-router-dom";
import { useSave, SaveOptions } from '../../../components/common/UseSave';
import IconArrowLeft from "../../../icons/IconArrowLeft";

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
    status: boolean;
    saveData?: BannerProps | null;
}

function AdminWidget({ title, status, saveData }: WidgetProps) {
    const navigate = useNavigate();
    
    type BannerSaveData = BannerProps & SaveOptions;
    const { loading, save } = useSave<BannerSaveData>();

    const handleSave = () => {
        if (!saveData) return; // null/undefined 방지
        const payload = { ...saveData };
        const dataToSave: BannerSaveData = {
        ...payload,
        call: "patch",
        apiUrl: `/api/banner/0`,
        payload,
        };

        save(dataToSave);
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
                disabled={!status || !saveData}
                onClick={handleSave}
            >
                저장하기
            </button>
        </div>
    );
}

export default AdminWidget;
