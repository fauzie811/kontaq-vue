<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
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

const router = useRouter();

// Order follows the 2-column mockup: left/right pairs, row by row.
const fields = [
  { name: 'name', label: 'Nama Lengkap', type: 'text', autocomplete: 'name' },
  { name: 'nickname', label: 'Nama Panggilan', type: 'text', autocomplete: 'nickname' },
  { name: 'gender', label: 'Jenis Kelamin', type: 'select' },
  { name: 'age', label: 'Usia', type: 'number' },
  { name: 'phone', label: 'Nomor HP', type: 'tel', autocomplete: 'tel' },
  { name: 'email', label: 'E-mail', type: 'email', autocomplete: 'email' },
  { name: 'occupation', label: 'Pekerjaan', type: 'text' },
  { name: 'address', label: 'Alamat', type: 'text', autocomplete: 'street-address' },
  { name: 'motivation', label: 'Motivasi ikut KontaQ', type: 'text', full: true },
];

const boxClass = 'peer h-14 rounded-none border-0 bg-muted px-5 pt-5 pb-1 text-base text-foreground placeholder:text-transparent hover:border-0 focus:ring-2 focus:ring-primary/40';
const labelClass = 'pointer-events-none absolute left-5 top-2 text-[11px] font-medium text-primary transition-all';
const labelEmptyClass = 'top-1/2 -translate-y-1/2 text-base';
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
    router.push({ name: 'home' });
  } catch (e) {
    toast.error(e);
  }
  isLoading.value = false;
});
</script>

<template>
  <form @submit="doSubmit" novalidate>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-16 gap-y-5 sm:gap-y-6">
      <FormField v-for="f in fields" :key="f.name" :name="f.name" v-slot="{ componentField, value }">
        <FormItem :class="f.full && 'md:col-span-2'">
          <div class="relative">
            <FormControl>
              <select
                  v-if="f.type === 'select'"
                  :name="componentField.name"
                  :value="value"
                  @blur="componentField.onBlur"
                  @change="componentField['onUpdate:modelValue']($event.target.value)"
                  :disabled="isLoading"
                  class="h-14 w-full appearance-none rounded-none border-0 bg-muted bg-none px-5 pt-5 pb-1 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 cursor-pointer"
                  :class="!value && 'text-transparent'"
                >
                  <option value="" disabled hidden></option>
                  <option value="m" class="text-foreground">Laki-laki</option>
                  <option value="f" class="text-foreground">Perempuan</option>
                </select>
              <Input
                v-else
                v-bind="componentField"
                :type="f.type"
                :autocomplete="f.autocomplete"
                placeholder=" "
                :disabled="isLoading"
                :class="boxClass"
              />
            </FormControl>
            <FormLabel
              :class="[
                labelClass,
                f.type === 'select'
                  ? !value && labelEmptyClass
                  : 'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px]',
              ]"
            >
              {{ f.label }}<span class="text-destructive">*</span>
            </FormLabel>
            <span
              v-if="f.type === 'select'"
              aria-hidden="true"
              class="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-accent text-xs"
            >▼</span>
          </div>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <div class="mt-8 flex justify-end">
      <Button type="submit" :disabled="isLoading" class="h-11 px-8 text-base">
        <LoaderCircle v-if="isLoading" class="w-4 h-4 animate-spin" />
        Simpan
      </Button>
    </div>
  </form>
</template>
