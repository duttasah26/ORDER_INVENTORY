import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email('Enter a valid email address.')
    .required('This field is required.'),
  password: Yup.string().required('This field is required.'),
});

export default loginSchema;
