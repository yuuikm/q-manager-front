import { API_BASE_URL } from 'constants/endpoints';

export interface Slider {
    id: number;
    title: string | null;
    description: string | null;
    image_path: string;
    link_url: string | null;
    order: number;
    is_active: boolean;
}

export const sliderAPI = {
    getSliders: async (): Promise<Slider[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/sliders`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch sliders');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching sliders:', error);
            return [];
        }
    },
};
