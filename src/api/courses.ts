import { COURSE_ENDPOINTS } from 'constants/endpoints';

export interface Certificate {
  id: number;
  certificate_number: string;
  final_score: number;
  issued_at: string;
  is_valid: boolean;
  course: {
    id: number;
    title: string;
  };
  user?: {
    first_name: string | null;
    last_name: string | null;
    username: string;
  };
}

export interface CertificateVerification {
  certificate_number: string;
  final_score: number;
  issued_at: string;
  is_valid: boolean;
  course: { id: number; title: string };
  user: { first_name: string | null; last_name: string | null; username: string };
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  price: number;
  featured_image?: string;
  max_students?: number;
  duration_hours?: number;
  requirements?: string;
  learning_outcomes?: string;
  zoom_link?: string;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  author?: {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
  };
  materials?: CourseMaterial[];
}

export interface CourseMaterial {
  id: number;
  title: string;
  description: string;
  type: 'video' | 'pdf' | 'doc' | 'link' | 'text';
  file_path?: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
  external_url?: string;
  content?: string;
  course_id: number;
  created_by: number;
  duration_minutes?: number;
  sort_order: number;
  is_required: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Test {
  id: number;
  course_id: number;
  title: string;
  description?: string;
  passing_score: number;
  is_active: boolean;
  total_questions?: number;
  time_limit_minutes: number;
  max_attempts: number;
  created_at: string;
  updated_at: string;
}

export interface TestQuestion {
  id: number;
  question: string;
  type: 'single_choice' | 'multiple_choice' | 'text';
  options: string[];
  points: number;
}

export interface CourseResponse {
  data: Course[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const coursesAPI = {
  async getCourses(params?: {
    page?: number;
    category?: string;
    search?: string;
    featured?: boolean;
    type?: string;
  }): Promise<CourseResponse> {
    const url = new URL(COURSE_ENDPOINTS.GET_COURSES);
    
    if (params?.page) url.searchParams.append('page', params.page.toString());
    if (params?.category) url.searchParams.append('category', params.category);
    if (params?.search) url.searchParams.append('search', params.search);
    if (params?.featured !== undefined) url.searchParams.append('featured', params.featured.toString());
    if (params?.type) url.searchParams.append('type', params.type);

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }

    return response.json();
  },

  async getCourse(id: number): Promise<Course> {
    const response = await fetch(`${COURSE_ENDPOINTS.GET_COURSE}/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch course');
    }

    return response.json();
  },

  async getCourseCategories(): Promise<CourseCategory[]> {
    const response = await fetch(COURSE_ENDPOINTS.GET_COURSE_CATEGORIES, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch course categories');
    }

    return response.json();
  },

  async getCourseMaterials(courseId: number): Promise<CourseMaterial[]> {
    const response = await fetch(`${COURSE_ENDPOINTS.GET_COURSE_MATERIALS}/${courseId}/materials`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch course materials');
    }

    return response.json();
  },

  async getCourseTests(courseId: number): Promise<Test[]> {
    const response = await fetch(`${COURSE_ENDPOINTS.GET_COURSES}/${courseId}/tests`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch course tests');
    }

    return response.json();
  },

  async getCertificates(): Promise<Certificate[]> {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(COURSE_ENDPOINTS.USER_CERTIFICATES, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch certificates');
    const data = await response.json();
    return data.certificates || [];
  },

  async verifyCertificate(number: string): Promise<CertificateVerification> {
    const response = await fetch(`${COURSE_ENDPOINTS.VERIFY_CERTIFICATE}/${number}`, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) throw new Error('Сертификат не найден');
    const data = await response.json();
    return data.certificate;
  },

  async updateCourseProgress(courseId: number, currentStepIndex: number, progressPercentage?: number): Promise<any> {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Not authenticated');

    const body: any = { current_step_index: currentStepIndex };
    if (progressPercentage !== undefined) {
      body.progress_percentage = progressPercentage;
    }

    const response = await fetch(`${COURSE_ENDPOINTS.GET_COURSES}/${courseId}/progress`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error('Failed to update progress');
    }

    return response.json();
  },
};
