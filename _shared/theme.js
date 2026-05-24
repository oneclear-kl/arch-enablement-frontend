/**
 * 业务中台装配环境 - 统一 Tailwind 配置
 * 
 * 品牌色：#005AF0 / #004FD3 hover / #F5F8FE 按钮悬停
 */
window.tailwind_config = {
  theme: {
    extend: {
      colors: {
        brand:    { DEFAULT: '#005AF0', light: '#4D8BF5', dark: '#0043B3', '50': '#E6EEFF', '100': '#C2D6FF', '200': '#9DBEFF' },
        nav:      { DEFAULT: '#005AF0', dark: '#0043B3', light: '#4D8BF5', '50': '#E6EEFF' },
        blue:     { DEFAULT: '#005AF0', light: '#4D8BF5', dark: '#0043B3', '50': '#E6EEFF', '100': '#C2D6FF', '200': '#9DBEFF', '500': '#005AF0', '600': '#0043B3' },
        page:     { bg: '#F5F6F8', card: '#FFFFFF', border: '#E0E4E8' },
        gray:     { '1': '#181818', '2': '#666666', '3': 'rgba(0,0,0,0.4)', '4': 'rgba(0,0,0,0.2)' },
        success:  '#52C41A',
        warning:  '#FAAD14',
        danger:   '#FF4D4F',
        info:     '#1890FF',
        sidebar:  { bg: '#F4F6F8', hover: '#E8EDF2', active: '#E6EEFF', text: '#333', activeText: '#0043B3', section: '#555', border: '#D8E0E8' }
      }
    }
  }
};

if (typeof tailwind !== 'undefined' && tailwind.config) {
  tailwind.config = window.tailwind_config;
}
