import * as Yup from 'yup';

export const fields = [
  { name: 'firstName', label: 'Имя *', type: 'text', placeholder: 'Введите ваше имя' },
  { name: 'lastName', label: 'Фамилия *', type: 'text', placeholder: 'Введите вашу фамилию' },
  { name: 'phone', label: 'Телефон *', type: 'tel', placeholder: '+7 (999) 123-45-67' },
  { name: 'email', label: 'Email *', type: 'email', placeholder: 'Введите ваш email' },
  { name: 'company', label: 'Компания', type: 'text', placeholder: 'Название вашей компании (необязательно)' },
  { name: 'notes', label: 'Комментарии', type: 'textarea', placeholder: 'Дополнительные пожелания или комментарии' },
];

export const initialValues = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  company: '',
  notes: '',
};

export const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .required('Имя обязательно для заполнения'),
  lastName: Yup.string()
    .min(2, 'Фамилия должна содержать минимум 2 символа')
    .required('Фамилия обязательна для заполнения'),
  phone: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Введите корректный номер телефона')
    .required('Телефон обязателен для заполнения'),
  email: Yup.string()
    .email('Пожалуйста, введите корректный email адрес')
    .required('Email обязателен для заполнения'),
  company: Yup.string(),
  notes: Yup.string(),
});
