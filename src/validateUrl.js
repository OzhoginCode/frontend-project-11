import { string } from 'yup';

const validateUrl = (url, list) => {
  const schema = string()
    .required()
    .url('Ссылка должна быть валидным URL')
    .test(
      'is-unique',
      'RSS уже существует',
      (value) => !list.includes(value),
    );

  return schema.validate(url)
    .then(() => ({ valid: true, error: null }))
    .catch((error) => ({ valid: false, error: error.errors[0] }));
};

export default validateUrl;
