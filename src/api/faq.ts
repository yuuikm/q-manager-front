import { FAQ_ENDPOINTS } from 'constants/endpoints';

export interface FaqItem {
  id: number;
  parent_id: number | null;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
  active_children?: FaqItem[];
  all_active_children?: FaqItem[];
  parent?: FaqItem | null;
}

export const faqApi = {
  /**
   * Fetch active FAQ questions tree, or search matching questions
   */
  async getFaqs(search?: string): Promise<FaqItem[]> {
    const url = new URL(FAQ_ENDPOINTS.GET_FAQS);
    if (search && search.trim()) {
      url.searchParams.append('search', search.trim());
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Не удалось загрузить частые вопросы');
    }

    return response.json();
  },

  /**
   * Fetch a single FAQ item with its active children
   */
  async getFaq(id: number): Promise<FaqItem> {
    const response = await fetch(`${FAQ_ENDPOINTS.GET_FAQ_ITEM}/${id}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Не удалось загрузить данные вопроса');
    }

    return response.json();
  },

  /**
   * Submit custom user question as a lead
   */
  async submitLeadQuestion(data: LeadFormData): Promise<{ message: string; lead: any }> {
    const response = await fetch(FAQ_ENDPOINTS.LEADS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || 'Не удалось отправить заявку');
    }

    return response.json();
  },
};

export interface LeadFormData {
  phone: string;
  email?: string;
  question: string;
  name?: string;
  source?: string;
}
