import i18n from 'i18next';
import onChange from 'on-change';

import resources from './locales/index.js';

import render from './render.js';
import validateUrl from './validateUrl.js';

const app = () => {
  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources,
  });

  const elements = {
    form: document.getElementById('add-rss-form'),
    input: document.getElementById('url-input'),
    submitButton: document.getElementById('submit-button'),
    inputError: document.getElementById('input-error'),
    listContainer: document.getElementById('rss-list-container'),
  };

  const initState = {
    process: {
      processState: 'filling',
      processError: null,
    },
    form: {
      valid: true,
      error: null,
    },
    rssList: [],
  };

  const state = onChange(initState, render(elements, i18nInstance));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value } = elements.input;

    state.process.processState = 'validating';

    validateUrl(value, state.rssList)
      .then(({ valid, error }) => {
        if (valid) {
          state.rssList.push(elements.input.value);
        }
        state.form.error = error;
        state.form.valid = valid;
        state.process.processState = 'filling';
      });
  });
};

export default app;
