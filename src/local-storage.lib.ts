const key = "last-input-code";

export const localStorageProvider = {
  saveCode: (code: string) => localStorage.setItem(key, code),
  getCode: () => localStorage.getItem(key) ?? "",
};
