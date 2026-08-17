import { describe, it, expect, vi, beforeEach } from 'vitest';
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
}));

vi.mock('@/utils', () => ({
  swAlert: vi.fn(),
}));

describe('Evaluations/Show.vue Review Mode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
          PageHeader: true,
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
          PageHeader: true,
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
