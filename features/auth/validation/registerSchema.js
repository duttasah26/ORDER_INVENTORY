import * as Yup from 'yup';

export const registerSchema = Yup.object({
  fullName: Yup.string().trim().required('This field is required.'),
  email: Yup.string()
    .trim()
    .email('Enter a valid email address.')
    .required('This field is required.'),
  password: Yup.string()
    .min(4, 'Password must be at least 4 characters.')
    .required('This field is required.'),
});

export default registerSchema;
