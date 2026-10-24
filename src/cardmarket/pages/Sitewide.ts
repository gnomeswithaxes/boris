import {
  boris_img_class,
  camera_class,
  col_camera_icon_classlist,
  header_selector,
  icon_selector,
} from '../page_elements'
import { get_mkm_src, replaceCamera } from '../utilities'

export function addImages(): void {
  const header = document.querySelector(header_selector)
  if (header) {
    header.classList.add(boris_img_class)
  } else {
    document.querySelector(icon_selector)?.classList.add(boris_img_class)
  }

  for (const span of [...document.getElementsByClassName(camera_class)]) {
    const src = get_mkm_src(span)
    if (!src) continue
    replaceCamera(span, src)
    span.parentElement?.classList.remove(...col_camera_icon_classlist)
    span.parentElement?.appendChild(span)
  }
}
