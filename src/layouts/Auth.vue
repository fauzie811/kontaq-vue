<template>
  <main class="h-screen">
    <div class="flex flex-1 min-h-full">
      <div class="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div class="w-full max-w-sm mx-auto lg:w-96">
          <slot />
        </div>
      </div>
      <div class="relative flex-1 hidden w-0 lg:flex lg:items-center lg:justify-center">
        <img class="absolute inset-0 object-cover w-full h-full"
          src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
          alt="" />
        <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-primary-1 to-primary-2 opacity-80"></div>
        <div class="relative flex flex-col items-center py-4">
          <div class="px-6 py-3 bg-white rounded-full">
            <img class="w-auto h-20" src="@/assets/logo-kontaq.png" alt="Komunitas Tadabbur Al-Qur'an" />
          </div>
          <img class="w-auto h-12 mt-5" src="@/assets/tagline.png" alt="Komunitas Tadabbur Al-Qur'an" />
        </div>
      </div>
    </div>
  </main>
</template>