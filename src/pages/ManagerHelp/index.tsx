import { type FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { managerHelpAPI, type ManagerHelpItem, type ManagerHelpCategory } from 'api/managerHelp';
import { ROUTES } from 'constants/routes';

const ManagerHelp: FC = () => {
    const [helps, setHelps] = useState<ManagerHelpItem[]>([]);
    const [categories, setCategories] = useState<ManagerHelpCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [selectedCategory]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [helpsData, categoriesData] = await Promise.all([
                managerHelpAPI.getHelps(selectedCategory ? { category_id: selectedCategory } : {}),
                managerHelpAPI.getCategories()
            ]);
            setHelps(helpsData);
            setCategories(categoriesData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка загрузки');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (id: number) => {
        navigate(`${ROUTES.MANAGER_HELP}/${id}`);
    };

    if (loading && helps.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold mb-4">В помощь менеджеру</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Полезные материалы, документы и видео для менеджеров
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8 justify-center">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === null
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                                }`}
                        >
                            Все
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {error && (
                        <div className="text-center text-red-600 mb-8">
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {helps.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => handleViewDetails(item.id)}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer p-6 flex flex-col h-full"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded">
                                        {item.category?.name || 'Общее'}
                                    </span>
                                    <div className="flex gap-2">
                                        {item.file_path && <span title="Документ">📄</span>}
                                        {item.youtube_url && <span title="Видео">🎬</span>}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                    {item.title}
                                </h3>
                                {item.description && (
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                        {item.description}
                                    </p>
                                )}
                                <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                                    <span className="text-xs text-gray-400">
                                        {new Date(item.created_at).toLocaleDateString('ru-RU')}
                                    </span>
                                    <span className="text-blue-600 text-sm font-medium">Подробнее →</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {helps.length === 0 && !loading && (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500 text-lg">Материалы пока не добавлены</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManagerHelp;
