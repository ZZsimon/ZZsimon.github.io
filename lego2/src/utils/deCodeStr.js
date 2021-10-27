import Hashids from 'hashids';
import { decode } from 'js-base64';

const hashids = new Hashids('bIcOXkJWRt4zfSDd');

export const deCodeStr = (_str) => {
  try {
    const str = hashids.decode(_str)[0];
    return str ? str : decode(_str);
  } catch (error) {
    return decode(_str);
  }
};
