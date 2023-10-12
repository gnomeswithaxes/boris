import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Checkbox } from "./components";

export const Options = () => {
  const autoInitial = false;
  const versionInitial = false;
  const imagesInitial = true;
  const wizardInitial = false
  const [autoChecked, setAutoChecked] = useState(autoInitial);
  const [versionChecked, setVersionChecked] = useState(versionInitial);
  const [imagesChecked, setImagesChecked] = useState(imagesInitial);
  const [wizardChecked, setWizardChecked] = useState(wizardInitial);

  const handleAutoChange = () => {
    setAutoChecked(!autoChecked);
    chrome.storage.sync.set({ auto: !autoChecked });
  };

  const handleVersionChange = () => {
    setVersionChecked(!versionChecked);
    chrome.storage.sync.set({ printVersion: !versionChecked });
  }

  const handleImagesChange = () => {
    setImagesChecked(!imagesChecked);
    chrome.storage.sync.set({ images: !imagesChecked });
  }

  const handleWizardChange = () => {
    setWizardChecked(!wizardChecked);
    chrome.storage.sync.set({ shoppingWizard: !wizardChecked });
  }

  useEffect(() => {
    let isMounted = true;
    chrome.storage.sync.get(['auto', 'printVersion', 'images', 'shoppingWizard'], (data) => {
      if (isMounted) {
        if (data.auto != undefined)
          setAutoChecked(data.auto)
        else {
          setAutoChecked(autoInitial);
          chrome.storage.sync.set({ auto: autoInitial });
        };
        if (data.printVersion != undefined)
          setVersionChecked(data.printVersion)
        else {
          setVersionChecked(versionInitial);
          chrome.storage.sync.set({ printVersion: versionInitial });
        };
        if (data.images != undefined)
          setImagesChecked(data.images)
        else {
          setImagesChecked(imagesInitial);
          chrome.storage.sync.set({ images: imagesInitial });
        };
        if (data.shoppingWizard != undefined)
          setWizardChecked(data.shoppingWizard)
        else {
          setWizardChecked(wizardInitial);
          chrome.storage.sync.set({ shoppingWizard: wizardInitial });
        };
      }
    });
    return () => { isMounted = false };
  });

  return (
    <div>
      <h2>MTGGoldfish</h2>
      <h3>Show cheapest prices automatically</h3>
      <Checkbox checked={autoChecked} handleChange={handleAutoChange} />
      <h2>Cardmarket</h2>
      <h3>Show card art instead of camera icon</h3>
      <Checkbox checked={imagesChecked} handleChange={handleImagesChange} />
      <h3>When downloading a Wants list, use card names as shown<br />(if false, english names are preferred)</h3>
      <Checkbox checked={versionChecked} handleChange={handleVersionChange} />
      <h3><i>EXPERIMENTAL</i> - Add card links to ShoppingWizard results. This works by saving all urls when you visit a Wants list.</h3>
      <Checkbox checked={wizardChecked} handleChange={handleWizardChange} />
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <h1 style={{ color: 'rgb(240, 173, 78)' }}>Opzioni Boris - <i>the Italian Goldfish</i></h1>
    <Options />
  </React.StrictMode>,
  document.getElementById("root")
);
