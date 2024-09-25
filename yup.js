
import * as Yup from 'yup';
export const validationSchema = Yup.object().shape({
    name: Yup.string().required('Tên không được để trống'),
    email: Yup.string()
      .email('Email không hợp lệ')
      .required('Email không được để trống'),
    age: Yup.number()
      .typeError('Tuổi phải là số')
      .required('Tuổi không được để trống')
      .positive('Tuổi phải là số dương')
      .max(70, 'Tuổi không được quá 70'),
  });
  