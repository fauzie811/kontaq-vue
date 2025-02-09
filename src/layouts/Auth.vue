<template>
  <main class="grid min-h-svh lg:grid-cols-2">
    <div class="flex flex-col gap-4 p-6 md:p-10">
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
    <div class="relative hidden lg:flex lg:items-center lg:justify-center">
      <img class="absolute inset-0 object-cover w-full h-full" src="@/assets/bg-auth.jpg" alt="" />
      <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-primary-1 to-primary-2 opacity-80"></div>
      <div class="relative flex flex-col items-center py-4">
        <div class="px-6 py-3 bg-white rounded-full">
          <img class="w-auto h-20" src="@/assets/logo-kontaq.png" alt="Komunitas Tadabbur Al-Qur'an" />
        </div>
        <img class="w-auto h-12 mt-5" src="@/assets/tagline.png" alt="Komunitas Tadabbur Al-Qur'an" />
      </div>
    </div>
  </main>
</template>