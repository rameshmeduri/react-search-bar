import { useState, useEffect, useRef } from 'react';
import {
  useDebounce,
  fetchSuggestions,
  fetchResults,
  renderSuggestion,
  renderResultItem
} from '../utils';

const SearchBar = ({ data }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);
  const [isSearching, setIsSearching] = useState(true);
  const [suggestionArr, setSuggestionArr] = useState([]);
  const [searchResultObj, setSearchResultObj] = useState({});
  const textboxRef = useRef(null);

  useEffect(() => {
    if (debouncedQuery.length > 2 && isSearching) {
      fetchSuggestions(debouncedQuery).then((list) => {
        setSuggestionArr(list);
      });
    } else {
      setSuggestionArr([]);
    }
  }, [debouncedQuery, isSearching]);

  const onChange = (event) => {
    const newVal = event.target.value.trim();
    setQuery(newVal);
    setIsSearching(true);
    if (!newVal) {
      setSuggestionArr([]);
    }
  };

  const onSearch = () => {
    setIsSearching(false);
    if (query.length) {
      fetchResults(query).then((obj) => {
        setSearchResultObj(obj);
      });
    } else {
      setSearchResultObj({});
    }
  };

  const clearInput = () => {
    setQuery('');
    setIsSearching(false);
    setSuggestionArr([]);
    textboxRef.current.focus();
  };

  const onSelect = (str) => {
    setQuery(str);
    setIsSearching(false);
    setSuggestionArr([]);
  };

  let suggestionsContent = null;
  if (suggestionArr.length && isSearching) {
    suggestionsContent = (
      <ul className="list-group">
        {suggestionArr.map(renderSuggestion(query, onSelect))}
      </ul>
    );
  }

  let searchResultContent = null;
  if (Object.keys(searchResultObj).length) {
    const {
      Page,
      PageSize,
      TotalNumberOfResults,
      ResultItems
    } = searchResultObj;
    searchResultContent = (
      <div className="my-5">
        <div className="showing">
          Showing {Page}-{PageSize} of {TotalNumberOfResults}
        </div>
        {ResultItems.map(renderResultItem(query))}
      </div>
    );
  }

  return (
    <div>
      <div className="row my-5">
        <div className="col-9 px-0 search-bar-container">
          <input
            type="text"
            className="form-control query-textbox"
            value={query}
            onChange={onChange}
            ref={textboxRef}
            data-testid="textbox"
          />

          <span className="close-icon">
            {query.length ? (
              <i className="fa fa-times" onClick={clearInput} />
            ) : null}
          </span>

          {suggestionsContent}
        </div>
        <div className="col-3 px-0">
          <button
            type="button"
            className="btn btn-primary search-btn"
            onClick={onSearch}>
            <i className="fa fa-search" /> Search
          </button>
        </div>
      </div>

      {searchResultContent}
    </div>
  );
};

export default SearchBar;
