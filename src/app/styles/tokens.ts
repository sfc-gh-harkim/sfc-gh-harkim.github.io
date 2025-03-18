export const tokens = {
  colors: {
    // Background colors
    background: {
      primary: '#111827',    // bg-gray-900
      secondary: '#1f2937',  // bg-gray-800
      tertiary: '#1E252F',   // modal background
      input: '#1D252F',      // input background in done state
    },
    // Text colors
    text: {
      primary: '#FFFFFF',    // text-white
      secondary: '#F3F4F6',  // text-gray-100
      tertiary: '#D1D5DB',   // text-gray-300
      muted: '#9CA3AF',      // text-gray-400
      status: '#BDC4D5',     // status text color
    },
    // Border colors
    border: {
      primary: '#293246',    // input border
      secondary: '#374151',  // border-gray-700
    },
    // Brand colors
    brand: {
      primary: '#2986E8',    // primary blue
      hover: '#2476D1',      // hover state
    },
    // Overlay colors
    overlay: {
      hover: 'rgba(255, 255, 255, 0.1)',  // white hover overlay
    },
  },
  spacing: {
    sidebar: {
      width: '18rem',        // w-72
      padding: '2rem',       // p-8
    },
    container: {
      padding: {
        x: '2rem',          // px-8
        y: '3rem',          // py-12
      },
    },
  },
  typography: {
    fontSize: {
      xs: '0.75rem',        // 12px
      sm: '0.875rem',       // 14px
      base: '1rem',         // 16px
      lg: '1.125rem',       // 18px
      xl: '1.25rem',        // 20px
      '2xl': '2rem',        // 32px
      '4xl': '4.5rem',      // 72px
    },
    lineHeight: {
      tight: '1.25',        // leading-tight
      normal: '1.5',        // leading-normal
      relaxed: '1.625',     // leading-relaxed
      loose: '2',           // leading-loose
    },
  },
  animation: {
    transition: {
      fast: '0.2s ease',
      base: '0.3s ease',
      slow: '0.5s ease',
    },
  },
  shadows: {
    modal: '0px 4px 16px 0px rgba(0, 0, 0, 0.30)',
    input: '-32px -32px 60px 0px rgba(16, 159, 212, 0.12) inset, 32px 32px 80px 0px rgba(13, 141, 150, 0.12) inset',
  },
  radius: {
    sm: '4px',
    base: '6px',
    lg: '8px',
  },
} as const; 