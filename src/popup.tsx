import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Options } from './OptionsPanel'
import { getPinnedLists, removePinnedList } from './common/pinned'
import type { IPinnedList } from './common/interfaces'

const Popup = () => {
  const [pinnedLists, setPinnedLists] = useState<IPinnedList[]>([])

  useEffect(() => {
    getPinnedLists().then(setPinnedLists)
  }, [])

  const handleRemove = (url: string) => {
    setPinnedLists(lists => lists.filter(list => list.url !== url))
    removePinnedList(url)
  }

  return (
    <div style={{ minWidth: '500px' }}>
      <h1 style={{ color: 'rgb(240, 173, 78)' }}>Boris — <i>the Italian Goldfish</i></h1>
      <Options />
      <hr />
      <h2>Saved Deck Lists:</h2>
      <h3>
        {pinnedLists.length ? (
          <ul>
            <base target="_blank" />
            {pinnedLists.map(list => (
              <li key={list.url}>
                <a style={{ color: 'black', textDecoration: 'none' }} href={list.url}>
                  {list.format && <><strong>{list.format}</strong> | </>}
                  {list.title}
                </a>
                <button type="button" style={{ color: 'red' }} onClick={() => handleRemove(list.url)}>
                  X
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <i>Pin lists on</i> MTGGoldfish.com <i>and they will appear here</i>
          </div>
        )}
      </h3>
    </div>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
    <Popup />
  </StrictMode>
)
