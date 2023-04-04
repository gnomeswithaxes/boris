import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ISavedList } from "./common/interfaces";
import { Options } from "./options";

const Popup = () => {
  const [savedLists, setSavedLists] = useState<ISavedList[]>([]);

  useEffect(() => {
    let isMounted = true;
    chrome.storage.sync.get('saved_lists', (result) => { if (isMounted) setSavedLists(result.saved_lists) })
    return () => { isMounted = false }; // cleanup toggles value, if unmounted
  }, []);

  function handleRemove(index: number) {
    const newList = savedLists.filter((list) => list !== savedLists[index]);
    setSavedLists(newList);
    chrome.storage.sync.set({ saved_lists: newList });
  }

  let list;
  if (savedLists.length) {
    list =
      <ul>
        <base target="_blank" />
        {savedLists.map((list: ISavedList, i) => (
          <li key={i}>
            <a style={{ color: 'black', textDecoration: "none" }} href={list.url} dangerouslySetInnerHTML={{ __html: list.title }}></a>
            <button type="button" style={{ color: "red" }} onClick={() => handleRemove(i)}>X</button>
          </li>
        ))}
      </ul>;
  } else {
    list = <i>Salva liste su goldfish.com e appariranno qui</i>
  }

  return (
    <div style={{ minWidth: "500px" }}>
      <h2>Saved Deck Lists: </h2>
      <h3>
        {list}
      </h3>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Options />
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
