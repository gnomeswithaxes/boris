import { autocomplete_results, boris_img_class, camera_class, col_camera_icon_classlist, header_selector, icon_selector } from '../page_elements'
import { get_mkm_src, replaceCamera } from '../utilities'
import { getSyncSetting } from '../../common/storage'

export function addAutocompleteImages(): void {
  getSyncSetting('images').then(enabled => {
    if (!enabled) return
    const results = document.getElementById(autocomplete_results)
    if (!results) return

    const observer = new MutationObserver((mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type !== 'childList') continue
        const icons = results.getElementsByClassName(camera_class)
        const count = icons.length
        for (let i = 0; i < count; i++) {
          const span = icons[0]
          const src = get_mkm_src(span)
          if (src) replaceCamera(span, src)
        }
      }
    })

    observer.observe(results, { childList: true })
  })
}

export function addImages(): void {
  const header = document.querySelector(header_selector)
  if (header) {
    header.classList.add(boris_img_class)
  } else {
    document.querySelector(icon_selector)?.classList.add(boris_img_class)
  }

  const icons = document.getElementsByClassName(camera_class)
  const count = icons.length
  for (let i = 0; i < count; i++) {
    const span = icons[0]
    const src = get_mkm_src(span)
    if (src) {
      replaceCamera(span, src)
      span.parentElement?.classList.remove(...col_camera_icon_classlist)
      span.parentElement?.appendChild(span)
    }
  }
}
