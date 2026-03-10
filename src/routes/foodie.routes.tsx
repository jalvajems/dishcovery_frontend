import RecipeListing from '@/pages/user/RecipeListing.foodie';
import FoodieDashBoard from '@/pages/user/FoodieDashboard';
import FoodieLayout from '@/pages/user/FoodieLayout';
import { Route, Routes } from 'react-router-dom';
import RecipeDetailFoodie from '@/pages/user/RecipeDetail.foodie';
import ReviewPage from '@/components/shared/ReviewPage';

function UserRouter() {
  return (
    <Routes>
      <Route path="/foodie" element={<FoodieLayout />}>
        <Route path="dashboard" element={<FoodieDashBoard />} />
        <Route path="recipe-listing" element={<RecipeListing />} />
      </Route>

      <Route path="/foodie/recipe-detail/:id" element={<RecipeDetailFoodie />} />

      {/* UNIVERSAL REVIEW PAGE */}
      <Route path="/foodie/review/:id" element={<ReviewPage reviewableType="Recipe" />} />
    </Routes>
  );
}

export default UserRouter;
