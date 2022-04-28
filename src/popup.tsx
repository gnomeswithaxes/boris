import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ISavedList } from "./interfaces";

const Popup = () => {
  const [savedLists, setSavedLists] = useState<ISavedList[]>([]);

  useEffect(() => {
    chrome.storage.sync.get('saved_lists', (result) => setSavedLists(result.saved_lists));
  });

  return (
    <div>
      <h2>Saved Deck Lists: </h2>
      <h3>
        <base target="_blank" />
        <ul style={{ minWidth: "700px" }}>
          {savedLists.map((list: ISavedList, i) => (
            <li key={i}><a style={{color: 'black', textDecoration: "none"}} href={list.url} dangerouslySetInnerHTML={{ __html: list.title }}></a></li>
          ))}
        </ul>
      </h3>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
