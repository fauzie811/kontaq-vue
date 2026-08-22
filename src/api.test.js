import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import authStore from '@/store/auth';
import {
  getOnlineStatus,
  listAnnouncements,
  listMyMaterials,
  listMyQuizzes,
  listMyEvaluations,
  getReports,
  updateReport,
  listMyLatePermissions,
  requestLatePermission,
} from './api';

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

  describe('listMyMaterials', () => {
    it('should fetch materials with week parameter', async () => {
      const mockMaterials = { data: [{ id: 1, title: 'Material 1', week: 2 }] };
      axios.get.mockResolvedValueOnce({ data: mockMaterials });

      const res = await listMyMaterials({ page: 1, week: 2, part_number: 3, chapter_number: 4 });
      expect(axios.get).toHaveBeenCalledWith('me/materials', {
        params: { page: 1, week: 2, part_number: 3, chapter_number: 4 },
      });
      expect(res).toEqual(mockMaterials);
    });
  });

  describe('listMyQuizzes', () => {
    it('should fetch quizzes with week parameter', async () => {
      const mockQuizzes = { data: [{ id: 1, title: 'Quiz 1', week: 2 }] };
      axios.get.mockResolvedValueOnce({ data: mockQuizzes });

      const res = await listMyQuizzes({ page: 1, week: 2 });
      expect(axios.get).toHaveBeenCalledWith('me/quizzes', {
        params: { page: 1, week: 2 },
      });
      expect(res).toEqual(mockQuizzes);
    });
  });

  describe('listMyEvaluations', () => {
    it('should fetch evaluations with week parameter', async () => {
      const mockEvaluations = { data: [{ id: 1, title: 'Eval 1', week: 2 }] };
      axios.get.mockResolvedValueOnce({ data: mockEvaluations });

      const res = await listMyEvaluations({ page: 1, week: 2 });
      expect(axios.get).toHaveBeenCalledWith('me/evaluations', {
        params: { page: 1, week: 2 },
      });
      expect(res).toEqual(mockEvaluations);
    });
  });

  describe('getReports', () => {
    it('should fetch report with week payload', async () => {
      const mockReport = { data: { quizzes: [], items: [] } };
      axios.post.mockResolvedValueOnce({ data: mockReport });

      const res = await getReports(3);
      expect(axios.post).toHaveBeenCalledWith('me/group/report', { week: 3 });
      expect(res).toEqual(mockReport);
    });
  });

  describe('updateReport', () => {
    it('should post update report with week and scores payload', async () => {
      const mockResult = { message: 'Updated' };
      axios.post.mockResolvedValueOnce({ data: mockResult });

      const res = await updateReport({ user_id: 5, week: 3, scores: { quiz_1: 100 } });
      expect(axios.post).toHaveBeenCalledWith('me/group/update-report', {
        user_id: 5,
        week: 3,
        scores: { quiz_1: 100 },
      });
      expect(res).toEqual(mockResult);
    });
  });

  describe('listMyLatePermissions', () => {
    it('should fetch the late permission history with pagination', async () => {
      const mockData = { data: { data: [{ id: 1, status: 'pending' }] } };
      axios.get.mockResolvedValueOnce({ data: mockData });

      const res = await listMyLatePermissions({ page: 3 });
      expect(axios.get).toHaveBeenCalledWith('me/late-permissions', {
        params: { page: 3 },
      });
      expect(res).toEqual(mockData);
    });

    it('should default to the first page', async () => {
      axios.get.mockResolvedValueOnce({ data: {} });

      await listMyLatePermissions();
      expect(axios.get).toHaveBeenCalledWith('me/late-permissions', {
        params: { page: 1 },
      });
    });
  });

  describe('requestLatePermission', () => {
    it('should post the request payload', async () => {
      const mockData = { success: true, data: { id: 7, status: 'pending' } };
      axios.post.mockResolvedValueOnce({ data: mockData });

      const res = await requestLatePermission({
        type: 'quiz',
        id: 12,
        reason: 'Saya sakit selama sepekan.',
      });

      expect(axios.post).toHaveBeenCalledWith('me/late-permissions', {
        type: 'quiz',
        id: 12,
        reason: 'Saya sakit selama sepekan.',
      });
      expect(res).toEqual(mockData);
    });

    it('should propagate the rejection message', async () => {
      axios.post.mockRejectedValueOnce('Waktu pengerjaan belum berakhir.');

      await expect(
        requestLatePermission({ type: 'quiz', id: 1, reason: 'terlambat sekali' })
      ).rejects.toBe('Waktu pengerjaan belum berakhir.');
    });
  });
});
