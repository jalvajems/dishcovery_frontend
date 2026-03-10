import { motion, useScroll, useTransform } from 'framer-motion';
import { ChefHat, Globe, Users, Utensils, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../assets/logo.png"

const staggerContainer: import("framer-motion").Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const fadeInUp: import("framer-motion").Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -40, transition: { duration: 0.4 } }
};

const fadeInLeft: import("framer-motion").Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInRight: import("framer-motion").Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const LandingPage = () => {
    const { scrollYProgress } = useScroll();
    const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const rotateBg = useTransform(scrollYProgress, [0, 1], [0, 45]);
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-emerald-500/30 overflow-hidden">

            {/* Navbar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed w-full z-50 top-0 bg-white/80 backdrop-blur-md border-b border-neutral-200"
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div
                        onClick={() => navigate('/foodie/dashboard')}
                        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        <img
                            src={logo}
                            alt="Dishcovery"
                            className="h-10 w-auto object-contain"
                        />
                    </div>
                    <div className="hidden md:flex gap-8 items-center font-medium text-neutral-600">
                        <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
                        <a href="#about" className="hover:text-emerald-600 transition-colors">About</a>
                        <Link to="/login" className="hover:text-emerald-600 transition-colors font-semibold">Login</Link>
                        <Link to="/signup" className="bg-emerald-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-emerald-700 transition-all shadow-md hover:shadow-emerald-500/30 hover:-translate-y-1">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-24 pb-20 bg-white overflow-hidden">
                {/* Parallax Decorative Backgrounds */}
                <motion.div
                    style={{ y: yBg, rotate: rotateBg }}
                    className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"
                />
                <motion.div
                    style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]) }}
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-50/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none"
                />

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                        {/* Text Content */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.3 }}
                            variants={fadeInLeft}
                            className="text-center lg:text-left flex flex-col justify-center"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-700 font-semibold mb-6 text-sm border border-emerald-200 self-center lg:self-start w-fit"
                            >
                                🎉 Welcome to the culinary world
                            </motion.div>
                            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight mb-8 text-neutral-800 leading-[1.1]">
                                Unleash Your <br />
                                <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent inline-block pb-2">
                                    Culinary Potential
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-neutral-500 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Join our platform to explore recipes, connect with chefs, attend workshops, and discover the best food spots around the world.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                                <Link to="/signup" className="group flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-500 px-8 py-4 rounded-full font-bold text-white hover:scale-105 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50">
                                    Join the Community
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/login" className="px-8 py-4 rounded-full font-bold text-neutral-700 bg-white border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 hover:-translate-y-1 hover:shadow-md transition-all">
                                    Login to Account
                                </Link>
                            </div>
                        </motion.div>

                        {/* Hero Image */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.3 }}
                            variants={fadeInRight}
                            className="relative hidden md:block"
                        >
                            <motion.div
                                whileHover={{ rotate: 0, scale: 1.02 }}
                                className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 transition-all duration-500"
                            >
                                <img
                                    src="https://t3.ftcdn.net/jpg/02/52/38/80/360_F_252388016_KjPnB9vglSCuUJAumCDNbmMzGdzPAucK.jpg"
                                    alt="Delicious food spread"
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent flex items-end p-8" />
                            </motion.div>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-neutral-50 border-t border-neutral-200 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.3 }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-neutral-900">Everything right at your fingertips</h2>
                        <p className="text-xl text-neutral-500 max-w-2xl mx-auto">Discover the ultimate platform built for food lovers and culinary experts alike.</p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
                    >
                        <FeatureCard
                            icon={<Utensils size={32} className="text-emerald-600" />}
                            title="Global Recipes"
                            description="Access an expansive library of recipes shared by professional chefs and home cooks."
                            bgColor="bg-emerald-100"
                        />
                        <FeatureCard
                            icon={<Globe size={32} className="text-teal-600" />}
                            title="Food Spots"
                            description="Find, review, and share the best restaurants and hidden culinary gems globally."
                            bgColor="bg-teal-100"
                        />
                        <FeatureCard
                            icon={<Users size={32} className="text-green-600" />}
                            title="Live Workshops"
                            description="Join interactive sessions to master new cooking techniques in real-time."
                            bgColor="bg-green-100"
                        />
                        <FeatureCard
                            icon={<ShieldCheck size={32} className="text-lime-600" />}
                            title="Verified Chefs"
                            description="Learn from verified professionals delivering top-tier culinary guidance."
                            bgColor="bg-lime-100"
                        />
                        <FeatureCard
                            icon={<Heart size={32} className="text-emerald-500" />}
                            title="Passionate Community"
                            description="Connect with food lovers, share creations, and build your foodie network."
                            bgColor="bg-emerald-100"
                        />
                    </motion.div>
                </div>
            </section>

            {/* About & Call to Action */}
            <section id="about" className="py-32 relative overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.4 }}
                            variants={fadeInLeft}
                            className="order-2 lg:order-1 relative"
                        >
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.4 }}
                                className="relative rounded-3xl overflow-hidden shadow-2xl"
                            >
                                <img
                                    src="https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141352.jpg"
                                    alt="Cooking together"
                                    className="w-full h-[500px] object-cover"
                                />
                                <div className="absolute inset-0 bg-emerald-900/10 mix-blend-multiply" />
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.4 }}
                            variants={fadeInRight}
                            className="order-1 lg:order-2"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-900 leading-tight">Ready to start cooking?</h2>
                            <p className="text-neutral-500 text-lg mb-8 leading-relaxed">
                                Dishcovery isn't just an app; it's a movement. Build your cookbook, connect with people who share your passion, and immerse yourself in the culinary arts.
                            </p>

                            <motion.ul
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: false }}
                                variants={staggerContainer}
                                className="space-y-4 mb-10"
                            >
                                {[
                                    'Create your digital cookbook',
                                    'Follow your favorite creators',
                                    'Attend live virtual classes'
                                ].map((item, i) => (
                                    <motion.li
                                        variants={fadeInUp}
                                        key={i}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <ArrowRight size={14} />
                                        </div>
                                        <span className="text-neutral-700 font-medium">{item}</span>
                                    </motion.li>
                                ))}
                            </motion.ul>

                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                                <Link to="/signup" className="flex items-center gap-2 bg-emerald-600 text-white px-10 py-4 rounded-full font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
                                    Create Free Account
                                    <ArrowRight size={18} />
                                </Link>
                            </motion.div>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8 }}
                className="border-t border-neutral-200 bg-neutral-50 py-12"
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                            <ChefHat size={24} className="text-emerald-600" />
                        </motion.div>
                        <span className="text-xl font-bold text-neutral-800 group-hover:text-emerald-700 transition-colors">Dishcovery</span>
                    </div>
                    <p className="text-neutral-500 text-sm">
                        © {new Date().getFullYear()} Dishcovery. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-neutral-500">
                        <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
                        <a href="#" className="hover:text-emerald-600 transition-colors">Contact</a>
                    </div>
                </div>
            </motion.footer>
        </div>
    );
};

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    bgColor: string;
}

const FeatureCard = ({ icon, title, description, bgColor }: FeatureCardProps) => {
    return (
        <motion.div
            variants={fadeInUp}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white border border-neutral-100 shadow-sm p-8 rounded-3xl hover:shadow-xl hover:border-emerald-100 transition-all z-10 relative cursor-pointer group"
        >
            <div className={`${bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-neutral-900 group-hover:text-emerald-700 transition-colors">{title}</h3>
            <p className="text-neutral-500 leading-relaxed text-sm">
                {description}
            </p>
        </motion.div>
    );
};

export default LandingPage;
