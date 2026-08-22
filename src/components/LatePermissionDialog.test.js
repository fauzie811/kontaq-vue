import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import LatePermissionDialog from '@/components/LatePermissionDialog.vue';
import * as api from '@/api';

vi.mock('@/api', () => ({
  requestLatePermission: vi.fn(),
}));

const toastSuccess = vi.fn();
vi.mock('vue-sonner', () => ({
  toast: {
    success: (...args) => toastSuccess(...args),
  },
}));

// Headless UI teleports the dialog to <body>, so it is queried through the
// document rather than through the wrapper.
const reasonField = () => document.querySelector('#late-permission-reason');
const dialogText = () => document.body.textContent;

async function setReason(value) {
  const field = reasonField();
  field.value = value;
  field.dispatchEvent(new Event('input'));
  await flushPromises();
}

async function submitForm() {
  document.querySelector('form').dispatchEvent(
    new Event('submit', { cancelable: true, bubbles: true })
  );
  await flushPromises();
}

let wrapper;

async function mountDialog(props = {}) {
  wrapper = mount(LatePermissionDialog, {
    props: {
      open: true,
      type: 'quiz',
      itemId: 12,
      itemLabel: 'Kuis Pekan 1',
      closedAt: '2026-11-02T15:59:59+07:00',
      ...props,
    },
  });
  await flushPromises();
  return wrapper;
}

describe('LatePermissionDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    document.body.innerHTML = '';
  });

  it('shows the item it is about and when the window closed', async () => {
    await mountDialog();

    expect(dialogText()).toContain('Ajukan Izin Telat');
    expect(dialogText()).toContain('Kuis Pekan 1');
    expect(dialogText()).toContain('2 Nov 2026');
  });

  it('refuses a reason that is too short without calling the API', async () => {
    await mountDialog();

    await setReason('sakit');
    await submitForm();

    expect(api.requestLatePermission).not.toHaveBeenCalled();
    expect(dialogText()).toContain('minimal 10 karakter');
  });

  it('submits a trimmed reason and closes on success', async () => {
    api.requestLatePermission.mockResolvedValue({
      success: true,
      message: 'Pengajuan izin telat terkirim.',
      data: { id: 5, status: 'pending' },
    });

    await mountDialog();

    await setReason('   Saya dirawat di rumah sakit sepekan penuh.   ');
    await submitForm();

    expect(api.requestLatePermission).toHaveBeenCalledWith({
      type: 'quiz',
      id: 12,
      reason: 'Saya dirawat di rumah sakit sepekan penuh.',
    });
    expect(toastSuccess).toHaveBeenCalledWith('Pengajuan izin telat terkirim.');
    expect(wrapper.emitted('submitted')).toHaveLength(1);
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false]);
  });

  it('sends the evaluation type when asked to', async () => {
    api.requestLatePermission.mockResolvedValue({ success: true, data: {} });

    await mountDialog({ type: 'evaluation', itemId: 4 });

    await setReason('Saya izin karena ada acara keluarga.');
    await submitForm();

    expect(api.requestLatePermission).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'evaluation', id: 4 })
    );
  });

  it('keeps the dialog open and shows the server message on failure', async () => {
    api.requestLatePermission.mockRejectedValue(
      'Pengajuan Anda untuk ini masih menunggu persetujuan admin.'
    );

    await mountDialog();

    await setReason('Saya lupa mengerjakan tepat waktu.');
    await submitForm();

    expect(dialogText()).toContain('masih menunggu persetujuan admin');
    expect(wrapper.emitted('submitted')).toBeUndefined();
    expect(wrapper.emitted('update:open')).toBeUndefined();
  });

  it('resets the previous reason when reopened', async () => {
    await mountDialog({ open: false });

    await wrapper.setProps({ open: true });
    await flushPromises();
    await setReason('alasan lama sekali');

    await wrapper.setProps({ open: false });
    await flushPromises();
    await wrapper.setProps({ open: true });
    await flushPromises();

    expect(reasonField().value).toBe('');
  });
});
