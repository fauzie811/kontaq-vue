<template>
  <div>
    <section aria-labelledby="profile-overview-title">
      <div class="overflow-hidden bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5">
        <h2 class="sr-only" id="profile-overview-title">Profile Overview</h2>
        <div class="p-6 bg-white">
          <div class="sm:flex sm:items-center sm:justify-between">
            <div class="sm:flex sm:space-x-5">
              <div class="flex-shrink-0">
                <img class="w-20 h-20 mx-auto rounded-full"
                  :src="'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=' + (authStore.user ? authStore.user.name : '')"
                  alt="" />
              </div>
              <div class="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                <p class="text-sm font-medium text-gray-600">Assalamu'alaikum,</p>
                <p class="text-xl font-bold text-gray-900 sm:text-2xl">{{ authStore.user ? authStore.user.name : '...' }}
                </p>
                <p class="text-sm font-medium text-gray-500">{{ authStore.user ? authStore.user.username : '' }}</p>
              </div>
            </div>
            <div class="flex justify-center mt-5 sm:mt-0">
              <a href="#"
                class="flex items-center justify-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Lihat
                profil</a>
            </div>
          </div>
        </div>
        <div
          class="grid grid-cols-1 border-t border-gray-200 divide-y divide-gray-200 bg-gray-50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div v-for="stat in stats" :key="stat.label" class="px-6 py-5 text-sm font-medium text-center">
            <span class="text-gray-900">{{ stat.value }}</span>
            {{ ' ' }}
            <span class="text-gray-600">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <h2 class="mt-8 text-lg font-medium leading-6 text-gray-900 ">Recent activity
    </h2>

    <!-- Activity list (smallest breakpoint only) -->
    <div class="shadow sm:hidden">
      <ul role="list" class="mt-2 overflow-hidden divide-y divide-gray-200 shadow sm:hidden">
        <li v-for="transaction in transactions" :key="transaction.id">
          <a :href="transaction.href" class="block px-4 py-4 bg-white hover:bg-gray-50">
            <span class="flex items-center space-x-4">
              <span class="flex flex-1 space-x-2 truncate">
                <BanknotesIcon class="flex-shrink-0 w-5 h-5 text-gray-400" aria-hidden="true" />
                <span class="flex flex-col text-sm text-gray-500 truncate">
                  <span class="truncate">{{ transaction.name }}</span>
                  <span><span class="font-medium text-gray-900">{{ transaction.amount }}</span> {{ transaction.currency
                  }}</span>
                  <time :datetime="transaction.datetime">{{ transaction.date }}</time>
                </span>
              </span>
              <ChevronRightIcon class="flex-shrink-0 w-5 h-5 text-gray-400" aria-hidden="true" />
            </span>
          </a>
        </li>
      </ul>

      <nav class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200" aria-label="Pagination">
        <div class="flex justify-between flex-1">
          <a href="#"
            class="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Previous</a>
          <a href="#"
            class="relative inline-flex items-center px-3 py-2 ml-3 text-sm font-semibold text-gray-900 bg-white rounded-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Next</a>
        </div>
      </nav>
    </div>

    <!-- Activity table (small breakpoint and up) -->
    <div class="hidden sm:block">
      <div class="">
        <div class="flex flex-col mt-2">
          <div
            class="min-w-full overflow-hidden overflow-x-auto align-middle rounded-lg shadow-sm ring-1 ring-gray-900/5">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-sm font-semibold text-left text-gray-900 bg-gray-50" scope="col">Transaction
                  </th>
                  <th class="px-6 py-3 text-sm font-semibold text-right text-gray-900 bg-gray-50" scope="col">Amount</th>
                  <th class="hidden px-6 py-3 text-sm font-semibold text-left text-gray-900 bg-gray-50 md:block"
                    scope="col">Status</th>
                  <th class="px-6 py-3 text-sm font-semibold text-right text-gray-900 bg-gray-50" scope="col">Date</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="transaction in transactions" :key="transaction.id" class="bg-white">
                  <td class="w-full px-6 py-4 text-sm text-gray-900 max-w-0 whitespace-nowrap">
                    <div class="flex">
                      <a :href="transaction.href" class="inline-flex space-x-2 text-sm truncate group">
                        <BanknotesIcon class="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true" />
                        <p class="text-gray-500 truncate group-hover:text-gray-900">{{ transaction.name }}</p>
                      </a>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                    <span class="font-medium text-gray-900">{{ transaction.amount }}</span>
                    {{ transaction.currency }}
                  </td>
                  <td class="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap md:block">
                    <span
                      :class="[statusStyles[transaction.status], 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize']">{{
                        transaction.status }}</span>
                  </td>
                  <td class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                    <time :datetime="transaction.datetime">{{ transaction.date }}</time>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- Pagination -->
            <nav class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6"
              aria-label="Pagination">
              <div class="hidden sm:block">
                <p class="text-sm text-gray-700">
                  Showing
                  {{ ' ' }}
                  <span class="font-medium">1</span>
                  {{ ' ' }}
                  to
                  {{ ' ' }}
                  <span class="font-medium">10</span>
                  {{ ' ' }}
                  of
                  {{ ' ' }}
                  <span class="font-medium">20</span>
                  {{ ' ' }}
                  results
                </p>
              </div>
              <div class="flex justify-between flex-1 gap-x-3 sm:justify-end">
                <a href="#"
                  class="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md ring-1 ring-inset ring-gray-300 hover:ring-gray-400">Previous</a>
                <a href="#"
                  class="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md ring-1 ring-inset ring-gray-300 hover:ring-gray-400">Next</a>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { BanknotesIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'
import authStore from '@/store/auth';

const stats = [
  { label: 'Vacation days left', value: 12 },
  { label: 'Sick days left', value: 4 },
  { label: 'Personal days left', value: 2 },
]
const transactions = [
  {
    id: 1,
    name: 'Payment to Molly Sanders',
    href: '#',
    amount: '$20,000',
    currency: 'USD',
    status: 'success',
    date: 'July 11, 2020',
    datetime: '2020-07-11',
  },
  // More transactions...
]
const statusStyles = {
  success: 'bg-green-100 text-green-800',
  processing: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-gray-100 text-gray-800',
}
</script>