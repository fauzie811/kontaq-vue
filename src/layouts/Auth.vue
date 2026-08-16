<template>
  <main class="grid min-h-svh lg:h-screen lg:overflow-hidden lg:grid-cols-12 bg-background font-sans selection:bg-primary/20 selection:text-primary">
    <!-- Desktop Left Hero Panel (Static 100vh, non-scrollable) -->
    <div class="relative hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-between p-10 overflow-hidden bg-primary/10 lg:h-screen lg:sticky lg:top-0">
      <img class="absolute inset-0 object-cover w-full h-full scale-105 transition-transform duration-1000 ease-out hover:scale-100" src="@/assets/bg-auth.jpg" alt="" />
      <div class="absolute inset-0 bg-gradient-to-br from-primary-2/90 via-primary-2/80 to-primary-1/70 backdrop-blur-[2px]"></div>
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/30 rounded-full blur-3xl pointer-events-none"></div>

      <div></div>

      <!-- Center Brand Identity -->
      <div class="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto py-12">
        <div class="p-6 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-black/15 border border-white/40 transform transition-transform hover:scale-105 duration-300">
          <img class="w-auto h-28 lg:h-32 object-contain" src="@/assets/logo-kontaq.png" alt="Komunitas Tadabbur Al-Qur'an" />
        </div>
        <img class="w-auto h-16 lg:h-20 mt-8 drop-shadow-md brightness-0 invert" src="@/assets/tagline.png" alt="Komunitas Tadabbur Al-Qur'an" />
      </div>

      <!-- Footer Badge -->
      <div class="relative z-10 text-xs text-white/70 text-center">
        &copy; Komunitas Tadabbur Al-Qur'an (KontaQ). All rights reserved.
      </div>
    </div>

    <!-- Right Content Area (Scrollable independently if form is tall) -->
    <div class="flex flex-col justify-between p-6 sm:p-10 lg:col-span-6 xl:col-span-5 bg-background lg:h-screen lg:overflow-y-auto">
      <!-- Mobile Top Brand Logo -->
      <div class="flex justify-center lg:hidden mb-6">
        <img class="w-auto h-14" src="@/assets/logo.png" alt="Komunitas Tadabbur Al-Qur'an" />
      </div>

      <!-- Main Slot Container -->
      <div class="flex items-center justify-center flex-1 py-4">
        <div class="view-transition-content w-full max-w-md lg:max-w-xl transition-all duration-300">
          <slot />
        </div>
      </div>

      <div class="text-xs text-center text-muted-foreground/60 pt-4 lg:hidden">
        &copy; Komunitas Tadabbur Al-Qur'an (KontaQ)
      </div>
    </div>
  </main>
</template>