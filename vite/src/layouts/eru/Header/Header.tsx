import React, { useEffect, useRef } from 'react';
import './Header.css';

const Header: React.FC = () => {
    // Header elementini referans olarak tutuyoruz
    const headerRef = useRef<HTMLDivElement>(null);

    // Component yüklendiğinde ve güncellenmesinde header'ın görünürlüğünü zorla
    useEffect(() => {
        // 1. Sayfa başlangıcında header'ı görünür kılma
        const forceHeaderVisible = () => {
            if (headerRef.current) {
                // Doğrudan stil atamalarıyla görünürlüğü zorla
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

                // Header içerisindeki elementlerin görünürlüğünü de kontrol et
                const innerHeader = headerRef.current.querySelector('header');
                if (innerHeader) {
                    Object.assign(innerHeader.style, headerStyles);
                }

                // Header'ın üzerinde başka bir element olmadığından emin ol
                headerRef.current.parentElement?.classList.add('header-parent-container');
            }

            // Sayfanın en üstüne scroll yap
            window.scrollTo(0, 0);
        };

        // İlk yüklemede çalıştır
        forceHeaderVisible();

        // Sayfa boyutu değiştiğinde tekrar çalıştır
        window.addEventListener('resize', forceHeaderVisible);

        // Sayfa scroll olduğunda tekrar kontrol et
        window.addEventListener('scroll', () => {
            if (window.scrollY === 0) {
                forceHeaderVisible();
            }
        });

        // 100ms sonra tekrar çalıştır (bazı tarayıcı render sorunlarını çözmek için)
        const timeoutId = setTimeout(forceHeaderVisible, 100);
        
        // Bileşen temizlendiğinde event listener'ları kaldır
        return () => {
            window.removeEventListener('resize', forceHeaderVisible);
            window.removeEventListener('scroll', forceHeaderVisible);
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div ref={headerRef} className="header-wrapper" id="header-container" style={{display: 'block', visibility: 'visible'}}>
            {/* Sayfa başında referans noktası */}
            <div id="header-anchor"></div>
            
            <header className="w-full bg-white text-blue-900 shadow-md z-50">
                {/* Üst Çubuk - Sosyal Medya ve Dil Seçenekleri */}
                <div className="header-top-bar">
                    <div className="flex items-center space-x-3">
                        <div className="border-l border-gray-400 h-4 mx-2"></div>
                        <a href="/" className="text-xs hover:text-gray-300">ERÜ Anasayfa</a>
                        <div className="border-l border-gray-400 h-4 mx-2"></div>
                        <a href="/" className="text-xs font-bold hover:text-gray-300">TR</a>
                        <a href="/" className="text-xs hover:text-gray-300 ml-1">EN</a>
                    </div>
                </div>

                {/* Ana Header - Logo ve Menü */}
                <div className="header-main-content">
                    {/* Logo - Absolute pozisyonda */}
                    <a
                        href="/"
                        className="header-logo"
                    ></a>

                    {/* Başlık - Logonun yanında yer alacak şekilde kenara itilmiş */}
                    <div className="flex items-center ml-28">
                        <div className="ml-4">
                            <h1 className="text-xl header-title">BİLGİSAYAR MÜHENDİSLİĞİ</h1>
                            <h2 className="text-2xl font-black header-title">STAJ BİLGİ SİSTEMİ</h2>
                        </div>
                    </div>

                    {/* Sağ Taraf: Navbar */}
                    <nav>
                        {/* Buraya menü öğeleri eklenebilir */}
                    </nav>
                </div>
            </header>
        </div>
    );
};

export default Header;