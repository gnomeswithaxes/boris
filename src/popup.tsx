import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Header } from './components'
import { Options } from './OptionsPanel'
import { getFavorites, removeFavorite } from './common/favorites'
import type { IFavoriteDeck } from './common/interfaces'
import { logError } from './common/utilities'

const Popup = () => {
  const [favorites, setFavorites] = useState<IFavoriteDeck[]>([])

  useEffect(() => {
    getFavorites().then(setFavorites, logError)
  }, [])

  const handleRemove = (url: string) => {
    setFavorites(decks => decks.filter(deck => deck.url !== url))
    removeFavorite(url).catch(error => {
      logError(error)
      getFavorites().then(setFavorites, logError)
    })
  }

  return (
    <div className="popup">
      <Header />
      <section>
        <h2>Favorite Decks</h2>
        {favorites.length ? (
          <ul className="favorites">
            {favorites.map(deck => (
              <li key={deck.url}>
                <span className="favorite-format">{deck.format}</span>
                <a href={deck.url} target="_blank" rel="noreferrer">
                  {deck.title}
                </a>
                <button
                  type="button"
                  aria-label={`Remove ${deck.title} from favorites`}
                  onClick={() => handleRemove(deck.url)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty">Add decks to your favorites on MTGGoldfish and they will appear here.</p>
        )}
      </section>
      <Options />
    </div>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
    <Popup />
  </StrictMode>,
)
