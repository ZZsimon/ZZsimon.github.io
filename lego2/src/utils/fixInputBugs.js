export const fixInputBugs = () => {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

  document.body.addEventListener('focusout', () => {
    const ua = window.navigator.userAgent;
    //键盘收起页面空白问题
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPad') > 0) {
      document.body.scrollTop = scrollTop;
      document.documentElement.scrollTop = scrollTop;
    }
  });
  const height = document.getElementsByTagName('body')[0].getBoundingClientRect().height;
  window.addEventListener('resize', () => {
    const body = document.getElementsByTagName('body')[0];
    body.setAttribute('style', `height: ${height}px`);
  });
};
