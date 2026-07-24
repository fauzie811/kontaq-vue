<template>
  <main class="grid min-h-svh lg:grid-cols-12">
    <div class="relative hidden lg:flex lg:col-span-7 lg:items-center lg:justify-center p-8">
      <img class="absolute inset-0 object-cover w-full h-full" src="@/assets/bg-auth.jpg" alt="" />
      <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-primary-1 to-primary-2 opacity-80"></div>
      <div class="relative flex flex-col items-center py-6 text-center">
        <div class="px-10 py-5 bg-white rounded-full shadow-lg">
          <img class="w-auto h-28 lg:h-32" src="@/assets/logo-kontaq.png" alt="Komunitas Tadabbur Al-Qur'an" />
        </div>
        <img class="w-auto h-16 lg:h-20 mt-8" src="@/assets/tagline.png" alt="Komunitas Tadabbur Al-Qur'an" />
      </div>
    </div>
    <div class="flex flex-col gap-4 p-6 md:p-10 lg:col-span-5">
      <div class="flex justify-center gap-2 lg:hidden">
        <a href="/" class="flex items-center">
          <img class="w-auto h-16" src="@/assets/logo.png" alt="Komunitas Tadabbur Al-Qur'an" />
        </a>
      </div>
      <div class="flex items-center justify-center flex-1">
        <div class="w-full max-w-sm">
          <slot />
        </div>
      </div>
    </div>
  </main>
</template>