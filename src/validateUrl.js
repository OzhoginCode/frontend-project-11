import { setLocale, string } from 'yup';

setLocale({
  string: {
    url: 'mustBeUrl',
  },
  mixed: {
    required: 'mustBeFilled',
    notOneOf: 'mustBeUnique',
  },
});

const validateUrl = (url, list) => {
  const schema = string()
    .required()
    .url()
    .notOneOf(list);

  return schema.validate(url);
};

export default validateUrl;
