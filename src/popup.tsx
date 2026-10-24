import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Options } from './OptionsPanel'
import { getFavorites, removeFavorite } from './common/favorites'
import type { IFavoriteDeck } from './common/interfaces'

const Popup = () => {
  const [favorites, setFavorites] = useState<IFavoriteDeck[]>([])

  useEffect(() => {
    getFavorites().then(setFavorites)
  }, [])

  const handleRemove = (url: string) => {
    setFavorites(decks => decks.filter(deck => deck.url !== url))
    removeFavorite(url)
  }

  return (
    <div style={{ minWidth: '500px' }}>
      <h1 style={{ color: 'rgb(240, 173, 78)' }}>Boris — <i>the Italian Goldfish</i></h1>
      <Options />
      <hr />
      <h2>Favorite Decks:</h2>
      <h3>
        {favorites.length ? (
          <ul>
            <base target="_blank" />
            {favorites.map(deck => (
              <li key={deck.url}>
                <a style={{ color: 'black', textDecoration: 'none' }} href={deck.url}>
                  {deck.format && <><strong>{deck.format}</strong> | </>}
                  {deck.title}
                </a>
                <button type="button" style={{ color: 'red' }} onClick={() => handleRemove(deck.url)}>
                  X
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <i>Add decks to your favorites on</i> MTGGoldfish.com <i>and they will appear here</i>
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
