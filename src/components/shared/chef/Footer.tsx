export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg mt-12"> 
        <div className="flex flex-wrap justify-center gap-8 mb-6"> 
            <a href="#" className="text-green-600 hover:text-green-700 font-medium transition-colors">About</a> 
            <a href="#" className="text-green-600 hover:text-green-700 font-medium transition-colors">Contact</a> 
            <a href="#" className="text-green-600 hover:text-green-700 font-medium transition-colors">FAQ</a> 
            <a href="#" className="text-green-600 hover:text-green-700 font-medium transition-colors">Terms & Conditions</a> 
            <a href="#" className="text-green-600 hover:text-green-700 font-medium transition-colors">Privacy Policy</a> </div> 
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
                                        <p className="text-center text-gray-600 text-sm"> © 2023 Dishcovery. All rights reserved. </p> </footer>
    );
}
