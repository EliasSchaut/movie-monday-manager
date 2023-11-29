<template>
  <footer class="bg-white dark:bg-gray-800">
    <!-- debug -->
    <div class="text-gray-500 dark:text-gray-300">
      <button @click="auth.logged_in = !auth.logged_in">
        logged_in: {{ auth.logged_in }}
      </button>
    </div>

    <div class="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
      <nav
        class="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
        :aria-label="$t('footer.title')"
      >
        <div v-for="item in navigation.main" :key="item.name" class="pb-6">
          <a
            :href="item.href"
            class="text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-400"
            >{{ item.name }}</a
          >
        </div>
      </nav>
      <div class="mt-10 flex justify-center space-x-10">
        <a
          v-for="item in navigation.social"
          :key="item.name"
          :href="item.href"
          class="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          target="_blank"
        >
          <span class="sr-only">{{ item.name }}</span>
          <component :is="item.icon" class="h-6 w-6" aria-hidden="true" />
        </a>
      </div>
      <p
        class="mt-10 text-center text-xs leading-5 text-gray-500 dark:text-gray-300"
      >
        &copy; 2023 Elias Lorenz Schaut
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue';
import { authStore } from '~/store/auth';

const auth = authStore();
const navigation = {
  main: [
    { name: 'About', href: '#' },
    { name: 'Imprint', href: '#' },
    { name: 'Privacy', href: '#' },
    { name: 'Resources', href: '#' },
  ],
  social: [
    {
      name: 'GitHub',
      href: 'https://github.com/EliasSchaut',
      icon: defineComponent({
        render: () =>
          h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
            h('path', {
              'fill-rule': 'evenodd',
              d: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z',
              'clip-rule': 'evenodd',
            }),
          ]),
      }),
    },
    {
      name: 'Discord',
      href: 'https://discord.gg/vacYz5qpJ3',
      icon: defineComponent({
        render: () =>
          h('svg', { fill: 'currentColor', viewBox: '0 0 127.14 96.36' }, [
            h('path', {
              'fill-rule': 'evenodd',
              d: 'M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z',
              'clip-rule': 'evenodd',
            }),
          ]),
      }),
    },
  ],
};
</script>
