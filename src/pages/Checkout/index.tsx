import { type FC, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fields, initialValues, validationSchema } from './config';
import FormWrapper from 'shared/FormWrapper';
import { ROUTES } from 'constants/routes';
import { useAppSelector } from 'store/hooks';
import { API_BASE_URL } from 'constants/endpoints';

interface CheckoutItem {
  id: number;
  title: string;
  type: 'course' | 'document';
  price: number;
  description?: string;
}

const Checkout: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAppSelector((state: any) => state.auth);
  const [checkoutItem, setCheckoutItem] = useState<CheckoutItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      setError('Неверные параметры заказа');
      setLoading(false);
      return;
    }

    if (type !== 'course' && type !== 'document') {
      setError('Неверный тип товара');
      setLoading(false);
      return;
    }

    fetchItemDetails(type as 'course' | 'document', parseInt(id));
  }, [searchParams]);

  const fetchItemDetails = async (type: 'course' | 'document', id: number) => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = type === 'course' 
        ? `${API_BASE_URL}/courses/${id}`
        : `${API_BASE_URL}/documents/${id}`;

      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error('Товар не найден');
      }

      const data = await response.json();
      
      setCheckoutItem({
        id: data.id,
        title: data.title,
        type,
        price: data.price || 0,
        description: data.description,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ошибка загрузки товара');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: typeof initialValues) => {
    if (!checkoutItem) return;

    try {
      setSubmitting(true);
      setError(null);

      const endpoint = checkoutItem.type === 'course'
        ? `${API_BASE_URL}/courses/${checkoutItem.id}/enroll`
        : `${API_BASE_URL}/documents/${checkoutItem.id}/purchase`;

      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: values.firstName,
          last_name: values.lastName,
          phone: values.phone,
          email: values.email,
          company: values.company || null,
          notes: values.notes || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при подаче заявки');
      }

      setSubmitted(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Произошла ошибка при подаче заявки');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !checkoutItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-800 font-medium">{error}</span>
              </div>
            </div>
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state after submission
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="bg-white py-10 px-8 shadow-xl rounded-2xl border border-gray-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Заявка успешно отправлена!
            </h2>
            <p className="text-gray-600 mb-2">
              Ваша заявка на {checkoutItem?.type === 'course' ? 'курс' : 'документ'} «{checkoutItem?.title}» принята.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Наш менеджер свяжется с вами в ближайшее время для уточнения деталей и оформления договора. 
              Вы можете отслеживать статус заявки в своём профиле.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">Этапы обработки заявки:</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">✓</span>
                  <span className="text-green-700 font-medium">Заявка создана</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-6 h-6 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">2</span>
                  <span className="text-gray-500">Оформление договора</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-6 h-6 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">3</span>
                  <span className="text-gray-500">Оплата и получение доступа</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(ROUTES.PROFILE)}
                className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Перейти в профиль
              </button>
              <button
                onClick={() => navigate(ROUTES.HOME)}
                className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                На главную
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!checkoutItem) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Подать заявку
          </h1>
          <p className="text-lg text-gray-600">
            Заполните данные для {checkoutItem.type === 'course' ? 'записи на курс' : 'приобретения документа'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white shadow-xl rounded-xl border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Детали заказа</h2>
            
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    {checkoutItem.type === 'course' ? (
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {checkoutItem.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {checkoutItem.type === 'course' ? 'Курс' : 'Документ'}
                  </p>
                  {checkoutItem.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {checkoutItem.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span className="text-gray-900">Стоимость:</span>
                <span className="text-indigo-600">
                  {checkoutItem.price > 0 ? `${checkoutItem.price}₸` : 'Бесплатно'}
                </span>
              </div>
            </div>

            {/* How it works */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Как это работает:</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">1</span>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Подайте заявку</p>
                    <p className="text-xs text-gray-500">Заполните контактные данные</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">2</span>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Оформление договора</p>
                    <p className="text-xs text-gray-500">Менеджер свяжется с вами</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">3</span>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Оплата</p>
                    <p className="text-xs text-gray-500">После оплаты вы получите доступ к материалу</p>
                  </div>
                </div>
              </div>
            </div>

            {user && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-800 text-sm font-medium">
                    Вы авторизованы как: {user.first_name} {user.last_name}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Application Form */}
          <div className="bg-white shadow-xl rounded-xl border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Контактные данные</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-800 text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            <FormWrapper
              fields={fields}
              initialValues={user ? {
                ...initialValues,
                firstName: user.first_name || '',
                lastName: user.last_name || '',
                email: user.email || '',
              } : initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              submitText={submitting ? 'Отправка...' : 'Подать заявку'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
