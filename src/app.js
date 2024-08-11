import i18n from 'i18next';
import axios from 'axios';
import onChange from 'on-change';

import resources from './locales/index.js';

import render from './render.js';
import validateUrl from './validateUrl.js';
import parseRss from './parseRss.js';

const app = () => {
  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  });

  const elements = {
    form: document.getElementById('add-rss-form'),
    input: document.getElementById('url-input'),
    submitButton: document.getElementById('submit-button'),
    feedback: document.getElementById('feedback'),
    feedsContainer: document.getElementById('rss-feeds-container'),
    postsContainer: document.getElementById('rss-posts-container'),
  };

  const initState = {
    process: {
      processState: 'filling',
      processError: null,
    },
    form: {
      valid: true,
    },
    rssList: [],
    posts: [],
    feeds: [],
  };

  const state = onChange(initState, render(elements, i18nInstance));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value } = elements.input;

    state.process.processState = 'processing';
    state.form.valid = true;
    state.process.processError = null;

    validateUrl(value, state.rssList)
      .then(() => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(value)}`))
      .then((data) => {
        const parsed = parseRss(data.data.contents);
        state.form.valid = true;
        state.rssList.push(value);
        state.feeds.push(parsed.feed);
        state.posts.push(...parsed.posts);
        state.process.processState = 'success';
      })
      .catch((error) => {
        if (error.message === 'Network Error') {
          state.process.processError = 'networkError';
          state.process.processState = 'filling';
          return;
        }
        state.form.valid = false;
        state.process.processError = `validationError.${error.message}`;
        state.process.processState = 'filling';
      });
  });
};

export default app;
