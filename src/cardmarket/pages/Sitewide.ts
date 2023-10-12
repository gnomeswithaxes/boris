import { autocomplete_results, boris_img_class, camera_class, col_camera_icon_classlist, header_selector, icon_selector } from "../page_elements";
import { get_mkm_src, replaceCamera } from "../utilities";


// Options for the observer (which mutations to observe)
const config = { childList: true };

// Callback function to execute when mutations are observed
const callback = function (mutationList: any, observer: any) {
    for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
            const results = document.getElementById(autocomplete_results)
            if (results) {
                const icon_spans = results.getElementsByClassName(camera_class)
                // The span collection gets smaller after every upgrade, so the original length must be saved
                const spans_length = icon_spans.length

                for (let i = 0; i < spans_length; i++) {
                    // always take the first one, that hasn't changed yet
                    const span = icon_spans[0]

                    let src = get_mkm_src(span)
                    if (src != "") {
                        replaceCamera(span, src)
                    }
                }
            }
        }
    }
};

export function addAutocompleteImages() { // TODO make this work
    chrome.storage.sync.get("images", async (result) => {
        if (result.images as boolean) {
            const results = document.getElementById(autocomplete_results)
            if (results) {
                const observer = new MutationObserver(callback);
                observer.observe(results, config);
            }
        }
    })
}


export function addImages() {
    const header = document.querySelector(header_selector)
    if (header) {
        header.classList.add(boris_img_class)
    } else {
        document.querySelector(icon_selector)?.classList.add(boris_img_class)
    }
    const icon_spans = document.getElementsByClassName(camera_class)
    // The span collection gets smaller after every upgrade, so the original length must be saved
    const spans_length = icon_spans.length

    for (let i = 0; i < spans_length; i++) {
        // always take the first one, that hasn't changed yet
        const span = icon_spans[0]

        let src = get_mkm_src(span)
        if (src != "") {
            replaceCamera(span, src)
            const div = span?.parentElement
            div?.classList.remove(...col_camera_icon_classlist)
            div?.appendChild(span!)
        }
    }
}