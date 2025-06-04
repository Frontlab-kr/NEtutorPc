$(document).ready(function () {
  //select
  $('select').niceSelect();

  //tab
  const tabs = document.querySelectorAll('.ne-tabs-item');
  const contents = document.querySelectorAll('.ne-tabs-content');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      // 모든 탭과 컨텐츠에서 active 제거
      tabs.forEach((t) => t.classList.remove('active'));
      contents.forEach((c) => c.classList.remove('active'));

      // 클릭한 탭과 해당 컨텐츠에 active 추가
      tab.classList.add('active');
      document
        .getElementById(tab.getAttribute('data-tab'))
        .classList.add('active');
    });
  });

  //input
  $(document).on('input', '.ne-input input', function () {
    const $parent = $(this).closest('.ne-input');
    if ($(this).val().trim() !== '') {
      $parent.addClass('has-value'); // 원하는 클래스
    } else {
      $parent.removeClass('has-value');
    }
  });
  $(document).on('click', '.ne-input button', function () {
    const $parent = $(this).closest('.ne-input');
    $(this).siblings('input').val('');
    $parent.removeClass('has-value');
  });

  //faq
  $('.ne-faq-item__question').on('click', function () {
    const $item = $(this).closest('.ne-faq-item');
    const $answer = $(this).next('.ne-faq-item__answer');

    if ($answer.height() > 0) {
      $answer.css('height', $answer.height() + 'px');
      $answer[0].offsetHeight;
      $answer.css('height', '0px');
      $item.removeClass('active');
    } else {
      $answer.css('height', $answer[0].scrollHeight + 'px');
      $item.addClass('active');
    }
  });

  $('.ne-faq-item__answer').on('transitionend', function () {
    if ($(this).height() !== 0) {
      $(this).css('height', 'auto');
    }
  });

  //modal
  // 열기 버튼 클릭
  document.querySelectorAll('[data-bs-target]').forEach((button) => {
    button.addEventListener('click', function () {
      const targetId = this.getAttribute('data-bs-target');
      const modal = document.querySelector(targetId);
      if (modal) {
        modal.classList.add('show');

        // 백드롭 추가
        let backdrop = document.createElement('div');
        backdrop.className = 'ne-modal-backdrop fade';
        document.body.appendChild(backdrop);

        requestAnimationFrame(() => {
          backdrop.classList.add('show');
        });
      }
    });
  });

  // 닫기 버튼(data-bs-dismiss="modal") 클릭
  document.addEventListener('click', function (e) {
    const dismissBtn = e.target.closest('[data-bs-dismiss="modal"]');
    if (dismissBtn) {
      const modal = dismissBtn.closest('.ne-modal');
      if (modal) {
        modal.classList.remove('show');
      }

      const backdrop = document.querySelector('.ne-modal-backdrop');
      if (backdrop) {
        // show 제거로 fade-out 시작
        backdrop.classList.remove('show');

        // 트랜지션 완료 후 제거 (300ms 후)
        setTimeout(() => {
          backdrop.remove();
        }, 300); // fade 트랜지션 시간과 맞춰주세요
      }
    }
  });

  // ESC 키로 닫기
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.ne-modal.show').forEach((modal) => {
        modal.classList.remove('show');
      });

      const backdrop = document.querySelector('.ne-modal-backdrop');
      if (backdrop) {
        backdrop.classList.remove('show');
        setTimeout(() => {
          backdrop.remove();
        }, 300); // fade 트랜지션 시간
      }
    }
  });
});
