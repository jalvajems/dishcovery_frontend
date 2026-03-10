import { Route, Routes } from 'react-router-dom';
import LandingPage from '@/pages/shared/LandingPage';

function PublicRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
        </Routes>
    );
}

export default PublicRoutes;
