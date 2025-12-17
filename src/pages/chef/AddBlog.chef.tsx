import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import { createBlogApi } from "@/api/chefApi";
import { showError, showSuccess } from "@/utils/toast";
import { useAwsS3Upload } from "@/components/shared/hooks/useAwsS3Upload";
import { useNavigate } from "react-router-dom";
import ChefNavbar from "@/components/shared/chef/NavBar.chef";


type BlogErrors = {
  title?: string;
  shortDescription?: string;
  content?: string;
  coverImage?: string;
};

const AddNewBlog: React.FC = () => {
  const navigate = useNavigate();


  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState("");

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [isPublished, setIsPublished] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const [errors, setErrors] = useState<BlogErrors>({});

  const { uploadToS3 } = useAwsS3Upload();


  const validateForm = (): boolean => {
    const newErrors: BlogErrors = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if(shortDescription.length<10) newErrors.shortDescription='atleast 10 letters needed'
    if (!shortDescription.trim())
      newErrors.shortDescription = "Short description is required";
    if(content.length<20) newErrors.content='atleast 20 letters needed'
    if (!content.trim()) newErrors.content = "Content is required";
    if (!coverImage) newErrors.coverImage = "Cover image is required";

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
    } catch (error: any) {
      showError(error.response?.data?.message);
      console.error(error);
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const image = e.target.files[0];
    const url = await uploadToS3(image);
    setCoverImage(url);
    setErrors({ ...errors, coverImage: undefined });
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    setTags([...tags, tagInput.trim()]);
    setTagInput("");
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const removeCoverImage = () => {
    setCoverImage(null);
  };


  return (
    <div className="min-h-screen bg-gray-100">
      <ChefNavbar />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-8">Add New Blog</h2>

          <form className="space-y-6" onSubmit={handleCreateBlog}>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Blog Title
              </label>

              {errors.title && (
                <p className="text-red-500 text-sm mb-1">{errors.title}</p>
              )}

              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrors({ ...errors, title: undefined });
                }}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Short Description
              </label>

              {errors.shortDescription && (
                <p className="text-red-500 text-sm mb-1">
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
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Full Content
              </label>

              {errors.content && (
                <p className="text-red-500 text-sm mb-1">{errors.content}</p>
              )}

              <textarea
                rows={8}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setErrors({ ...errors, content: undefined });
                }}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Cover Image
              </label>

              {errors.coverImage && (
                <p className="text-red-500 text-sm mb-2">
                  {errors.coverImage}
                </p>
              )}

              {!coverImage ? (
                <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer">
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    Click to upload image
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={coverImage}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeCoverImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Tags</label>

              <div className="flex gap-3">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-1 px-4 py-3 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-3 bg-emerald-600 text-white rounded-lg"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {tag}
                    <button onClick={() => removeTag(index)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg"
              >
                Publish Blog
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddNewBlog;
