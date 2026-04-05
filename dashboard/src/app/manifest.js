export default function manifest() {
  return {
    name: 'Vietlott Dashboard',
    short_name: 'Vietlott',
    description: 'Thống kê & Dự đoán xổ số Vietlott chuyên nghiệp',
    start_url: '/',
    display: 'standalone',
    background_color: '#0E1217',
    theme_color: '#0E1217',
    icons: [
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
