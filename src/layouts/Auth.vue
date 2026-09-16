<template>
  <main class="grid min-h-svh lg:h-screen lg:overflow-hidden lg:grid-cols-12 bg-background font-sans selection:bg-primary/20 selection:text-primary">
    <!-- Desktop Left Brand Panel (Static 100vh, non-scrollable) -->
    <div class="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-between p-10 bg-[#ebece8] dark:bg-muted border-r border-border lg:h-screen lg:sticky lg:top-0">
      <div></div>

      <!-- Center Brand Identity -->
      <div class="flex flex-col items-center text-center max-w-lg mx-auto py-12">
        <img class="w-auto h-24 xl:h-28 object-contain" src="@/assets/kontaq-logo.svg" alt="KontaQ" />
        <h1 class="mt-7 text-3xl xl:text-4xl font-extrabold tracking-tight text-primary text-balance">
          Komunitas Tadabbur Al-Qur&rsquo;an
        </h1>
        <p class="mt-2 text-base xl:text-lg font-bold tracking-wide text-accent text-balance">
          Raih Keberkahan Hidup bersama Al-Qur&rsquo;an
        </p>
      </div>

      <!-- Footer Badge -->
      <div class="text-xs text-muted-foreground text-center">
        &copy; Komunitas Tadabbur Al-Qur'an (KontaQ). All rights reserved. &middot;
        <a
          href="https://kontaq.org"
          target="_blank"
          rel="noopener noreferrer"
          class="underline underline-offset-2 hover:text-primary transition-colors"
        >kontaq.org</a>
      </div>
    </div>

    <!-- Right Content Area (Scrollable independently if form is tall) -->
    <div class="flex flex-col justify-between p-6 sm:p-10 lg:col-span-6 xl:col-span-5 bg-background lg:h-screen lg:overflow-y-auto">
      <!-- Mobile Top Brand Identity -->
      <div class="flex flex-col items-center text-center lg:hidden mb-6">
        <img class="w-auto h-12 sm:h-14 object-contain" src="@/assets/kontaq-logo.svg" alt="KontaQ" />
        <p class="mt-3 text-lg sm:text-xl font-extrabold tracking-tight text-primary text-balance">
          Komunitas Tadabbur Al-Qur&rsquo;an
        </p>
        <p class="mt-1 text-xs sm:text-sm font-bold tracking-wide text-accent text-balance">
          Raih Keberkahan Hidup bersama Al-Qur&rsquo;an
        </p>
      </div>

      <!-- Main Slot Container -->
      <div class="flex items-center justify-center flex-1 py-4">
        <div class="w-full max-w-md lg:max-w-xl transition-all duration-300">
          <slot />
        </div>
      </div>

      <div class="text-xs text-center text-muted-foreground/60 pt-4 lg:hidden">
        &copy; Komunitas Tadabbur Al-Qur'an (KontaQ) &middot;
        <a
          href="https://kontaq.org"
          target="_blank"
          rel="noopener noreferrer"
          class="underline underline-offset-2 hover:text-primary transition-colors"
        >kontaq.org</a>
      </div>
    </div>
  </main>
</template>
