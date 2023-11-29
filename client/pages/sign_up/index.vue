<template>
  <div
    class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <IconCompany class="h-10" />
      <h2
        class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white"
      >
        Erstelle dein Konto!
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-2xl">
      <div
        class="bg-white px-6 py-12 shadow dark:bg-gray-800 sm:rounded-lg sm:px-12"
      >
        <Form
          class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
          :submit="submit_set_up"
        >
          <FormInputUsername class="sm:col-span-4" id="username" required />
          <FormAvatar id="avatar" label="Avatar" class="sm:col-span-2" />
          <FormInputArea
            id="bio"
            class="sm:col-span-6"
            label="About You"
            :side_label="{ label: 'Optional', href: null }"
            placeholder="Write a few sentences about yourself."
            :minlength="1"
            :maxlength="1500"
          />
          <FormInputName
            class="sm:col-span-3"
            id="first_name"
            label="Vorname"
            placeholder="Max"
            required
          />
          <FormInputName
            class="sm:col-span-3"
            id="last_name"
            label="Nachname"
            placeholder="Mustermann"
            required
          />
          <FormInputEmail class="sm:col-span-6" id="email" required />
          <FormInputPassword
            @pw_input="
              (new_pw_value) => {
                pw_value = new_pw_value;
                check_pw();
              }
            "
            class="sm:col-span-3"
            id="password"
            required
          />
          <FormInputPassword
            @pw_input="
              (new_pw_confirm_value) => {
                pw_confirm_value = new_pw_confirm_value;
                check_pw();
              }
            "
            class="sm:col-span-3"
            id="password_confirm"
            label="Confirm Password"
            :pw_confirmed="pw_confirmed"
            required
          />
          <div class="space-y-5 sm:col-span-6">
            <FormCheckbox
              id="profile_public"
              label="Profile Visibility"
              desc="By selecting this, you agree to make your profile visible to other users."
            />
            <FormCheckbox
              id="email_opt_in"
              label="Newsletter"
              desc="By selecting this, you agree to receive our newsletter."
            />
            <FormCheckbox
              id="terms"
              label="Terms of Service"
              desc="By selecting this, you agree to the Terms of Service."
              required
            />
          </div>
          <FormSubmit class="sm:col-span-6" label="Registrieren" />
        </Form>

        <div>
          <div class="relative mt-10">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-gray-200" />
            </div>
            <div
              class="relative flex justify-center text-sm font-medium leading-6"
            >
              <span
                class="bg-white px-6 text-gray-900 dark:bg-gray-800 dark:text-white"
                >{{ $t('login.oauth') }}</span
              >
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-4">
            <a
              href="#"
              class="flex w-full items-center justify-center gap-3 rounded-md bg-[#4285F4] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]"
            >
              <IconGoogle class="h-5 w-5" />
              <span class="text-sm font-semibold leading-6">Google</span>
            </a>

            <a
              href="https://github.com/login/oauth/authorize?client_id=d6019ebc37fef6b8ed85&"
              class="flex w-full items-center justify-center gap-3 rounded-md bg-[#24292F] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
            >
              <IconGithub class="h-5 w-5" />
              <span class="text-sm font-semibold leading-6">GitHub</span>
            </a>
          </div>
        </div>
      </div>

      <p class="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
        Bereits ein Konto?
        <NuxtLink
          to="login"
          class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >Melde dich an
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { EnvelopeIcon, KeyIcon } from '@heroicons/vue/20/solid';
import { defineComponent } from 'vue';
import { authStore } from '@/store/auth';
import { alertStore } from '@/store/alert';
import { GraphQLError } from 'graphql/error';

export default defineComponent({
  name: 'Sign_Up',
  components: {
    EnvelopeIcon,
    KeyIcon,
  },
  setup() {
    const query_mutate_user = gql`
      mutation register($user_input_data: UserInputModel!) {
        auth_register(user_input_data: $user_input_data) {
          success
          response
          code
        }
      }
    `;
    const { mutate: mutate_user } = useMutation(query_mutate_user);

    return {
      auth: authStore(),
      alert: alertStore(),
      pw_value: ref<string>(''),
      pw_confirm_value: ref<string>(''),
      pw_confirmed: ref<boolean>(false),
      mutate_user,
    };
  },
  methods: {
    check_pw() {
      this.pw_confirmed = this.pw_value === this.pw_confirm_value;
    },
    submit_set_up(e: Event, form_data: FormData) {
      const variables = {
        user_input_data: {
          username: form_data.get('username'),
          email: form_data.get('email'),
          password: form_data.get('password'),
          first_name: form_data.get('first_name'),
          last_name: form_data.get('last_name'),
          bio: form_data.get('bio') !== '' ? form_data.get('bio') : null,
          avatar: null,
          profile_public: form_data.get('profile_public') === 'on',
          email_opt_in: form_data.get('email_opt_in') === 'on',
        },
      };

      this.mutate_user({ ...variables })
        .then((result) => {
          console.log(result);
          if (result?.data.success) {
            this.$router.push({ name: 'login' });
          } else {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
          }
        })
        .catch((e: GraphQLError) => {
          console.error(e);
        });
    },
  },
});
</script>
