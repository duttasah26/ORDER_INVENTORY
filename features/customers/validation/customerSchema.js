import * as Yup from 'yup';
import { isValidEmail } from '@shared/utils/validators';

export const customerSchema = Yup.object({
  full_name: Yup.string().trim().required('This field is required.'),
  email_address: Yup.string()
    .trim()
    .required('This field is required.')
    .test('is-valid-email', 'Enter a valid email address.', (value) =>
      value ? isValidEmail(value) : true
    ),
});

export default customerSchema;
