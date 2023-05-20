<template>
  <span>{{ countdown }}</span>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue';
import intervalToDuration from 'date-fns/intervalToDuration';
import addMinutes from 'date-fns/addMinutes';

const countdown = ref('00:00');

const zeroPad = (num) => String(num).padStart(2, '0');

const emit = defineEmits(['finished']);
const props = defineProps({
  startTime: Date,
  duration: Number | String,
});

onBeforeUnmount(() => {
  if (interval) clearInterval(interval);
});

const interval = setInterval(() => {
  if (props.startTime) {
    const dur = intervalToDuration({
      start: new Date(),
      end: addMinutes(props.startTime, props.duration),
    });

    let hour = '';
    if (dur.hours > 0) {
      hour = `${zeroPad(dur.hours)}:`;
    }

    countdown.value = `${hour}${zeroPad(dur.minutes)}:${zeroPad(
      dur.seconds
    )}`;

    if (countdown.value == '00:00') {
      clearInterval(interval);
      emit('finished');
    }
  } else {
    countdown.value = '00:00';
  }
}, 1000);
</script>