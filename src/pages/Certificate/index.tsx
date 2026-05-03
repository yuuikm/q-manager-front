import { type FC, useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import QRCode from 'qrcode';
import { coursesAPI, type CertificateVerification } from 'api/courses';

const CertificatePage: FC = () => {
  const { number } = useParams<{ number: string }>();
  const [cert, setCert] = useState<CertificateVerification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string>('');
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!number) return;
    coursesAPI
      .verifyCertificate(number)
      .then(data => {
        setCert(data);
        return QRCode.toDataURL(window.location.href, { width: 120, margin: 1 });
      })
      .then(url => setQrUrl(url))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [number]);

  const handlePrint = () => window.print();

  const getUserName = (cert: CertificateVerification) => {
    const { first_name, last_name, username } = cert.user;
    if (first_name || last_name) return [first_name, last_name].filter(Boolean).join(' ');
    return username;
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Сертификат не найден</h2>
          <p className="text-gray-500 mb-6">
            {error || `Сертификат с номером «${number}» не существует или был отозван.`}
          </p>
          <Link
            to="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            На главную
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-50 flex flex-col items-center justify-center p-6 print:bg-white print:p-0">
      {/* Actions — hidden when printing */}
      <div className="print:hidden flex flex-col items-center gap-3 mb-8 w-full max-w-2xl">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${cert.is_valid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
          <span>{cert.is_valid ? '✅' : '❌'}</span>
          {cert.is_valid ? 'Сертификат подлинный и действителен' : 'Сертификат недействителен'}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors shadow-md"
          >
            🖨️ Распечатать
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium px-5 py-2.5 rounded-xl border border-gray-200 transition-colors"
          >
            На главную
          </Link>
        </div>
      </div>

      {/* Certificate */}
      <div
        ref={printRef}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none print:max-w-full"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {/* Top accent bar */}
        <div className="h-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800" />

        <div className="px-12 py-10">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-xs font-sans font-semibold tracking-widest text-indigo-500 uppercase mb-2">
              Удостоверяет
            </p>
            <h1 className="text-3xl font-bold text-gray-900 tracking-wide mb-1">СЕРТИФИКАТ</h1>
            <p className="text-sm text-gray-400 font-sans">об успешном прохождении курса</p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-indigo-200" />
            <span className="text-indigo-400">✦</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-indigo-200" />
          </div>

          {/* Recipient */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-400 font-sans mb-1">Настоящим подтверждается, что</p>
            <p className="text-4xl font-bold text-indigo-900 mb-6">{getUserName(cert)}</p>
            <p className="text-sm text-gray-400 font-sans mb-2">успешно завершил(а) курс</p>
            <p className="text-xl font-semibold text-gray-800 leading-snug max-w-lg mx-auto">
              «{cert.course.title}»
            </p>
          </div>

          {/* Score & Date row */}
          <div className="flex justify-center gap-10 mb-8">
            <div className="text-center">
              <p className="text-xs text-gray-400 font-sans uppercase tracking-wider mb-1">Итоговый балл</p>
              <p className="text-2xl font-bold text-green-600">{cert.final_score}%</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-xs text-gray-400 font-sans uppercase tracking-wider mb-1">Дата выдачи</p>
              <p className="text-base font-semibold text-gray-700">{formatDate(cert.issued_at)}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-indigo-200" />
            <span className="text-indigo-400">✦</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-indigo-200" />
          </div>

          {/* Footer: number + QR */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-gray-400 font-sans uppercase tracking-wider mb-1">Номер сертификата</p>
              <p className="text-sm font-mono font-semibold text-gray-700">{cert.certificate_number}</p>
              <p className="text-xs text-gray-400 font-sans mt-3">Отсканируйте QR-код для проверки подлинности</p>
            </div>
            {qrUrl && (
              <img
                src={qrUrl}
                alt="QR код для проверки"
                className="w-24 h-24 rounded-lg border border-gray-100"
              />
            )}
          </div>
        </div>

        {/* Bottom accent bar */}
        <div className="h-3 bg-gradient-to-r from-indigo-800 via-purple-600 to-indigo-600" />
      </div>
    </div>
  );
};

export default CertificatePage;
