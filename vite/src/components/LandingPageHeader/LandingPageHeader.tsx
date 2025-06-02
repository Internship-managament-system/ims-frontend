import React, { useEffect, useRef } from 'react';
import './LandingPageHeader.css';
import { useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/languageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faXTwitter,
  faInstagram,
  faLinkedin,
  faYoutube,
  faTelegram
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

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
                            {/* Sosyal medya ikonları - Footer ile aynı */}
                            <div className="flex items-center space-x-3 mr-4">
                                <a 
                                    href="https://twitter.com/EruMedya" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-gray-300 transition-all duration-300 hover:scale-110 transform"
                                    title="X (Twitter)"
                                >
                                    <FontAwesomeIcon icon={faXTwitter} className="text-sm" />
                                </a>
                                <a 
                                    href="https://facebook.com/EruMedya" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-gray-300 transition-all duration-300 hover:scale-110 transform"
                                    title="Facebook"
                                >
                                    <FontAwesomeIcon icon={faFacebookF} className="text-sm" />
                                </a>
                                <a 
                                    href="https://www.instagram.com/erciyesuni1978/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-gray-300 transition-all duration-300 hover:scale-110 transform"
                                    title="Instagram"
                                >
                                    <FontAwesomeIcon icon={faInstagram} className="text-sm" />
                                </a>
                                <a 
                                    href="https://www.linkedin.com/company/erciyes-university?trk=cp_followed_name_erciyes-university" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-gray-300 transition-all duration-300 hover:scale-110 transform"
                                    title="LinkedIn"
                                >
                                    <FontAwesomeIcon icon={faLinkedin} className="text-sm" />
                                </a>
                                <a 
                                    href="https://www.youtube.com/user/EruMedya" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-gray-300 transition-all duration-300 hover:scale-110 transform"
                                    title="YouTube"
                                >
                                    <FontAwesomeIcon icon={faYoutube} className="text-sm" />
                                </a>
                                <a 
                                    href="https://t.me/+606my8cwYyUwMWNk" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-gray-300 transition-all duration-300 hover:scale-110 transform"
                                    title="Telegram"
                                >
                                    <FontAwesomeIcon icon={faTelegram} className="text-sm" />
                                </a>
                                <a 
                                    href="mailto:basinyayin@erciyes.edu.tr" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-gray-300 transition-all duration-300 hover:scale-110 transform"
                                    title="E-mail"
                                >
                                    <FontAwesomeIcon icon={faEnvelope} className="text-sm" />
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
                                    className="text-xs hover:text-gray-300 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-all duration-300 hover:scale-105 transform hover:shadow-lg"
                                >
                                    Giriş Yap
                                </Link>
                                <Link
                                    to="/auth/signup"
                                    className="text-xs hover:text-gray-300 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-all duration-300 hover:scale-105 transform hover:shadow-lg"
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