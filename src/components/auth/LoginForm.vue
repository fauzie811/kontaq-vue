<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { LoaderCircle, Eye, EyeOff } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { login } from '@/api';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const router = useRouter();

const isLoading = ref(false);
const showPassword = ref(false);

const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(1, { message: 'ID KontaQ harus diisi' }),
    password: z.string().min(1, { message: 'Password harus diisi' }),
  })
);

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
});

const doLogin = handleSubmit(async (values) => {
  isLoading.value = true;
  try {
    await login({
      login: values.username,
      password: values.password,
    });
    toast.success('Berhasil masuk. Selamat datang kembali!');
    router.replace({ name: 'home' });
  } catch (e) {
    toast.error(e?.message || e || 'Gagal masuk. Periksa kembali ID dan password Anda.');
  }
  isLoading.value = false;
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col items-center gap-2 text-center">
      <img class="w-auto h-8 sm:h-9 object-contain" src="@/assets/kontaq-icon.svg" alt="KontaQ" />
      <div class="space-y-1">
        <p class="text-lg sm:text-xl font-bold text-primary font-quran leading-loose tracking-wide">
          بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
        </p>
        <h1 class="text-xl sm:text-2xl font-bold text-primary font-quran leading-loose tracking-wide select-none">
          السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ
        </h1>
      </div>
      <p class="text-sm text-balance text-muted-foreground mt-2">
        Silakan login terlebih dahulu.
      </p>
    </div>

    <!-- Form -->
    <form @submit="doLogin" class="space-y-5">
      <FormField v-slot="{ componentField }" name="username" :validate-on-blur="!isFieldDirty">
        <FormItem>
          <FormLabel class="text-sm font-semibold text-accent">ID KontaQ</FormLabel>
          <FormControl>
            <div class="relative flex items-center">
              <Input
                type="text"
                placeholder="Masukkan ID KontaQ"
                autocomplete="username"
                v-bind="componentField"
                required
                :disabled="isLoading"
                class="h-11 focus:border-primary focus:ring-primary/20 transition-all rounded-full"
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="password" :validate-on-blur="!isFieldDirty">
        <FormItem>
          <div class="flex items-center justify-between">
            <FormLabel class="text-sm font-semibold text-accent">Password</FormLabel>
            <router-link
              to="/forgot-password"
              class="text-xs font-medium text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
            >
              Lupa password?
            </router-link>
          </div>
          <FormControl>
            <div class="relative flex items-center">
              <Input
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                autocomplete="current-password"
                v-bind="componentField"
                required
                :disabled="isLoading"
                class="pr-11 h-11 focus:border-primary focus:ring-primary/20 transition-all rounded-full"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                tabindex="-1"
                class="absolute right-3.5 p-1 text-muted-foreground/70 hover:text-foreground transition-colors rounded-full focus:outline-none"
                :title="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
              >
                <EyeOff v-if="showPassword" class="w-4 h-4" />
                <Eye v-else class="w-4 h-4" />
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button
        type="submit"
        variant="outline"
        size="lg"
        class="w-full h-11 mt-2 font-semibold border-accent text-amber-700 dark:text-accent hover:bg-accent/10 hover:text-amber-700 dark:hover:text-accent gap-2"
        :disabled="isLoading"
      >
        <LoaderCircle v-if="isLoading" class="w-4 h-4 animate-spin" />
        <span>{{ isLoading ? 'Memproses...' : 'Masuk' }}</span>
      </Button>
    </form>

    <!-- Footer -->
    <div class="pt-4 border-t border-border/60 text-center text-sm text-muted-foreground">
      Belum punya akun?
      <router-link
        to="/register"
        class="ml-1 text-primary font-semibold hover:underline underline-offset-4 transition-colors"
      >
        Daftar sekarang
      </router-link>
    </div>
  </div>
</template>