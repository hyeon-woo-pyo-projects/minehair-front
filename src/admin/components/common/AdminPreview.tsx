import { useEffect, useState } from "react";
import AdminWidget from "../layouts/AdminWidget";
import IconUpload from "../../../icons/IconUpload";

interface PreviewProps {
  location: string;
  ogTitle: string;
  ogDescription: string;
  ogImg: string;
}

function AdminPreview() {
    const [preview, setPreview] = useState<PreviewProps>({
        location: "",
        ogTitle: "",
        ogDescription: "",
        ogImg: "",
    });

    useEffect(() => {
        setPreview((prev) => ({
        ...prev,
        location: window.location.origin,
        }));
    }, []);

    const handleChange = (key: keyof PreviewProps, value: string) => {
        setPreview((prev) => ({
        ...prev,
        [key]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.includes("image")) {
        alert("이미지 형식만 업로드 가능합니다.");
        return;
        }

        // 미리보기용 URL 생성
        const previewUrl = URL.createObjectURL(file);

        setPreview((prev) => ({
        ...prev,
        ogImg: previewUrl,
        }));
    };

    return (
        <div className="admin-page" id="admin-preview">
        <AdminWidget title={"미리보기 링크"} />

        <div className="admin-body inner">
            <div className="preview">
            <div className="img-line">
                {preview.ogImg ? (
                <img src={preview.ogImg} alt="미리보기 이미지" />
                ) : null}
            </div>

            <div className="text-line">
                <p className="title">{preview.ogTitle}</p>
                <p className="description">{preview.ogDescription}</p>
                <p className="url">{preview.location}</p>
            </div>
            </div>

            <form className="admin-form" id="admin-preview-form">
            <ul>
                <li>
                <span className="admin-form-title">링크</span>

                <div className="input-area">
                    <input type="text" value={preview.location} disabled />
                </div>
                </li>

                <li>
                <span className="admin-form-title">타이틀</span>

                <div className="input-area">
                    <input
                    type="text"
                    value={preview.ogTitle}
                    onChange={(e) => handleChange("ogTitle", e.target.value)}
                    />
                </div>
                </li>

                <li>
                <span className="admin-form-title">설명</span>

                <div className="input-area">
                    <input
                    type="text"
                    value={preview.ogDescription}
                    onChange={(e) =>
                        handleChange("ogDescription", e.target.value)
                    }
                    />
                </div>
                </li>

                <li>
                <span className="admin-form-title">이미지</span>

                <div className="input-area">
                    <input
                    type="file"
                    id="preview-img"
                    onChange={handleFileChange}
                    accept="image/*"
                    />
                    <label htmlFor="preview-img">
                    <IconUpload color="var(--color-white)" />
                    이미지 업로드
                    </label>
                </div>
                </li>
            </ul>
            </form>
        </div>
        </div>
    );
}

export default AdminPreview;
