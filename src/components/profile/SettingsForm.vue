<script setup>
import useLocalStorage from '@/plugins/localStorage'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const fontPref = useLocalStorage('font-family', 'sans');
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-6">
    <div class="sm:col-span-3">
      <FormField name="font">
        <FormItem>
          <FormLabel>Font</FormLabel>

          <Select v-model="fontPref">
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Pilih font tampilan" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="sans">
                  Sans Serif
                </SelectItem>
                <SelectItem value="arial">
                  Arial
                </SelectItem>
                <SelectItem value="times">
                  Times New Roman
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormItem>
      </FormField>
    </div>
  </div>
</template>