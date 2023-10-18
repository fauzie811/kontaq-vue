<template>
  <div>
    <div>
      <img class="block w-auto h-16 lg:hidden" src="../../assets/logo.png" alt="Komunitas Tadabbur Al-Qur'an" />
      <h2 class="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">Assalamu'alaikum</h2>
      <p class="mt-2 text-sm leading-6 text-gray-500">
        Silakan login terlebih dahulu.
      </p>
    </div>

    <div class="mt-10">
      <div>
        <form v-on:submit.prevent="doLogin" :class="['space-y-6', isLogginIn ? 'opacity-50 pointer-events-none' : '']">
          <div>
            <label for="username" class="block text-sm font-medium leading-6 text-gray-900">ID KontaQ</label>
            <div class="mt-2">
              <input v-model="username" id="username" name="username" type="text" autocomplete="username" required
                class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-lime-600 sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
            <div class="mt-2">
              <input v-model="password" id="password" name="password" type="password" autocomplete="current-password"
                required
                class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-lime-600 sm:text-sm sm:leading-6" />
            </div>
          </div>

          <!-- <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox"
                    class="w-4 h-4 border-gray-300 rounded text-lime-600 focus:ring-lime-600" />
                  <label for="remember-me" class="block ml-3 text-sm leading-6 text-gray-700">Remember me</label>
                </div>

                <div class="text-sm leading-6">
                  <a href="#" class="font-semibold text-lime-600 hover:text-lime-500">Forgot password?</a>
                </div>
              </div> -->

          <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

          <div>
            <button type="submit"
              class="flex w-full justify-center rounded-md bg-lime-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-lime-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600">Masuk</button>
          </div>
        </form>
      </div>
    </div>

    <p class="mt-4 text-sm leading-6 text-center text-gray-500">
      Belum punya akun?
      {{ ' ' }}
      <router-link to="/register" class="font-semibold text-lime-600 hover:text-lime-500">Daftar
        sekarang</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/api';

const router = useRouter();

const isLogginIn = ref(false);
const username = ref();
const password = ref();
const error = ref();

const doLogin = async () => {
  error.value = null;
  isLogginIn.value = true;
  try {
    await login({
      login: username.value,
      password: password.value,
    });
    router.replace({ name: 'home' });
  } catch (e) {
    // console.error(e);
    error.value = e;
  }
  isLogginIn.value = false;
}
</script>