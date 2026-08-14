<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import {
  LoaderCircle,
  User,
  Tag,
  Calendar,
  MapPin,
  Briefcase,
  Phone,
  Mail,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  UserPlus
} from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { register } from '@/api';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';

const router = useRouter();
const isLoading = ref(false);
const showPassword = ref(false);
const showPasswordConfirmation = ref(false);

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, { message: 'Nama lengkap harus diisi' }),
    nickname: z.string().min(1, { message: 'Nama panggilan harus diisi' }),
    gender: z.enum(['m', 'f'], {
      required_error: 'Pilih jenis kelamin',
    }),
    age: z.number({ invalid_type_error: 'Usia harus angka' }).min(10, { message: 'Usia minimal 10 tahun' }),
    address: z.string().min(1, { message: 'Alamat harus diisi' }),
    occupation: z.string().min(1, { message: 'Pekerjaan harus diisi' }),
    phone: z.string().min(1, { message: 'Nomor HP harus diisi' }),
    email: z.string().email({ message: 'Email tidak valid' }),
    motivation: z.string().min(1, { message: 'Motivasi harus diisi' }),
    password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
    password_confirmation: z.string(),
  }).refine((data) => data.password === data.password_confirmation, {
    message: 'Password tidak cocok',
    path: ['password_confirmation'],
  })
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const doRegister = handleSubmit(async (values) => {
  isLoading.value = true;
  try {
    await register(values);
    toast.success('Pendaftaran berhasil! Selamat datang di KontaQ.');
    router.replace({ name: 'home' });
  } catch (e) {
    toast.error(e?.message || e || 'Gagal mendaftar. Silakan periksa kembali data Anda.');
  }
  isLoading.value = false;
});
</script>

<template>
  <div class="bg-card text-card-foreground border border-border/80 rounded-2xl shadow-xl shadow-primary/5 p-6 sm:p-8 space-y-6">
    <!-- Header -->
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="text-2xl sm:text-3xl font-bold text-foreground font-arabic leading-loose tracking-wide select-none">
        بِسْمِ اللَّهِ، السَّلَامُ عَلَيْكُمْ
      </h1>
      <p class="text-sm text-balance text-muted-foreground">
        Silakan lengkapi formulir berikut untuk mendaftar.
      </p>
    </div>

    <!-- Form -->
    <form @submit="doRegister" class="space-y-6">
      <!-- Section 1: Profil Anggota -->
      <div class="space-y-4">
        <div class="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/50 pb-1">
          Informasi Pribadi
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-6">
          <div class="sm:col-span-4">
            <FormField v-slot="{ componentField }" name="name">
              <FormItem>
                <FormLabel class="text-xs font-medium text-muted-foreground">Nama Lengkap</FormLabel>
                <FormControl>
                  <div class="relative flex items-center">
                    <User class="absolute left-3.5 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="Sesuai KTP / Identitas"
                      autocomplete="name"
                      v-bind="componentField"
                      required
                      :disabled="isLoading"
                      class="pl-10 h-10 border-border/80 focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="sm:col-span-2">
            <FormField v-slot="{ componentField }" name="nickname">
              <FormItem>
                <FormLabel class="text-xs font-medium text-muted-foreground">Panggilan</FormLabel>
                <FormControl>
                  <div class="relative flex items-center">
                    <Tag class="absolute left-3.5 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="Nama sapaan"
                      v-bind="componentField"
                      required
                      :disabled="isLoading"
                      class="pl-10 h-10 border-border/80 focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="sm:col-span-4">
            <FormField v-slot="{ componentField }" name="gender">
              <FormItem>
                <FormLabel class="text-xs font-medium text-muted-foreground">Jenis Kelamin</FormLabel>
                <FormControl>
                  <RadioGroup v-bind="componentField" class="grid grid-cols-2 gap-3" :disabled="isLoading">
                    <label
                      for="gender-m"
                      class="flex items-center gap-2.5 px-3 py-2 border border-border/80 rounded-xl cursor-pointer transition-all hover:bg-accent/40 has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:ring-1 has-[:checked]:ring-primary/20"
                    >
                      <RadioGroupItem value="m" id="gender-m" />
                      <span class="text-sm font-medium">Laki-laki</span>
                    </label>
                    <label
                      for="gender-f"
                      class="flex items-center gap-2.5 px-3 py-2 border border-border/80 rounded-xl cursor-pointer transition-all hover:bg-accent/40 has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:ring-1 has-[:checked]:ring-primary/20"
                    >
                      <RadioGroupItem value="f" id="gender-f" />
                      <span class="text-sm font-medium">Perempuan</span>
                    </label>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="sm:col-span-2">
            <FormField v-slot="{ componentField }" name="age">
              <FormItem>
                <FormLabel class="text-xs font-medium text-muted-foreground">Usia (Tahun)</FormLabel>
                <FormControl>
                  <div class="relative flex items-center">
                    <Calendar class="absolute left-3.5 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
                    <Input
                      type="number"
                      placeholder="Thn"
                      v-bind="componentField"
                      required
                      :disabled="isLoading"
                      class="pl-10 h-10 border-border/80 focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>
      </div>

      <!-- Section 2: Domisili & Pekerjaan -->
      <div class="space-y-4">
        <div class="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/50 pb-1">
          Domisili & Pekerjaan
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <FormField v-slot="{ componentField }" name="address">
              <FormItem>
                <FormLabel class="text-xs font-medium text-muted-foreground">Alamat Tinggal</FormLabel>
                <FormControl>
                  <div class="relative flex items-center">
                    <MapPin class="absolute left-3.5 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="Kota / Kabupaten tempat tinggal"
                      v-bind="componentField"
                      required
                      :disabled="isLoading"
                      class="pl-10 h-10 border-border/80 focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="sm:col-span-2">
            <FormField v-slot="{ componentField }" name="occupation">
              <FormItem>
                <FormLabel class="text-xs font-medium text-muted-foreground">Pekerjaan / Aktivitas</FormLabel>
                <FormControl>
                  <div class="relative flex items-center">
                    <Briefcase class="absolute left-3.5 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="Contoh: Karyawan, Pelajar, Wiraswasta"
                      v-bind="componentField"
                      required
                      :disabled="isLoading"
                      class="pl-10 h-10 border-border/80 focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>
      </div>

      <!-- Section 3: Kontak & Motivasi -->
      <div class="space-y-4">
        <div class="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/50 pb-1">
          Kontak & Motivasi
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FormField v-slot="{ componentField }" name="phone">
              <FormItem>
                <FormLabel class="text-xs font-medium text-muted-foreground">Nomor HP / WhatsApp</FormLabel>
                <FormControl>
                  <div class="relative flex items-center">
                    <Phone class="absolute left-3.5 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
                    <Input
                      type="tel"
                      placeholder="0812xxxxxxx"
                      v-bind="componentField"
                      required
                      :disabled="isLoading"
                      class="pl-10 h-10 border-border/80 focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div>
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel class="text-xs font-medium text-muted-foreground">Email</FormLabel>
                <FormControl>
                  <div class="relative flex items-center">
                    <Mail class="absolute left-3.5 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
                    <Input
                      type="email"
                      placeholder="alamat@email.com"
                      autocomplete="email"
                      v-bind="componentField"
                      required
                      :disabled="isLoading"
                      class="pl-10 h-10 border-border/80 focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="sm:col-span-2">
            <FormField v-slot="{ componentField }" name="motivation">
              <FormItem>
                <FormLabel class="text-xs font-medium text-muted-foreground">Motivasi Ikut KontaQ</FormLabel>
                <FormControl>
                  <div class="relative flex items-center">
                    <Sparkles class="absolute left-3.5 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="Alasan bergabung dan harapan Anda"
                      v-bind="componentField"
                      required
                      :disabled="isLoading"
                      class="pl-10 h-10 border-border/80 focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>
      </div>

      <!-- Section 4: Keamanan Akun -->
      <div class="space-y-4">
        <div class="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/50 pb-1">
          Keamanan Akun
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel class="text-xs font-medium text-muted-foreground">Password</FormLabel>
                <FormControl>
                  <div class="relative flex items-center">
                    <Lock class="absolute left-3.5 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
                    <Input
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="Min. 6 karakter"
                      autocomplete="new-password"
                      v-bind="componentField"
                      required
                      :disabled="isLoading"
                      class="pl-10 pr-10 h-10 border-border/80 focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
                    />
                    <button
                      type="button"
                      @click="showPassword = !showPassword"
                      tabindex="-1"
                      class="absolute right-3 p-1 text-muted-foreground/70 hover:text-foreground transition-colors rounded-lg focus:outline-none"
                    >
                      <EyeOff v-if="showPassword" class="w-3.5 h-3.5" />
                      <Eye v-else class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div>
            <FormField v-slot="{ componentField }" name="password_confirmation">
              <FormItem>
                <FormLabel class="text-xs font-medium text-muted-foreground">Konfirmasi Password</FormLabel>
                <FormControl>
                  <div class="relative flex items-center">
                    <Lock class="absolute left-3.5 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
                    <Input
                      :type="showPasswordConfirmation ? 'text' : 'password'"
                      placeholder="Ulangi password"
                      autocomplete="new-password"
                      v-bind="componentField"
                      required
                      :disabled="isLoading"
                      class="pl-10 pr-10 h-10 border-border/80 focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
                    />
                    <button
                      type="button"
                      @click="showPasswordConfirmation = !showPasswordConfirmation"
                      tabindex="-1"
                      class="absolute right-3 p-1 text-muted-foreground/70 hover:text-foreground transition-colors rounded-lg focus:outline-none"
                    >
                      <EyeOff v-if="showPasswordConfirmation" class="w-3.5 h-3.5" />
                      <Eye v-else class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        class="w-full h-11 font-semibold shadow-md shadow-primary/20 active:scale-[0.98] transition-all gap-2"
        :disabled="isLoading"
      >
        <LoaderCircle v-if="isLoading" class="w-4 h-4 animate-spin" />
        <UserPlus v-else class="w-4 h-4" />
        <span>{{ isLoading ? 'Memproses Pendaftaran...' : 'Daftar Sekarang' }}</span>
      </Button>
    </form>

    <!-- Footer -->
    <div class="pt-4 border-t border-border/60 text-center text-sm text-muted-foreground">
      Sudah punya akun?
      <router-link
        to="/login"
        class="ml-1 text-primary font-semibold hover:underline underline-offset-4 transition-colors"
      >
        Login di sini
      </router-link>
    </div>
  </div>
</template>