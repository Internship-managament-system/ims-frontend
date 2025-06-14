import { toAbsoluteUrl } from '@/utils';

const ScreenLoader = () => {
  return (
    <div className="flex flex-col items-center gap-6 justify-center fixed inset-0 z-50 bg-white transition-opacity duration-700 ease-in-out">
      <div className="flex flex-col items-center gap-4">
        <img
          className="h-[100px] max-w-none"
          src={toAbsoluteUrl('/media/eru/erciyes-logo.png')}
          alt="Erciyes Üniversitesi"
        />
        <div className="w-10 h-10 border-4 border-[#13126e] border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div className="text-gray-600 font-medium text-sm">Yükleniyor...</div>
    </div>
  );
};

export { ScreenLoader };
