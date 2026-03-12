import { Route } from 'react-router-dom';
import LandingPage from '@/pages/shared/LandingPage';

function PublicRoutes() {
    return (
        <>
            <Route path="/" element={<LandingPage />} />
        </>
    );
}

export default PublicRoutes;
