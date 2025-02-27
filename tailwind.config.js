/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        zentry: ['zentry', 'sans-serif'],
        general: ['general', 'sans-serif'],
        'circular-web': ['circular-web', 'sans-serif'],
        'robert-medium': ['robert-medium', 'sans-serif'],
        'robert-regular': ['robert-regular', 'sans-serif'],

        
      },
      
      colors: {
        blue: {
          50: '#DFDFF0',   // درجة فاتحة جدًا من اللون الأزرق
          75: '#DFDFF2',   // درجة قريبة من السابقة
          100: '#F0F2FA',  // درجة أكثر وضوحًا
          200: '#010101',  // تقريبًا أسود
          300: '#4FB7DD',  // درجة زرقاء أكثر تشبعًا
        },
        violet: {
          300: '#5724FF',  // درجة بنفسجية قوية
        },
        yellow: {
          100: '#8E983F',  // درجة صفراء زيتونية
          300: '#EDFF66',  // درجة صفراء فاتحة جدًا
        }
      }


    },
  },
  plugins: [],
}
