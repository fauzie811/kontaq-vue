import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import LatePermissions from '@/pages/LatePermissions.vue';
import * as api from '@/api';

vi.mock('@/api', () => ({
  listMyLatePermissions: vi.fn(),
}));

const permission = (overrides = {}) => ({
  id: 1,
  type: 'quiz',
  permissible_id: 9,
  title: 'Kuis Tadabbur Pekan 1',
  week: 1,
  order: 2,
  reason: 'Saya sakit selama sepekan penuh.',
  status: 'pending',
  status_label: 'Menunggu Persetujuan',
  is_active: false,
  expires_at: null,
  review_note: null,
  reviewed_at: null,
  created_at: '2026-11-03T09:00:00+07:00',
  ...overrides,
});

function mountPage(rows) {
  api.listMyLatePermissions.mockResolvedValue({
    data: { data: rows, total: rows.length, from: 1, to: rows.length, current_page: 1, last_page: 1 },
  });

  return mount(LatePermissions, {
    global: { stubs: { PageHeader: true, Pagination: true } },
  });
}

describe('LatePermissions.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists a pending request with its reason', async () => {
    const wrapper = mountPage([permission()]);
    await flushPromises();

    expect(wrapper.text()).toContain('Kuis Tadabbur Pekan 1');
    expect(wrapper.text()).toContain('Kuis · Pekan 1 · Hari 2');
    expect(wrapper.text()).toContain('Menunggu Persetujuan');
    expect(wrapper.text()).toContain('Saya sakit selama sepekan penuh.');
  });

  it('shows the deadline of an approved and still active permission', async () => {
    const wrapper = mountPage([
      permission({
        status: 'approved',
        status_label: 'Disetujui',
        is_active: true,
        expires_at: '2026-11-10T17:00:00+07:00',
      }),
    ]);
    await flushPromises();

    expect(wrapper.text()).toContain('Disetujui');
    expect(wrapper.text()).toContain('Berlaku Sampai');
    expect(wrapper.text()).toContain('10 Nov 2026');
  });

  it('reads an approved but lapsed permission as expired', async () => {
    const wrapper = mountPage([
      permission({
        status: 'approved',
        status_label: 'Disetujui',
        is_active: false,
        expires_at: '2026-11-04T17:00:00+07:00',
      }),
    ]);
    await flushPromises();

    expect(wrapper.text()).toContain('Masa Berlaku Habis');
    expect(wrapper.text()).not.toContain('Berlaku Sampai');
  });

  it("shows the admin's note on a rejected request", async () => {
    const wrapper = mountPage([
      permission({
        status: 'rejected',
        status_label: 'Ditolak',
        review_note: 'Alasan tidak dapat diterima.',
      }),
    ]);
    await flushPromises();

    expect(wrapper.text()).toContain('Ditolak');
    expect(wrapper.text()).toContain('Catatan Admin');
    expect(wrapper.text()).toContain('Alasan tidak dapat diterima.');
  });

  it('labels an evaluation request without a day number', async () => {
    const wrapper = mountPage([
      permission({ type: 'evaluation', week: 3, order: null, title: 'Evaluasi Pekan 3' }),
    ]);
    await flushPromises();

    expect(wrapper.text()).toContain('Evaluasi · Pekan 3');
    expect(wrapper.text()).not.toContain('Hari');
  });

  it('invites the student to the quiz pages when there is nothing yet', async () => {
    const wrapper = mountPage([]);
    await flushPromises();

    expect(wrapper.text()).toContain('Belum Ada Pengajuan');
  });
});
