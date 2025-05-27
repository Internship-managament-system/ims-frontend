import React from 'react';
import './Footer.css';
import logoImage from '/public/media/eru/erciyes-logo.png';
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
import { useLanguage } from '../../../contexts/languageContext';

interface FooterProps {
  logoUrl?: string;
  compact?: boolean;
}

const Footer: React.FC<FooterProps> = ({
  logoUrl = logoImage
}) => {
  const { t } = useLanguage();

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
                {' '}{t('footer.address')}
              </div>

              <div className="mb-3">
                <a href="tel:+903522076666 x 32500" className="text-white hover-top d-inline-block">
                  <FontAwesomeIcon icon={faSquarePhoneFlip} className="mr-2" />
                  {' '}+90 352 207 6666
                </a>
              </div>

              <div className="mb-3">
                <FontAwesomeIcon icon={faPrint} className="mr-2 text-white" />
                {' '}+90 352 437 4931
              </div>

              <div className="mb-3">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-white" />
                {' '}basinyayin@erciyes.edu.tr
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
                        &nbsp;&nbsp;{t('footer.eru')}
                      </a>
                    </li>
                    <li className="col-md-4 col-6 p-0 m-0">
                      <a target="_blank" rel="noopener noreferrer" href="/tr/duyuru/tum-duyurular">
                        <FontAwesomeIcon icon={faChevronRight} />
                        &nbsp;&nbsp;{t('footer.announcements')}
                      </a>
                    </li>
                    <li className="col-md-4 col-6 p-0 m-0">
                      <a target="_blank" rel="noopener noreferrer" href="/tr/a-t/akademik-takvim">
                        <FontAwesomeIcon icon={faChevronRight} />
                        &nbsp;&nbsp;{t('footer.calendar')}
                      </a>
                    </li>
                    <li className="col-md-4 col-6 p-0 m-0">
                      <a target="_blank" rel="noopener noreferrer" href="/tr/yardim/sikca-sorulan-sorular">
                        <FontAwesomeIcon icon={faChevronRight} />
                        &nbsp;&nbsp;{t('footer.faq')}
                      </a>
                    </li>
                    <li className="col-md-4 col-6 p-0 m-0">
                      <a target="_blank" rel="noopener noreferrer" href="https://obisis.erciyes.edu.tr/">
                        <FontAwesomeIcon icon={faChevronRight} />
                        &nbsp;&nbsp;{t('footer.obisis')}
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
              {t('footer.rights')}<br />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
