
import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";

export interface SaveOptions {
    call?: "post" | "patch" | "put" | "delete" | string;
    apiUrl?: string;
    payload?: any;
}

export function useSave<T extends SaveOptions = SaveOptions>() {
    const [loading, setLoading] = useState(false);
    
    const save = async (data?: T): Promise<boolean> => {
        if (!data) return false;
        setLoading(true);

        try {
            if (data.call === "patch" && data.apiUrl) {
                await axiosInstance.patch(data.apiUrl, data.payload);
            }
            return true;
        } catch (error) {
            console.error("Save failed:", error);
            if (error instanceof Error) {
                alert(`저장에 실패했습니다: ${error.message}`);
            } else {
                alert("저장 중 알 수 없는 오류가 발생했습니다.");
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { loading, save };
}
