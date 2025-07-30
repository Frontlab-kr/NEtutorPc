(function () {
  function includeHTML(callback) {
    const elements = document.querySelectorAll('[include-html]');
    let remaining = elements.length;

    if (remaining === 0) {
      callback?.();
      return;
    }

    elements.forEach((elmnt) => {
      const file = elmnt.getAttribute('include-html');
      if (!file) {
        if (--remaining === 0) callback?.();
        return;
      }

      fetch(file)
        .then((response) => (response.ok ? response.text() : 'Page not found.'))
        .then((data) => {
          if (
            elmnt.parentNode.tagName === 'HEAD' ||
            document.head.contains(elmnt)
          ) {
            const temp = document.createElement('div');
            temp.innerHTML = data;
            [...temp.children].forEach((child) => {
              document.head.appendChild(child);
            });
            elmnt.remove();
          } else {
            elmnt.innerHTML = data;
            elmnt.removeAttribute('include-html');
          }
        })
        .finally(() => {
          // 모든 include 완료 후 다시 검사
          if (--remaining === 0) {
            // 포함된 파일에 또 include-html이 있는지 다시 확인
            // 잠시 defer하여 DOM 반영 기다림
            setTimeout(() => {
              if (document.querySelector('[include-html]')) {
                includeHTML(callback); // 재귀 호출
              } else {
                callback?.(); // 최종 콜백
              }
            }, 0);
          }
        });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    includeHTML(function () {
      // ✅ 1. 페이지 타이틀 반영
      const title = $('#content').data('page-title');
      if (title) {
        $('.ne-header h1').text(title);
      }

      // ✅ 2. 모든 select에 niceSelect 적용
      $('select').each(function () {
        if (!$(this).next().hasClass('ne-select')) {
          $(this).niceSelect();
        }
      });

      // ✅ footer 패밀리사이트 드롭다운 새창 열기
      $(document).on(
        'click',
        '.ne-footer-familysite .ne-select .option',
        function () {
          const url = $(this).data('value');
          if (url) {
            window.open(url, '_blank');
          }
        }
      );

      //
      $(document).on('click', '.ne-footer-menu .ne-btn', function () {
        $('.ne-footer').toggleClass('active');
      });
    });
  });
})();
