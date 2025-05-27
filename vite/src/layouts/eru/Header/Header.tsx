import React, { useEffect, useRef } from 'react';
import './Header.css';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../../contexts/languageContext';

const Header: React.FC = () => {
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
                    opacity: '1',
                    position: 'relative',
                    top: '0',
                    zIndex: '1000',
                    width: '100%',
                    backgroundColor: '#fff',
                    marginTop: '0px'
                };

                Object.assign(headerRef.current.style, headerStyles);

                const innerHeader = headerRef.current.querySelector('header');
                if (innerHeader) {
                    Object.assign(innerHeader.style, headerStyles);
                }

                headerRef.current.parentElement?.classList.add('header-parent-container');
            }

            window.scrollTo(0, 0);
        };

        forceHeaderVisible();
        window.addEventListener('resize', forceHeaderVisible);
        window.addEventListener('scroll', () => {
            if (window.scrollY === 0) {
                forceHeaderVisible();
            }
        });

        const timeoutId = setTimeout(forceHeaderVisible, 100);

        return () => {
            window.removeEventListener('resize', forceHeaderVisible);
            window.removeEventListener('scroll', forceHeaderVisible);
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div
            ref={headerRef}
            className="header-wrapper"
            id="header-container"
            style={{ display: 'block', visibility: 'visible' }}
        >
            <div id="header-anchor"></div>

            <header className="w-full bg-white text-blue-900 shadow-md z-50">
                <div className="header-top-bar">
                    <div className="flex items-center space-x-3">
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

export default Header;
