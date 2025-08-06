import { Outlet } from 'react-router-dom';
import AdminFixHeader from './components/layouts/AdminFixHeader';

function AdminLayout() {
    return (
    <>
        <AdminFixHeader />
        <Outlet />
    </>
    );
}

export default AdminLayout;
