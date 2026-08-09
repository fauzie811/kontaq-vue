import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import authStore from '@/store/auth';
import { getOnlineStatus, listAnnouncements } from './api';

vi.mock('axios');

describe('API Helper Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getOnlineStatus', () => {
    it('should fetch online status successfully', async () => {
      const mockData = { online: 42 };
      axios.get.mockResolvedValueOnce({ data: mockData });

      const res = await getOnlineStatus();
      expect(axios.get).toHaveBeenCalledWith('online-status');
      expect(res).toEqual(mockData);
    });

    it('should throw error when request fails', async () => {
      axios.get.mockRejectedValueOnce(new Error('Network error'));
      await expect(getOnlineStatus()).rejects.toThrow('Network error');
    });
  });

  describe('listAnnouncements', () => {
    it('should fetch announcements with pagination parameter', async () => {
      const mockAnnouncements = { data: [{ id: 1, title: 'Notice' }] };
      axios.get.mockResolvedValueOnce({ data: mockAnnouncements });

      const res = await listAnnouncements(2);
      expect(axios.get).toHaveBeenCalledWith('announcements', {
        params: { page: 2 },
      });
      expect(res).toEqual(mockAnnouncements);
    });
  });
});
