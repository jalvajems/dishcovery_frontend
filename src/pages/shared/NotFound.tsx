import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Search } from 'lucide-react';
import logo from "../../assets/logo.png";
import { STATUS_CODE } from '@/constants/StatusCode';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center font-sans overflow-hidden relative">
            {/* Background elements to match LandingPage */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"
            />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-50/50 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none"
            />

            <div className="absolute top-0 w-full p-6 lg:px-8 flex justify-between items-center z-50">
                <Link to="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                    <img src={logo} alt="Dishcovery" className="h-10 w-auto object-contain" />
                </Link>
            </div>

            <div className="relative z-10 text-center px-4 max-w-2xl mx-auto flex flex-col items-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="relative mb-8"
                >
                    <h1 className="text-[150px] md:text-[200px] font-extrabold leading-none tracking-tighter bg-gradient-to-br from-emerald-600 via-green-500 to-teal-400 bg-clip-text text-transparent opacity-20 select-none">
                        {STATUS_CODE.NOT_FOUND}
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Search size={100} className="text-emerald-500 drop-shadow-xl" strokeWidth={1.5} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-6">
                        Lost your appetite?
                    </h2>
                    <p className="text-lg text-neutral-500 mb-10 max-w-lg mx-auto leading-relaxed">
                        We can't seem to find the page you're looking for. It might have been moved, deleted, or perhaps it never existed in our cookbook.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center w-full"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-neutral-700 bg-white border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 shadow-sm hover:shadow-md transition-all group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Go Back
                    </button>
                    
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-500 px-8 py-4 rounded-full font-bold text-white hover:scale-105 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50"
                    >
                        <Home size={18} />
                        Back to Home
                    </Link>
                </motion.div>
            </div>
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="absolute bottom-8 text-neutral-400 text-sm font-medium z-10"
            >
                Dishcovery &copy; {new Date().getFullYear()}
            </motion.div>
        </div>
    );
};

export default NotFound;
