<template>
  <div>
    <PageHeader page-title="Profil saya" />
    <div class="divide-y divide-black/5">
      <div class="grid grid-cols-1 py-16 gap-x-8 gap-y-10 md:grid-cols-3">
        <div>
          <h2 class="text-base font-semibold leading-7">Personal Information</h2>
          <p class="mt-1 text-sm leading-6 text-gray-500">Use a permanent address where you can receive mail.</p>
        </div>

        <form class="md:col-span-2">
          <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div class="flex items-center col-span-full gap-x-8">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="" class="flex-none object-cover w-24 h-24 bg-gray-100 rounded-lg" />
              <div>
                <button type="button"
                  class="px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Change
                  avatar</button>
                <p class="mt-2 text-xs leading-5 text-gray-500">JPG, GIF or PNG. 1MB max.</p>
              </div>
            </div>

            <div class="sm:col-span-3">
              <label for="first-name" class="block text-sm font-medium leading-6">First name</label>
              <div class="mt-2">
                <input type="text" name="first-name" id="first-name" autocomplete="given-name"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              </div>
            </div>

            <div class="sm:col-span-3">
              <label for="last-name" class="block text-sm font-medium leading-6">Last name</label>
              <div class="mt-2">
                <input type="text" name="last-name" id="last-name" autocomplete="family-name"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              </div>
            </div>

            <div class="col-span-full">
              <label for="email" class="block text-sm font-medium leading-6">Email address</label>
              <div class="mt-2">
                <input id="email" name="email" type="email" autocomplete="email"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              </div>
            </div>

            <div class="col-span-full">
              <label for="username" class="block text-sm font-medium leading-6">Username</label>
              <div class="mt-2">
                <div
                  class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                  <span class="flex items-center pl-3 text-gray-400 select-none sm:text-sm">example.com/</span>
                  <input type="text" name="username" id="username" autocomplete="username"
                    class="flex-1 border-0 bg-transparent py-1.5 pl-1 text-white focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="janesmith" />
                </div>
              </div>
            </div>

            <div class="col-span-full">
              <label for="timezone" class="block text-sm font-medium leading-6">Timezone</label>
              <div class="mt-2">
                <select id="timezone" name="timezone"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 [&_*]:text-black">
                  <option>Pacific Standard Time</option>
                  <option>Eastern Standard Time</option>
                  <option>Greenwich Mean Time</option>
                </select>
              </div>
            </div>
          </div>

          <div class="flex mt-8">
            <button type="submit"
              class="px-3 py-2 text-sm font-semibold text-white bg-indigo-500 rounded-md shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Save</button>
          </div>
        </form>
      </div>

      <div class="grid grid-cols-1 py-16 gap-x-8 gap-y-10 md:grid-cols-3">
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
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              </div>
            </div>

            <div class="col-span-full">
              <label for="new-password" class="block text-sm font-medium leading-6">New password</label>
              <div class="mt-2">
                <input id="new-password" name="new_password" type="password" autocomplete="new-password"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              </div>
            </div>

            <div class="col-span-full">
              <label for="confirm-password" class="block text-sm font-medium leading-6">Confirm password</label>
              <div class="mt-2">
                <input id="confirm-password" name="confirm_password" type="password" autocomplete="new-password"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              </div>
            </div>
          </div>

          <div class="flex mt-8">
            <button type="submit"
              class="px-3 py-2 text-sm font-semibold text-white bg-indigo-500 rounded-md shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Save</button>
          </div>
        </form>
      </div>

      <div class="grid grid-cols-1 py-16 gap-x-8 gap-y-10 md:grid-cols-3">
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
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              </div>
            </div>
          </div>

          <div class="flex mt-8">
            <button type="submit"
              class="px-3 py-2 text-sm font-semibold text-white bg-indigo-500 rounded-md shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Log
              out other sessions</button>
          </div>
        </form>
      </div>

      <div class="grid grid-cols-1 py-16 gap-x-8 gap-y-10 md:grid-cols-3">
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
      </div>
    </div>
  </div>
</template>

<script setup>
import PageHeader from '@/components/PageHeader.vue';

</script>