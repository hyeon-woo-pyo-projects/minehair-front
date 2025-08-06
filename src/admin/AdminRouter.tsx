import { Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';

function AdminRouter() {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('roleCode');

    if (!token || role !== 'ROLE_ADMIN') {
        alert('관리자 권한이 필요합니다.');
        return <Navigate to="/" replace />;
    }

    return <AdminLayout/>;
}

export default AdminRouter;
