import React, { useState } from "react";
import { Upload, X, Tag, BookOpen, FileText, Image } from "lucide-react";
import { createBlogApi } from "@/api/chefApi";
import { showError, showSuccess } from "@/utils/toast";
import { getErrorMessage, logError } from "@/utils/errorHandler";
import { useAwsS3Upload } from "@/hooks/useAwsS3Upload";
import { useNavigate } from "react-router-dom";
import ChefNavbar from "@/components/shared/chef/NavBar.chef";

type BlogErrors = {
  title?: string;
  shortDescription?: string;
  content?: string;
  coverImage?: string;
  tags?:string;
};

const SUGGESTED_TAGS = [
  "Recipe",
  "Cooking Tips",
  "Healthy Eating",
  "Desserts",
  "Main Course",
  "Appetizers",
  "Vegetarian",
  "Vegan",
  "Quick Meals",
  "Baking",
  "International Cuisine",
  "Seasonal",
  "Budget Friendly",
  "Meal Prep",
  "Italian",
  "Asian",
  "Mediterranean",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Beverages",
];

const AddNewBlog: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState("");

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const [isPublished] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const [errors, setErrors] = useState<BlogErrors>({});

  const { uploadToS3 } = useAwsS3Upload();

  const validateForm = (): boolean => {
    const newErrors: BlogErrors = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (shortDescription.length < 10)
      newErrors.shortDescription = "At least 10 characters needed";
    if (!shortDescription.trim())
      newErrors.shortDescription = "Short description is required";
    if (content.length < 20) newErrors.content = "At least 20 characters needed";
    if (!content.trim()) newErrors.content = "Content is required";
    if (!coverImage) newErrors.coverImage = "Cover image is required";
    if (!tags.length) newErrors.tags = "Tag is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      title,
      shortDescription,
      content,
      tags,
      coverImage,
      isDraft: !isPublished,
    };

    try {
      const response = await createBlogApi(payload);
      showSuccess(response.data.message || "Blog created successfully!");
      navigate("/chef/blog-listing");
    } catch (error: unknown) {
      logError(error);
      showError(getErrorMessage(error));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const image = e.target.files[0];
    const url = await uploadToS3(image);
    setCoverImage(url);
    setErrors({ ...errors, coverImage: undefined });
  };

  const addTag = (tag?: string) => {
    const tagToAdd = tag || tagInput.trim();
    if (!tagToAdd || tags.includes(tagToAdd)) return;
    setTags([...tags, tagToAdd]);
    setTagInput("");
    setShowTagDropdown(false);
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const removeCoverImage = () => {
    setCoverImage(null);
  };

  const filteredSuggestedTags = SUGGESTED_TAGS.filter(
    (tag) =>
      tag.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(tag)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <ChefNavbar />

      <main className="max-w-5xl mx-auto px-6 py-8 pb-16">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create New Blog Post
          </h1>
          <p className="text-gray-600">
            Share your culinary expertise with the world
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="space-y-8">
            {/* Blog Title */}
            <div className="group">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <label className="block text-base font-semibold text-gray-800">
                  Blog Title
                </label>
              </div>

              {errors.title && (
                <p className="text-red-500 text-sm mb-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {errors.title}
                </p>
              )}

              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrors({ ...errors, title: undefined });
                }}
                placeholder="Enter an engaging title for your blog post..."
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-lg hover:border-emerald-300"
              />
            </div>

            {/* Cover Image */}
            <div className="group">
              <div className="flex items-center gap-2 mb-3">
                <Image className="w-5 h-5 text-emerald-600" />
                <label className="block text-base font-semibold text-gray-800">
                  Cover Image
                </label>
              </div>

              {errors.coverImage && (
                <p className="text-red-500 text-sm mb-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {errors.coverImage}
                </p>
              )}

              {!coverImage ? (
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
                    onChange={handleImageUpload}
                  />
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden group shadow-lg">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={removeCoverImage}
                      className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-2xl transform hover:scale-110 transition-all"
                    >
                      <X size={22} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Short Description */}
            <div className="group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <label className="block text-base font-semibold text-gray-800">
                    Short Description
                  </label>
                </div>
                <span className="text-sm text-gray-500 font-medium">
                  {shortDescription.length} characters
                </span>
              </div>

              {errors.shortDescription && (
                <p className="text-red-500 text-sm mb-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {errors.shortDescription}
                </p>
              )}

              <textarea
                rows={4}
                value={shortDescription}
                onChange={(e) => {
                  setShortDescription(e.target.value);
                  setErrors({ ...errors, shortDescription: undefined });
                }}
                placeholder="Write a compelling summary that captures the essence of your blog post..."
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none hover:border-emerald-300"
              />
            </div>

            {/* Full Content */}
            <div className="group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <label className="block text-base font-semibold text-gray-800">
                    Full Content
                  </label>
                </div>
                <span className="text-sm text-gray-500 font-medium">
                  {content.length} characters
                </span>
              </div>

              {errors.content && (
                <p className="text-red-500 text-sm mb-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {errors.content}
                </p>
              )}

              <textarea
                rows={12}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setErrors({ ...errors, content: undefined });
                }}
                placeholder="Write your full blog content here. Share your recipes, cooking techniques, tips, and culinary stories..."
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none hover:border-emerald-300"
                />
            </div>

            {/* Tags with Dropdown */}
            <div className="group">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-5 h-5 text-emerald-600" />
                <label className="block text-base font-semibold text-gray-800">
                  Tags
                </label>
                
              </div>
{errors.tags && (
                <p className="text-red-500 text-sm mb-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {errors.tags}
                </p>
              )}
              <div className="relative">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      value={tagInput}
                      onChange={(e) => {
                        setTagInput(e.target.value);
                        setShowTagDropdown(true);
                      }}
                      onFocus={() => setShowTagDropdown(true)}
                      onBlur={() => {
                        // Delay to allow click on dropdown items
                        setTimeout(() => setShowTagDropdown(false), 200);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="Type to search or create a tag..."
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all hover:border-emerald-300"
                    />

                    {/* Dropdown Menu */}
                    {showTagDropdown && tagInput && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto z-20">
                        {filteredSuggestedTags.length > 0 && (
                          <>
                            <div className="px-4 py-2.5 text-xs font-semibold text-gray-500 bg-gray-50 border-b sticky top-0">
                              SUGGESTED TAGS
                            </div>
                            {filteredSuggestedTags.map((tag, index) => (
                              <button
                                key={index}
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  addTag(tag);
                                }}
                                className="w-full text-left px-4 py-3 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2.5 border-b border-gray-100 last:border-b-0"
                              >
                                <Tag className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">{tag}</span>
                              </button>
                            ))}
                          </>
                        )}

                        {/* Create new tag option */}
                        {tagInput.trim() && (
                          <>
                            <div className="px-4 py-2.5 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-t sticky top-0">
                              CREATE NEW TAG
                            </div>
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                addTag();
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2.5"
                            >
                              <span className="w-5 h-5 flex items-center justify-center text-emerald-600 font-bold text-lg">
                                +
                              </span>
                              <span className="font-medium">
                                Create "{tagInput}"
                              </span>
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => addTag()}
                    className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    Add Tag
                  </button>
                </div>
              </div>

              {/* Selected Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2.5 mt-4">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 px-4 py-2 rounded-full flex items-center gap-2 border border-emerald-200 shadow-sm hover:shadow-md transition-all group"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span className="font-medium">{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="hover:bg-emerald-200 rounded-full p-1 transition-colors ml-1"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/chef/blog-listing")}
                className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleCreateBlog}
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Publish Blog
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddNewBlog;