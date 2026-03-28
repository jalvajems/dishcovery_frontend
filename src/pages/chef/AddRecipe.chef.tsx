import { useState } from 'react';
import { Upload, ChevronDown, Plus, X, ImageIcon } from 'lucide-react';
import { addRecipePageApi } from '@/api/chefApi';
import { useAuthStore } from '@/store/authStore';
import { showError, showSuccess } from '@/utils/toast';
import { getErrorMessage, logError } from '@/utils/errorHandler';
import { useAwsS3Upload } from '@/hooks/useAwsS3Upload';
import ChefNavbar from '@/components/shared/chef/NavBar.chef';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';

export default function AddRecipe() {
  const [formData, setFormData] = useState({
    title: '',
    cuisine: '',
    cookingTime: '',
    tags: '',
    dietType: '',
    isDraft: true
  });
  type FormErrors = {
    title?: string;
    cuisine?: string;
    cookingTime?: string;
    ingredients?: string;
    steps?: string;
    tags?: string;
    dietType?: string;
    image?: string;
  };

  const [errors, setErrors] = useState<FormErrors>({});

  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);
  const [uploadedImages, setUploadedImages] = useState<string | null>(null);
  const navigate = useNavigate()
  const { isVerifiedUser } = useUserStore()



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation clearing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  };

  const { uploadToS3 } = useAwsS3Upload()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {

      const Image = e.target.files?.[0]
      const url = await uploadToS3(Image)

      setUploadedImages(url)

    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };
   const removeCoverImage = () => {
        setUploadedImages(null);
    };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Recipe name is missing or required";
    }
    if (!formData.tags.trim()) {
      newErrors.tags = "Recipe tag is missing or required";
    }
    if (!formData.dietType.trim()) {
      newErrors.dietType = "Recipe diet type is missing or required";
    }
    if (!uploadedImages?.trim()) {
      newErrors.image = "Recipe image is missing or required";
    }

    if (!formData.cuisine) {
      newErrors.cuisine = "Cuisine selection is missing or required";
    }

    if (!formData.cookingTime || isNaN(Number(formData.cookingTime)) || Number(formData.cookingTime) <= 0) {
      newErrors.cookingTime = "Valid cooking time is missing or required";
    }

    if (ingredients.filter(i => i.trim()).length === 0) {
      newErrors.ingredients = "At least one ingredient is missing or required";
    }

    if (steps.filter(s => s.trim()).length === 0) {
      newErrors.steps = "At least one step is missing or required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const handleSaveRecipe = async () => {
    if (!validateForm()) return;
    try {
      const recipeData = {
        chefId: (useAuthStore.getState().user as unknown as { _id: string })?._id,
        title: formData.title,
        cuisine: formData.cuisine,
        cookingTime: Number(formData.cookingTime) || 0,
        tags: formData.tags ? [formData.tags] : [],
        dietType: formData.dietType ? [formData.dietType] : [],
        ingredients: ingredients.filter(i => i.trim() !== ''),
        images: uploadedImages,
        steps: steps.filter(s => s.trim() !== ''),
        isDraft: formData.isDraft
      }
      const result = await addRecipePageApi(recipeData)
      showSuccess(result.data.message)
      navigate('/chef/recipes-listing')
    } catch (error: unknown) {
      logError(error, 'Save recipe failed');
      const errorMessage = getErrorMessage(error);

      // Handle server-side validation errors (format: "field: message, field2: message")
      if (typeof errorMessage === "string" && errorMessage.includes(":")) {
        const newErrors: FormErrors = {};
        const parts = errorMessage.split(", ");
        parts.forEach(part => {
          const [field, ...messageParts] = part.split(": ");
          if (field && messageParts.length > 0) {
            let fieldName = field.trim().toLowerCase();
            // Map server-side fields to frontend error keys
            if (fieldName === "images") fieldName = "image";
            
            (newErrors as Record<string, string>)[fieldName] = messageParts.join(": ").trim();
          }
        });

        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          showError("Please fix the validation errors");
          return;
        }
      }

      showError(errorMessage || 'Failed to save recipe');
    }
  };

  const handleCancel = () => {
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      <ChefNavbar />

      <main className="max-w-3xl mx-auto px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-green-700 to-emerald-700 bg-clip-text text-transparent">
          Add Recipe
        </h1>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 p-10">
          <div className="space-y-6">
            <div>
              <label htmlFor="recipeName" className="block text-sm font-bold text-gray-900 mb-2">
                Recipe Name
              </label>
              {errors.title && (
                <p className="text-red-500 text-sm mb-1 font-medium">
                  {errors.title}
                </p>
              )}
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter recipe name"
                className="w-full px-4 py-4 bg-green-50 border border-green-100 rounded-xl text-gray-900 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="cuisine" className="block text-sm font-bold text-gray-900 mb-2">
                Category / Cuisine
              </label>
              {errors.cuisine && (
                <p className="text-red-500 text-sm mb-1 font-medium">
                  {errors.cuisine}
                </p>
              )}
              <div className="relative">
                <select
                  id="cuisine"
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-green-50 border border-green-100 rounded-xl text-green-600 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                >
                  <option value="">Select category</option>
                  <option value="italian">Italian</option>
                  <option value="arabic">Arabic</option>
                  <option value="thai">Thai</option>
                  <option value="mexican">Mexican</option>
                  <option value="chinese">Chinese</option>
                  <option value="indian">Indian</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600 pointer-events-none" />
              </div>
            </div>

            <div>

              <label htmlFor="cookingTime" className="block text-sm font-bold text-gray-900 mb-2">
                Cooking Time
              </label>
              {errors.cookingTime && (
                <p className="text-red-500 text-sm mb-1 font-medium">
                  {errors.cookingTime}
                </p>
              )}
              <input
                type="text"
                id="cookingTime"
                name="cookingTime"
                value={formData.cookingTime}
                onChange={handleInputChange}
                placeholder="Enter cooking time in minutes"
                className="w-full px-4 py-4 bg-green-50 border border-green-100 rounded-xl text-gray-900 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-bold text-gray-900 mb-2">
                Tags
              </label>
               {errors.tags && (
                <p className="text-red-500 text-sm mb-1 font-medium">
                  {errors.tags}
                </p>
              )}
              <div className="relative">
                <select
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-green-50 border border-green-100 rounded-xl text-green-600 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                >
                  <option value="">Select tags</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="spicy">Spicy</option>
                  <option value="quick">Quick & Easy</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-gray-900">
                  Ingredients
                </label>
                {errors.ingredients && (
                  <p className="text-red-500 text-sm mb-2 font-medium">
                    {errors.ingredients}
                  </p>
                )}

                <button
                  onClick={addIngredient}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => updateIngredient(index, e.target.value)}
                      placeholder={`Ingredient ${index + 1}`}
                      className="flex-1 px-4 py-3 bg-green-50 border border-green-100 rounded-xl text-gray-900 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                    />
                    {ingredients.length > 1 && (
                      <button
                        onClick={() => removeIngredient(index)}
                        className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-gray-900">
                  Steps
                </label>
                {errors.steps && (
                  <p className="text-red-500 text-sm mb-2 font-medium">
                    {errors.steps}
                  </p>
                )}
                <button
                  onClick={addStep}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold mt-2">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => updateStep(index, e.target.value)}
                      placeholder={`Step ${index + 1}`}
                      className="flex-1 px-4 py-3 bg-green-50 border border-green-100 rounded-xl text-gray-900 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                    />
                    {steps.length > 1 && (
                      <button
                        onClick={() => removeStep(index)}
                        className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

                  <div>
                       <label className="text-sm font-medium flex items-center gap-1">
                            <ImageIcon size={16} />
                            Update Profile Image
                        </label>
                       {errors.image && (
                            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                        )}
                        {!uploadedImages ? (
                                <label className="flex flex-col items-center justify-center h-72 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition-all group">
                                    <Upload className="w-14 h-14 text-gray-400 mb-4 group-hover:text-emerald-600 transition-colors group-hover:scale-110 transform" />
                                    <span className="text-base font-medium text-gray-700 group-hover:text-emerald-700 mb-1">
                                        Click to upload cover image
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        PNG, JPG, WEBP up to 10MB
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                    />
                                </label>
                            ) : (
                                <div className="relative rounded-xl overflow-hidden group shadow-lg">
                                    <img
                                        src={uploadedImages}
                                        alt="Cover preview"
                                        className="w-full h-96 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={removeCoverImage}
                                            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-2xl transform hover:scale-110 transition-all"
                                        >
                                            <h1>X</h1>
                                        </button>
                                    </div>
                                </div>
                            )}
                    </div>

            <div>
              <label htmlFor="dietType" className="block text-sm font-bold text-gray-900 mb-2">
                Tags / Diet Type
              </label>
               {errors.dietType && (
                <p className="text-red-500 text-sm mb-1 font-medium">
                  {errors.dietType}
                </p>
              )}
              <div className="relative">
                <select
                  id="dietType"
                  name="dietType"
                  value={formData.dietType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-green-50 border border-green-100 rounded-xl text-green-600 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                >
                  <option value="">Select tags</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="glutenfree">Gluten-Free</option>
                  <option value="keto">Keto</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Publish Status
              </label>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-700 font-medium">Draft</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!formData.isDraft}
                    onChange={(e) => setFormData(prev => ({ ...prev, isDraft: !e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                onClick={handleCancel}
                className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:scale-105 transition-all"
              >
                Cancel
              </button>
              <button
                disabled={!isVerifiedUser}
                onClick={handleSaveRecipe}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all shadow-lg"
              >
                Save Recipe
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-8 px-8 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8 mb-6">
            <a href="#" className="text-green-600 hover:text-green-700 font-medium transition-colors">About</a>
            <a href="#" className="text-green-600 hover:text-green-700 font-medium transition-colors">Contact</a>
            <a href="#" className="text-green-600 hover:text-green-700 font-medium transition-colors">FAQ</a>
            <a href="#" className="text-green-600 hover:text-green-700 font-medium transition-colors">Terms & Conditions</a>
            <a href="#" className="text-green-600 hover:text-green-700 font-medium transition-colors">Privacy Policy</a>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <a href="#" className="p-3 bg-green-100 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>
            <a href="#" className="p-3 bg-green-100 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="white" />
              </svg>
            </a>
            <a href="#" className="p-3 bg-green-100 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
          </div>

          <p className="text-center text-gray-600 text-sm">
            © 2023 Dishcovery. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}