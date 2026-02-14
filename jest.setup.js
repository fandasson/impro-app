import '@testing-library/jest-dom'

// Mock Supabase client
jest.mock('./utils/supabase/client', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(),
    auth: {
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
    },
  })),
}))

// Mock Supabase server client
jest.mock('./utils/supabase/server', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(),
    auth: {
      getUser: jest.fn(),
    },
  })),
}))

// Mock React cache
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  cache: (fn) => fn, // Passthrough for testing
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '',
  useSearchParams: () => new URLSearchParams(),
}))
