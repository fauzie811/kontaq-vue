import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import Quizzes from '@/pages/Quizzes.vue';
import * as api from '@/api';

vi.mock('@/api', () => ({
  listAllMyQuizzes: vi.fn(),
}));

const replace = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({ replace }),
}));

const quiz = (id, overrides = {}) => ({ id, is_open: false, finished_at: null, ...overrides });

async function mountWith(rows) {
  api.listAllMyQuizzes.mockResolvedValue(rows);
  const wrapper = mount(Quizzes);
  await flushPromises();
  return wrapper;
}

describe('Quizzes.vue default quiz redirect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens the first open, unfinished quiz', async () => {
    await mountWith([
      quiz(1, { is_open: true, finished_at: '2026-11-01' }),
      quiz(2),
      quiz(3, { is_open: true }),
      quiz(4, { is_open: true }),
    ]);

    expect(replace).toHaveBeenCalledWith({ name: 'quizzes.show', params: { id: 3 } });
  });

  it('falls back to the latest quiz when none is workable', async () => {
    await mountWith([quiz(1), quiz(2, { finished_at: '2026-11-01' })]);

    expect(replace).toHaveBeenCalledWith({ name: 'quizzes.show', params: { id: 2 } });
  });

  it('shows an empty state when there are no quizzes', async () => {
    const wrapper = await mountWith([]);

    expect(replace).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('Belum Ada Kuis');
  });
});
