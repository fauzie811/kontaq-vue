import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import Quizzes from '@/pages/Quizzes.vue';
import * as api from '@/api';

vi.mock('@/api', () => ({
  listMyQuizzes: vi.fn(),
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const NOW = new Date('2026-11-03T09:00:00+07:00');

const quiz = (overrides = {}) => ({
  id: 1,
  title: 'Kuis Pekan 1 Hari 1',
  duration: 60,
  week: 1,
  order: 1,
  material_read: true,
  material_id: null,
  started_at: null,
  finished_at: null,
  opens_at: '2026-11-01T16:00:00+07:00',
  closes_at: '2026-11-02T15:59:59+07:00',
  is_open: false,
  can_request_late_permission: true,
  late_permission_status: null,
  late_permission_expires_at: null,
  late_permission_review_note: null,
  ...overrides,
});

function mountPage(rows) {
  api.listMyQuizzes.mockResolvedValue({
    data: { data: rows, total: rows.length, from: 1, to: rows.length, current_page: 1, last_page: 1 },
  });

  return mount(Quizzes, {
    global: {
      stubs: {
        // Render the slot so button labels are assertable.
        routerLink: { template: '<a><slot /></a>' },
        PageHeader: true,
        Pagination: true,
        WeekPicker: true,
        LatePermissionDialog: true,
      },
    },
  });
}

describe('Quizzes.vue schedule locking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the schedule window on every card', async () => {
    const wrapper = mountPage([quiz()]);
    await flushPromises();

    expect(wrapper.text()).toContain('1 Nov 2026');
    expect(wrapper.text()).toContain('2 Nov 2026');
  });

  it('offers a late request once the window has closed', async () => {
    const wrapper = mountPage([quiz()]);
    await flushPromises();

    expect(wrapper.text()).toContain('Waktu Habis');
    expect(wrapper.text()).toContain('Ajukan Izin Telat');
  });

  it('locks a quiz that has not opened yet without offering a request', async () => {
    const wrapper = mountPage([
      quiz({
        opens_at: '2026-11-08T16:00:00+07:00',
        closes_at: '2026-11-09T15:59:59+07:00',
        can_request_late_permission: false,
      }),
    ]);
    await flushPromises();

    expect(wrapper.text()).toContain('Belum Dibuka');
    expect(wrapper.text()).not.toContain('Ajukan Izin Telat');
  });

  it('reports a request that is still being reviewed', async () => {
    const wrapper = mountPage([
      quiz({ can_request_late_permission: false, late_permission_status: 'pending' }),
    ]);
    await flushPromises();

    expect(wrapper.text()).toContain('Menunggu Persetujuan');
    expect(wrapper.text()).toContain('sedang ditinjau admin');
    expect(wrapper.text()).not.toContain('Ajukan Izin Telat');
  });

  it("shows the admin's note and lets the student try again after a rejection", async () => {
    const wrapper = mountPage([
      quiz({
        late_permission_status: 'rejected',
        late_permission_review_note: 'Alasan kurang jelas.',
      }),
    ]);
    await flushPromises();

    expect(wrapper.text()).toContain('Pengajuan izin telat ditolak: Alasan kurang jelas.');
    expect(wrapper.text()).toContain('Ajukan Izin Telat');
  });

  it('unlocks the quiz and shows the deadline once permission is approved', async () => {
    const wrapper = mountPage([
      quiz({
        is_open: true,
        can_request_late_permission: false,
        late_permission_status: 'approved',
        late_permission_expires_at: '2026-11-10T17:00:00+07:00',
      }),
    ]);
    await flushPromises();

    expect(wrapper.text()).toContain('Izin telat berlaku sampai 10 Nov 2026');
    expect(wrapper.text()).toContain('Mulai Kuis');
    expect(wrapper.text()).not.toContain('Waktu Habis');
  });

  it('leaves an open quiz untouched by the lock states', async () => {
    const wrapper = mountPage([
      quiz({ is_open: true, can_request_late_permission: false }),
    ]);
    await flushPromises();

    expect(wrapper.text()).toContain('Belum dikerjakan');
    expect(wrapper.text()).not.toContain('Waktu Habis');
    expect(wrapper.text()).not.toContain('Belum Dibuka');
    expect(wrapper.text()).not.toContain('Ajukan Izin Telat');
  });

  it('still demands the material be read before an open quiz can start', async () => {
    const wrapper = mountPage([
      quiz({ is_open: true, can_request_late_permission: false, material_read: false }),
    ]);
    await flushPromises();

    expect(wrapper.text()).toContain('Materi Belum Dibaca');
    expect(wrapper.text()).toContain('Baca Materi Terlebih Dahulu');
  });
});
