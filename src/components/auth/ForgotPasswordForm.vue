<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { LoaderCircle } from 'lucide-vue-next';
import { toast } from 'vue-sonner'
import { forgotPassword } from '@/api';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input';

const router = useRouter();
const isLoading = ref(false);

const formSchema = toTypedSchema(z.object({
  email: z.string().email('Email tidak valid'),
}))

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  try {
    const { success, message } = await forgotPassword(values.email);
    if (success) {
      toast.success('Link reset password telah dikirim ke email Anda');
      router.push({ name: 'login' });
    } else {
      toast.error(message);
    }
  } catch (e) {
    toast.error(e);
  }
  isLoading.value = false;
});
</script>

<template>
  <form @submit="onSubmit" class="flex flex-col gap-6">
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="text-2xl font-bold">Lupa Password</h1>
      <p class="text-sm text-balance text-muted-foreground">
        Masukkan email Anda untuk mendapatkan link reset password.
      </p>
    </div>
    <div class="grid gap-6">
      <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" autocomplete="email" v-bind="componentField" required :disabled="isLoading" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit" class="w-full" :disabled="isLoading">
        <LoaderCircle v-if="isLoading" class="w-4 h-4 animate-spin" />
        Kirim Link Reset
      </Button>
    </div>
    <div class="text-sm text-center">
      <router-link to="/login" class="underline underline-offset-4">Kembali ke Login</router-link>
    </div>
  </form>
</template>