<template>
  <div>
    <PageHeader page-title="Profil" />
    <div class="divide-y divide-black/5">
      <div class="grid grid-cols-1 py-16 gap-x-8 gap-y-10 md:grid-cols-3">
        <div>
          <h2 class="text-base font-semibold leading-7">Informasi Pribadi</h2>
          <p class="mt-1 text-sm leading-6 text-gray-500">Use a permanent address where you can receive mail.</p>
        </div>

        <form v-on:submit.prevent="saveProfile" class="md:col-span-2">
          <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <!-- <div class="flex items-center col-span-full gap-x-8">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="" class="flex-none object-cover w-24 h-24 bg-gray-100 rounded-lg" />
              <div>
                <button type="button"
                  class="px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Change
                  avatar</button>
                <p class="mt-2 text-xs leading-5 text-gray-500">JPG, GIF or PNG. 1MB max.</p>
              </div>
            </div> -->

            <InputFrame class="sm:col-span-4" label="Nama Lengkap">
              <input v-model="profile.name" id="name" name="name" type="text" autocomplete="name" required
                class="block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />
            </InputFrame>

            <InputFrame class="sm:col-span-2" label="Panggilan">
              <input v-model="profile.nickname" id="nickname" name="nickname" type="text" required
                class="block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />
            </InputFrame>

            <RadioGroup
              class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-green-600 sm:col-span-4"
              v-model="profile.gender">
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
              <input v-model="profile.age" id="age" name="age" type="number" required
                class="block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />
            </InputFrame>

            <InputFrame class="col-span-full" label="Alamat">
              <input v-model="profile.address" id="address" name="address" type="text" required
                class="block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />
            </InputFrame>

            <InputFrame class="col-span-full" label="Pekerjaan">
              <input v-model="profile.occupation" id="occupation" name="occupation" type="text" required
                class="block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />
            </InputFrame>

            <InputFrame class="sm:col-span-3" label="Nomor HP">
              <input v-model="profile.phone" id="phone" name="phone" type="tel" required
                class="block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />
            </InputFrame>

            <InputFrame class="sm:col-span-3" label="Email">
              <input v-model="profile.email" id="email" name="email" type="email" required
                class="block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />
            </InputFrame>

            <InputFrame class="col-span-full" label="Motivasi Ikut KontaQ">
              <input v-model="profile.motivation" id="motivation" name="motivation" type="text" required
                class="block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />
            </InputFrame>
          </div>

          <div class="flex mt-8">
            <button type="submit"
              class="px-3 py-2 text-sm font-semibold text-white bg-green-500 rounded-md shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500">Simpan</button>
          </div>
        </form>
      </div>

      <!-- <div class="grid grid-cols-1 py-16 gap-x-8 gap-y-10 md:grid-cols-3">
        <div>
          <h2 class="text-base font-semibold leading-7">Change password</h2>
          <p class="mt-1 text-sm leading-6 text-gray-500">Update your password associated with your account.</p>
        </div>

        <form class="md:col-span-2">
          <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div class="col-span-full">
              <label for="current-password" class="block text-sm font-medium leading-6">Current password</label>
              <div class="mt-2">
                <input id="current-password" name="current_password" type="password" autocomplete="current-password"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6" />
              </div>
            </div>

            <div class="col-span-full">
              <label for="new-password" class="block text-sm font-medium leading-6">New password</label>
              <div class="mt-2">
                <input id="new-password" name="new_password" type="password" autocomplete="new-password"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6" />
              </div>
            </div>

            <div class="col-span-full">
              <label for="confirm-password" class="block text-sm font-medium leading-6">Confirm password</label>
              <div class="mt-2">
                <input id="confirm-password" name="confirm_password" type="password" autocomplete="new-password"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6" />
              </div>
            </div>
          </div>

          <div class="flex mt-8">
            <button type="submit"
              class="px-3 py-2 text-sm font-semibold text-white bg-green-500 rounded-md shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500">Save</button>
          </div>
        </form>
      </div> -->

      <!-- <div class="grid grid-cols-1 py-16 gap-x-8 gap-y-10 md:grid-cols-3">
        <div>
          <h2 class="text-base font-semibold leading-7">Log out other sessions</h2>
          <p class="mt-1 text-sm leading-6 text-gray-500">Please enter your password to confirm you would like to log out
            of
            your other sessions across all of your devices.</p>
        </div>

        <form class="md:col-span-2">
          <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div class="col-span-full">
              <label for="logout-password" class="block text-sm font-medium leading-6">Your password</label>
              <div class="mt-2">
                <input id="logout-password" name="password" type="password" autocomplete="current-password"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6" />
              </div>
            </div>
          </div>

          <div class="flex mt-8">
            <button type="submit"
              class="px-3 py-2 text-sm font-semibold text-white bg-green-500 rounded-md shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500">Log
              out other sessions</button>
          </div>
        </form>
      </div> -->

      <!-- <div class="grid grid-cols-1 py-16 gap-x-8 gap-y-10 md:grid-cols-3">
        <div>
          <h2 class="text-base font-semibold leading-7">Delete account</h2>
          <p class="mt-1 text-sm leading-6 text-gray-500">No longer want to use our service? You can delete your account
            here. This action is not reversible. All information related to this account will be deleted permanently.</p>
        </div>

        <form class="flex items-start md:col-span-2">
          <button type="submit"
            class="px-3 py-2 text-sm font-semibold text-white bg-red-500 rounded-md shadow-sm hover:bg-red-400">Yes,
            delete
            my account</button>
        </form>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue';

import { getUser, getProfile, updateProfile } from '@/api';
import PageHeader from '@/components/PageHeader.vue';
import InputFrame from '@/components/forms/InputFrame.vue';

const profile = ref({});

async function loadProfile() {
  const data = await getProfile();
  profile.value = data.data;
}
loadProfile();

async function saveProfile() {
  await updateProfile(profile.value);
  getUser();
}
</script>