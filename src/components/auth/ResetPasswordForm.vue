<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { LoaderCircle } from 'lucide-vue-next';
import { toast } from 'vue-sonner'
import { resetPassword } from '@/api';
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
const route = useRoute();
const isLoading = ref(false);

const formSchema = toTypedSchema(z.object({
  password: z.string().min(8, 'Password minimal 8 karakter'),
  password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
  message: "Password tidak sama",
  path: ["password_confirmation"]
}))

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  try {
    await resetPassword({
      token: route.params.token,
      email: route.query.email,
      password: values.password,
      password_confirmation: values.password_confirmation
    });
    toast.success('Password berhasil direset');
    router.push({ name: 'login' });
  } catch (e) {
    toast.error(e);
  }
  isLoading.value = false;
});
</script>

<template>
  <form @submit="onSubmit" class="flex flex-col gap-6">
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="text-2xl font-bold">Reset Password</h1>
      <p class="text-sm text-balance text-muted-foreground">
        Masukkan password baru Anda.
      </p>
    </div>
    <div class="grid gap-6">
      <FormField v-slot="{ componentField }" name="password" :validate-on-blur="!isFieldDirty">
        <FormItem>
          <FormLabel>Password Baru</FormLabel>
          <FormControl>
            <Input type="password" autocomplete="new-password" v-bind="componentField" required :disabled="isLoading" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="password_confirmation" :validate-on-blur="!isFieldDirty">
        <FormItem>
          <FormLabel>Konfirmasi Password</FormLabel>
          <FormControl>
            <Input type="password" autocomplete="new-password" v-bind="componentField" required :disabled="isLoading" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit" class="w-full" :disabled="isLoading">
        <LoaderCircle v-if="isLoading" class="w-4 h-4 animate-spin" />
        Reset Password
      </Button>
    </div>
    <div class="text-sm text-center">
      <router-link to="/login" class="underline underline-offset-4">Kembali ke Login</router-link>
    </div>
  </form>
</template>