export interface RegisterView {
  showLoading: () => void;
  hideLoading: () => void;
  showError: (message: string) => void;
  clearError: () => void;
  setFormValid: (isValid: boolean) => void;
  navigateToKanban: () => void;
  updateFormValidity: (isValid: boolean) => void;
  prefillEmail: (email: string) => void;
}
