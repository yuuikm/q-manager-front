import { type FC, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { managerHelpAPI, type ManagerHelpItem } from 'api/managerHelp';
import { ROUTES } from 'constants/routes';
import { BASE_URL } from 'constants/endpoints.ts';

const ManagerHelpDetail: FC = () => {
    const { id } = useParams<{ id: string }>();
    const [help, setHelp] = useState<ManagerHelpItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            fetchHelpDetail(id);
        }
    }, [id]);

    const fetchHelpDetail = async (helpId: string) => {
        try {
            setLoading(true);
            const data = await managerHelpAPI.getHelp(helpId);
            setHelp(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка загрузки');
        } finally {
            setLoading(false);
        }
    };

    const getYoutubeEmbedUrl = (url: string) => {
        try {
            const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
            return `https://www.youtube.com/embed/${videoId}`;
        } catch (e) {
            return null;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !help) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <p className="text-red-600 mb-4">{error || 'Материал не найден'}</p>
                <button
                    onClick={() => navigate(ROUTES.MANAGER_HELP)}
                    className="text-blue-600 hover:underline"
                >
                    Вернуться к списку
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => navigate(ROUTES.MANAGER_HELP)}
                        className="flex items-center text-gray-600 hover:text-blue-600 mb-8 transition-colors"
                    >
                        ← Назад к списку
                    </button>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    {help.category?.name || 'Общее'}
                                </span>
                                <span className="text-gray-400 text-sm">
                                    {new Date(help.created_at).toLocaleDateString('ru-RU')}
                                </span>
                            </div>

                            <h1 className="text-3xl font-bold text-gray-900 mb-6">{help.title}</h1>

                            <div className="prose max-w-none text-gray-700 mb-10">
                                {help.description ? (
                                    <div dangerouslySetInnerHTML={{ __html: help.description.replace(/\n/g, '<br/>') }} />
                                ) : (
                                    <p className="italic text-gray-400">Описание отсутствует</p>
                                )}
                            </div>

                            {help.file_path && (
                                <div className="bg-gray-50 rounded-xl p-6 mb-10">
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        📄 Прикрепленные документы
                                    </h3>
                                    <a
                                        href={`${BASE_URL}/storage/${help.file_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors shadow-sm"
                                    >
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                            />
                                        </svg>
                                        Скачать: {help.file_name}
                                    </a>
                                </div>
                            )}

                            {help.youtube_url && (
                                <div className="mb-10">
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        🎬 Видео материал
                                    </h3>
                                    <div className="relative pb-[56.25%] h-0 rounded-xl overflow-hidden shadow-lg">
                                        <iframe
                                            className="absolute top-0 left-0 w-full h-full border-0"
                                            src={getYoutubeEmbedUrl(help.youtube_url) || ''}
                                            title="YouTube video player"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerHelpDetail;
