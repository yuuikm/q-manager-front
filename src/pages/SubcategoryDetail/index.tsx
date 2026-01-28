import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DOCUMENT_ENDPOINTS } from 'constants/endpoints';
import DocumentCard from 'components/DocumentCard';

interface Document {
    id: number;
    title: string;
    description: string;
    category: {
        id: number;
        name: string;
    } | null;
    subcategory?: {
        id: number;
        name: string;
    } | null;
    document_type?: string | null;
    price: number;
    file_name: string;
    file_type: string;
    file_size: number;
    buy_number: number;
    created_at: string;
}

interface Subcategory {
    id: number;
    name: string;
    slug: string;
    description?: string;
    category?: {
        id: number;
        name: string;
    };
}

interface GroupedDocuments {
    [documentType: string]: Document[];
}

const DOCUMENT_TYPES = [
    'Документированные процедуры',
    'Карты основных процессов',
    'Карты поддерживающих процессов',
    'Карты управляющих процессов',
    'Руководство по качеству',
    'Производственные инструкции',
    'Руководство по надлежащей производственной практике',
];

const SubcategoryDetail = () => {
    const { subcategorySlug } = useParams<{ subcategorySlug: string }>();
    const navigate = useNavigate();
    const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (subcategorySlug) {
            fetchSubcategory();
        }
    }, [subcategorySlug]);

    const fetchSubcategory = async () => {
        try {
            setLoading(true);
            // Fetch subcategory details
            const subResponse = await fetch(`${DOCUMENT_ENDPOINTS.GET_SUBCATEGORY_BY_SLUG}/${subcategorySlug}`);
            if (!subResponse.ok) {
                throw new Error('Subcategory not found');
            }
            const subData = await subResponse.json();
            setSubcategory(subData);

            // Fetch documents for this subcategory
            const docsResponse = await fetch(`${DOCUMENT_ENDPOINTS.GET_DOCUMENTS}?subcategory_id=${subData.id}`);
            if (docsResponse.ok) {
                const docsData = await docsResponse.json();
                setDocuments(docsData.data || []);
            }
        } catch (err) {
            console.error('Error fetching subcategory:', err);
            setError('Категория не найдена');
        } finally {
            setLoading(false);
        }
    };

    // Group documents by document_type
    const groupedDocuments: GroupedDocuments = documents.reduce((acc, doc) => {
        const type = doc.document_type || 'Другие';
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(doc);
        return acc;
    }, {} as GroupedDocuments);

    // Sort types: predefined types first, then "Другие"
    const sortedTypes = [
        ...DOCUMENT_TYPES.filter(type => groupedDocuments[type]),
        ...Object.keys(groupedDocuments).filter(type => !DOCUMENT_TYPES.includes(type)),
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Загрузка...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !subcategory) {
        return (
            <div className="min-h-screen bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Категория не найдена</h1>
                        <button
                            onClick={() => navigate('/documents')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Вернуться к категориям
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/documents')}
                    className="mb-6 flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Назад к категориям
                </button>

                {/* Header */}
                <div className="mb-12">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        {subcategory.category && (
                            <div className="mb-3">
                                <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
                                    {subcategory.category.name}
                                </span>
                            </div>
                        )}
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{subcategory.name}</h1>
                        {subcategory.description && (
                            <p className="text-xl text-gray-600">{subcategory.description}</p>
                        )}
                        <div className="mt-4 text-sm text-gray-500">
                            Всего документов: {documents.length}
                        </div>
                    </div>
                </div>

                {/* Documents Grouped by Type */}
                {documents.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <p className="text-gray-600 text-lg">В этой категории пока нет документов.</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {sortedTypes.map((type) => (
                            <div key={type}>
                                {/* Type Header */}
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2 inline-block">
                                        {type}
                                    </h2>
                                    <span className="ml-4 text-gray-500">({groupedDocuments[type].length})</span>
                                </div>

                                {/* Documents Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {groupedDocuments[type].map((document) => (
                                        <DocumentCard
                                            key={document.id}
                                            document={document}
                                            onViewDetails={(doc) => {
                                                navigate(`/documents/view/${doc.id}`);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubcategoryDetail;
