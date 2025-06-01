import React, { useEffect, useRef } from 'react';
import './LandingPageHeader.css';
import { useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/languageContext';
import { KeenIcon } from '../index';

const LandingPageHeader: React.FC = () => {
    const headerRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const { language, setLanguage, t } = useLanguage();

    const changeLanguage = (lang: 'tr' | 'en') => {
        setLanguage(lang);

        const currentPath = location.pathname;
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('lang', lang);
        window.history.pushState({}, '', `${currentPath}?${searchParams.toString()}`);
    };

    useEffect(() => {
        const forceHeaderVisible = () => {
            if (headerRef.current) {
                const headerStyles = {
                    display: 'block',
                    visibility: 'visible',
                    opacity: '1'
                };

                Object.assign(headerRef.current.style, headerStyles);

                const innerHeader = headerRef.current.querySelector('header');
                if (innerHeader) {
                    Object.assign(innerHeader.style, headerStyles);
                }
            }
        };

        forceHeaderVisible();
        const timeoutId = setTimeout(forceHeaderVisible, 100);

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div
            ref={headerRef}
            className="header-wrapper"
            id="header-container"
        >
            <div id="header-anchor"></div>

            <header className="w-full bg-white text-blue-900 shadow-md z-50">
                <div className="header-top-bar">
                    <div className="flex items-center justify-between w-full">
                        {/* Sol taraf - boş */}
                        <div></div>

                        {/* Sağ taraf - Linkler */}
                        <div className="flex items-center space-x-3">
                            {/* Sosyal medya ikonları - Ana Sayfa'nın solunda */}
                            <div className="flex items-center space-x-4 mr-4">
                                <a 
                                    href="https://www.youtube.com/@ErciyesUni1978" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-gray-300 transition-all duration-300 hover:scale-110 transform"
                                    title="YouTube"
                                >
                                    <KeenIcon icon="youtube" className="text-base" />
                                </a>
                                <a 
                                    href="https://tr.linkedin.com/school/erciyesuniversity/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-gray-300 transition-all duration-300 hover:scale-110 transform"
                                    title="LinkedIn"
                                >
                                    <span className="text-base font-bold border border-white rounded px-1 text-xs">in</span>
                                </a>
                                <a 
                                    href="https://www.instagram.com/erciyesuni1978/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-gray-300 transition-all duration-300 hover:scale-110 transform"
                                    title="Instagram"
                                >
                                    <KeenIcon icon="instagram" className="text-base" />
                                </a>
                                <a 
                                    href="https://x.com/erciyesuni1978" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-gray-300 transition-all duration-300 hover:scale-110 transform"
                                    title="X"
                                >
                                    <span className="text-base font-bold">𝕏</span>
                                </a>
                                <a 
                                    href="https://www.facebook.com/ErciyesUni1978/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-gray-300 transition-all duration-300 hover:scale-110 transform"
                                    title="Facebook"
                                >
                                    <KeenIcon icon="facebook" className="text-base" />
                                </a>
                                <a 
                                    href="https://mail.erciyes.edu.tr/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-gray-300 transition-all duration-300 hover:scale-110 transform"
                                    title="Email"
                                >
                                    <KeenIcon icon="sms" className="text-base" />
                                </a>
                            </div>
                            
                            <div className="border-l border-gray-400 h-4 mx-2"></div>
                            <a href="https://www.erciyes.edu.tr/" className="text-xs hover:text-gray-300">
                                {t('homepage')}
                            </a>
                            
                            <div className="border-l border-gray-400 h-4 mx-2"></div>
                            <button
                                onClick={() => changeLanguage('tr')}
                                className={`text-xs hover:text-gray-300 ${language === 'tr' ? 'font-bold' : ''}`}
                            >
                                TR
                            </button>
                            <button
                                onClick={() => changeLanguage('en')}
                                className={`text-xs hover:text-gray-300 ml-1 ${language === 'en' ? 'font-bold' : ''}`}
                            >
                                EN
                            </button>
                            
                            {/* Giriş Yapma ve Kayıt Olma Butonları */}
                            <div className="flex items-center space-x-2 ml-6">
                                <div className="border-l border-gray-400 h-4 mx-2"></div>
                                <Link
                                    to="/auth/login"
                                    className="text-xs hover:text-gray-300 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-all duration-300 hover:scale-105 transform hover:shadow-lg"
                                >
                                    Giriş Yap
                                </Link>
                                <Link
                                    to="/auth/signup"
                                    className="text-xs hover:text-gray-300 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-all duration-300 hover:scale-105 transform hover:shadow-lg"
                                >
                                    Kayıt Ol
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="header-main-content">
                    <a href="/" className="header-logo"></a>

                    <div className="flex items-center ml-28">
                        <div className="ml-4">
                            <h2 className="text-3xl font-black header-title">{t('internshipSystem')}</h2>
                        </div>
                    </div>

                    <nav>
                        {/* Menü öğeleri eklenebilir */}
                    </nav>
                </div>
            </header>
        </div>
    );
};

export default LandingPageHeader; 