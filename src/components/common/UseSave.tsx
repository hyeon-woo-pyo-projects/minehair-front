import { useState } from "react";

export function useSave() {
    const [loading, setLoading] = useState(false);

    function save() {
        // setLoading(true);
        console.log('!!!')

        const save = async (data?: any) => {
            console.log(data)
            if (!data) return; // 데이터 없을 경우 예외 처리
            setLoading(true);
            try {
                // 예시: API 호출
                await fetch("/api/save", {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            } finally {
                setLoading(false);
            }
        };
    }

    return { loading, save };
}
