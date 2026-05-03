import { type FC, useState } from 'react';

interface MockCardProps {
  onSuccess: () => void;
  isAllowedUser: boolean;
  amount: number;
}

const MockCard: FC<MockCardProps> = ({ onSuccess, isAllowedUser, amount }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handlePay = () => {
    setError(null);
    if (!cardNumber || !expiry || !cvc) {
      setError('Пожалуйста, заполните все поля карты');
      return;
    }

    if (isAllowedUser) {
      setIsProcessing(true);
      // Simulate network request
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess();
      }, 1500);
    } else {
      setError('В данный момент оплата картой недоступна для вашего аккаунта (включен тестовый режим).');
    }
  };

  return (
    <div className="bg-gradient-to-tr from-gray-900 to-gray-800 p-6 rounded-2xl shadow-2xl relative overflow-hidden text-white w-full max-w-sm mx-auto my-6">
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-indigo-500 opacity-20 blur-xl"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl tracking-widest font-semibold flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            ОПЛАТА
          </h3>
          <span className="text-lg font-bold text-white bg-black/30 px-3 py-1 rounded-lg">
            {amount > 0 ? `${amount} ₸` : 'Бесплатно'}
          </span>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-500/50 text-red-200 text-sm px-3 py-2 rounded">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">Номер карты</label>
            <input 
              type="text" 
              className="w-full bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-400 font-mono tracking-widest transition-colors"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
              disabled={isProcessing}
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">Срок (MM/YY)</label>
              <input 
                type="text" 
                className="w-full bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-400 font-mono transition-colors"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                maxLength={5}
                disabled={isProcessing}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">CVC</label>
              <input 
                type="password" 
                className="w-full bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-400 font-mono transition-colors"
                placeholder="***"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/gi, ''))}
                maxLength={3}
                disabled={isProcessing}
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handlePay}
          disabled={isProcessing}
          className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-indigo-400 disabled:to-purple-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 active:scale-[0.98] flex justify-center items-center"
        >
          {isProcessing ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Оплатить и завершить'
          )}
        </button>
      </div>
    </div>
  );
};

export default MockCard;
