import Taro, { getCurrentInstance } from '@tarojs/taro';

/**
 *
 * @param {点击时间类型} clickEvent
 * @param {应用场景类型（支付报名：2，邀请助力：4）} applicationScenarios
 */
export const handleClick = ({
  clickEvent,
  h5Url,
  scrollTop,
  lessonId,
  applicationScenarios
}) => {
  switch (clickEvent) {
    case 1:
      goH5(h5Url);
      break;

    case 2:
      goTop(scrollTop);
      break;
    case 3:
      checkLogin(lessonId);
      break;
    default:
      break;
  }
};

const goH5 = (h5Url) => {
  window.location.href = h5Url;
};
const goTop = (scrollTop) => {
  const top = +scrollTop === 0 ? 1 : scrollTop;
  Taro.pageScrollTo({
    scrollTop: top,
    duration: 300
  });
};

const checkLogin = (lessonId) => {
  const token = Taro.getStorageSync('front-token');
  if (token) {
    goPay(lessonId);
    return;
  }

  showLoginModal();
};

const goPay = (lessonId) => {
  const { router } = getCurrentInstance();
  const channel = router.params.channel;

  // 支付页面pageId始终保持为2，参考 @/utils/const文件
  const replaceStr = `&pageId=2&lessonId=${lessonId}&channel`;
  const _path = router.path.replace(/&channel/, replaceStr);

  const replaceStr2 = `?channel=${channel}&pageId=2&lessonId=${lessonId}`;
  const path = _path.replace(/\?channel=[a-zA-Z0-9=]*/, replaceStr2);
  Taro.redirectTo({
    url: path
  });
};

const showLoginModal = () => {};
