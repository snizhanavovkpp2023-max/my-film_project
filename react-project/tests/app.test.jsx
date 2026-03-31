import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App'

const localStorageMock = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString() },
    clear: () => { store = {} },
    removeItem: (key) => { delete store[key] }
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

vi.mock('../src/components/NavBar', () => ({ default: () => <div>NavBar</div> }))
vi.mock('../src/components/Footer', () => ({ default: () => <div>Footer</div> }))
vi.mock('../src/pages/Login', () => ({ default: () => <div>Login Page</div> }))
vi.mock('../src/pages/Home', () => ({ default: () => <div>Home Page</div> }))
vi.mock('../src/pages/Favorites', () => ({ default: () => <div>Favorites Page</div> }))

const renderApp = (route = '/') => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  )
}

describe('App routing', () => {
  test('redirects to /login when user is not logged in', () => {
    localStorageMock.clear()
    renderApp('/')
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  test('hides NavBar when user is not logged in', () => {
    localStorageMock.clear()
    renderApp('/')
    expect(screen.queryByText('NavBar')).not.toBeInTheDocument()
  })

  test('hides Footer when user is not logged in', () => {
    localStorageMock.clear()
    renderApp('/')
    expect(screen.queryByText('Footer')).not.toBeInTheDocument()
  })

  test('redirects to /login when accessing favorites without login', () => {
    localStorageMock.clear()
    renderApp('/favorites')
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  test('shows NavBar when user is logged in', async () => {
    localStorageMock.setItem('currentUser', JSON.stringify({ username: 'Anna', email: 'a@a.com', favorites: [] }))
    renderApp('/')
    await waitFor(() => expect(screen.getByText('NavBar')).toBeInTheDocument())
  })

  test('shows Footer when user is logged in', async () => {
    localStorageMock.setItem('currentUser', JSON.stringify({ username: 'Anna', email: 'a@a.com', favorites: [] }))
    renderApp('/')
    await waitFor(() => expect(screen.getByText('Footer')).toBeInTheDocument())
  })

  test('shows login page by default', () => {
    localStorageMock.clear()
    renderApp('/login')
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })
})
