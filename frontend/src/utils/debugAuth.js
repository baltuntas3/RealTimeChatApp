// Debug utility for auth issues
export const debugAuth = {
  logLoginSequence: (step, data = {}) => {
    console.log(`🔍 [LOGIN DEBUG] ${step}:`, data);
  },
  
  logLogoutSequence: (step, data = {}) => {
    console.log(`🚪 [LOGOUT DEBUG] ${step}:`, data);
  },
  
  logTokenRefresh: (step, data = {}) => {
    console.log(`🔄 [TOKEN REFRESH DEBUG] ${step}:`, data);
  },
  
  logError: (step, error) => {
    console.error(`❌ [AUTH ERROR DEBUG] ${step}:`, error);
  }
};

export default debugAuth;