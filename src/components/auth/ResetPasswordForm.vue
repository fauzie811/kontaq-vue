<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { LoaderCircle, Lock, Eye, EyeOff, KeyRound, ArrowLeft } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { resetPassword } from '@/api';
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
const route = useRoute();
const isLoading = ref(false);
const showPassword = ref(false);
const showPasswordConfirmation = ref(false);

const formSchema = toTypedSchema(
  z.object({
    password: z.string().min(8, 'Password minimal 8 karakter'),
    password_confirmation: z.string()
  }).refine((data) => data.password === data.password_confirmation, {
    message: 'Password tidak sama',
    path: ['password_confirmation']
  })
);

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  try {
    await resetPassword({
      token: route.params.token,
      email: route.query.email,
      password: values.password,
      password_confirmation: values.password_confirmation
    });
    toast.success('Password berhasil direset. Silakan login dengan password baru.');
    router.push({ name: 'login' });
  } catch (e) {
    toast.error(e?.message || e || 'Gagal mereset password. Silakan coba lagi.');
  }
  isLoading.value = false;
});
</script>

<template>
  <div class="bg-card text-card-foreground border border-border/80 rounded-2xl shadow-xl shadow-primary/5 p-6 sm:p-8 space-y-6">
    <!-- Header -->
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="text-2xl font-bold">Reset Password</h1>
      <p class="text-sm text-balance text-muted-foreground">
        Masukkan password baru Anda.
      </p>
    </div>

    <!-- Form -->
    <form @submit="onSubmit" class="space-y-5">
      <FormField v-slot="{ componentField }" name="password" :validate-on-blur="!isFieldDirty">
        <FormItem>
          <FormLabel class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password Baru</FormLabel>
          <FormControl>
            <div class="relative flex items-center">
              <Lock class="absolute left-3.5 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
              <Input
                :type="showPassword ? 'text' : 'password'"
                placeholder="Min. 8 karakter"
                autocomplete="new-password"
                v-bind="componentField"
                required
                :disabled="isLoading"
                class="pl-10 pr-11 h-11 border-border/80 focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                tabindex="-1"
                class="absolute right-3.5 p-1 text-muted-foreground/70 hover:text-foreground transition-colors rounded-lg focus:outline-none"
              >
                <EyeOff v-if="showPassword" class="w-4 h-4" />
                <Eye v-else class="w-4 h-4" />
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="password_confirmation" :validate-on-blur="!isFieldDirty">
        <FormItem>
          <FormLabel class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Konfirmasi Password Baru</FormLabel>
          <FormControl>
            <div class="relative flex items-center">
              <Lock class="absolute left-3.5 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
              <Input
                :type="showPasswordConfirmation ? 'text' : 'password'"
                placeholder="Ulangi password baru"
                autocomplete="new-password"
                v-bind="componentField"
                required
                :disabled="isLoading"
                class="pl-10 pr-11 h-11 border-border/80 focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
              />
              <button
                type="button"
                @click="showPasswordConfirmation = !showPasswordConfirmation"
                tabindex="-1"
                class="absolute right-3.5 p-1 text-muted-foreground/70 hover:text-foreground transition-colors rounded-lg focus:outline-none"
              >
                <EyeOff v-if="showPasswordConfirmation" class="w-4 h-4" />
                <Eye v-else class="w-4 h-4" />
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button
        type="submit"
        size="lg"
        class="w-full h-11 mt-2 font-semibold shadow-md shadow-primary/20 active:scale-[0.98] transition-all gap-2"
        :disabled="isLoading"
      >
        <LoaderCircle v-if="isLoading" class="w-4 h-4 animate-spin" />
        <KeyRound v-else class="w-4 h-4" />
        <span>{{ isLoading ? 'Menyimpan...' : 'Simpan Password Baru' }}</span>
      </Button>
    </form>

    <!-- Footer -->
    <div class="pt-4 border-t border-border/60 text-center text-sm text-muted-foreground">
      <router-link
        to="/login"
        class="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline underline-offset-4 transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Kembali ke Login</span>
      </router-link>
    </div>
  </div>
</template>