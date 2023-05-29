<template>
  <div class="flex flex-1 min-h-full">
    <div class="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div class="w-full max-w-sm mx-auto lg:w-96">
        <div>
          <img class="w-auto h-16" src="../../assets/logo.png" alt="Komunitas Tadabbur Al-Qur'an" />
          <h2 class="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">Assalamu'alaikum</h2>
          <p class="mt-2 text-sm leading-6 text-gray-500">
            Silakan lengkapi formulir berikut untuk mendaftar.
          </p>
        </div>

        <div class="mt-10">
          <div>
            <form v-on:submit.prevent="doRegister"
              :class="['grid grid-cols-1 gap-4 sm:grid-cols-6', isRegistering ? 'opacity-50 pointer-events-none' : '']">
              <InputFrame class="sm:col-span-4" label="Nama Lengkap">
                <input v-model="userData.name" id="name" name="name" type="text" autocomplete="name" required
                  class="block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />
              </InputFrame>

              <InputFrame class="sm:col-span-2" label="Panggilan">
                <input v-model="userData.nickname" id="nickname" name="nickname" type="text" required
                  class="block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />
              </InputFrame>

              <RadioGroup
                class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-green-600 sm:col-span-4"
                v-model="userData.gender">
                <RadioGroupLabel class="block text-xs font-medium text-gray-900">Jenis Kelamin</RadioGroupLabel>
                <div class="grid grid-cols-2 gap-2">
                  <RadioGroupOption as="template" value="m" v-slot="{ active, checked }">
                    <div
                      :class="['cursor-pointer focus:outline-none', active ? 'ring-2 ring-green-600 ring-offset-2' : '', checked ? 'bg-green-600 text-white hover:bg-green-500' : 'ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50', 'flex items-center justify-center rounded-md py-1 px-3 text-xs sm:flex-1']">
                      <RadioGroupLabel as="span">Laki-laki</RadioGroupLabel>
                    </div>
                  </RadioGroupOption>
                  <RadioGroupOption as="template" value="f" v-slot="{ active, checked }">
                    <div
                      :class="['cursor-pointer focus:outline-none', active ? 'ring-2 ring-green-600 ring-offset-2' : '', checked ? 'bg-green-600 text-white hover:bg-green-500' : 'ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50', 'flex items-center justify-center rounded-md py-1 px-3 text-xs sm:flex-1']">
                      <RadioGroupLabel as="span">Perempuan</RadioGroupLabel>
                    </div>
                  </RadioGroupOption>
                </div>
              </RadioGroup>

              <InputFrame class="sm:col-span-2" label="Usia">
                <input v-model="userData.age" id="age" name="age" type="number" required
                  class="block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />
              </InputFrame>

              <InputFrame class="col-span-full" label="Alamat">
                <input v-model="userData.address" id="address" name="address" type="text" required
                  class="block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />
              </InputFrame>

              <InputFrame class="col-span-full" label="Pekerjaan">
                <input v-model="userData.occupation" id="occupation" name="occupation" type="text" required
                  class="block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />
              </InputFrame>

              <InputFrame class="sm:col-span-3" label="Nomor HP">
                <input v-model="userData.phone" id="phone" name="phone" type="tel" required
                  class="block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />
              </InputFrame>

              <InputFrame class="sm:col-span-3" label="Email">
                <input v-model="userData.email" id="email" name="email" type="email" required
                  class="block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />
              </InputFrame>

              <InputFrame class="col-span-full" label="Motivasi Ikut KontaQ">
                <input v-model="userData.motivation" id="motivation" name="motivation" type="text" required
                  class="block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />
              </InputFrame>

              <InputFrame class="sm:col-span-3" label="Password">
                <input v-model="userData.password" id="password" name="password" type="password" required
                  class="block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />
              </InputFrame>

              <InputFrame class="sm:col-span-3" label="Konfirmasi Password">
                <input v-model="userData.password_confirmation" id="password_confirmation" name="password_confirmation"
                  type="password" required
                  class="block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />
              </InputFrame>

              <p v-if="error" class="text-sm text-red-600 col-span-full">{{ error }}</p>

              <div class="col-span-full">
                <button type="submit"
                  class="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">Mendaftar</button>
              </div>
            </form>
          </div>
        </div>

        <p class="mt-4 text-sm leading-6 text-center text-gray-500">
          Sudah punya akun?
          {{ ' ' }}
          <router-link to="/login" class="font-semibold text-green-600 hover:text-green-500">Login</router-link>
        </p>
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
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue';

import { useRouter } from 'vue-router';
import { register } from '@/api';
import InputFrame from '@/components/forms/InputFrame.vue';

const router = useRouter();

const isRegistering = ref(false);
const userData = ref({
  fullname: null,
  nickname: null,
  gender: null,
  age: null,
  address: null,
  occupation: null,
  phone: null,
  email: null,
  motivation: null,
});
const error = ref();

const doRegister = async () => {
  error.value = null;
  isRegistering.value = true;
  try {
    await register(userData.value);
    router.replace({ name: 'home' });
  } catch (e) {
    // console.error(e);
    error.value = e;
  }
  isRegistering.value = false;
}
</script>