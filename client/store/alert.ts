export const alertStore = defineStore('alert', {
  state: (): AlertType => {
    return {
      visible: false,
      msg: '',
      type: 'info',
    };
  },
  actions: {
    show(msg: string, type: AlertType['type'] = 'info') {
      this.visible = true;
      this.msg = msg;
      this.type = type;
    },
    hide() {
      this.visible = false;
    },
  },
  persist: false,
});

class AlertType {
  visible!: boolean;
  msg!: string;
  type!: 'info' | 'danger' | 'warn' | 'success';
}
