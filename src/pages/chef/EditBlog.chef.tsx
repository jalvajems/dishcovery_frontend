import React, { useEffect, useState } from 'react';
import { Search, Bell, Upload, X } from 'lucide-react';
import { createBlogApi, editBlogApi, getBlogDetailChefApi } from '@/api/chefApi';
import { showError, showSuccess } from '@/utils/toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useAwsS3Upload } from '@/components/shared/hooks/useAwsS3Upload';
import ChefNavbar from '@/components/shared/chef/NavBar.chef';
import { useUserStore } from '@/store/userStore';

const EditBlog: React.FC = () => {
    const { blogId } = useParams()
    const navigate = useNavigate()
    const [title, setTitle] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [content, setContent] = useState("");

    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    const [isPublished, setIsPublished] = useState(false);
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const { isVerifiedUser } = useUserStore()

    type BlogErrors = {
        title?: string;
        shortDescription?: string;
        content?: string;
        coverImage?: string;
        tags?: string;
    };

    const [errors, setErrors] = useState<BlogErrors>({});



    useEffect(() => {
        async function fetchBlog() {
            if (!blogId) return;

            try {
                const res = await getBlogDetailChefApi(blogId);
                const blog = res.data.data;

                setTitle(blog.title || '');
                setShortDescription(blog.shortDescription || '');
                setContent(blog.content || '');
                setTags(blog.tags || []);
                setCoverImage(blog.coverImage || null);
                setIsPublished(!blog.isDraft);

            } catch (error: any) {
                showError(error.response?.data?.message || 'Failed to load blog');
            }
        }

        fetchBlog();
    }, [blogId]);
    const validateBlog = () => {
        const newErrors: BlogErrors = {};

        if (!title.trim()) {
            newErrors.title = "Blog title is required";
        }

        if (!shortDescription.trim()) {
            newErrors.shortDescription = "Short description is required";
        } else if (shortDescription.length < 30) {
            newErrors.shortDescription = "Minimum 30 characters required";
        }

        if (!content.trim()) {
            newErrors.content = "Blog content is required";
        } else if (content.length < 100) {
            newErrors.content = "Content must be at least 100 characters";
        }

        if (!coverImage) {
            newErrors.coverImage = "Cover image is required";
        }

        if (tags.length === 0) {
            newErrors.tags = "Add at least one tag";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    const handleCreateBlog = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateBlog()) return;

        const payload = {
            title,
            shortDescription,
            content,
            tags,
            coverImage,
            isDraft: !isPublished
        };
        console.log('payload', payload);

        try {
            if (!blogId) return;
            const response = await editBlogApi(payload, blogId);
            showSuccess(response.data.message || 'blog created successfuly!')
            navigate('/chef/blog-listing')
        } catch (error: any) {
            showError(error.response?.data?.message)
            console.error(error);
        }
    };

    const { uploadToS3, fileUrl, loading, error } = useAwsS3Upload()


    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {

            const Image = e.target.files?.[0]
            const url = await uploadToS3(Image)
            console.log(url);

            setCoverImage(url)

        }
    };
    const addTag = () => {
        if (tagInput.trim() !== "") {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const removeTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };


    const removeCoverImage = () => {
        setCoverImage(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <ChefNavbar />


            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Edit Blog</h2>

                    <form className="space-y-6" onSubmit={handleCreateBlog}>
                        {/* Blog Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Blog Title
                            </label>
                            {errors.title && (
                                <p className="text-red-500 text-sm mb-1 font-medium">
                                    {errors.title}
                                </p>
                            )}
                            <input
                                type="text"
                                placeholder="Enter blog title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />

                        </div>

                        {/* Short Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Short Description / Excerpt
                            </label>
                            {errors.shortDescription && (
                                <p className="text-red-500 text-sm mb-1 font-medium">
                                    {errors.shortDescription}
                                </p>
                            )}
                            <textarea
                                rows={4}
                                value={shortDescription}
                                onChange={(e) => setShortDescription(e.target.value)}
                                placeholder="Write a brief description..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                            />

                        </div>

                        {/* Full Content */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Content
                            </label>
                            {errors.content && (
                                <p className="text-red-500 text-sm mb-1 font-medium">
                                    {errors.content}
                                </p>
                            )}

                            <textarea
                                rows={8}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your blog content here..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                            />

                        </div>

                        {/* Upload Cover Image */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Upload Cover Image
                            </label>
                            {errors.coverImage && (
                                <p className="text-red-500 text-sm mb-2 font-medium">
                                    {errors.coverImage}
                                </p>
                            )}
                            {!coverImage ? (
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition">
                                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">Click to upload cover image</span>
                                    <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
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
                                        alt="Cover preview"
                                        className="w-full h-64 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeCoverImage}
                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Tags / Categories */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">Tags</label>
                            {errors.tags && (
                                <p className="text-red-500 text-sm mb-2 font-medium">
                                    {errors.tags}
                                </p>
                            )}

                            <div className="flex space-x-3">
                                <input
                                    type="text"
                                    placeholder="Enter tag"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-emerald-500"
                                />
                                <button
                                    type="button"
                                    onClick={addTag}
                                    className="px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                                >
                                    Add
                                </button>
                            </div>

                            {/* Show tags as chips */}
                            <div className="flex flex-wrap gap-3 mt-3">
                                {tags.map((tag, index) => (
                                    <div
                                        key={index}
                                        className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full flex items-center space-x-2"
                                    >
                                        <span>{tag}</span>
                                        <button
                                            onClick={() => removeTag(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>


                        {/* Publish Status */}
                        {/* <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Publish Status
                            </label>
                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div>
                                    <span className="text-sm font-medium text-gray-900">
                                        {isPublished ? 'Published' : 'Draft'}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {isPublished ? 'Your blog is live' : 'Save as draft to publish later'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsPublished(!isPublished)}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${isPublished ? 'bg-emerald-500' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${isPublished ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div> */}

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                onClick={() => navigate(`/blog-detail/${blogId}`)}
                                type="button"
                                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                            >
                                Cancel
                            </button>
                            {/* <button
                                type="button"
                                onClick={() => {
                                    setIsPublished(false);
                                    handleCreateBlog(new Event("submit") as any);
                                }}
                                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                            >
                                Save Draft
                            </button> */}

                            <button
                                disabled={!isVerifiedUser}
                                type="submit"
                                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition font-medium shadow-lg shadow-emerald-500/30"
                            >
                                Publish Blog
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-16">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex justify-center space-x-8 mb-6">
                        <a href="#" className="text-gray-600 hover:text-emerald-600 transition text-sm">About</a>
                        <a href="#" className="text-gray-600 hover:text-emerald-600 transition text-sm">Contact</a>
                        <a href="#" className="text-gray-600 hover:text-emerald-600 transition text-sm">FAQ</a>
                        <a href="#" className="text-gray-600 hover:text-emerald-600 transition text-sm">Terms & Conditions</a>
                        <a href="#" className="text-gray-600 hover:text-emerald-600 transition text-sm">Privacy Policy</a>
                    </div>
                    <div className="flex justify-center space-x-6 mb-6">
                        <a href="#" className="text-gray-400 hover:text-emerald-600 transition">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-emerald-600 transition">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path></svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-emerald-600 transition">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4M12 8h.01"></path></svg>
                        </a>
                    </div>
                    <p className="text-center text-sm text-gray-500">
                        © 2023 Dishcovery. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default EditBlog;