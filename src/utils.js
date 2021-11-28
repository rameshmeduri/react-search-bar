import { useState, useEffect } from 'react';
import axios from 'axios';

const SuggestionsApi =
  'https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/e026dab444155edf2f52122aefbb80347c68de86/suggestion.json';

  const ResultsApi =
  'https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/44deafab00fc808ed7fa0e59a8bc959d255b9785/queryResult.json';

const useDebounce = (str) => {
  const [debouncedValue, setDebouncedValue] = useState(str);
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(str);
    }, 400);
    return () => clearTimeout(timerId);
  }, [str]);
  return debouncedValue;
};

const fetchSuggestions = (query) => {
  return axios.get(SuggestionsApi).then((res) => {
    const suggestionsArr = res?.data?.suggestions;
    if (suggestionsArr && suggestionsArr.length) {
      return suggestionsArr;
    }
    return [];
  });
};

const fetchResults = (query) => {
  return axios.get(ResultsApi).then((res) => {
    return res.data;
  });
};

const renderSuggestion = (query, onSelect) => (str, index) => {
  const rx = new RegExp(`(${query})`, 'gi');
  const text = str.replace(rx, (str) => `<b>${str}</b>`);
  return (
    <li
      key={index}
      className="list-group-item list-group-item-action"
      onClick={() => {
        onSelect(str);
      }}>
      <span dangerouslySetInnerHTML={{ __html: text }} />
    </li>
  );
};

const renderResultItem = (query) => (obj) => {
  const { DocumentId, DocumentTitle, DocumentExcerpt, DocumentURI } = obj;
  const rx = new RegExp(`(${query})`, 'gi');
  let desc = DocumentExcerpt.Text;
  desc = desc.replace(rx, (str) => `<b>${str}</b>`);

  return (
    <div className="card" key={DocumentId}>
      <div className="card-body">
        <div className="card-title mt-5">{DocumentTitle.Text}</div>
        <div
          className="card-text mt-3"
          dangerouslySetInnerHTML={{ __html: desc }}
        />
        <div className="card-link mt-3">{DocumentURI}</div>
      </div>
    </div>
  );
};

export {
  useDebounce,
  fetchSuggestions,
  fetchResults,
  renderSuggestion,
  renderResultItem
};
