import { type FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getCurrentUser, checkAuth } from 'store/authSlice';
import { DOCUMENT_ENDPOINTS, COURSE_ENDPOINTS } from 'constants/endpoints';
import { authAPI } from 'api/auth';
import { coursesAPI, type Certificate } from 'api/courses';
import { routeHelpers } from 'constants/routes';

interface PurchasedDocument {
  id: number;
  document: {
    id: number;
    title: string;
    description: string;
    file_name: string;
    file_size: number;
    price: number;
    category: {
      id: number;
      name: string;
    } | null;
  };
  price_paid: number;
  purchased_at: string;
}

interface EnrolledCourse {
  id: number;
  course: {
    id: number;
    title: string;
    description: string;
    type: string[];
    price: number;
    category: {
      id: number;
      name: string;
    } | null;
  };
  status: string;
  enrolled_at: string;
}

const Profile: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector((state: any) => state.auth);
  const [purchasedDocuments, setPurchasedDocuments] = useState<PurchasedDocument[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loadingCertificates, setLoadingCertificates] = useState(false);
  const [certQrUrls, setCertQrUrls] = useState<Record<string, string>>({});
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [isSavingPhone, setIsSavingPhone] = useState(false);

  useEffect(() => {
    if (user?.phone) {
      setPhoneInput(user.phone);
    }
  }, [user]);

  const handleSavePhone = async () => {
    try {
      setIsSavingPhone(true);
      await authAPI.updateProfile({ phone: phoneInput });
      dispatch(getCurrentUser());
      setIsEditingPhone(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update phone');
    } finally {
      setIsSavingPhone(false);
    }
  };

  const fetchPurchasedDocuments = async () => {
    try {
      setLoadingDocuments(true);
      const token = localStorage.getItem('auth_token');
      
      if (!token) return;
      
      const response = await fetch(DOCUMENT_ENDPOINTS.USER_PURCHASED_DOCUMENTS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPurchasedDocuments(data.purchases || []);
      }
    } catch (error) {
      console.error('Error fetching purchased documents:', error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      setLoadingCourses(true);
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(COURSE_ENDPOINTS.USER_ENROLLED_COURSES, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEnrolledCourses(data.enrollments || []);
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchCertificates = async () => {
    try {
      setLoadingCertificates(true);
      const certs = await coursesAPI.getCertificates();
      setCertificates(certs);

      const origin = window.location.origin;
      const qrMap: Record<string, string> = {};
      await Promise.all(
        certs.map(async (c) => {
          const url = `${origin}${routeHelpers.certificate(c.certificate_number)}`;
          qrMap[c.certificate_number] = await QRCode.toDataURL(url, { width: 100, margin: 1 });
        }),
      );
      setCertQrUrls(qrMap);
    } catch (err) {
      console.error('Error fetching certificates:', err);
    } finally {
      setLoadingCertificates(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      dispatch(checkAuth());
      dispatch(getCurrentUser());
      fetchPurchasedDocuments();
      fetchEnrolledCourses();
      fetchCertificates();
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleDownloadDocument = async (documentId: number, fileName: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) return;
      
      const response = await fetch(`${DOCUMENT_ENDPOINTS.DOWNLOAD_DOCUMENT}/${documentId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = fileName;
        window.document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        window.document.body.removeChild(a);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to download document');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('An error occurred while downloading the document');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Перенаправление на страницу входа...</p>
        </div>
      </div>
    );
  }

  const statusLabel = (status: string) => {
    if (status === 'enrolled') return { text: 'Записан', color: 'bg-blue-100 text-blue-700' };
    if (status === 'in_progress') return { text: 'В процессе', color: 'bg-orange-100 text-orange-700' };
    if (status === 'completed') return { text: 'Завершён', color: 'bg-green-100 text-green-700' };
    return { text: status, color: 'bg-gray-100 text-gray-600' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Профиль пользователя</h1>
            <button
              onClick={() => navigate('/')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Назад
            </button>
          </div>

          {/* Top card: info + certificates side by side */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="grid md:grid-cols-2 gap-8">

              {/* Left: user info + stats */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Основная информация</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Имя пользователя</p>
                      <p className="text-base text-gray-900 mt-0.5">{user.username}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
                      <p className="text-base text-gray-900 mt-0.5">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Номер телефона</p>
                      {isEditingPhone ? (
                        <div className="mt-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value)}
                            className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="+7 (999) 000-00-00"
                            disabled={isSavingPhone}
                          />
                          <button
                            onClick={handleSavePhone}
                            disabled={isSavingPhone}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                          >
                            {isSavingPhone ? '...' : 'Сохранить'}
                          </button>
                          <button
                            onClick={() => { setIsEditingPhone(false); setPhoneInput(user.phone || ''); }}
                            disabled={isSavingPhone}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm transition-colors"
                          >
                            Отмена
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-base text-gray-900">{user.phone || 'Не указан'}</p>
                          <button
                            onClick={() => setIsEditingPhone(true)}
                            className="text-xs text-indigo-500 hover:text-indigo-700"
                          >
                            Изменить
                          </button>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Дата регистрации</p>
                      <p className="text-base text-gray-900 mt-0.5">
                        {new Date(user.created_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h2 className="text-sm font-semibold text-gray-700 mb-3">Статистика</h2>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-2xl font-bold text-indigo-600">{purchasedDocuments.length}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Документов</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{enrolledCourses.length}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Курсов</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-500">{certificates.length}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Сертификатов</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: certificates */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Мои сертификаты</h2>

                {loadingCertificates ? (
                  <div className="flex items-center gap-3 py-6 text-gray-500">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500 flex-shrink-0" />
                    <span className="text-sm">Загрузка...</span>
                  </div>
                ) : certificates.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-xl">
                    <p className="text-4xl mb-2">🏆</p>
                    <p className="text-gray-500 text-sm font-medium">Пока нет сертификатов</p>
                    <p className="text-gray-400 text-xs mt-1">Завершите курс и сдайте тест</p>
                    <button
                      onClick={() => navigate('/courses')}
                      className="mt-4 text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Смотреть курсы
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {certificates.map((cert) => {
                      const userName = [cert.user?.first_name, cert.user?.last_name].filter(Boolean).join(' ') || cert.user?.username || user?.username;
                      const certUrl = `${window.location.origin}${routeHelpers.certificate(cert.certificate_number)}`;
                      return (
                        <div key={cert.id} className="rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                          <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 p-4 text-white">
                            <div className="flex items-start gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-yellow-400">🏆</span>
                                  {cert.is_valid
                                    ? <span className="text-[10px] bg-green-500/20 text-green-300 border border-green-400/30 px-1.5 py-0.5 rounded-full">✓ Действителен</span>
                                    : <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-400/30 px-1.5 py-0.5 rounded-full">Недействителен</span>
                                  }
                                </div>
                                <p className="font-semibold text-sm text-white truncate">{userName}</p>
                                <p className="text-blue-300 text-xs truncate">«{cert.course.title}»</p>
                                <div className="flex gap-4 mt-2 text-xs">
                                  <span className="text-green-400 font-bold">{cert.final_score}%</span>
                                  <span className="text-white/50">{new Date(cert.issued_at).toLocaleDateString('ru-RU')}</span>
                                </div>
                                <p className="text-white/30 text-[10px] font-mono mt-1 truncate">{cert.certificate_number}</p>
                              </div>
                              {certQrUrls[cert.certificate_number] && (
                                <img
                                  src={certQrUrls[cert.certificate_number]}
                                  alt="QR"
                                  className="w-14 h-14 rounded bg-white p-0.5 flex-shrink-0"
                                />
                              )}
                            </div>
                          </div>
                          <div className="bg-gray-50 px-4 py-2 flex gap-4">
                            <a href={certUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                              🔗 Открыть
                            </a>
                            <button
                              onClick={() => { const w = window.open('', '_blank'); if (w) { w.location.href = certUrl; setTimeout(() => w.print(), 800); } }}
                              className="text-xs text-gray-600 hover:text-gray-800 font-medium"
                            >
                              🖨️ Печать
                            </button>
                            <button
                              onClick={() => navigator.clipboard.writeText(certUrl)}
                              className="text-xs text-gray-600 hover:text-gray-800 font-medium ml-auto"
                            >
                              📋 Копировать
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Purchased Documents */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Мои купленные документы</h2>

            {loadingDocuments ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
                <p className="mt-4 text-gray-600 text-sm">Загрузка документов...</p>
              </div>
            ) : purchasedDocuments.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">У вас пока нет купленных документов</p>
                <button onClick={() => navigate('/documents')} className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Посмотреть документы
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {purchasedDocuments.map((purchase) => (
                  <div key={purchase.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{purchase.document.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-3">{purchase.document.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                        <span>{purchase.document.file_name}</span>
                        <span>{formatFileSize(purchase.document.file_size)}</span>
                        <span>Куплен {new Date(purchase.purchased_at).toLocaleDateString('ru-RU')}</span>
                        {purchase.document.category && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{purchase.document.category.name}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleDownloadDocument(purchase.document.id, purchase.document.file_name)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-1.5"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Скачать
                      </button>
                      <span className="text-sm font-semibold text-green-600">{purchase.price_paid} ₸</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enrolled Courses */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Мои курсы и семинары</h2>

            {loadingCourses ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto" />
                <p className="mt-4 text-gray-600 text-sm">Загрузка курсов...</p>
              </div>
            ) : enrolledCourses.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-gray-500">У вас пока нет активных курсов</p>
                <button onClick={() => navigate('/courses')} className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                  Посмотреть каталог курсов
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {enrolledCourses.map((enrollment) => {
                  const status = statusLabel(enrollment.status);
                  return (
                    <div key={enrollment.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{enrollment.course.title}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{enrollment.course.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                          <span className={`px-2 py-0.5 rounded-full font-medium ${status.color}`}>{status.text}</span>
                          <span className="text-gray-400">От {new Date(enrollment.enrolled_at).toLocaleDateString('ru-RU')}</span>
                          {enrollment.course.category && (
                            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{enrollment.course.category.name}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/learn/${enrollment.course.id}`)}
                        className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-1.5"
                      >
                        Перейти к курсу
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
