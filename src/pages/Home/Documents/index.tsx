import { type FC, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DOCUMENT_ENDPOINTS } from 'constants/endpoints';
import {
  DOCUMENTS_SECTION_HEADER,
  FALLBACK_DOCUMENTS,
} from './config';

interface DocumentsProps {
  onPreview?: (title: string, standard: string) => void;
  onBuy?: (docId: number, title: string) => void;
}

interface DocCardData {
  id: number;
  title: string;
  description?: string;
  standard: string;
  fileFormat: string;
  fileName: string;
  fileSizeText: string;
  price: number;
}

const Documents: FC<DocumentsProps> = ({ onPreview, onBuy }) => {
  const [documents, setDocuments] = useState<DocCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const response = await fetch(DOCUMENT_ENDPOINTS.GET_DOCUMENTS);
        if (response.ok) {
          const res = await response.json();
          const items = res.data || [];
          if (items.length > 0) {
            const mapped: DocCardData[] = items.slice(0, 6).map((doc: any) => ({
              id: doc.id,
              title: doc.title,
              description:
                doc.description ||
                'Официальная форма и практические инструкции для аудита и внедрения стандарта СМК.',
              standard: doc.category?.name || 'СТ РК / ISO',
              fileFormat: doc.file_type ? doc.file_type.toUpperCase() : 'DOCX + PDF',
              fileName: doc.file_name || `document-${doc.id}.docx`,
              fileSizeText: doc.file_size
                ? `${Math.round(doc.file_size / 1024)} КБ`
                : '350 КБ',
              price: doc.price || 5000,
            }));
            setDocuments(mapped);
          } else {
            setDocuments(FALLBACK_DOCUMENTS);
          }
        } else {
          setDocuments(FALLBACK_DOCUMENTS);
        }
      } catch (err) {
        console.error('Error fetching documents:', err);
        setDocuments(FALLBACK_DOCUMENTS);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₸';
  };

  const handlePreviewClick = (title: string, standard: string) => {
    if (onPreview) {
      onPreview(title, standard);
    }
  };

  const handleBuyClick = (docId: number, title: string) => {
    if (onBuy) {
      onBuy(docId, title);
    } else {
      navigate(`/documents/view/${docId}`);
    }
  };

  return (
    <section className="py-14 bg-white border-b border-slate-200" id="docs-market">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-sm sm:text-base font-bold uppercase tracking-wider text-brand-700">
              {DOCUMENTS_SECTION_HEADER.tag}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-1.5 tracking-tight">
              {DOCUMENTS_SECTION_HEADER.title}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mt-2">
              {DOCUMENTS_SECTION_HEADER.subtitle}
            </p>
          </div>
          <Link
            to={DOCUMENTS_SECTION_HEADER.allDocsPath}
            className="text-base sm:text-lg font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1 group"
          >
            <span>{DOCUMENTS_SECTION_HEADER.allDocsLabel}</span>
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-slate-50 rounded-xl h-60 border border-slate-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-7 flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 bg-brand-100 text-brand-800 text-xs sm:text-sm font-semibold rounded font-mono">
                      {doc.standard}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-slate-500 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-red-500">
                        picture_as_pdf
                      </span>
                      <span>{doc.fileFormat}</span>
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-2.5 line-clamp-2">
                    {doc.title}
                  </h3>

                  {doc.description && (
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-3.5 line-clamp-3">
                      {doc.description}
                    </p>
                  )}

                  <p className="text-xs sm:text-sm text-slate-500 font-mono mb-1">
                    {doc.fileName} ({doc.fileSizeText})
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 mt-4 flex items-center justify-between">
                  <span className="text-xl sm:text-2xl font-bold text-slate-900">
                    {formatPrice(doc.price)}
                  </span>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handlePreviewClick(doc.title, doc.standard)}
                      className="px-3.5 py-2.5 text-sm sm:text-base font-semibold text-slate-700 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors"
                    >
                      Образец
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBuyClick(doc.id, doc.title)}
                      className="px-4 py-2.5 text-sm sm:text-base font-semibold bg-brand-700 text-white hover:bg-brand-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      <span>Купить</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Documents;
