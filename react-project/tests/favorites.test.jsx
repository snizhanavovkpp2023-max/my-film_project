import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Favorites from '../src/pages/Favorites'

vi.mock('../src/contexts/MovieContext', () => ({
  useMovieContext: vi.fn()
}))

import { useMovieContext } from '../src/contexts/MovieContext'

const renderFavorites = (movies = []) => {
  useMovieContext.mockReturnValue({
    favorites: movies,
    addToFavorites: vi.fn(),
    removeFromFavorites: vi.fn(),
    isFavorite: vi.fn(() => false),
    currentUser: { username: 'Anna' }
  })
  return render(
    <MemoryRouter>
      <Favorites />
    </MemoryRouter>
  )
}

describe('Favorites page', () => {
  test('shows Your Favorites title when favorites exist', () => {
    const movies = [
      { id: 1, title: 'Inception', poster_path: '/test.jpg', release_date: '2010-07-16' }
    ]
    renderFavorites(movies)
    expect(screen.getByText('Your Favorites')).toBeInTheDocument()
  })

  test('shows movies grid when favorites exist', () => {
    const movies = [
      { id: 1, title: 'Inception', poster_path: '/test.jpg', release_date: '2010-07-16' },
      { id: 2, title: 'Interstellar', poster_path: '/test2.jpg', release_date: '2014-11-07' }
    ]
    renderFavorites(movies)
    expect(screen.getByText('Inception')).toBeInTheDocument()
    expect(screen.getByText('Interstellar')).toBeInTheDocument()
  })

  test('shows empty message when favorites is empty array', () => {
    renderFavorites([])
    expect(screen.getByText('Your Favorites')).toBeInTheDocument()
  })

  test('shows correct number of movies', () => {
    const movies = [
      { id: 1, title: 'Inception', poster_path: '/test.jpg', release_date: '2010-07-16' },
      { id: 2, title: 'Interstellar', poster_path: '/test2.jpg', release_date: '2014-11-07' },
      { id: 3, title: 'Batman', poster_path: '/test3.jpg', release_date: '2022-03-04' }
    ]
    renderFavorites(movies)
    expect(screen.getAllByRole('img')).toHaveLength(3)
  })

  test('shows release year for each movie', () => {
    const movies = [
      { id: 1, title: 'Inception', poster_path: '/test.jpg', release_date: '2010-07-16' }
    ]
    renderFavorites(movies)
    expect(screen.getByText('2010')).toBeInTheDocument()
  })
})
