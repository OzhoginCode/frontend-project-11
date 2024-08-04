import onChange from 'on-change';

import render from './render.js';
import validateUrl from './validateUrl.js';

const app = () => {
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

  const state = onChange(initState, render(elements));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value } = elements.input;

    state.process.processState = 'validating';

    validateUrl(value, state.rssList)
      .then(({ valid, error }) => {
        if (valid) {
          state.rssList.push(elements.input.value);
        }
        state.form.valid = valid;
        state.form.error = error;
        state.process.processState = 'filling';
      });
  });
};

export default app;
