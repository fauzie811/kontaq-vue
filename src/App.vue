<template>
  <component :is="$route.meta.layout || 'main'">
    <router-view />
  </component>
</template>
