<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { LoaderCircle } from 'lucide-vue-next';
import { toast } from 'vue-sonner'
import { getUser, getProfile, updateProfile } from '@/api';
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

const isLoading = ref(true);

const formSchema = toTypedSchema(z.object({
  name: z.string().min(1, 'Nama lengkap harus diisi'),
  nickname: z.string().min(1, 'Nama panggilan harus diisi'),
  gender: z.enum(['m', 'f'], {
    required_error: 'Pilih jenis kelamin',
  }),
  age: z.number().min(10, 'Usia minimal 10 tahun'),
  address: z.string().min(1, 'Alamat harus diisi'),
  occupation: z.string().min(1, 'Pekerjaan harus diisi'),
  phone: z.string().min(1, 'Nomor HP harus diisi'),
  email: z.string().email('Email tidak valid'),
  motivation: z.string().min(1, 'Motivasi harus diisi'),
}));

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
});

const loadProfile = async () => {
  const { data: profile } = await getProfile();

  resetForm({ values: profile });
  isLoading.value = false;
};
loadProfile();

const doSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  try {
    await updateProfile(values);
    getUser();
    toast.success('Profil berhasil diperbarui');
  } catch (e) {
    toast.error(e);
  }
  isLoading.value = false;
});
</script>

<template>
  <form @submit="doSubmit" class="space-y-6">
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
    </div>

    <Button type="submit" :disabled="isLoading">
      <LoaderCircle v-if="isLoading" class="w-4 h-4 animate-spin" />
      Simpan Perubahan
    </Button>
  </form>
</template>