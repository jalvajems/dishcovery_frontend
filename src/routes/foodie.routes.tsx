import RecipeListing from '@/pages/user/RecipeListing.foodie';
import FoodieDashBoard from '@/pages/user/FoodieDashboard';
import FoodieLayout from '@/pages/user/FoodieLayout';
import { Route, Routes } from 'react-router-dom';
import RecipeDetailFoodie from '@/pages/user/RecipeDetail.foodie';
import ReviewPage from '@/components/shared/ReviewPage';
import BlogDetailPage from '@/pages/user/BlogDetail.foodie';
import BlogListFoodie from '@/pages/user/BlogList.foodie';
import ProfileFoodie from '@/pages/user/Profile.foodie';
import AddFoodieProfile from '@/pages/user/AddProfile.foodie';
import EditFoodieProfile from '@/pages/user/EditProfile';
import FoodSpotListing from '@/pages/user/FoodSpotsList.foodie';
import { FoodSpotDetailPage } from '@/pages/user/FoodSpotDetail.foodie';
import AddFoodSpot from '@/pages/user/AddFoodSpot.foodie';
import EditFoodSpot from '@/pages/user/EditFoodSpot';
import MyFoodSpotList from '@/pages/user/MyFoodSpotsList.foodie';
import WorkshopDiscovery from '@/pages/user/WorkshopDiscovery.foodie';
import WorkshopDetailFoodie from '@/pages/user/WorkshopDetail.foodie';
import MyWorkshopsFoodie from '@/pages/user/MyWorkshops.foodie';
import LiveSession from '@/pages/shared/LiveSession';
import WorkshopSummary from '@/pages/shared/WorkshopSummary';

function UserRouter() {
    return (
        <Routes>
            <Route path="/foodie" element={<FoodieLayout />}>
                <Route path="dashboard" element={<FoodieDashBoard />} />
                <Route path="recipe-listing" element={<RecipeListing />} />
                <Route path="blog-listing" element={<BlogListFoodie />} />
                <Route path="spot-listing" element={<FoodSpotListing />} />
                <Route path="myspot-listing" element={<MyFoodSpotList />} />
                <Route path="workshop-discovery" element={<WorkshopDiscovery />} />
                <Route path="my-workshops" element={<MyWorkshopsFoodie />} />
            </Route>

            <Route path="/foodie/recipe-detail/:id" element={<RecipeDetailFoodie />} />
            <Route path="/foodie/review/:id" element={<ReviewPage reviewableType="Recipe" />} />

            <Route path="/foodie/blog-detail/:blogId" element={<BlogDetailPage />} />

            <Route path='/foodie/profile' element={<ProfileFoodie />} />
            <Route path='/foodie/profile-add' element={<AddFoodieProfile />} />
            <Route path='/foodie/profile-edit/:id' element={<EditFoodieProfile />} />

            <Route path='/foodie/foodspot/:id' element={<FoodSpotDetailPage />} />
            <Route path='/foodie/foodspot-add' element={<AddFoodSpot />} />
            <Route path='/foodie/foodspot-edit/:id' element={<EditFoodSpot />} />
            <Route path="/foodie/workshop-detail/:id" element={<WorkshopDetailFoodie />} />
            <Route path="/foodie/live-session/:workshopId" element={<LiveSession />} />
            <Route path="/foodie/workshop-summary/:workshopId" element={<WorkshopSummary />} />
        </Routes>
    );
}

export default UserRouter;
