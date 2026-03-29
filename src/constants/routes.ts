export const ROUTES = {
  // Main pages
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',

  // Documents
  DOCUMENTS: '/documents',
  DOCUMENT_DETAIL: '/documents/view/:id',
  SUBCATEGORY_DETAIL: '/documents/:subcategorySlug',

  // News
  NEWS: '/news',
  NEWS_DETAIL: '/news/:id',

  // Courses
  COURSES: '/courses', // keeping for fallback/existing links if necessary
  COURSES_ONLINE: '/courses/online',
  COURSES_OFFLINE: '/courses/offline',
  COURSES_SELF: '/courses/self-education',
  COURSE_DETAIL: '/courses/:id',

  // Checkout
  CHECKOUT: '/checkout',

  // About
  ABOUT_US: '/about-us',

  // Contact
  CONTACT: '/contact',

  // Consultation services
  CONSULTATION_DEVELOPMENT: '/consultation/development',
  CONSULTATION_EFQM: '/consultation/efqm',
  CONSULTATION_IMPROVEMENT: '/consultation/improvement',
  CONSULTATION_AUDIT: '/consultation/audit',

  // Manager Help
  MANAGER_HELP: '/manager-help',
  MANAGER_HELP_DETAIL: '/manager-help/:id',

  // Admin (if needed for frontend)
  ADMIN: '/admin',
} as const;

// Helper function to generate routes with parameters
export const generateRoute = (route: string, params: Record<string, string | number> = {}): string => {
  let generatedRoute = route;

  Object.entries(params).forEach(([key, value]) => {
    generatedRoute = generatedRoute.replace(`:${key}`, String(value));
  });

  return generatedRoute;
};

// Route helpers for common use cases
export const routeHelpers = {
  documentDetail: (id: number) => generateRoute(ROUTES.DOCUMENT_DETAIL, { id }),
  subcategoryDetail: (subcategorySlug: string) => generateRoute(ROUTES.SUBCATEGORY_DETAIL, { subcategorySlug }),
  newsDetail: (id: number) => generateRoute(ROUTES.NEWS_DETAIL, { id }),
  courseDetail: (id: number) => generateRoute(ROUTES.COURSE_DETAIL, { id }),
  managerHelpDetail: (id: number) => generateRoute(ROUTES.MANAGER_HELP_DETAIL, { id }),
  checkout: (type: 'course' | 'document', id: number) => `${ROUTES.CHECKOUT}?type=${type}&id=${id}`,
} as const;
