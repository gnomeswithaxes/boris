import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Checkbox } from "./components";

export const Options = () => {
  const [autoChecked, setAutoChecked] = useState(false);
  const [versionChecked, setVersionChecked] = useState(false);
  const [wizardChecked, setWizardChecked] = useState(false);

  const handleAutoChange = () => {
    setAutoChecked(!autoChecked);
    chrome.storage.sync.set({ auto: !autoChecked });
  };

  const handleVersionChange = () => {
    setVersionChecked(!versionChecked);
    chrome.storage.sync.set({ printVersion: !versionChecked });
  }

  const handleWizardChange = () => {
    setWizardChecked(!wizardChecked);
    chrome.storage.sync.set({ shoppingWizard: !wizardChecked });
  }

  useEffect(() => {
    let isMounted = true;
    chrome.storage.sync.get(['auto', 'printVersion', 'shoppingWizard'], (data) => {
      if (isMounted) {
        if (data.auto as boolean | undefined)
          setAutoChecked(data.auto)
        else {
          setAutoChecked(false);
          chrome.storage.sync.set({ auto: false });
        };
        if (data.printVersion as boolean | undefined)
          setVersionChecked(data.printVersion)
        else {
          setVersionChecked(false);
          chrome.storage.sync.set({ printVersion: false });
        };
        if (data.shoppingWizard as boolean | undefined)
          setWizardChecked(data.shoppingWizard)
        else {
          setWizardChecked(false);
          chrome.storage.sync.set({ shoppingWizard: false });
        };
      }
    });
    return () => { isMounted = false };
  });

  return (
    <div>
      <h2>MTGGoldfish</h2>
      <h3>Automatic cheapest prices conversion</h3>
      <Checkbox checked={autoChecked} handleChange={handleAutoChange} />
      <h2>Cardmarket</h2>
      <h3>When saving a Wants list, print card names as shown<br />(if false, english names are used instead)</h3>
      <Checkbox checked={versionChecked} handleChange={handleVersionChange} />
      <h3><i>EXPERIMENTAL</i> - Add links to ShoppingWizard results</h3>
      <Checkbox checked={wizardChecked} handleChange={handleWizardChange} />
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <h1 style={{color: 'rgb(240, 173, 78)'}}>Opzioni Boris - <i>the Italian Goldfish</i></h1>
    <Options />
  </React.StrictMode>,
  document.getElementById("root")
);
