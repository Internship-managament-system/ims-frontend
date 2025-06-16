// Popup penceresi açma utility fonksiyonları

interface PopupOptions {
  width?: number;
  height?: number;
  left?: number;
  top?: number;
  scrollbars?: boolean;
  resizable?: boolean;
  status?: boolean;
  menubar?: boolean;
  toolbar?: boolean;
  location?: boolean;
}

/**
 * Staj başvuru detaylarını popup pencerede açar
 * @param applicationId - Başvuru ID'si
 * @param options - Popup pencere seçenekleri
 */
export const openInternshipDetailPopup = (
  applicationId: string, 
  options: PopupOptions = {}
): Window | null => {
  const defaultOptions: PopupOptions = {
    width: 1200,
    height: 800,
    scrollbars: true,
    resizable: true,
    status: false,
    menubar: false,
    toolbar: false,
    location: false,
  };

  const finalOptions = { ...defaultOptions, ...options };

  // Popup penceresini merkeze yerleştir
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const left = finalOptions.left ?? (screenWidth - finalOptions.width!) / 2;
  const top = finalOptions.top ?? (screenHeight - finalOptions.height!) / 2;

  // Popup pencere ayarlarını oluştur
  const features = [
    `width=${finalOptions.width}`,
    `height=${finalOptions.height}`,
    `left=${left}`,
    `top=${top}`,
    `scrollbars=${finalOptions.scrollbars ? 'yes' : 'no'}`,
    `resizable=${finalOptions.resizable ? 'yes' : 'no'}`,
    `status=${finalOptions.status ? 'yes' : 'no'}`,
    `menubar=${finalOptions.menubar ? 'yes' : 'no'}`,
    `toolbar=${finalOptions.toolbar ? 'yes' : 'no'}`,
    `location=${finalOptions.location ? 'yes' : 'no'}`,
  ].join(',');

  // URL'i oluştur
  const baseUrl = window.location.origin;
  const popupUrl = `${baseUrl}/internship-detail-popup?id=${applicationId}`;

  // Popup pencereyi aç
  const popup = window.open(popupUrl, 'internshipDetail', features);

  // Popup pencereye odaklan
  if (popup) {
    popup.focus();
  }

  return popup;
};

/**
 * Genel popup pencere açma fonksiyonu
 * @param url - Açılacak URL
 * @param name - Popup pencere adı
 * @param options - Popup pencere seçenekleri
 */
export const openPopup = (
  url: string,
  name: string = 'popup',
  options: PopupOptions = {}
): Window | null => {
  const defaultOptions: PopupOptions = {
    width: 800,
    height: 600,
    scrollbars: true,
    resizable: true,
    status: false,
    menubar: false,
    toolbar: false,
    location: false,
  };

  const finalOptions = { ...defaultOptions, ...options };

  // Popup penceresini merkeze yerleştir
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const left = finalOptions.left ?? (screenWidth - finalOptions.width!) / 2;
  const top = finalOptions.top ?? (screenHeight - finalOptions.height!) / 2;

  // Popup pencere ayarlarını oluştur
  const features = [
    `width=${finalOptions.width}`,
    `height=${finalOptions.height}`,
    `left=${left}`,
    `top=${top}`,
    `scrollbars=${finalOptions.scrollbars ? 'yes' : 'no'}`,
    `resizable=${finalOptions.resizable ? 'yes' : 'no'}`,
    `status=${finalOptions.status ? 'yes' : 'no'}`,
    `menubar=${finalOptions.menubar ? 'yes' : 'no'}`,
    `toolbar=${finalOptions.toolbar ? 'yes' : 'no'}`,
    `location=${finalOptions.location ? 'yes' : 'no'}`,
  ].join(',');

  // Popup pencereyi aç
  const popup = window.open(url, name, features);

  // Popup pencereye odaklan
  if (popup) {
    popup.focus();
  }

  return popup;
}; 