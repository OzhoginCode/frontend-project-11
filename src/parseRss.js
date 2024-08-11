const parse = (xml) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');

  const channel = doc.querySelector('channel');
  const title = channel.querySelector('title').textContent;
  const description = channel.querySelector('description').textContent;

  const items = Array.from(channel.querySelectorAll('item'));
  const posts = items.map((item) => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
  }));

  return {
    feed: {
      title,
      description,
    },
    posts,
  };
};

const parseRss = (xml) => {
  try {
    return parse(xml);
  } catch {
    throw new Error('mustBeRSS');
  }
};

export default parseRss;
