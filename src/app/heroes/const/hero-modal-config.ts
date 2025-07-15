import { DialogConfig } from '../../shared/interfaces/dialog-config.interface';
import { HERO_ERROR_MESSAGES } from './hero-error-messages';

export const HERO_DELETE_MODAL_CONFIG: DialogConfig = {
  title: 'Delete this hero?',
  showTwoBtn: true,
  btnLabel: {
    accept: 'Yes',
    deny: 'No',
  },
};

export const HERO_DELETE_SUCCESS_CONFIG: DialogConfig = {
  title: 'Hero deleted!',
  showTwoBtn: false,
  btnLabel: {
    accept: 'Ok',
  },
};

export const HERO_DELETE_ERROR_CONFIG: DialogConfig = {
  title: HERO_ERROR_MESSAGES.DELETE_ERROR,
  showTwoBtn: false,
  btnLabel: {
    accept: 'Ok',
  },
};

export const HERO_CREATE_SUCCESS_CONFIG: DialogConfig = {
  title: 'Hero created!',
  showTwoBtn: false,
  btnLabel: {
    accept: 'Ok',
  },
};

export const HERO_CREATE_ERROR_CONFIG: DialogConfig = {
  title: HERO_ERROR_MESSAGES.CREATE_ERROR,
  showTwoBtn: false,
  btnLabel: {
    accept: 'Ok',
  },
};

export const HERO_UPDATE_SUCCESS_CONFIG: DialogConfig = {
  title: 'Hero updated!',
  showTwoBtn: false,
  btnLabel: {
    accept: 'Ok',
  },
};

export const HERO_UPDATE_ERROR_CONFIG: DialogConfig = {
  title: HERO_ERROR_MESSAGES.UPDATE_ERROR,
  showTwoBtn: false,
  btnLabel: {
    accept: 'Ok',
  },
};

export const HERO_GET_ID_ERROR_CONFIG: DialogConfig = {
  title: HERO_ERROR_MESSAGES.NO_RESULTS_FOUND,
  showTwoBtn: false,
  btnLabel: {
    accept: 'Ok',
  },
};
