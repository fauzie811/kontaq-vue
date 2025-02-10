<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { LoaderCircle } from 'lucide-vue-next';
import { toast } from 'vue-sonner'
import { login } from '@/api';
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
  username: z.string(),
  password: z.string(),
}))

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
})

const doLogin = handleSubmit(async (values) => {
  isLoading.value = true;
  try {
    await login({
      login: values.username,
      password: values.password,
    });
    router.replace({ name: 'home' });
  } catch (e) {
    toast.error(e);
  }
  isLoading.value = false;
});
</script>

<template>
  <form @submit="doLogin" class="flex flex-col gap-6">
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="text-2xl font-bold">Assalamu'alaikum</h1>
      <p class="text-sm text-balance text-muted-foreground">
        Silakan login terlebih dahulu.
      </p>
    </div>
    <div class="grid gap-6">
      <FormField v-slot="{ componentField }" name="username" :validate-on-blur="!isFieldDirty">
        <FormItem>
          <FormLabel>ID Kontaq</FormLabel>
          <FormControl>
            <Input type="text" autocomplete="username" v-bind="componentField" required :disabled="isLoading" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="password" :validate-on-blur="!isFieldDirty">
        <FormItem>
          <div class="flex items-center">
            <FormLabel>Password</FormLabel>
            <router-link to="/forgot-password" class="ml-auto text-sm underline-offset-4 hover:underline">
              Lupa password?
            </router-link>
          </div>
          <FormControl>
            <Input type="password" autocomplete="current-password" v-bind="componentField" required
              :disabled="isLoading" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <Button type="submit" :disabled="isLoading">
        <LoaderCircle v-if="isLoading" class="w-4 h-4 animate-spin" />
        Masuk
      </Button>
    </div>
    <div class="text-sm text-center">
      Belum punya akun?
      <router-link to="/register" class="underline underline-offset-4">Daftar sekarang</router-link>
    </div>
  </form>
</template>