import { useNavigate } from 'react-router-dom';
import { routeHelpers } from 'constants/routes';

interface Subcategory {
    id: number;
    name: string;
    slug: string;
    description?: string;
    documents_count?: number;
    category?: {
        id: number;
        name: string;
    };
}

interface SubcategoryCardProps {
    subcategory: Subcategory;
}

const SubcategoryCard = ({ subcategory }: SubcategoryCardProps) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="p-6">
                {/* Category Badge */}
                {subcategory.category && (
                    <div className="mb-3">
                        <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                            {subcategory.category.name}
                        </span>
                    </div>
                )}

                {/* Subcategory Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {subcategory.name}
                </h3>

                {/* Description */}
                {subcategory.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {subcategory.description}
                    </p>
                )}

                {/* Document Count */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{subcategory.documents_count || 0} документов</span>
                </div>

                {/* Read More Button */}
                <button
                    onClick={() => navigate(routeHelpers.subcategoryDetail(subcategory.slug))}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center group-hover:bg-blue-700"
                >
                    Подробнее
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default SubcategoryCard;
