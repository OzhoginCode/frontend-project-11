const handleProcessState = (elements, processState, i18nInstance) => {
  switch (processState) {
    case 'filling':
      elements.feedback.classList.remove('d-none');
      elements.submitButton.disabled = false;
      break;

    case 'processing':
      elements.feedback.classList.add('d-none');
      elements.submitButton.disabled = true;
      break;

    case 'success':
      elements.feedback.classList.remove('d-none');
      elements.submitButton.disabled = false;
      elements.feedback.innerHTML = i18nInstance.t('feedback.success');
      break;

    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};

const handleChangeRssList = (elements) => {
  const { input } = elements;

  input.value = '';
  input.focus();
};

const renderFeeds = (elements, feeds, i18nInstance) => {
  const { feedsContainer } = elements;

  if (!feeds.length) {
    feedsContainer.innerHTML = '';
    return;
  }

  const h3 = document.createElement('h3');
  h3.textContent = i18nInstance.t('headers.feeds');

  const ul = document.createElement('ul');
  ul.classList.add('list-group');

  const feedsList = feeds.map(({ title, description }) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0');

    const titleEl = document.createElement('h6');
    titleEl.textContent = title;

    const descriptionEl = document.createElement('p');
    descriptionEl.textContent = description;
    descriptionEl.classList.add('small', 'text-black-50');

    li.appendChild(titleEl);
    li.appendChild(descriptionEl);

    return li;
  });

  ul.replaceChildren(...feedsList);

  feedsContainer.innerHTML = '';
  feedsContainer.appendChild(h3);
  feedsContainer.appendChild(ul);
};

const renderPosts = (elements, posts, i18nInstance) => {
  const { postsContainer } = elements;

  if (!posts.length) {
    postsContainer.innerHTML = '';
    return;
  }

  const h3 = document.createElement('h3');
  h3.textContent = i18nInstance.t('headers.posts');

  const ul = document.createElement('ul');
  ul.classList.add('list-group');

  const postsList = posts.map(({ title, link }) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'd-flex', 'justify-content-between');

    const linkEl = document.createElement('a');
    linkEl.textContent = title;
    linkEl.setAttribute('href', link);
    linkEl.setAttribute('target', '_blank');
    linkEl.classList.add('fw-bold');

    const btn = document.createElement('button');
    btn.textContent = i18nInstance.t('buttons.viewPost');
    btn.classList.add('btn', 'btn-outline-primary');

    li.appendChild(linkEl);
    li.appendChild(btn);

    return li;
  });

  ul.replaceChildren(...postsList);

  postsContainer.innerHTML = '';
  postsContainer.appendChild(h3);
  postsContainer.appendChild(ul);
};

const render = (elements, i18nInstance) => (path, value) => {
  switch (path) {
    case 'process.processState':
      handleProcessState(elements, value, i18nInstance);
      break;

    case 'process.processError':
      elements.feedback.innerHTML = i18nInstance.t(value);
      elements.feedback.classList.toggle('text-danger', value);
      elements.feedback.classList.toggle('text-success', !value);
      break;

    case 'form.valid':
      elements.input.classList.toggle('is-invalid', !value);
      break;

    case 'rssList':
      handleChangeRssList(elements);
      break;

    case 'feeds':
      renderFeeds(elements, value, i18nInstance);
      break;

    case 'posts':
      renderPosts(elements, value, i18nInstance);
      break;

    default:
      break;
  }
};

export default render;
