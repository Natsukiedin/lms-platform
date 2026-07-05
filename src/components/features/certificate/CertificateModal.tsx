import React from 'react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  userName: string;
  courseName: string;
  completionDate: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  companyName,
  userName,
  courseName,
  completionDate,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 print:bg-white print:static print:inset-auto">
      <div className="bg-white w-[800px] max-w-[95vw] rounded-lg shadow-2xl relative print:shadow-none print:w-full print:max-w-none">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black print:hidden text-2xl font-bold"
        >
          &times;
        </button>
        
        <div className="p-12 border-8 border-double border-gray-300 m-4 print:m-0 print:border-4 relative text-center min-h-[500px] flex flex-col justify-center bg-yellow-50/30">
          <h1 className="text-4xl font-serif font-bold text-gray-800 mb-8 tracking-widest">修了証書</h1>
          
          <div className="mb-8 text-2xl text-left pl-12 font-serif">
            <p className="mb-2">{companyName}</p>
            <p className="font-bold border-b border-gray-400 inline-block pb-1 min-w-[300px]">{userName} 殿</p>
          </div>
          
          <div className="mb-10 font-serif leading-loose text-lg">
            <p>あなたは「<span className="font-bold text-xl">{courseName}</span>」の</p>
            <p>全課程を修了し、所定の試験に合格したことを証します。</p>
          </div>
          
          <div className="text-right pr-12 font-serif mb-8">
            <p className="mb-4">修了日: {completionDate}</p>
            <p className="font-bold text-xl">株式会社NAGAHAMA屋</p>
            <p>代表取締役 長浜 太郎</p>
          </div>
          
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-20 pointer-events-none">
            <span className="text-8xl">🏅</span>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end print:hidden">
          <button 
            onClick={handlePrint}
            className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition-colors shadow flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            PDF保存 / 印刷
          </button>
        </div>
      </div>
      
      {/* 印刷用CSS定義 (簡易版) */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .fixed > div, .fixed > div * {
            visibility: visible;
          }
          .fixed > div {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }
          @page { size: landscape; margin: 1cm; }
        }
      `}} />
    </div>
  );
};
