const Toast = (text, state) => {

  const root = document.getElementById('app'),
    newToast = document.createElement('div');

  // To replace jQuery.queue()
  let time = 0;

  newToast.className = `toast ${state}`;
  newToast.textContent = text;
  root.insertBefore(newToast, root.firstChild);

  // add Toast Action
  setTimeout(function () {
    newToast.style.opacity = 1;
    newToast.style.transform = 'translateX(-50%) scale(1)';

    let stackMargin = 15;
    const toast = document.querySelectorAll('.toast');

    for (let i = 0; i < toast.length; i++) {
      let height = toast[i].offsetHeight;
      let topMargin = 15;
      toast[i].style.top = stackMargin + 'px';
      stackMargin += height + topMargin;
    }
    console.log(stackMargin);

  }, time += 100);

  // remove Toast Action
  setTimeout(function () {
    let winWidth = window.outerWidth;
    let width = newToast.offsetWidth;

    newToast.style.opacity = 0;
    newToast.style.left = (winWidth / 2) + width + 'px';

    console.log(winWidth);
    console.log(width);

  }, time += 3000);

  // delete Dom
  setTimeout(function () {
    const parent = newToast.parentNode;
    parent.removeChild(newToast);
  }, time += 500);

}

export { Toast };