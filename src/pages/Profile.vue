<script setup>
import PageHeader from '@/components/PageHeader.vue';
import { ProfileForm, SettingsForm } from '@/components/profile';
import {
  Card,
  CardContent,
} from '@/components/ui/card'
</script>

<template>
  <div>
    <PageHeader page-title="Profil" />
    <div class="divide-y divide-black/5">
      <div class="grid grid-cols-1 py-16 gap-x-8 gap-y-10 md:grid-cols-3">
        <div>
          <h2 class="text-base font-semibold leading-7">Informasi Pribadi</h2>
          <!-- <p class="mt-1 text-sm leading-6 text-gray-500">Use a permanent address where you can receive mail.</p> -->
        </div>

        <Card class="pt-6 md:col-span-2">
          <CardContent>
            <ProfileForm />
          </CardContent>
        </Card>
      </div>

      <div class="grid grid-cols-1 py-16 gap-x-8 gap-y-10 md:grid-cols-3">
        <div>
          <h2 class="text-base font-semibold leading-7">Pengaturan</h2>
          <!-- <p class="mt-1 text-sm leading-6 text-gray-500">Use a permanent address where you can receive mail.</p> -->
        </div>

        <Card class="pt-6 md:col-span-2">
          <CardContent>
            <SettingsForm />
          </CardContent>
        </Card>
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
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-lime-600 sm:text-sm sm:leading-6" />
              </div>
            </div>

            <div class="col-span-full">
              <label for="new-password" class="block text-sm font-medium leading-6">New password</label>
              <div class="mt-2">
                <input id="new-password" name="new_password" type="password" autocomplete="new-password"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-lime-600 sm:text-sm sm:leading-6" />
              </div>
            </div>

            <div class="col-span-full">
              <label for="confirm-password" class="block text-sm font-medium leading-6">Confirm password</label>
              <div class="mt-2">
                <input id="confirm-password" name="confirm_password" type="password" autocomplete="new-password"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-lime-600 sm:text-sm sm:leading-6" />
              </div>
            </div>
          </div>

          <div class="flex mt-8">
            <button type="submit"
              class="px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-lime-500 hover:bg-lime-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-500">Save</button>
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
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-lime-600 sm:text-sm sm:leading-6" />
              </div>
            </div>
          </div>

          <div class="flex mt-8">
            <button type="submit"
              class="px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-lime-500 hover:bg-lime-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-500">Log
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
