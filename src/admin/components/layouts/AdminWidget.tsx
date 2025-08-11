import { useNavigate } from "react-router-dom";
import { useSave, SaveOptions } from "../../../components/common/UseSave";
import IconArrowLeft from "../../../icons/IconArrowLeft";
import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../../api/axiosInstance";

interface WidgetProps<T extends SaveOptions> {
    title: string;
    status?: boolean;
    saveData?: T | null;
    imageFile?: File | null;
    uploadImageFile?: (file: File) => Promise<string | null>;
    onUploadSuccess?: (uploadedUrl: string) => void;
    onClearImageFile?: () => void;
    setSave?: React.Dispatch<React.SetStateAction<boolean>>;
    onSave?: () => Promise<void | boolean>;
}

function AdminWidget<T extends SaveOptions>({
    title,
    status = false,
    saveData,
    imageFile,
    uploadImageFile,
    onUploadSuccess,
    onClearImageFile,
    setSave,
    onSave,
}: WidgetProps<T>) {
    const navigate = useNavigate();
    const { save, loading } = useSave<T>();

    const [canSave, setCanSave] = useState(status && !!saveData);
    const initialDataRef = useRef<T | null>(null);

    useEffect(() => {
        if (saveData && !initialDataRef.current) {
            initialDataRef.current = JSON.parse(JSON.stringify(saveData)); // deep copy
        }
    }, [saveData]);

    // 변경 여부 감지
    useEffect(() => {
        if (!saveData || !initialDataRef.current) return;
        const isChanged = JSON.stringify(saveData) !== JSON.stringify(initialDataRef.current);
        setCanSave(isChanged);
    }, [saveData]);

    const handleSave = async () => {
        if (!saveData) return;

        if (onSave) {
            await onSave();
            return;
        }

        console.log(saveData)

        if (!window.confirm("저장 하시겠습니까?")) return;

        let finalImageUrl = (saveData as any).imageUrl;

        if (imageFile && uploadImageFile) {
            const uploadedUrl = await uploadImageFile(imageFile);
            if (!uploadedUrl) return;
            finalImageUrl = uploadedUrl;
            onUploadSuccess?.(uploadedUrl);
        }

        const payload = {
            ...saveData,
            imageUrl: finalImageUrl,
        };

        let success = false;

        // menuId 존재 시 PATCH
        if ((payload as any).menuId) {
            try {
                const res = await axiosInstance.patch(`/role-menus/${(payload as any).menuId}`, payload);
                success = res.data.success;
            } catch (err) {
                console.error(err);
                alert("저장 중 오류가 발생했습니다.");
                return;
            }
        } else {
            // 다른 페이지에서 사용되는 경우 기존 save() 함수 사용
            const dataToSave = { ...payload, payload };
            success = await save(dataToSave);
        }

        if (success) {
            setCanSave(false);
            setSave?.(false);
            onClearImageFile?.();
            alert("저장되었습니다");
            // 저장 후 초기 데이터 업데이트
            initialDataRef.current = JSON.parse(JSON.stringify(payload));
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
                disabled={!canSave || loading}
                onClick={handleSave}
            >
                저장하기
            </button>
        </div>
    );
}

export default AdminWidget;
