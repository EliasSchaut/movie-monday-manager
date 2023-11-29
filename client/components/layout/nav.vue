<template>
  <Disclosure
    as="nav"
    class="bg-white shadow dark:bg-gray-800"
    v-slot="{ open }"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 justify-between">
        <div class="flex">
          <!-- NavBar left side -->
          <div class="flex flex-shrink-0 items-center">
            <IconCompany class="block h-8 lg:hidden" />
            <IconCompany class="hidden h-8 lg:block" />
          </div>
          <div
            class="hidden border-t dark:border-t-gray-800 sm:ml-6 sm:flex sm:space-x-8"
          >
            <NuxtLink
              v-for="link in navigation"
              :to="link.href"
              :class="[
                $route.path === link.href
                  ? 'border-indigo-500 text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white',
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
              ]"
              >{{ link.name }}</NuxtLink
            >
          </div>
        </div>

        <!-- NavBar right side -->
        <div class="flex flex-1 items-center justify-end gap-x-6">
          <!-- Settings -->
          <SettingLang class="hidden sm:block" />
          <SettingTheme class="hidden sm:block" />
          <span
            class="hidden h-6 w-px bg-gray-300 sm:block"
            aria-hidden="true"
          />
          <!-- Mobile: Profile dropdown -->
          <div v-if="auth.logged_in" class="hidden sm:flex sm:items-center">
            <Menu as="div" class="relative ml-3">
              <div>
                <MenuButton
                  class="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800 dark:focus:ring-white dark:focus:ring-offset-gray-800"
                >
                  <span class="sr-only">{{
                    $t('common.sr.open_user_menu')
                  }}</span>
                  <img
                    class="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </MenuButton>
              </div>
              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <MenuItem v-slot="{ active }">
                    <NuxtLink
                      to="/profile/settings"
                      :class="[
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700',
                      ]"
                      >{{ $t('nav.profile') }}</NuxtLink
                    >
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <NuxtLink
                      to="profile/settings"
                      :class="[
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700',
                      ]"
                      >{{ $t('nav.settings') }}</NuxtLink
                    >
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <NuxtLink
                      to="/logout"
                      :class="[
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700',
                      ]"
                      >{{ $t('nav.sign_out') }}</NuxtLink
                    >
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
          <!-- Computer: Log In / Sign Up -->
          <div v-else class="flex items-center justify-end gap-x-6">
            <NuxtLink
              to="/login"
              class="hidden text-sm font-semibold leading-6 text-gray-900 dark:text-white sm:block"
              >{{ $t('nav.login') }}</NuxtLink
            >
            <NuxtLink
              to="/sign_up"
              class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >{{ $t('nav.sign_up') }}</NuxtLink
            >
          </div>
          <div class="-mr-2 flex items-center sm:hidden">
            <!-- Mobile menu button -->
            <DisclosureButton
              class="-ml-2.5 mr-2.5 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-white"
            >
              <span class="sr-only">{{ $t('common.sr.open_main_menu') }}</span>
              <Bars3Icon
                v-if="!open"
                class="block h-6 w-6"
                aria-hidden="true"
              />
              <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
        </div>
      </div>
    </div>

    <!-- NavBar Panel mobile -->
    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 pb-3 pt-2">
        <DisclosureButton
          v-for="link in navigation"
          :as="NuxtLink"
          :to="link.href"
          :class="[
            $route.path === link.href
              ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-gray-900 dark:text-white'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
            'block border-l-4 py-2 pl-3 pr-4 text-base font-medium',
          ]"
          >{{ link.name }}</DisclosureButton
        >
      </div>
      <div v-if="auth.logged_in" class="border-t border-gray-200 pb-3 pt-4">
        <div class="flex items-center px-4">
          <div class="flex-shrink-0">
            <img
              class="h-10 w-10 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-gray-800 dark:text-white">
              Tom Cook
            </div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              tom@example.com
            </div>
          </div>
        </div>
        <div class="mt-3 space-y-1">
          <DisclosureButton
            :as="NuxtLink"
            to="/profile"
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >{{ $t('nav.profile') }}</DisclosureButton
          >
          <DisclosureButton
            :as="NuxtLink"
            to="/settings"
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >{{ $t('nav.settings') }}</DisclosureButton
          >
          <DisclosureButton
            :as="NuxtLink"
            to="/logout"
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >{{ $t('nav.sign_out') }}</DisclosureButton
          >
        </div>
      </div>
      <div
        v-else
        class="border-t border-gray-200 pb-3 pt-4 dark:border-gray-700"
      >
        <DisclosureButton
          :as="NuxtLink"
          to="/login"
          class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >{{ $t('nav.login') }}</DisclosureButton
        >
      </div>
      <div
        class="flex gap-x-4 border-t border-gray-200 pb-3 pt-4 dark:border-gray-700"
      >
        <SettingLang class="pl-4" />
        <SettingTheme />
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/vue';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { authStore } from '~/store/auth';
import { NuxtLink } from '#components';

export default defineComponent({
  name: 'LayoutNav',
  computed: {
    NuxtLink() {
      return NuxtLink;
    },
  },
  setup() {
    return {
      auth: authStore(),
    };
  },
  data() {
    return {
      navigation: [
        {
          name: 'Home',
          href: '/',
        },
      ] as Array<{ name: string; href: string }>,
    };
  },
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Bars3Icon,
    BellIcon,
    XMarkIcon,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
