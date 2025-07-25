export interface LoginView {
  showLoading: () => void;
  hideLoading: () => void;
  showError: (message: string) => void;
  clearError: () => void;
  setFormValid: (isValid: boolean) => void;
  navigateToRegister: (email?: string) => void;
  navigateToKanban: () => void;
  updateFormValidity: (isValid: boolean) => void;
}
