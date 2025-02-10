<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { LoaderCircle } from 'lucide-vue-next';
import { toast } from 'vue-sonner'
import { register } from '@/api';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';

const router = useRouter();
const isLoading = ref(false);

const formSchema = toTypedSchema(z.object({
  name: z.string().min(1, { message: 'Nama lengkap harus diisi' }),
  nickname: z.string().min(1, { message: 'Nama panggilan harus diisi' }),
  gender: z.enum(['m', 'f'], {
    required_error: 'Pilih jenis kelamin',
  }),
  age: z.number().min(10, { message: 'Usia minimal 10 tahun' }),
  address: z.string().min(1, { message: 'Alamat harus diisi' }),
  occupation: z.string().min(1, { message: 'Pekerjaan harus diisi' }),
  phone: z.string().min(1, { message: 'Nomor HP harus diisi' }),
  email: z.string().email({ message: 'Email tidak valid' }),
  motivation: z.string().min(1, { message: 'Motivasi harus diisi' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
  password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
  message: "Password tidak cocok",
  path: ["password_confirmation"],
}));

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const doRegister = handleSubmit(async (values) => {
  isLoading.value = true;
  try {
    await register(values);
    router.replace({ name: 'home' });
  } catch (e) {
    toast.error(e);
  }
  isLoading.value = false;
});
</script>

<template>
  <form @submit="doRegister" class="flex flex-col gap-6">
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="text-2xl font-bold">Assalamu'alaikum</h1>
      <p class="text-sm text-balance text-muted-foreground">
        Silakan lengkapi formulir berikut untuk mendaftar.
      </p>
    </div>

    <div class="grid gap-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-6">
        <div class="sm:col-span-4">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input type="text" autocomplete="name" v-bind="componentField" required :disabled="isLoading" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="sm:col-span-2">
          <FormField v-slot="{ componentField }" name="nickname">
            <FormItem>
              <FormLabel>Panggilan</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" required :disabled="isLoading" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="sm:col-span-4">
          <FormField v-slot="{ componentField }" name="gender">
            <FormItem>
              <FormLabel>Jenis Kelamin</FormLabel>
              <FormControl>
                <RadioGroup v-bind="componentField" class="grid grid-cols-2 gap-2" :disabled="isLoading">
                  <div class="flex items-center">
                    <RadioGroupItem value="m" id="gender-m" />
                    <label for="gender-m" class="ml-2">Laki-laki</label>
                  </div>
                  <div class="flex items-center">
                    <RadioGroupItem value="f" id="gender-f" />
                    <label for="gender-f" class="ml-2">Perempuan</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="sm:col-span-2">
          <FormField v-slot="{ componentField }" name="age">
            <FormItem>
              <FormLabel>Usia</FormLabel>
              <FormControl>
                <Input type="number" v-bind="componentField" required :disabled="isLoading" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="col-span-full">
          <FormField v-slot="{ componentField }" name="address">
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" required :disabled="isLoading" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="col-span-full">
          <FormField v-slot="{ componentField }" name="occupation">
            <FormItem>
              <FormLabel>Pekerjaan</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" required :disabled="isLoading" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="sm:col-span-3">
          <FormField v-slot="{ componentField }" name="phone">
            <FormItem>
              <FormLabel>Nomor HP</FormLabel>
              <FormControl>
                <Input type="tel" v-bind="componentField" required :disabled="isLoading" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="sm:col-span-3">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autocomplete="email" v-bind="componentField" required :disabled="isLoading" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="col-span-full">
          <FormField v-slot="{ componentField }" name="motivation">
            <FormItem>
              <FormLabel>Motivasi Ikut KontaQ</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" required :disabled="isLoading" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="sm:col-span-3">
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" autocomplete="new-password" v-bind="componentField" required
                  :disabled="isLoading" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="sm:col-span-3">
          <FormField v-slot="{ componentField }" name="password_confirmation">
            <FormItem>
              <FormLabel>Konfirmasi Password</FormLabel>
              <FormControl>
                <Input type="password" autocomplete="new-password" v-bind="componentField" required
                  :disabled="isLoading" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </div>

      <Button type="submit" :disabled="isLoading">
        <LoaderCircle v-if="isLoading" class="w-4 h-4 animate-spin" />
        Mendaftar
      </Button>
    </div>

    <div class="text-sm text-center">
      Sudah punya akun?
      <router-link to="/login" class="underline underline-offset-4">Login</router-link>
    </div>
  </form>
</template>