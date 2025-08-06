import { Outlet } from 'react-router-dom';
import AdminFixHeader from './components/layouts/AdminFixHeader';
import { useState } from 'react';

function AdminLayout() {
    const [ loading, setLoading ] = useState(false)
    return (
    <>
        <AdminFixHeader />
        <Outlet />
    </>
    );
}

export default AdminLayout;
