import i18n from 'i18next';
import axios from 'axios';
import onChange from 'on-change';
import { uniqueId } from 'lodash';

import resources from './locales/index.js';

import render from './render.js';
import validateUrl from './tools/validateUrl.js';
import parseRss from './tools/parseRss.js';

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
    modal: document.getElementById('modal'),
    modalTitle: document.getElementById('modal-title'),
    modalText: document.getElementById('modal-text'),
    modalLink: document.getElementById('modal-link'),
  };

  const initState = {
    process: {
      processState: 'filling',
      processError: null,
    },
    form: {
      valid: true,
    },
    modal: {
      state: 'closed',
      postId: null,
    },
    posts: [],
    feeds: [],
    ui: {
      watchesPostsIds: [],
    },
  };

  const state = onChange(initState, render(elements, i18nInstance, initState));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value } = elements.input;

    state.process.processState = 'processing';
    state.form.valid = true;
    state.process.processError = null;

    const existingUrls = state.feeds.map((feed) => feed.url);

    validateUrl(value, existingUrls)
      .then(() => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(value)}`))
      .then((data) => {
        const parsed = parseRss(data.data.contents);

        const feedId = uniqueId();

        const feed = {
          feedId,
          url: value,
          ...parsed.feed,
        };
        state.feeds = [feed, ...state.feeds];

        const posts = parsed.posts.map((post) => ({ ...post, feedId, id: uniqueId() }));
        state.posts = [...posts, ...state.posts];

        state.form.valid = true;
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

  elements.modal.addEventListener('show.bs.modal', (e) => {
    const { postId } = e.relatedTarget.dataset;

    state.modal.postId = postId;
    state.modal.state = 'opened';

    if (!state.ui.watchesPostsIds.includes(postId)) {
      state.ui.watchesPostsIds.push(postId);
    }
  });

  const updateRss = () => {
    const { feeds } = state;

    const queries = feeds.map(({ url, feedId }) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
      .then((data) => ({ data, feedId })));

    Promise.all(queries)
      .then((results) => {
        results.forEach(({ data, feedId }) => {
          const { posts } = parseRss(data.data.contents);

          const existingPostTitles = state.posts
            .filter((post) => post.feedId === feedId)
            .map((post) => post.title);

          const newPosts = posts
            .filter(({ title }) => !existingPostTitles.includes(title))
            .map((post) => ({ ...post, feedId, id: uniqueId() }));

          state.posts = [...newPosts, ...state.posts];
        });
      })
      .catch((error) => {
        console.log(`Unexpected RSS refresh error: ${error}`);
      })
      .finally(() => {
        setTimeout(updateRss, 5000);
      });
  };

  updateRss();
};

export default app;
