import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../src/pages/Home'
import { getPopularMovies, searchMovies } from '../src/services/api'

vi.mock('../src/services/api', () => ({
  getPopularMovies: vi.fn(),
  searchMovies: vi.fn()
}))

vi.mock('../src/contexts/MovieContext', () => ({
  useMovieContext: () => ({
    favorites: [],
    addToFavorites: vi.fn(),
    removeFromFavorites: vi.fn(),
    isFavorite: vi.fn(() => false),
    currentUser: { username: 'Anna' }
  })
}))

const mockMovies = [
  { id: 1, title: 'Inception', poster_path: '/inc.jpg', release_date: '2010-07-16' },
  { id: 2, title: 'Interstellar', poster_path: '/int.jpg', release_date: '2014-11-07' }
]

const renderHome = () => render(
  <MemoryRouter>
    <Home />
  </MemoryRouter>
)

beforeEach(() => {
  getPopularMovies.mockClear()
  searchMovies.mockClear()
})

describe('Home page', () => {
  test('shows loading indicator initially', () => {
    getPopularMovies.mockResolvedValueOnce(mockMovies)
    renderHome()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('shows popular movies after loading', async () => {
    getPopularMovies.mockResolvedValueOnce(mockMovies)
    renderHome()
    await waitFor(() => {
      expect(screen.getByText('Inception')).toBeInTheDocument()
      expect(screen.getByText('Interstellar')).toBeInTheDocument()
    })
  })

  test('shows error when movies fail to load', async () => {
    getPopularMovies.mockRejectedValueOnce(new Error('API error'))
    renderHome()
    await waitFor(() => {
      expect(screen.getByText('Failed to load movies...')).toBeInTheDocument()
    })
  })

  test('shows search input and button', async () => {
    getPopularMovies.mockResolvedValueOnce(mockMovies)
    renderHome()
    expect(screen.getByPlaceholderText('Search for movies...')).toBeInTheDocument()
    expect(screen.getByText('Search')).toBeInTheDocument()
  })

  test('searches movies when query is entered', async () => {
    getPopularMovies.mockResolvedValueOnce(mockMovies)
    searchMovies.mockResolvedValueOnce([{ id: 3, title: 'Batman', poster_path: '/bat.jpg', release_date: '2022-03-04' }])

    renderHome()
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument())

    fireEvent.change(screen.getByPlaceholderText('Search for movies...'), {
      target: { value: 'Batman' }
    })
    fireEvent.click(screen.getByText('Search'))

    await waitFor(() => {
      expect(screen.getByText('Batman')).toBeInTheDocument()
    })
  })

  test('does not search when query is empty', async () => {
    getPopularMovies.mockResolvedValueOnce(mockMovies)
    renderHome()
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument())

    fireEvent.click(screen.getByText('Search'))
    expect(searchMovies).not.toHaveBeenCalled()
  })

  test('shows error when search fails', async () => {
    getPopularMovies.mockResolvedValueOnce(mockMovies)
    searchMovies.mockRejectedValueOnce(new Error('Search error'))

    renderHome()
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument())

    fireEvent.change(screen.getByPlaceholderText('Search for movies...'), {
      target: { value: 'Batman' }
    })
    fireEvent.click(screen.getByText('Search'))

    await waitFor(() => {
      expect(screen.getByText('Failed to search movies...')).toBeInTheDocument()
    })
  })
})
