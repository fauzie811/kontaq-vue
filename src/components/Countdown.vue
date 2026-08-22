<template>
  <slot
    :countdown="countdown"
    :seconds-left="remainingSeconds"
    :is-warning="remainingSeconds > 0 && remainingSeconds <= 300"
    :is-critical="remainingSeconds > 0 && remainingSeconds <= 60"
  >
    <span>{{ countdown }}</span>
  </slot>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import addMinutes from 'date-fns/addMinutes';

const props = defineProps({
  startTime: {
    type: Date,
    default: null,
  },
  duration: {
    type: [Number, String],
    default: 0,
  },
});

const emit = defineEmits(['finished', 'tick']);

const countdown = ref('00:00');
const remainingSeconds = ref(0);
let interval = null;

const zeroPad = (num) => String(num).padStart(2, '0');

function updateCountdown() {
  if (!props.startTime || !props.duration) {
    countdown.value = '00:00';
    remainingSeconds.value = 0;
    return;
  }

  const startDate = props.startTime instanceof Date ? props.startTime : new Date(props.startTime);
  if (isNaN(startDate.getTime())) {
    countdown.value = '00:00';
    remainingSeconds.value = 0;
    return;
  }

  const durationMinutes = Number(props.duration) || 0;
  const endDate = addMinutes(startDate, durationMinutes);
  const now = new Date();
  const diffMs = endDate.getTime() - now.getTime();
  const totalSecs = Math.max(0, Math.floor(diffMs / 1000));

  remainingSeconds.value = totalSecs;

  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;

  const hourPrefix = hours > 0 ? `${zeroPad(hours)}:` : '';
  countdown.value = `${hourPrefix}${zeroPad(minutes)}:${zeroPad(seconds)}`;

  emit('tick', {
    countdown: countdown.value,
    remainingSeconds: totalSecs,
    isWarning: totalSecs > 0 && totalSecs <= 300,
    isCritical: totalSecs > 0 && totalSecs <= 60,
  });

  if (totalSecs <= 0) {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    emit('finished');
  }
}

function startTimer() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  updateCountdown();
  interval = setInterval(updateCountdown, 1000);
}

watch(
  () => [props.startTime, props.duration],
  () => {
    startTimer();
  },
  { immediate: true }
);

onMounted(() => {
  startTimer();
});

onBeforeUnmount(() => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
});
</script>