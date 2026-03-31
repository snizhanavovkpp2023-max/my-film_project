import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from '../src/pages/Login'

const mockLogin = vi.fn()
const mockNavigate = vi.fn()

vi.mock('../src/contexts/MovieContext', () => ({
  useMovieContext: () => ({ login: mockLogin })
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const renderLogin = () => render(
  <MemoryRouter>
    <Login />
  </MemoryRouter>
)

beforeEach(() => {
  mockLogin.mockClear()
  mockNavigate.mockClear()
})

describe('Login form', () => {
  test('renders login form correctly', () => {
    renderLogin()
    expect(screen.getByText('Login Form')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })

  test('shows error when username is empty', async () => {
    renderLogin()
    fireEvent.click(screen.getByText('Submit'))
    await waitFor(() => {
      expect(screen.getByText('Username is required!')).toBeInTheDocument()
    })
  })

  test('shows error when email is empty', async () => {
    renderLogin()
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'Anna' } })
    fireEvent.click(screen.getByText('Submit'))
    await waitFor(() => {
      expect(screen.getByText('Email is required!')).toBeInTheDocument()
    })
  })

  test('shows error when password is too short', async () => {
    renderLogin()
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'Anna' } })
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'anna@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '12' } })
    fireEvent.click(screen.getByText('Submit'))
    await waitFor(() => {
      expect(screen.getByText('Min 4 characters!')).toBeInTheDocument()
    })
  })

  test('calls login and navigates to / on success', async () => {
    mockLogin.mockResolvedValueOnce({ success: true })
    renderLogin()
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'Anna' } })
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'anna@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '1234' } })
    fireEvent.click(screen.getByText('Submit'))
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  test('shows error message when login fails', async () => {
    mockLogin.mockResolvedValueOnce({ success: false, message: 'Невірний пароль' })
    renderLogin()
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'Anna' } })
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'anna@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '1234' } })
    fireEvent.click(screen.getByText('Submit'))
    await waitFor(() => {
      expect(screen.getByText('Невірний пароль')).toBeInTheDocument()
    })
  })
})
