# Boris - <i>The Italian Goldfish</i>
Chrome extension to convert prices of Magic the Gathering cards on [MTGGoldfish.com](https://www.mtggoldfish.com) from dollars to euro and add functionality to [cardmarket.com](https://www.cardmarket.com)

For a complete list of feature, see the official page on [Chrome Web Store](https://chrome.google.com/webstore/detail/boris-the-italian-goldfis/dgkhcijbcbefeghmdjddbkbpfkkndhgg)

## Installation
The easiest way is to add it directly from [Chrome Web Store](https://chrome.google.com/webstore/detail/boris-the-italian-goldfis/dgkhcijbcbefeghmdjddbkbpfkkndhgg)

You can also manually add it to Chrome:
 - download the file `boris.zip` from the [Releases](https://github.com/gnomeswithaxes/boris/releases/latest) section of this repository. Inside you will find a folder called `dist`
 - open Chrome and write `chrome://extensions/` in the address bar (or navigate to the extensions management page)
 - enable "Developer Mode" in the upper right corner
 - click on "Load Unpacked"
 - select the folder called `dist` (make sure it contains the file `manifest.json`) 


To manually build the extension: 
 - download or clone the repository and open the folder `boris`
 - install modules: `> npm install`
 - build: `> npm run build` 
 - to automatically build after every change: `> npm run watch`
