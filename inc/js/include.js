(function () {
  function includeHTML() {
    const elements = document.querySelectorAll('[include-html]');
    elements.forEach((elmnt) => {
      const file = elmnt.getAttribute('include-html');
      if (file) {
        fetch(file)
          .then((response) =>
            response.ok ? response.text() : 'Page not found.'
          )
          .then((data) => {
            // head에 포함될 경우
            if (
              elmnt.parentNode.tagName === 'HEAD' ||
              document.head.contains(elmnt)
            ) {
              const temp = document.createElement('div');
              temp.innerHTML = data;
              // head 안에 있는 요소들을 추가
              [...temp.children].forEach((child) => {
                document.head.appendChild(child);
              });
              elmnt.remove();
            } else {
              elmnt.innerHTML = data;
              elmnt.removeAttribute('include-html');
              includeHTML(); // 중첩 include 지원
            }
          });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', includeHTML);
})();
