import { useNavigate } from "react-router-dom";
import { useSave, SaveOptions } from "../../../components/common/UseSave";
import IconArrowLeft from "../../../icons/IconArrowLeft";
import { useState, useEffect } from "react";

interface WidgetProps<T extends SaveOptions> {
  title: string;
  status?: boolean;
  saveData?: T | null;
}

function AdminWidget<T extends SaveOptions>({ title, status = false, saveData }: WidgetProps<T>) {
  const navigate = useNavigate();
  const { save, loading } = useSave<T>();

  const [canSave, setCanSave] = useState(status && !!saveData);

  useEffect(() => {
    setCanSave(status && !!saveData);
  }, [status, saveData]);

  const handleSave = async () => {
    if (!saveData) return;
    if (!window.confirm("저장 하시겠습니까?")) return;

    const payload = { ...saveData };
    const dataToSave = {
      ...payload,
      payload,
    };

    const success = await save(dataToSave);
    if (success) {
      setCanSave(false);
      alert("저장되었습니다");
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
