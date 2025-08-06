// hooks/useSave.ts
import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";

export interface SaveOptions {
    call?: "post" | "patch" | "put" | "delete" | string;
    apiUrl?: string;
    payload?: any;
}

export function useSave<T extends SaveOptions = SaveOptions>() {
    const [loading, setLoading] = useState(false);

    const save = async (data?: T): Promise<void> => {
        if (!data) return;
        setLoading(true);
        try {
            if (data.call === "patch" && data.apiUrl) {
                axiosInstance.patch(data.apiUrl, data.payload);
            }
        // 기타 처리...
        } finally {
        setLoading(false);
        }
    };

    return { loading, save };
}
