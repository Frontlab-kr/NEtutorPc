$(document).ready(function () {
  //select
  $.fn.niceSelect = function (method) {
    // Methods
    if (typeof method == 'string') {
      if (method == 'update') {
        this.each(function () {
          var $select = $(this);
          var $dropdown = $(this).next('.ne-select');
          var open = $dropdown.hasClass('open');

          if ($dropdown.length) {
            $dropdown.remove();
            create_nice_select($select);

            if (open) {
              $select.next().trigger('click');
            }
          }
        });
      } else if (method == 'destroy') {
        this.each(function () {
          var $select = $(this);
          var $dropdown = $(this).next('.ne-select');

          if ($dropdown.length) {
            $dropdown.remove();
            $select.css('display', '');
          }
        });
        if ($('.ne-select').length == 0) {
          $(document).off('.ne_select');
        }
      } else {
        console.log('Method "' + method + '" does not exist.');
      }
      return this;
    }

    // Hide native select
    this.hide();

    // Create custom markup
    this.each(function () {
      var $select = $(this);

      if (!$select.next().hasClass('ne-select')) {
        create_nice_select($select);
      }
    });

    function create_nice_select($select) {
      $select.after(
        $('<div></div>')
          .addClass('ne-select')
          .addClass($select.attr('class') || '')
          .addClass($select.attr('disabled') ? 'disabled' : '')
          .attr('tabindex', $select.attr('disabled') ? null : '0')
          .html('<span class="current"></span><ul class="list"></ul>')
      );

      const $dropdown = $select.next();
      const $options = $select.find('option');
      const selectedVal = $select.val(); // 현재 값
      const $selectedOption = $select.find(`option[value="${selectedVal}"]`);
      const hasSelectedAttr = $select.find('option[selected]').length > 0;
      const placeholder = $select.attr('data-placeholder');
      const $current = $dropdown.find('.current');
      let currentText = '';
      let isPlaceholder = false;

      // ✅ placeholder 우선: selected 명시 없으면 placeholder 표시
      if (!hasSelectedAttr && placeholder) {
        currentText = placeholder;
        isPlaceholder = true;
      } else if ($selectedOption.length > 0) {
        currentText = $selectedOption.data('display') || $selectedOption.text();
        isPlaceholder = false;
      } else {
        const $firstOption = $options.first();
        currentText = $firstOption.data('display') || $firstOption.text();
        isPlaceholder = false;
      }

      $current.text(currentText);
      $current.toggleClass('placeholder', isPlaceholder);

      // 옵션 리스트 생성
      $options.each(function () {
        const $option = $(this);
        const value = $option.val();
        const display = $option.data('display');
        const isSelected = value === selectedVal;

        $dropdown.find('ul').append(
          $('<li></li>')
            .attr('data-value', value)
            .attr('data-display', display || null)
            .addClass(
              'option' +
                (isSelected ? ' selected focus' : '') +
                ($option.is(':disabled') ? ' disabled' : '')
            )
            .append($('<p></p>').text($option.text()))
        );
      });

      const $selected = $dropdown.find('.option.selected');
      if ($selected.length) {
        requestAnimationFrame(() => {
          const list = $dropdown.find('.list')[0];
          if (list && $selected[0]) {
            const listRect = list.getBoundingClientRect();
            const optionRect = $selected[0].getBoundingClientRect();

            if (
              optionRect.top < listRect.top ||
              optionRect.bottom > listRect.bottom
            ) {
              list.scrollTop = $selected[0].offsetTop - list.clientHeight / 2;
            }
          }
        });
      }
    }

    /* Event listeners */

    // Unbind existing events in case that the plugin has been initialized before
    $(document).off('.ne_select');

    // Open/close
    $(document).on('click.ne_select', '.ne-select', function (event) {
      var $dropdown = $(this);

      $('.ne-select').not($dropdown).removeClass('open');
      $dropdown.toggleClass('open');

      if ($dropdown.hasClass('open')) {
        $dropdown.find('.option');
        $dropdown.find('.focus').removeClass('focus');
        $dropdown.find('.selected').addClass('focus');
      } else {
        $dropdown.focus();
      }
    });

    // Close when clicking outside
    $(document).on('click.ne_select', function (event) {
      if ($(event.target).closest('.ne-select').length === 0) {
        $('.ne-select').removeClass('open').find('.option');
      }
    });

    // Option click
    $(document).on(
      'click.ne_select',
      '.ne-select .option:not(.disabled)',
      function (event) {
        var $option = $(this);
        var $dropdown = $option.closest('.ne-select');
        var $current = $dropdown.find('.current');

        $dropdown.find('.selected').removeClass('selected');
        $option.addClass('selected');

        var text = $option.data('display') || $option.text();
        $dropdown.find('.current').text(text);

        // ✅ placeholder 클래스 제거
        $current.removeClass('placeholder');

        $dropdown.prev('select').val($option.data('value')).trigger('change');
      }
    );

    // Keyboard events
    $(document).on('keydown.ne_select', '.ne-select', function (event) {
      var $dropdown = $(this);
      var $focused_option = $(
        $dropdown.find('.focus') || $dropdown.find('.list .option.selected')
      );

      // Space or Enter
      if (event.keyCode == 32 || event.keyCode == 13) {
        if ($dropdown.hasClass('open')) {
          $focused_option.trigger('click');
        } else {
          $dropdown.trigger('click');
        }
        return false;
        // Down
      } else if (event.keyCode == 40) {
        if (!$dropdown.hasClass('open')) {
          $dropdown.trigger('click');
        } else {
          var $next = $focused_option.nextAll('.option:not(.disabled)').first();
          if ($next.length > 0) {
            $dropdown.find('.focus').removeClass('focus');
            $next.addClass('focus');
          }
        }
        return false;
        // Up
      } else if (event.keyCode == 38) {
        if (!$dropdown.hasClass('open')) {
          $dropdown.trigger('click');
        } else {
          var $prev = $focused_option.prevAll('.option:not(.disabled)').first();
          if ($prev.length > 0) {
            $dropdown.find('.focus').removeClass('focus');
            $prev.addClass('focus');
          }
        }
        return false;
        // Esc
      } else if (event.keyCode == 27) {
        if ($dropdown.hasClass('open')) {
          $dropdown.trigger('click');
        }
        // Tab
      } else if (event.keyCode == 9) {
        if ($dropdown.hasClass('open')) {
          return false;
        }
      }
    });

    // Detect CSS pointer-events support, for IE <= 10. From Modernizr.
    var style = document.createElement('a').style;
    style.cssText = 'pointer-events:auto';
    if (style.pointerEvents !== 'auto') {
      $('html').addClass('no-csspointerevents');
    }

    return this;
  };

  $('.ne .ne-select').niceSelect();
  $('.ne-modal .ne-select').niceSelect();

  //tab
  document.querySelectorAll('.ne-tabs').forEach((tabsContainer) => {
    const tabLinks = tabsContainer.querySelectorAll('.ne-tabs-item');

    tabLinks.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();

        // 탭 그룹 기준으로만 처리
        const container = tab.closest('.ne-tabs').parentElement;

        // 탭 그룹 안 모든 탭 비활성화
        container
          .querySelectorAll('.ne-tabs-item')
          .forEach((t) => t.classList.remove('active'));

        // 콘텐츠 영역 비활성화
        container
          .querySelectorAll('.ne-tabs-contents')
          .forEach((c) => c.classList.remove('active'));

        // 현재 탭 활성화
        tab.classList.add('active');

        // 대상 콘텐츠 활성화
        const targetId = tab.getAttribute('href').replace('#', '');
        const targetContent = container.querySelector(`#${targetId}`);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
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

  //search
  $(document).on('input', '.ne-search input', function () {
    const $parent = $(this).closest('.ne-search');
    if ($(this).val().trim() !== '') {
      $parent.addClass('has-value'); // 원하는 클래스
    } else {
      $parent.removeClass('has-value');
    }
  });
  $(document).on('click', '.ne-search button', function () {
    const $parent = $(this).closest('.ne-search');
    $(this).siblings('input').val('');
    $parent.removeClass('has-value');
  });

  //password
  $('.ne-password button').on('click', function () {
    const $container = $(this).closest('.ne-password');
    const $input = $container.find('input');

    // active 클래스 토글
    $container.toggleClass('active');

    // type 토글
    const isPassword = $input.attr('type') === 'password';
    $input.attr('type', isPassword ? 'text' : 'password');
  });

  //faq
  $('.ne-faq-item__question').on('click', function () {
    const $item = $(this).closest('.ne-faq-item');
    const $answer = $(this).next('.ne-faq-item__answer');

    $('.ne-faq-item').not($item).removeClass('active');
    $('.ne-faq-item__answer')
      .not($answer)
      .each(function () {
        const $el = $(this);
        if ($el.height() > 0) {
          $el.css('height', $el.height() + 'px');
          $el[0].offsetHeight;
          $el.css('height', '0px');
        }
      });

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

  //counter
  $(document).on('click', '.counter-minus, .counter-plus', function () {
    const $btn = $(this);
    const $counter = $btn.closest('.ne-counter');
    const $input = $counter.find('input.counter-value');

    let current = parseInt($input.val(), 10) || 0;

    if ($btn.hasClass('counter-plus')) {
      current += 1;
    } else if ($btn.hasClass('counter-minus')) {
      current = Math.max(0, current - 1);
    }

    $input.val(current);
  });

  //class
  $('.ne-class-home-class-head h4 button').on('click', function () {
    const $item = $(this).closest('.ne-class-home-class');
    const $answer = $(this)
      .closest('.ne-class-home-class')
      .find('.ne-class-home-class-contents');

    $('.ne-class-home-class').not($item).removeClass('active');
    $('.ne-class-home-class-contents')
      .not($answer)
      .each(function () {
        const $el = $(this);
        if ($el.height() > 0) {
          $el.css('height', $el.height() + 'px');
          $el[0].offsetHeight;
          $el.css('height', '0px');
        }
      });

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

  $('.ne-class-home-class').on('transitionend', function () {
    if ($(this).height() !== 0) {
      $(this).css('height', 'auto');
    }
  });

  //modal
  // 열기 버튼 클릭 시
  document.querySelectorAll('[data-bs-target]').forEach((button) => {
    button.addEventListener('click', function () {
      const targetId = this.getAttribute('data-bs-target');
      const modal = document.querySelector(targetId);
      if (modal) {
        modal.classList.add('show');
        document.body.classList.add('modal-open'); // ✅ html에 클래스 추가

        // 백드롭 추가
        const backdrop = document.createElement('div');
        backdrop.className = 'ne-modal-backdrop fade';
        document.body.appendChild(backdrop);
        requestAnimationFrame(() => backdrop.classList.add('show'));
      }
    });
  });

  // 닫기 버튼 클릭, ESC, 백드롭 클릭 등 닫을 때마다
  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('show');
    }

    const backdrop = document.querySelector('.ne-modal-backdrop');
    if (backdrop) {
      backdrop.classList.remove('show');
      setTimeout(() => backdrop.remove(), 300);
    }

    document.body.classList.remove('modal-open'); // ✅ html 클래스 제거
  }

  // ESC 키
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.ne-modal.show').forEach((modal) => {
        closeModal(modal);
      });
    }
  });

  // 닫기 버튼
  document.addEventListener('click', function (e) {
    const dismissBtn = e.target.closest('[data-bs-dismiss="modal"]');
    if (dismissBtn) {
      const modal = dismissBtn.closest('.ne-modal');
      closeModal(modal);
    }
  });

  let isDraggingFromModal = false;

  // 모달 내부에서 마우스를 누른 경우 플래그 설정
  document.addEventListener('mousedown', function (e) {
    const modalContent = e.target.closest('.ne-modal-content');
    isDraggingFromModal = !!modalContent;
  });

  // 기존 코드 중 "dialog 외부 클릭 시" 부분을 다음으로 교체
  document.addEventListener('click', function (e) {
    if (e.target.closest('.ne-tooltip')) return;

    const modal = e.target.closest('.ne-modal');
    const content = e.target.closest('.ne-modal-content');

    // ❗ 드래그 시작이 모달 내부였다면 닫지 않음
    if (modal && !content && !isDraggingFromModal) {
      closeModal(modal);
    }

    // 클릭 후 항상 초기화
    isDraggingFromModal = false;
  });

  //
  $(document).on(
    'change',
    '.ne-modal-mybook-list-item .ne-checkbox input[type="checkbox"],.ne-modal-mybook-list-item .ne-radio input[type="radio"]',
    function () {
      const $item = $(this).closest('.ne-modal-mybook-list-item');
      $item.toggleClass('active', this.checked);
    }
  );

  //layer
  $(document).on('click', '[data-toggle^="layer"]', function (e) {
    const $button = $(this);
    const layerId = $button.data('toggle');
    const position = $button.data('position') || 'bottom';
    const $layer = $('#' + layerId);

    // 기존 레이어 초기화
    $('.ne-sns-layer, .ne-channel-layer').removeClass(
      'active top top-left top-right bottom bottom-left bottom-right'
    );

    // 위치 클래스 추가
    $layer.addClass('active').addClass(position);

    // 버튼 위치 및 사이즈
    const offset = $button.offset();
    const height = $button.outerHeight();
    const width = $button.outerWidth();

    // header offset 계산
    let headerOffset = 0;
    const $searchHeader = $('.ne-header-search');
    const $header = $('.ne-header');

    headerOffset = $header.outerHeight(); // 52만

    // 기본 위치 계산
    let top = offset.top + height + 10;
    let left = offset.left;

    if (position.includes('top')) {
      top = offset.top - $layer.outerHeight() - 10;
    }

    if (position.includes('left')) {
      left = offset.left;
    } else if (position.includes('right')) {
      left = offset.left + width - $layer.outerWidth();
    } else if (position === 'top' || position === 'bottom') {
      left = offset.left + width / 2 - $layer.outerWidth() / 2;
    }

    // ne-channel-layer일 경우 추가 보정
    if ($layer.hasClass('ne-channel-layer')) {
      top -= 11;
    }

    // 만약 fixed header가 있고, 레이어가 화면 기준(top에서 내려오는 위치로) 보여야 한다면
    top -= headerOffset;

    // 레이어 위치 적용
    $layer.css({
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
    });
  });

  $(document).on('click', function (e) {
    if (!$(e.target).closest('.ne-sns-layer, [data-toggle]').length) {
      $('.ne-sns-layer').removeClass('active');
    }
    if (!$(e.target).closest('.ne-channel-layer, [data-toggle]').length) {
      $('.ne-channel-layer').removeClass('active');
    }
  });

  //tooltip
  $(document).on('click', '[data-toggle^="tooltip"]', function (e) {
    const $button = $(this);
    const tooltipId = $button.data('toggle');
    const position = $button.data('position') || 'bottom';
    const $tooltip = $('#' + tooltipId);

    // 툴팁 초기화
    $('.ne-tooltip').removeClass(
      'active top top-left top-right bottom bottom-left bottom-right'
    );

    const $child = $tooltip.children().first();
    if ($child.length) {
      const childHeight = $child.outerHeight(true) + 40; // margin 포함
      const childWidth = $child.outerWidth(true) + 40;
      $tooltip.css({
        height: childHeight + 'px',
        width: childWidth + 'px',
      });
    } else {
      $tooltip.css({
        height: 'auto',
        width: 'auto',
      });
    }

    // 위치 클래스 추가
    $tooltip.addClass('active').addClass(position);

    // 버튼 기준 좌표 계산
    const buttonOffset = $button.offset();
    const tooltipHeight = $tooltip.outerHeight();
    const tooltipWidth = $tooltip.outerWidth();
    const buttonHeight = $button.outerHeight();
    const buttonWidth = $button.outerWidth();

    let top = buttonOffset.top + buttonHeight + 10;
    let left = buttonOffset.left;

    if (position.includes('top')) {
      top = buttonOffset.top - tooltipHeight - 10;
    }

    if (position.includes('left')) {
      left = buttonOffset.left;
    } else if (position.includes('right')) {
      left = buttonOffset.left + buttonWidth - tooltipWidth;
    } else if (position === 'top' || position === 'bottom') {
      left = buttonOffset.left + buttonWidth / 2 - tooltipWidth / 2;
    }

    // 모달 내부에 있으면 모달 기준 위치 보정
    const $modal = $button.closest('.ne-modal');
    if ($modal.length) {
      const modalOffset = $modal.offset();
      top -= modalOffset.top;
      left -= modalOffset.left;
      $tooltip
        .css({
          position: 'absolute',
          top: `${top}px`,
          left: `${left}px`,
        })
        .appendTo($modal);
    } else {
      $tooltip
        .css({
          position: 'absolute',
          top: `${top}px`,
          left: `${left}px`,
        })
        .appendTo('body');
    }
  });

  // 외부 클릭 시 툴팁 닫기
  $(document).on('click', function (e) {
    if (!$(e.target).closest('.ne-tooltip, [data-toggle]').length) {
      $('.ne-tooltip').removeClass('active');
    }
  });

  // 툴팁 내 버튼 클릭 시 툴팁 닫기
  $(document).on('click', '.ne-tooltip .ne-btn', function () {
    $(this).closest('.ne-tooltip').removeClass('active');
  });

  //datepicker
  function patchHeaderText() {
    const $dp = $('#ui-datepicker-div');

    // 상단 텍스트 수정
    $dp
      .find('.ui-datepicker-year')
      .siblings('span.ui-datepicker-year-label')
      .remove();
    $dp
      .find('.ui-datepicker-year')

      .after(`<span class="ui-datepicker-year-label">년</span>`);

    $dp
      .find('.ui-datepicker-month')
      .siblings('span.ui-datepicker-month-label')
      .remove();
    $dp
      .find('.ui-datepicker-month')

      .after(`<span class="ui-datepicker-month-label">월</span>`);
  }
  if ($('.ne-date').length > 0) {
    $('.ne-date').datepicker({
      showOtherMonths: true,
      selectOtherMonths: true,
      dateFormat: 'yy-mm-dd',
      changeMonth: true,
      changeYear: true,
      showMonthAfterYear: true,
      yearSuffix: '',
      beforeShow: function () {
        setTimeout(() => {
          patchHeaderText();
          $('.ui-datepicker select').niceSelect();
        }, 0);
      },
      onChangeMonthYear: function () {
        setTimeout(() => {
          patchHeaderText();
          $('.ui-datepicker select').niceSelect();
        }, 0);
      },
    });

    $.datepicker.setDefaults({
      dateFormat: 'yy-mm-dd',
      prevText: '이전 달',
      nextText: '다음 달',
      closeText: '닫기',
      currentText: '오늘',
      monthNames: [
        '1월',
        '2월',
        '3월',
        '4월',
        '5월',
        '6월',
        '7월',
        '8월',
        '9월',
        '10월',
        '11월',
        '12월',
      ],
      monthNamesShort: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
      ],
      dayNames: ['일', '월', '화', '수', '목', '금', '토'],
      dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
      dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
      showMonthAfterYear: true,
      yearSuffix: '년',
      showButtonPanel: true,
      changeMonth: true,
      changeYear: true,
    });
  }
  //header
  $(document).on(
    'click',
    '.ne-header-menu-item.ne-header-menu-item-menu',
    function () {
      $('html').toggleClass('html--menu');
      $('.ne').toggleClass('ne--fullmenu');
      $('.ne-header').removeClass('ne-header--transition');
      setTimeout(() => {
        $('.ne-header').addClass('ne-header--transition');
      }, 600);
    }
  );
  $(document).on(
    'click',
    '.ne-header-menu-item.ne-header-menu-item-search, .ne-header-search__close button, .ne--search .ne-header-dim',
    function () {
      $('html').toggleClass('html--menu');
      $('.ne').toggleClass('ne--search');
      $('.ne').removeClass('ne--search-on');
      $('.ne-header-search .ne-search input').val('');
      $('.ne-header').removeClass('ne-header--transition');
      setTimeout(() => {
        $('.ne-header').addClass('ne-header--transition');
      }, 600);
    }
  );
  $(document).on('click', '.ne--fullmenu .ne-header-dim', function () {
    $('html').toggleClass('html--menu');
    $('.ne').toggleClass('ne--fullmenu');
    $('.ne-header').removeClass('ne-header--transition');
    setTimeout(() => {
      $('.ne-header').addClass('ne-header--transition');
    }, 600);
  });
  $(document).on('input', '.ne-header-search .ne-search input', function () {
    const val = $(this).val().trim();
    if (val === '') {
      $('.ne').removeClass('ne--search-on');
    } else {
      $('.ne').addClass('ne--search-on');
    }
  });
  $(document).on('blur', '.ne-header-search .ne-search input', function () {
    const val = $(this).val().trim();
    if (val === '') {
      $('.ne').removeClass('ne--search-on');
    }
  });

  //mybook
  $(document).on('click', '.ne-mybook-toggle', function () {
    $('.ne').toggleClass('ne--mybook');
  });
  $(document).on('click', '.ne-mybook-dim', function () {
    $('.ne').removeClass('ne--mybook');
  });

  // ESC 키
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      $('.ne').removeClass('ne--fullmenu');
      $('.ne').removeClass('ne--search');
      $('.ne').removeClass('ne--search-on');
      $('html').removeClass('html--menu');
      $('.ne-header-search .ne-search input').val('');
      $('.ne').removeClass('ne--mybook');
    }
  });

  //footer
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
});
