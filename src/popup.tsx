import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Options } from './OptionsPanel'
import { getSyncSetting, setSyncSetting } from './common/storage'
import type { IPinnedList } from './common/interfaces'

const Popup = () => {
  const [pinnedLists, setPinnedLists] = useState<IPinnedList[]>([])

  useEffect(() => {
    getSyncSetting('pinned_lists').then(setPinnedLists)
  }, [])

  const handleRemove = (index: number) => {
    const newList = pinnedLists.filter((_, i) => i !== index)
    setPinnedLists(newList)
    setSyncSetting('pinned_lists', newList)
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
            {pinnedLists.map((list, i) => (
              <li key={i}>
                <a
                  style={{ color: 'black', textDecoration: 'none' }}
                  href={list.url}
                  dangerouslySetInnerHTML={{ __html: list.title }}
                />
                <button type="button" style={{ color: 'red' }} onClick={() => handleRemove(i)}>
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
