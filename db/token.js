const TOKEN = 'token';
const THEME = 'theme';

export default class TokenStorage {
  saveToken(token) {
    sessionStorage.setItem(TOKEN, token);
  }

  getToken() {
    return sessionStorage.getItem(TOKEN);
  }

  clearToken() {
    sessionStorage.clear(TOKEN);
  }
}

export default class ThemeStorage {
    saveTheme(theme) {
      localStorage.setItem(THEME, theme);
    }
  
    getTheme() {
      return localStorage.getItem(THEME);
    }
  
    clearTheme() {
        localStorage.clear(THEME);
    }
  }
  