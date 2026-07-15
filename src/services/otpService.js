import api from './api';

export const otpService = {
  generateOTP: async (data) => {
    try {
      const response = await api.post('/otp/generate', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to generate OTP' };
    }
  },

  verifyOTP: async (data) => {
    try {
      const response = await api.post('/otp/verify', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Invalid OTP' };
    }
  },

  resendOTP: async (data) => {
    try {
      const response = await api.post('/otp/resend', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to resend OTP' };
    }
  },
};