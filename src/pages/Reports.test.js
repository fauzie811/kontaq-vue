import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import Reports from '@/pages/Reports.vue';
import * as api from '@/api';

vi.mock('@/api', () => ({
  getReports: vi.fn(),
}));

vi.mock('vue-sonner', () => ({ toast: { error: vi.fn() } }));

vi.mock('@/store/auth', () => ({
  default: { user: { group: { current_week: 2 } } },
}));

const report = {
  mode: 'weekly',
  number: 2,
  max: 4,
  juz: [1, 2],
  quizzes: [{ id: 7, title: 'Q1' }, { id: 8, title: 'Q2' }],
  evaluations: [{ id: 3, title: 'E' }],
  items: [
    { id: 1, name: 'Aisyah', username: '201-101-00605', scores: { quiz_7: 100, quiz_8: 'i', evaluation_3: 80 }, total: 180, rank: 1 },
    { id: 2, name: 'Budi', username: '201-602-00405', scores: null, total: null, rank: null },
  ],
};

async function mountPage() {
  api.getReports.mockResolvedValue({ success: true, data: report });
  const wrapper = mount(Reports, { global: { stubs: { routerLink: { template: '<a><slot /></a>' } } } });
  await flushPromises();
  return wrapper;
}

describe('Reports.vue', () => {
  beforeEach(() => vi.clearAllMocks());

  it("opens the weekly report on the group's current week", async () => {
    const wrapper = await mountPage();

    expect(api.getReports).toHaveBeenCalledWith({ mode: 'weekly', number: 2 });
    expect(wrapper.findAll('select')[1].findAll('option').map((o) => o.text())).toEqual(['1', '2', '3', '4']);
    expect(wrapper.text()).toContain('Sertifikat');
  });

  it('renders the columns, scores, total, rank and juz range', async () => {
    const wrapper = await mountPage();
    const headers = wrapper.findAll('th').map((th) => th.text());
    expect(headers).toEqual(['No.', 'Nama Peserta', 'Kuis 1', 'Kuis 2', 'Evaluasi', 'Total Nilai', 'Peringkat', 'Juz']);

    const first = wrapper.findAll('tbody tr')[0].findAll('td').map((td) => td.text());
    expect(first).toEqual(['1', 'Aisyah201-101-00605', '100', 'Izin', '80', '180', '1', '1–2']);

    const second = wrapper.findAll('tbody tr')[1].findAll('td').map((td) => td.text());
    expect(second.slice(2)).toEqual(['–', '–', '–', '–', '–', '1–2']);
  });

  it('switching mode reloads from number 1', async () => {
    const wrapper = await mountPage();
    await wrapper.findAll('select')[0].setValue('juz');
    await flushPromises();

    expect(api.getReports).toHaveBeenLastCalledWith({ mode: 'juz', number: 1 });
  });
});
