import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { IPinnedList } from "./common/interfaces";
import { Options } from "./options";

const Popup = () => {
  const [pinnedLists, setPinnedLists] = useState<IPinnedList[]>([]);

  useEffect(() => {
    let isMounted = true;
    chrome.storage.sync.get('pinned_lists', (result) => { if (isMounted) setPinnedLists(result.pinned_lists) })
    return () => { isMounted = false }; // cleanup toggles value, if unmounted
  }, []);

  function handleRemove(index: number) {
    const newList = pinnedLists.filter((list) => list !== pinnedLists[index]);
    setPinnedLists(newList);
    chrome.storage.sync.set({ pinned_lists: newList });
  }

  let list;
  if (pinnedLists && pinnedLists.length) {
    list =
      <ul>
        <base target="_blank" />
        {pinnedLists.map((list: IPinnedList, i) => (
          <li key={i}>
            <a style={{ color: 'black', textDecoration: "none" }} href={list.url} dangerouslySetInnerHTML={{ __html: list.title }}></a>
            <button type="button" style={{ color: "red" }} onClick={() => handleRemove(i)}>X</button>
          </li>
        ))}
      </ul>;
  } else {
    list = <div><i>Pin lists on</i> MTGGoldfish.com <i>and they will appear here</i></div>
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
    <h1 style={{color: 'rgb(240, 173, 78)'}}>Boris - <i>the Italian Goldfish</i></h1>
    <Options />
    <hr />
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
