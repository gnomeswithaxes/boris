import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

export const Options = () => {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
    chrome.storage.sync.set({ auto: !checked });
  };

  useEffect(() => {
    chrome.storage.sync.get('auto', (data) => {
      if (data.auto as boolean | undefined)
        setChecked(data.auto)
      else {
        setChecked(false);
        chrome.storage.sync.set({ auto: false });
      };
    });
  });

  return (
    <div>
      <h2>Conversione automatica prezzi</h2>
      <label className="switch">
        <input id="auto" type="checkbox"
          checked={checked}
          onChange={handleChange} />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <h1>Opzioni Boris - <i>The Italian Goldfish</i></h1>
    <br />
    <Options />
  </React.StrictMode>,
  document.getElementById("root")
);
