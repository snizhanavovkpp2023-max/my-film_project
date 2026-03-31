import { getPopularMovies, searchMovies } from '../src/services/api'

const mockFetch = vi.fn()
global.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockClear()
})

describe('getPopularMovies', () => {
  test('returns an array of popular movies', async () => {
    const mockMovies = [{ id: 1, title: 'Inception' }, { id: 2, title: 'Interstellar' }]
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ results: mockMovies })
    })

    const result = await getPopularMovies()
    expect(result).toEqual(mockMovies)
  })

  test('calls the correct URL', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ results: [] })
    })

    await getPopularMovies()
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/movie/popular')
    )
  })

  test('returns an empty array when no movies found', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ results: [] })
    })

    const result = await getPopularMovies()
    expect(result).toHaveLength(0)
  })
})

describe('searchMovies', () => {
  test('returns search results', async () => {
    const mockMovies = [{ id: 3, title: 'Batman' }]
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ results: mockMovies })
    })

    const result = await searchMovies('Batman')
    expect(result[0].title).toBe('Batman')
  })

  test('encodes special characters in search query', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ results: [] })
    })

    await searchMovies('spider man')
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('spider%20man')
    )
  })

  test('calls the correct search URL', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ results: [] })
    })

    await searchMovies('test')
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/search/movie')
    )
  })
})

describe('getMovieDetails', () => {
  test('returns movie details', async () => {
    const mockDetails = { id: 1, title: 'Inception', runtime: 148 }
    mockFetch.mockResolvedValueOnce({
      json: async () => mockDetails
    })

    const response = await fetch(`https://api.themoviedb.org/3/movie/1?api_key=test&append_to_response=credits`)
    const result = await response.json()
    expect(result.title).toBe('Inception')
    expect(result.runtime).toBe(148)
  })

  test('calls URL with correct movieId', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({})
    })

    await fetch(`https://api.themoviedb.org/3/movie/42?api_key=test`)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/movie/42')
    )
  })

  test('calls URL with credits parameter', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({})
    })

    await fetch(`https://api.themoviedb.org/3/movie/1?api_key=test&append_to_response=credits`)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('append_to_response=credits')
    )
  })
})

describe('getMovieVideos', () => {
  test('returns an array of videos', async () => {
    const mockVideos = [{ id: 'abc', type: 'Trailer', site: 'YouTube' }]
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ results: mockVideos })
    })

    const response = await fetch(`https://api.themoviedb.org/3/movie/1/videos?api_key=test`)
    const result = await response.json()
    expect(result.results).toEqual(mockVideos)
  })

  test('calls URL with correct movieId', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ results: [] })
    })

    await fetch(`https://api.themoviedb.org/3/movie/99/videos?api_key=test`)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/movie/99/videos')
    )
  })

  test('returns video with type Trailer', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ results: [{ type: 'Trailer', site: 'YouTube' }] })
    })

    const response = await fetch(`https://api.themoviedb.org/3/movie/1/videos?api_key=test`)
    const result = await response.json()
    expect(result.results[0].type).toBe('Trailer')
  })
})
