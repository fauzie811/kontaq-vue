import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import Show from '@/pages/Evaluations/Show.vue';
import * as api from '@/api';

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '1' },
  }),
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

vi.mock('@/api', () => ({
  getMyEvaluation: vi.fn(),
  updateMyEvaluation: vi.fn(),
  listAllMyEvaluations: vi.fn(),
}));

vi.mock('@/utils', async (importOriginal) => ({
  ...(await importOriginal()),
  swAlert: vi.fn(),
}));

describe('Evaluations/Show.vue Review Mode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.listAllMyEvaluations.mockResolvedValue([]);
  });

  it('renders 4 options (a-d) when option_e is not present in completed evaluation review', async () => {
    api.getMyEvaluation.mockResolvedValue({
      success: true,
      data: {
        evaluation: {
          id: 1,
          title: 'Evaluation 1',
          questions: [
            {
              id: 201,
              type: 'multiple',
              content: '<p>Evaluation question 1?</p>',
              answer: 'b',
              details: {
                option_a: 'First Option',
                option_b: 'Second Option',
                option_c: 'Third Option',
                option_d: 'Fourth Option',
              },
            },
          ],
        },
        user_evaluation: {
          id: 1,
          finished_at: '2026-08-17T10:00:00Z',
          score: 100,
          answers: {
            201: 'b',
          },
        },
      },
    });

    const wrapper = mount(Show, {
      global: {
        stubs: {
          routerLink: true,
          LatePermissionDialog: true,
          Countdown: true,
          QuestionCard: true,
        },
      },
    });

    await flushPromises();

    expect(wrapper.text()).toContain('First Option');
    expect(wrapper.text()).toContain('Fourth Option');
    expect(wrapper.text()).toContain('a.');
    expect(wrapper.text()).toContain('d.');
    expect(wrapper.text()).not.toContain('e.');
  });

  it('renders 5 options (a-e) when option_e is present in completed evaluation review', async () => {
    api.getMyEvaluation.mockResolvedValue({
      success: true,
      data: {
        evaluation: {
          id: 1,
          title: 'Evaluation 1',
          questions: [
            {
              id: 202,
              type: 'multiple',
              content: '<p>Evaluation question with 5 options?</p>',
              answer: 'e',
              details: {
                option_a: 'First Option',
                option_b: 'Second Option',
                option_c: 'Third Option',
                option_d: 'Fourth Option',
                option_e: 'Fifth Option E',
              },
            },
          ],
        },
        user_evaluation: {
          id: 1,
          finished_at: '2026-08-17T10:00:00Z',
          score: 100,
          answers: {
            202: 'e',
          },
        },
      },
    });

    const wrapper = mount(Show, {
      global: {
        stubs: {
          routerLink: true,
          LatePermissionDialog: true,
          Countdown: true,
          QuestionCard: true,
        },
      },
    });

    await flushPromises();

    expect(wrapper.text()).toContain('Fifth Option E');
    expect(wrapper.text()).toContain('e.');
  });
});

describe('Evaluations/Show.vue Active Mode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.listAllMyEvaluations.mockResolvedValue([]);
  });

  it('renders active evaluation mode with timer, stepper and submit button', async () => {
    api.listAllMyEvaluations.mockResolvedValue([
      { id: 1, title: 'Evaluation Active', is_open: true },
      { id: 2, title: 'Evaluation Next', is_open: true },
    ]);
    api.getMyEvaluation.mockResolvedValue({
      success: true,
      data: {
        evaluation: {
          id: 1,
          title: 'Evaluation Active',
          duration: 30,
          questions: [
            { id: 201, type: 'multiple', content: 'Soal 1', details: {} },
            { id: 202, type: 'multiple', content: 'Soal 2', details: {} },
          ],
        },
        user_evaluation: {
          id: 1,
          created_at: '2026-08-22T10:00:00Z',
          finished_at: null,
          answers: {},
        },
      },
    });

    const wrapper = mount(Show, {
      global: {
        stubs: {
          routerLink: true,
          LatePermissionDialog: true,
          Countdown: true,
          QuestionCard: true,
        },
      },
    });

    await flushPromises();

    expect(wrapper.text()).toContain('Evaluation Active');
    expect(wrapper.text()).toContain('Sisa Waktu');
    expect(wrapper.text()).toContain('Selesai');
    expect(wrapper.findAll('option').map((o) => o.text())).toEqual(['1', '2']);
  });
});

describe('Evaluations/Show.vue Locked Evaluation', () => {
  const NOW = new Date('2026-11-10T09:00:00+07:00');

  const item = (overrides = {}) => ({
    id: 1,
    title: 'Evaluasi Pekan 1',
    finished_at: null,
    opens_at: '2026-11-06T16:00:00+07:00',
    closes_at: '2026-11-08T14:00:00+07:00',
    is_open: false,
    can_request_late_permission: true,
    late_permission_status: null,
    late_permission_review_note: null,
    ...overrides,
  });

  async function mountLocked(row) {
    api.listAllMyEvaluations.mockResolvedValue([row]);
    const wrapper = mount(Show, {
      global: {
        stubs: {
          routerLink: { template: '<a><slot /></a>' },
          Countdown: true,
          QuestionCard: true,
          LatePermissionDialog: true,
        },
      },
    });
    await flushPromises();
    return wrapper;
  }

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('offers a late request once the window has closed, without starting the evaluation', async () => {
    const wrapper = await mountLocked(item());

    expect(api.getMyEvaluation).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('Waktu Habis');
    expect(wrapper.text()).toContain('6 Nov 2026');
    expect(wrapper.text()).toContain('Ajukan Izin Telat');
  });

  it('locks an evaluation that has not opened yet without offering a request', async () => {
    const wrapper = await mountLocked(
      item({
        opens_at: '2026-11-13T16:00:00+07:00',
        closes_at: '2026-11-15T14:00:00+07:00',
        can_request_late_permission: false,
      }),
    );

    expect(wrapper.text()).toContain('Belum Dibuka');
    expect(wrapper.text()).not.toContain('Ajukan Izin Telat');
  });

  it('reports a request that is still being reviewed', async () => {
    const wrapper = await mountLocked(
      item({ can_request_late_permission: false, late_permission_status: 'pending' }),
    );

    expect(wrapper.text()).toContain('Menunggu Persetujuan');
    expect(wrapper.text()).not.toContain('Ajukan Izin Telat');
  });

  it('shows the backend refusal message instead of redirecting', async () => {
    api.getMyEvaluation.mockResolvedValue({ success: false, message: 'Selesaikan semua kuis dulu.' });
    const wrapper = await mountLocked(item({ is_open: true, can_request_late_permission: false }));

    expect(wrapper.text()).toContain('Selesaikan semua kuis dulu.');
  });
});
