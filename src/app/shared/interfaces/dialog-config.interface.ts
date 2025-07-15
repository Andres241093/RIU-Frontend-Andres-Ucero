export interface DialogConfig {
  title: string;
  content?: string;
  showTwoBtn: boolean;
  btnLabel: {
    accept: string;
    deny?: string;
  };
}
