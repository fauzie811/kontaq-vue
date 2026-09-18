import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import Evaluations from '@/pages/Evaluations.vue';
import * as api from '@/api';

vi.mock('@/api', () => ({
  listAllMyEvaluations: vi.fn(),
}));

const replace = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({ replace }),
}));

const evaluation = (id, overrides = {}) => ({ id, is_open: false, finished_at: null, ...overrides });

async function mountWith(rows) {
  api.listAllMyEvaluations.mockResolvedValue(rows);
  const wrapper = mount(Evaluations);
  await flushPromises();
  return wrapper;
}

describe('Evaluations.vue default evaluation redirect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens the first open, unfinished evaluation', async () => {
    await mountWith([
      evaluation(1, { is_open: true, finished_at: '2026-11-01' }),
      evaluation(2),
      evaluation(3, { is_open: true }),
      evaluation(4, { is_open: true }),
    ]);

    expect(replace).toHaveBeenCalledWith({ name: 'evaluations.show', params: { id: 3 } });
  });

  it('falls back to the latest quiz when none is workable', async () => {
    await mountWith([evaluation(1), evaluation(2, { finished_at: '2026-11-01' })]);

    expect(replace).toHaveBeenCalledWith({ name: 'evaluations.show', params: { id: 2 } });
  });

  it('shows an empty state when there are no evaluations', async () => {
    const wrapper = await mountWith([]);

    expect(replace).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('Belum Ada Evaluasi');
  });
});
