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

      var $dropdown = $select.next();
      var $options = $select.find('option');

      var $selectedOption = $select.find('option:selected');
      var selectValue = $selectedOption.val();
      var placeholder =
        $select.data('placeholder') || $select.attr('data-placeholder');

      var isPlaceholder = typeof placeholder !== 'undefined';

      var $matchedOption = $options.filter('[value="' + selectValue + '"]');

      var currentText = isPlaceholder
        ? placeholder || '&nbsp;'
        : $selectedOption.data('display') || $selectedOption.text();

      var $current = $dropdown.find('.current');
      $current.text(currentText);
      $current.toggleClass('placeholder', isPlaceholder);

      $options.each(function (i) {
        var $option = $(this);
        var display = $option.data('display');

        var isSelected =
          !isPlaceholder && $option.val() === selectValue ? ' selected' : '';

        $dropdown.find('ul').append(
          $('<li></li>')
            .attr('data-value', $option.val())
            .attr('data-display', display || null)
            .addClass(
              'option' +
                isSelected +
                ($option.is(':disabled') ? ' disabled' : '')
            )
            .append($('<p></p>').text($option.text()))
        );
      });
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

  $('.ne select').niceSelect();
  $('.ne-modal select').niceSelect();

  //tab
  // const tabs = document.querySelectorAll('.ne-tabs-item');
  // const contents = document.querySelectorAll('.ne-tabs-content');

  // tabs.forEach((tab) => {
  //   tab.addEventListener('click', () => {
  //     // 모든 탭과 컨텐츠에서 active 제거
  //     tabs.forEach((t) => t.classList.remove('active'));
  //     contents.forEach((c) => c.classList.remove('active'));

  //     // 클릭한 탭과 해당 컨텐츠에 active 추가
  //     tab.classList.add('active');
  //     document
  //       .getElementById(tab.getAttribute('data-tab'))
  //       .classList.add('active');
  //   });
  // });

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

  //layer
  $('[data-toggle]').on('click', function (e) {
    const $button = $(this);
    const layerId = $button.data('toggle');
    const position = $button.data('position') || 'bottom';
    const $layer = $('#' + layerId);

    // 초기화
    $('.ne-sns-layer').removeClass(
      'active top top-left top-right bottom bottom-left bottom-right'
    );

    // 위치 클래스 추가
    $layer.addClass('active').addClass(position);

    // 버튼 위치 기준으로 레이어 배치 (간단히 absolute)
    const offset = $button.offset();
    const height = $button.outerHeight();
    const width = $button.outerWidth();

    // 기본 위치값 (예시)
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
  });

  //tooltip
  $('[data-toggle]').on('click', function (e) {
    const $button = $(this);
    const tooltipId = $button.data('toggle');
    const position = $button.data('position') || 'bottom';
    const $tooltip = $('#' + tooltipId);

    // 초기화
    $('.ne-tooltip').removeClass(
      'active top top-left top-right bottom bottom-left bottom-right'
    );

    // 위치 클래스 추가
    $tooltip.addClass('active').addClass(position);

    // 버튼 위치 기준으로 레이어 배치 (간단히 absolute)
    const offset = $button.offset();
    const height = $button.outerHeight();
    const width = $button.outerWidth();

    // 기본 위치값 (예시)
    let top = offset.top + height + 10;
    let left = offset.left;

    if (position.includes('top')) {
      top = offset.top - $tooltip.outerHeight() - 10;
    }

    if (position.includes('left')) {
      left = offset.left;
    } else if (position.includes('right')) {
      left = offset.left + width - $tooltip.outerWidth();
    } else if (position === 'top' || position === 'bottom') {
      left = offset.left + width / 2 - $tooltip.outerWidth() / 2;
    }

    $tooltip.css({
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
    });
  });

  $(document).on('click', function (e) {
    if (!$(e.target).closest('.ne-tooltip, [data-toggle]').length) {
      $('.ne-tooltip').removeClass('active');
    }
  });
  $('.ne-tooltip .ne-btn').on('click', function (e) {
    $(this).parents('.ne-tooltip').removeClass('active');
  });
});
