// libraries
import { type FC } from "react";

const currentYear = new Date().getFullYear();

const Footer: FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Q-Manager.kz</h3>
            <p>
              Профессиональное обучение и консультации в области менеджмента
              качества.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Курсы</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  СМК (ISO 9001)
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  СМОТ (ISO 45001)
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  СМИ (ISO 27001)
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  СМАК (ISO 37001)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Контакты</h3>
            <ul className="space-y-2">
              <li>Телефон: +7 (727) 274-93-92</li>
              <li>Email: info@standard.kz</li>
              <li>Адрес: 050008, г.Алматы, ул.Байзакова, 299</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p>© {currentYear} Q-Manager.kz. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
