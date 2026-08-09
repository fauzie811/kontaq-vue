<script setup>
import PageHeader from '@/components/PageHeader.vue';
import { ProfileForm, SettingsForm } from '@/components/profile';
import {
  Card,
  CardContent,
} from '@/components/ui/card'
</script>

<template>
  <div>
    <PageHeader page-title="Profil" />
    <div class="divide-y divide-border">
      <div class="grid grid-cols-1 py-16 gap-x-8 gap-y-10 md:grid-cols-3">
        <div>
          <h2 class="text-base font-semibold leading-7 text-foreground">Informasi Pribadi</h2>
          <!-- <p class="mt-1 text-sm leading-6 text-muted-foreground">Use a permanent address where you can receive mail.</p> -->
        </div>

        <Card class="pt-6 md:col-span-2">
          <CardContent>
            <ProfileForm />
          </CardContent>
        </Card>
      </div>

      <div class="grid grid-cols-1 py-16 gap-x-8 gap-y-10 md:grid-cols-3">
        <div>
          <h2 class="text-base font-semibold leading-7 text-foreground">Pengaturan</h2>
          <!-- <p class="mt-1 text-sm leading-6 text-muted-foreground">Use a permanent address where you can receive mail.</p> -->
        </div>

        <Card class="pt-6 md:col-span-2">
          <CardContent>
            <SettingsForm />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
