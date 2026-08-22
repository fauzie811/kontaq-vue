import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import Evaluations from '@/pages/Evaluations.vue';
import * as api from '@/api';

vi.mock('@/api', () => ({
  listMyEvaluations: vi.fn(),
}));

const NOW = new Date('2026-11-10T09:00:00+07:00');

const evaluation = (overrides = {}) => ({
  id: 1,
  title: 'Evaluasi Pekan 1',
  duration: 60,
  week: 1,
  started_at: null,
  finished_at: null,
  opens_at: '2026-11-06T16:00:00+07:00',
  closes_at: '2026-11-08T14:00:00+07:00',
  is_open: false,
  can_request_late_permission: true,
  late_permission_status: null,
  late_permission_expires_at: null,
  late_permission_review_note: null,
  ...overrides,
});

function mountPage(rows, availableWeeks = [1, 26, 27, 86]) {
  api.listMyEvaluations.mockResolvedValue({
    data: { data: rows, total: rows.length, from: 1, to: rows.length, current_page: 1, last_page: 1 },
    available_weeks: availableWeeks,
  });

  return mount(Evaluations, {
    global: {
      stubs: {
        routerLink: { template: '<a><slot /></a>' },
        PageHeader: true,
        Pagination: true,
        WeekPicker: {
          props: ['modelValue', 'weeks', 'showAllOption'],
          template: '<div data-test="week-picker" :data-weeks="JSON.stringify(weeks)"></div>',
        },
        LatePermissionDialog: true,
      },
    },
  });
}

describe('Evaluations.vue schedule locking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('offers a late request once the window has closed', async () => {
    const wrapper = mountPage([evaluation()]);
    await flushPromises();

    expect(wrapper.text()).toContain('6 Nov 2026');
    expect(wrapper.text()).toContain('Waktu Habis');
    expect(wrapper.text()).toContain('Ajukan Izin Telat');
  });

  it('locks an evaluation that has not opened yet without offering a request', async () => {
    const wrapper = mountPage([
      evaluation({
        opens_at: '2026-11-13T16:00:00+07:00',
        closes_at: '2026-11-15T14:00:00+07:00',
        can_request_late_permission: false,
      }),
    ]);
    await flushPromises();

    expect(wrapper.text()).toContain('Belum Dibuka');
    expect(wrapper.text()).not.toContain('Ajukan Izin Telat');
  });

  it('reports a request that is still being reviewed', async () => {
    const wrapper = mountPage([
      evaluation({ can_request_late_permission: false, late_permission_status: 'pending' }),
    ]);
    await flushPromises();

    expect(wrapper.text()).toContain('Menunggu Persetujuan');
    expect(wrapper.text()).toContain('sedang ditinjau admin');
  });

  it('unlocks the evaluation once permission is approved', async () => {
    const wrapper = mountPage([
      evaluation({
        is_open: true,
        can_request_late_permission: false,
        late_permission_status: 'approved',
        late_permission_expires_at: '2026-11-17T17:00:00+07:00',
      }),
    ]);
    await flushPromises();

    expect(wrapper.text()).toContain('Izin telat berlaku sampai 17 Nov 2026');
    expect(wrapper.text()).toContain('Mulai Evaluasi');
    expect(wrapper.text()).not.toContain('Waktu Habis');
  });

  it('leaves an open evaluation untouched by the lock states', async () => {
    const wrapper = mountPage([
      evaluation({ is_open: true, can_request_late_permission: false }),
    ]);
    await flushPromises();

    expect(wrapper.text()).toContain('Belum dikerjakan');
    expect(wrapper.text()).toContain('Mulai Evaluasi');
    expect(wrapper.text()).not.toContain('Waktu Habis');
    expect(wrapper.text()).not.toContain('Belum Dibuka');
  });

  it('passes all available weeks from the API to the WeekPicker', async () => {
    const availableWeeks = [1, 26, 27, 86];
    const wrapper = mountPage([evaluation()], availableWeeks);
    await flushPromises();

    const picker = wrapper.find('[data-test="week-picker"]');
    expect(picker.exists()).toBe(true);
    expect(picker.attributes('data-weeks')).toBe(JSON.stringify(availableWeeks));
  });
});
