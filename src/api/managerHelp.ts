import { API_BASE_URL } from 'constants/endpoints';

export interface ManagerHelpCategory {
    id: number;
    name: string;
    slug: string;
}

export interface ManagerHelpItem {
    id: number;
    title: string;
    slug: string;
    category_id: number;
    description: string | null;
    file_path: string | null;
    file_name: string | null;
    youtube_url: string | null;
    is_active: boolean;
    category?: ManagerHelpCategory;
    created_at: string;
    updated_at: string;
}

export const managerHelpAPI = {
    async getHelps(params?: { category_id?: number }): Promise<ManagerHelpItem[]> {
        const url = new URL(`${API_BASE_URL}/manager-help`);
        if (params?.category_id) url.searchParams.append('category_id', params.category_id.toString());
        url.searchParams.append('is_active', '1');

        const response = await fetch(url.toString(), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Failed to fetch manager helps');
        return response.json();
    },

    async getHelp(id: number | string): Promise<ManagerHelpItem> {
        const response = await fetch(`${API_BASE_URL}/manager-help/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Failed to fetch manager help');
        return response.json();
    },

    async getCategories(): Promise<ManagerHelpCategory[]> {
        const response = await fetch(`${API_BASE_URL}/manager-help-categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        return response.json();
    },
};
