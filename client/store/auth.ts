export const authStore = defineStore('auth', {
  state: (): AuthType => {
    return {
      logged_in: false,
      is_admin: false,
      token: '',
    };
  },
  actions: {
    login(token: string, is_admin?: boolean) {
      this.logged_in = true;
      this.is_admin = is_admin || false;
      this.token = token;
    },
    logout() {
      this.logged_in = false;
      this.is_admin = false;
      this.token = '';
    },
  },
  persist: true,
});

class AuthType {
  logged_in!: boolean;
  is_admin!: boolean;
  token!: string;
}
