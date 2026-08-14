<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { LoaderCircle, Mail, Send, ArrowLeft } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { forgotPassword } from '@/api';
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

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email('Email tidak valid'),
  })
);

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  try {
    const res = await forgotPassword(values.email);
    const success = res?.success ?? true;
    const message = res?.message || 'Link reset password telah dikirim ke email Anda';
    if (success) {
      toast.success(message);
      router.push({ name: 'login' });
    } else {
      toast.error(message);
    }
  } catch (e) {
    toast.error(e?.message || e || 'Gagal mengirim link reset password. Periksa kembali email Anda.');
  }
  isLoading.value = false;
});
</script>

<template>
  <div class="bg-card text-card-foreground border border-border/80 rounded-2xl shadow-xl shadow-primary/5 p-6 sm:p-8 space-y-6">
    <!-- Header -->
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="text-2xl font-bold">Lupa Password</h1>
      <p class="text-sm text-balance text-muted-foreground">
        Masukkan email Anda untuk mendapatkan link reset password.
      </p>
    </div>

    <!-- Form -->
    <form @submit="onSubmit" class="space-y-5">
      <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
        <FormItem>
          <FormLabel class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Terdaftar</FormLabel>
          <FormControl>
            <div class="relative flex items-center">
              <Mail class="absolute left-3.5 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
              <Input
                type="email"
                placeholder="nama@email.com"
                autocomplete="email"
                v-bind="componentField"
                required
                :disabled="isLoading"
                class="pl-10 h-11 border-border/80 focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
              />
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
        <Send v-else class="w-4 h-4" />
        <span>{{ isLoading ? 'Mengirim...' : 'Kirim Link Reset' }}</span>
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