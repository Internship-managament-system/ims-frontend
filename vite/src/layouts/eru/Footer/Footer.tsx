//Footer.tsx
import React from 'react';
import './Footer.css';
import logoImage from '/public/media/eru/erciyes-logo.png';
// Font Awesome bileşenlerini import edelim 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLocationDot, 
  faSquarePhoneFlip, 
  faPrint, 
  faEnvelope, 
  faChevronRight 
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebookF, 
  faXTwitter, 
  faInstagram, 
  faLinkedin, 
  faYoutube, 
  faTelegram 
} from '@fortawesome/free-brands-svg-icons';

// TypeScript için arayüz tanımı
interface FooterProps {
  logoUrl?: string;
  compact?: boolean; // Kompakt görünüm için yeni prop
}

const Footer: React.FC<FooterProps> = ({ 
  logoUrl = logoImage
}) => {
  return (
    <>
      <div className="footer-bg pt-4 pb-4 mt-7 w-full">
        <div className="container mx-auto clearfix text-white fw1">
          <div className="text-center">
            <div className="footer-logo">
              <img src={logoUrl} alt="Erciyes Üniversitesi Logo" />
            </div>
          </div>
          
          <div className="row clearfix mt-5 mb-5">
            {/* Sol Kolon - İletişim Bilgileri */}
            <div className="col-md-4 mt-2 mb-3 text-center text-md-left fs15 text-grey">
              <div className="mb-3">
                <FontAwesomeIcon icon={faLocationDot} className="mr-2 text-white" />
                {' '}Erciyes Üniversitesi Mühendislik Fakültesi Bilgisayar Mühendisliği Bölüm Başkanlığı 38039 Talas / KAYSERİ
              </div>
              
              <div className="mb-3">
                <a href="tel:+903522076666 x 32500" className="text-white hover-top d-inline-block">
                  <FontAwesomeIcon icon={faSquarePhoneFlip} className="mr-2" />
                  {' '}+903522076666 x 32500
                </a>
              </div>
              
              <div className="mb-3">
                <FontAwesomeIcon icon={faPrint} className="mr-2 text-white" />
                {' '}+903524375784
              </div>
              
              <div className="mb-3">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-white" />
                {' '}bmbb@erciyes.edu.tr
              </div>
            </div>
            
            {/* Sağ Kolon - Linkler */}
            <div className="col-md-8">
              <ul className="footer-menu ul row clearfix">
                <li className="col-md-12">
                  <ul className="ul row clearfix">
                    <li className="col-md-4 col-6 p-0 m-0">
                      <a target="_blank" rel="noopener noreferrer" href="https://www.erciyes.edu.tr/">
                        <FontAwesomeIcon icon={faChevronRight} />
                        &nbsp;&nbsp;Erciyes Üniversitesi
                      </a>
                    </li>
                    <li className="col-md-4 col-6 p-0 m-0">
                      <a target="_blank" rel="noopener noreferrer" href="/tr/duyuru/tum-duyurular">
                        <FontAwesomeIcon icon={faChevronRight} />
                        &nbsp;&nbsp;Duyurular
                      </a>
                    </li>
                    <li className="col-md-4 col-6 p-0 m-0">
                      <a target="_blank" rel="noopener noreferrer" href="https://mf.erciyes.edu.tr/">
                        <FontAwesomeIcon icon={faChevronRight} />
                        &nbsp;&nbsp;Mühendislik Fakültesi
                      </a>
                    </li>
                    <li className="col-md-4 col-6 p-0 m-0">
                      <a target="_blank" rel="noopener noreferrer" href="/tr/a-t/akademik-takvim">
                        <FontAwesomeIcon icon={faChevronRight} />
                        &nbsp;&nbsp;Akademik Takvim
                      </a>
                    </li>
                   
                    <li className="col-md-4 col-6 p-0 m-0">
                      <a target="_blank" rel="noopener noreferrer" href="/tr/yardim/sikca-sorulan-sorular">
                        <FontAwesomeIcon icon={faChevronRight} />
                        &nbsp;&nbsp;Sıkça Sorulan Sorular (SSS)
                      </a>
                    </li>
                    <li className="col-md-4 col-6 p-0 m-0">
                      <a target="_blank" rel="noopener noreferrer" href="https://obisis.erciyes.edu.tr/">
                        <FontAwesomeIcon icon={faChevronRight} />
                        &nbsp;&nbsp;Obisis
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Alt Kısım - Sosyal Medya ve Telif Hakkı */}
      <div className="footer-bg-color w-full">
        <div className="container mx-auto">
          <div className="row clearfix">
            {/* Sosyal Medya İkonları */}
            <div className="col-lg-5 text-center text-lg-left">
              <a href="https://twitter.com/EruMedya" className="sosyalhover" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faXTwitter} />
              </a>
              <a href="https://facebook.com/EruMedya" className="sosyalhover" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="https://twitter.com/EruMedya" className="sosyalhover" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://www.linkedin.com/company/erciyes-university?trk=cp_followed_name_erciyes-university" className="sosyalhover" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a href="https://www.youtube.com/user/EruMedya" className="sosyalhover" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
              <a href="https://t.me/+606my8cwYyUwMWNk" className="sosyalhover" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTelegram} />
              </a>
            </div>

            {/* Telif Hakkı Bilgisi */}
            <div className="col-lg-7 text-center text-lg-right p-2 text-grey">
              2015 - 2025 © ERÜ Web İçerik Yönetim Sistemi | Erciyes Üniversitesi Bilgi İşlem Daire Başkanlığı <br />
              <span className="small">Web sitesi içerik sorumlusu: Osman Buğra KAHRAMAN - obkahraman@erciyes.edu.tr</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;