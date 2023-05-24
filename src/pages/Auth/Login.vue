<template>
  <div class="flex flex-1 min-h-full">
    <div class="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div class="w-full max-w-sm mx-auto lg:w-96">
        <div>
          <img class="w-auto h-16" src="../../assets/logo.png" alt="Komunitas Tadabbur Al-Qur'an" />
          <h2 class="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">Assalamu'alaikum</h2>
          <p class="mt-2 text-sm leading-6 text-gray-500">
            Silakan login terlebih dahulu.
          </p>
          <!-- <p class="mt-2 text-sm leading-6 text-gray-500">
            Belum punya akun?
            {{ ' ' }}
            <a href="#" class="font-semibold text-green-600 hover:text-green-500">Daftar sekarang</a>
          </p> -->
        </div>

        <div class="mt-10">
          <div>
            <form v-on:submit.prevent="doLogin" class="space-y-6">
              <div>
                <label for="username" class="block text-sm font-medium leading-6 text-gray-900">ID Anggota</label>
                <div class="mt-2">
                  <input v-model="username" id="username" name="username" type="text" autocomplete="username" required
                    class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6" />
                </div>
              </div>

              <div>
                <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                <div class="mt-2">
                  <input v-model="password" id="password" name="password" type="password" autocomplete="current-password"
                    required
                    class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6" />
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <!-- <input id="remember-me" name="remember-me" type="checkbox"
                    class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-600" />
                  <label for="remember-me" class="block ml-3 text-sm leading-6 text-gray-700">Remember me</label> -->
                </div>

                <div class="text-sm leading-6">
                  <a href="#" class="font-semibold text-green-600 hover:text-green-500">Forgot password?</a>
                </div>
              </div>

              <div>
                <button type="submit"
                  class="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">Masuk</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="relative flex-1 hidden w-0 lg:block">
      <img class="absolute inset-0 object-cover w-full h-full"
        src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
        alt="" />
      <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-[#7bc060] to-[#33a44b] opacity-70"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/api';

const router = useRouter();

const username = ref();
const password = ref();

const doLogin = async () => {
  try {
    await login({
      login: username.value,
      password: password.value,
    });
    router.replace({ name: 'home' });
  } catch (e) {
    console.error(e);
  }
}
</script>