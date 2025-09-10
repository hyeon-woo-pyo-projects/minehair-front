import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import '../../style/pages/pages.css';
import { useNavigate } from 'react-router-dom';
import IconArrowDown from '../../icons/IconArrowDown';

interface DataProps {
  id: number;
  title: string;
  content: string;
  author: string;
  viewCount: number;
}

function QnA() {
  const navigate = useNavigate();
  const [data, setData] = useState<DataProps[]>([]);
  const [openIds, setOpenIds] = useState<number[]>([]); // ✅ 여러 항목 가능

  const getData = () => {
    axiosInstance
      .get('/board/qna/page')
      .then((res) => {
        if (res.data?.success === true) {
          setData(res.data.data || []);
        }
      })
      .catch((err: any) => {
        const status = err?.response?.status ?? err?.status;
        if (status === 401) {
          alert('회원만 조회 가능합니다');
          navigate(-1);
        } else {
          alert('오류가 발생했습니다');
          console.error(err);
        }
      });
  };

  useEffect(() => {
    getData();
  }, []);

  // ✅ toggle: 배열 안에 있으면 제거, 없으면 추가
  const handleToggle = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="pages" id="pages-qna">
      <h1 className="page-title">Q&A</h1>

      <div className="pages-body inner">
        <div className="contents-view">
          {data.length > 0 ? (
            data.map((el) => {
              const isOpen = openIds.includes(el.id);
              return (
                <div className="qna" key={el.id}>
                  <div
                    className="question"
                    onClick={() => handleToggle(el.id)}
                    role="button"
                    aria-expanded={isOpen}
                  >
                    <p>
                      <span>Q.</span> {el.title}
                    </p>

                    <span className={`arrow ${isOpen ? 'open' : ''}`} aria-hidden>
                      <IconArrowDown color="var(--color-black)" />
                    </span>
                  </div>

                  <div className={`answer ${isOpen ? 'open' : ''}`}>
                    <p>
                      <span>A.</span> {el.content}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="empty-notice">데이터가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default QnA;
