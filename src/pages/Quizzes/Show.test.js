import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import Show from '@/pages/Quizzes/Show.vue';
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
  getMyQuiz: vi.fn(),
  updateMyQuiz: vi.fn(),
  listAllMyQuizzes: vi.fn(),
}));

describe('Quizzes/Show.vue Review Mode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.listAllMyQuizzes.mockResolvedValue([]);
  });

  it('renders 4 options (a-d) when option_e is not present in completed quiz review', async () => {
    api.getMyQuiz.mockResolvedValue({
      success: true,
      data: {
        quiz: {
          id: 1,
          title: 'Quiz 1',
          questions: [
            {
              id: 101,
              type: 'multiple',
              content: '<p>Question 1?</p>',
              answer: 'a',
              details: {
                option_a: 'First Option',
                option_b: 'Second Option',
                option_c: 'Third Option',
                option_d: 'Fourth Option',
              },
            },
          ],
        },
        user_quiz: {
          id: 1,
          finished_at: '2026-08-17T10:00:00Z',
          score: 100,
          answers: {
            101: 'a',
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

  it('renders 5 options (a-e) when option_e is present in completed quiz review', async () => {
    api.getMyQuiz.mockResolvedValue({
      success: true,
      data: {
        quiz: {
          id: 1,
          title: 'Quiz 1',
          questions: [
            {
              id: 102,
              type: 'multiple',
              content: '<p>Question with 5 options?</p>',
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
        user_quiz: {
          id: 1,
          finished_at: '2026-08-17T10:00:00Z',
          score: 100,
          answers: {
            102: 'e',
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

describe('Quizzes/Show.vue Active Mode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.listAllMyQuizzes.mockResolvedValue([]);
  });

  it('renders active quiz mode with timer, stepper and submit button', async () => {
    api.listAllMyQuizzes.mockResolvedValue([
      { id: 1, title: 'Quiz Active', is_open: true },
      { id: 2, title: 'Quiz Next', is_open: true },
    ]);
    api.getMyQuiz.mockResolvedValue({
      success: true,
      data: {
        quiz: {
          id: 1,
          title: 'Quiz Active',
          duration: 15,
          questions: [
            { id: 101, type: 'multiple', content: 'Soal 1', details: {} },
            { id: 102, type: 'multiple', content: 'Soal 2', details: {} },
          ],
        },
        user_quiz: {
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

    expect(wrapper.text()).toContain('Quiz Active');
    expect(wrapper.text()).toContain('Sisa Waktu');
    expect(wrapper.text()).toContain('Selesai');
    expect(wrapper.findAll('option').map((o) => o.text())).toEqual(['1', '2']);
    expect(wrapper.find('select').element.value).toBe('1');
  });
});

describe('Quizzes/Show.vue Locked Quiz', () => {
  const NOW = new Date('2026-11-03T09:00:00+07:00');

  const item = (overrides = {}) => ({
    id: 1,
    title: 'Kuis Pekan 1 Hari 1',
    material_id: null,
    material_read: true,
    finished_at: null,
    opens_at: '2026-11-01T16:00:00+07:00',
    closes_at: '2026-11-02T15:59:59+07:00',
    is_open: false,
    can_request_late_permission: true,
    late_permission_status: null,
    late_permission_review_note: null,
    ...overrides,
  });

  async function mountLocked(row) {
    api.listAllMyQuizzes.mockResolvedValue([row]);
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

  it('offers a late request once the window has closed, without starting the quiz', async () => {
    const wrapper = await mountLocked(item());

    expect(api.getMyQuiz).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('Waktu Habis');
    expect(wrapper.text()).toContain('1 Nov 2026');
    expect(wrapper.text()).toContain('Ajukan Izin Telat');
  });

  it('locks a quiz that has not opened yet without offering a request', async () => {
    const wrapper = await mountLocked(
      item({
        opens_at: '2026-11-08T16:00:00+07:00',
        closes_at: '2026-11-09T15:59:59+07:00',
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
    expect(wrapper.text()).toContain('sedang ditinjau admin');
    expect(wrapper.text()).not.toContain('Ajukan Izin Telat');
  });

  it("shows the admin's note and lets the student try again after a rejection", async () => {
    const wrapper = await mountLocked(
      item({ late_permission_status: 'rejected', late_permission_review_note: 'Alasan kurang jelas.' }),
    );

    expect(wrapper.text()).toContain('Pengajuan izin telat ditolak: Alasan kurang jelas.');
    expect(wrapper.text()).toContain('Ajukan Izin Telat');
  });

  it('demands the material be read before an open quiz can start', async () => {
    const wrapper = await mountLocked(
      item({ is_open: true, can_request_late_permission: false, material_id: 10, material_read: false }),
    );

    expect(api.getMyQuiz).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('Materi Belum Dibaca');
    expect(wrapper.text()).toContain('Baca Materi Terlebih Dahulu');
  });

  it('shows the backend refusal message instead of redirecting', async () => {
    api.getMyQuiz.mockResolvedValue({ success: false, message: 'Kuis ditutup.' });
    const wrapper = await mountLocked(item({ is_open: true, can_request_late_permission: false }));

    expect(wrapper.text()).toContain('Kuis ditutup.');
  });
});
