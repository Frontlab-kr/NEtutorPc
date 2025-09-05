// jQuery: 스크롤이 0보다 크면 <html>에 'is-scrolled' 클래스 토글
$(function () {
  const $html = $('html');
  const update = () => {
    const y = $(window).scrollTop();
    $html.toggleClass('is-scrolled', y > 0);
  };

  // 초기 한 번 실행
  update();

  // 스크롤/리사이즈 시 갱신
  $(window).on('scroll resize', update);
});

$(document).ready(function () {
  AOS.init();
});

$('.ne-gate-nav-toggle').on('click', function () {
  $('.ne-gate-nav').toggleClass('active');
});
$('.ne-gate-nav-list-item').on('click', function () {
  $('.ne-gate-nav').removeClass('active');
});

//
// jQuery: .hover-icon에 호버 시, 자식 아이콘(.ico-24-arrow / .ico-24-arrow-navy) 애니메이션 시작/복귀
$(function () {
  const evEnd = 'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd';
  const ICONS = '.ico-24-arrow, .ico-24-arrow-navy, .ico-24-arrow-black'; // ← 여기만 추가/수정하면 확장 가능

  $('.hover-icon').on('mouseenter', function () {
    $(this)
      .find(ICONS)
      .each(function () {
        const $el = $(this);
        // 재호버 시 재생을 위해 클래스 리셋 후 강제 리플로우
        $el.removeClass('is-back is-forward');
        // 강제 리플로우
        // eslint-disable-next-line no-unused-expressions
        this.offsetWidth;
        $el.addClass('is-forward');
      });
  });

  $('.hover-icon').on('mouseleave', function () {
    $(this)
      .find(ICONS)
      .each(function () {
        const $el = $(this);
        $el
          .removeClass('is-forward')
          .addClass('is-back')
          .one(evEnd, function () {
            $el.removeClass('is-back');
          });
      });
  });
});

// jQuery: 특정 클래스(.move-smooth)가 붙은 앵커를 부드럽게 스크롤 이동
// 사용: <a href="#content" class="ne-gate-service-scroll move-smooth" data-offset="80"> ... </a>
$(function () {
  const CLASS = 'move-smooth';
  const SPEED = 700; // ms

  $(document).on('click', `a.${CLASS}[href^="#"]`, function (e) {
    const href = $(this).attr('href');
    if (!href || href === '#') return; // 빈 해시 무시

    const $target = $(href);
    if (!$target.length) return;

    e.preventDefault();

    const extraOffset = parseInt($(this).data('offset'), 10) || 0;

    // 기본 오프셋
    let y = $target.offset().top - extraOffset + 1;

    // 특정 클래스가 있으면 25vh 추가 보정
    if ($(this).hasClass('use-vh-offset')) {
      // 25vh 보정값
      const offsetVH = window.innerHeight * 1.15;

      // 최종 Y좌표
      y = $target.offset().top - extraOffset + offsetVH + 1;
    }

    if (window.lenis && typeof window.lenis.scrollTo === 'function') {
      window.lenis.scrollTo(y, {
        duration: 1.0,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
    } else {
      $('html, body').stop().animate({ scrollTop: y }, SPEED, 'swing');
    }
  });
});

// GSAP & ScrollTrigger 필요
gsap.registerPlugin(ScrollTrigger);

(function () {
  const wrap = document.querySelector('.ne-gate-introduce-scroll .circle');
  const target = wrap?.querySelector(':scope > ul');
  if (!wrap || !target) return;

  // 300px 기준에서 8px처럼 보이도록 시작 스케일
  const START_SCALE = 8 / 300; // ≈ 0.026666...

  // 초기 상태
  gsap.set(target, {
    transformOrigin: '50% 50%',
    scale: START_SCALE,
    willChange: 'transform',
  });
  gsap.set(
    [
      '.circle .circle01',
      '.circle .circle02',
      '.circle .circle03',
      '.circle .circle04',
      '.circle .circle05',
    ],
    { xPercent: 0, willChange: 'transform' }
  );

  // opacity 초기화: circle01만 항상 보이고, 나머지는 0으로 시작
  gsap.set(
    [
      '.circle .circle02',
      '.circle .circle03',
      '.circle .circle04',
      '.circle .circle05',
    ],
    { opacity: 0 }
  );

  // 타임라인
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: wrap,
      start: 'top 50%',
      endTrigger: '.ne-gate-leveltest',
      end: 'top+=200% top+=150%',
      scrub: true,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // [Phase 1] 8px → 300px (ul 스케일업)
  tl.to(target, { scale: 1, ease: 'none', duration: 0.5 });

  // 펼치기 직전에 opacity 처리
  tl.add(() => {
    const dir = tl.scrollTrigger && tl.scrollTrigger.direction;
    if (dir === -1) {
      // 되감는 중이면 opacity 0
      gsap.set(
        [
          '.circle .circle02',
          '.circle .circle03',
          '.circle .circle04',
          '.circle .circle05',
        ],
        { opacity: 0 }
      );
    } else {
      // 정방향이면 opacity 1
      gsap.set(
        [
          '.circle .circle02',
          '.circle .circle03',
          '.circle .circle04',
          '.circle .circle05',
        ],
        { opacity: 1 }
      );
    }
  }, 'spread-=0.05');

  // [Phase 2] 펼치기 (li 이동, 동시에 시작)
  tl.addLabel('spread')
    .to(
      '.circle .circle01',
      { xPercent: -200, duration: 0.6, ease: 'power2.inOut' },
      'spread'
    )
    .to(
      '.circle .circle02',
      { xPercent: -100, duration: 0.6, ease: 'power2.inOut' },
      'spread'
    )
    .to(
      '.circle .circle03',
      { xPercent: 0, duration: 0.6, ease: 'power2.inOut' },
      'spread'
    )
    .to(
      '.circle .circle04',
      { xPercent: 100, duration: 0.6, ease: 'power2.inOut' },
      'spread'
    )
    .to(
      '.circle .circle05',
      { xPercent: 200, duration: 0.6, ease: 'power2.inOut' },
      'spread'
    )

    // z-index 교체
    .add(() => {
      const dir = tl.scrollTrigger && tl.scrollTrigger.direction; // 1: 내려감, -1: 올라감
      if (dir === -1) {
        // 되감는 중: 초기값으로 복구 (50,40,30,20,10)
        gsap.set('.circle .circle01', { zIndex: 50 });
        gsap.set('.circle .circle02', { zIndex: 40 });
        gsap.set('.circle .circle03', { zIndex: 30 });
        gsap.set('.circle .circle04', { zIndex: 20 });
        gsap.set('.circle .circle05', { zIndex: 10 });
      } else {
        // 정방향: 역순(10,20,30,40,50)
        gsap.set('.circle .circle01', { zIndex: 10 });
        gsap.set('.circle .circle02', { zIndex: 20 });
        gsap.set('.circle .circle03', { zIndex: 30 });
        gsap.set('.circle .circle04', { zIndex: 40 });
        gsap.set('.circle .circle05', { zIndex: 50 });
      }
    }, '+=0.05')

    // [Phase 3] 원래 자리로 복귀
    .to(
      '.circle .circle01',
      { xPercent: 0, duration: 0.6, ease: 'power2.inOut' },
      '+=0'
    )
    .to(
      '.circle .circle02',
      { xPercent: 0, duration: 0.6, ease: 'power2.inOut' },
      '<'
    )
    .to(
      '.circle .circle03',
      { xPercent: 0, duration: 0.6, ease: 'power2.inOut' },
      '<'
    )
    .to(
      '.circle .circle04',
      { xPercent: 0, duration: 0.6, ease: 'power2.inOut' },
      '<'
    )
    .to(
      '.circle .circle05',
      { xPercent: 0, duration: 0.6, ease: 'power2.inOut' },
      '<'
    )

    // [Phase 4] 하강 + 페이드아웃
    // .to(wrap, {
    //   y: () => window.innerHeight * 0.4,
    //   duration: 1.4,
    //   ease: 'power2.inOut',
    // })
    .to(wrap, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
    });
})();

// ===== Gate: Menu → Data (수평 트랙) + 네비 점프(라벨 스크롤) =====
// GSAP & ScrollTrigger 필요
gsap.registerPlugin(ScrollTrigger);

(() => {
  const swap = document.querySelector('.ne-gate-swap');
  const track = document.querySelector('.ne-gate-track');
  const menu = document.querySelector('.ne-gate-menu'); // #section03
  const data = document.querySelector('.ne-gate-data'); // #section04
  if (!swap || !track || !menu || !data) return;

  // --- 메뉴 하위 ---
  const img = menu.querySelector('.ne-gate-menu__img');
  let mask = menu.querySelector('.ne-gate-menu__mask'); // 반전 마스크 레이어
  const wrap = menu.querySelector('.ne-gate-menu__inner');
  const items = wrap ? wrap.querySelectorAll(':scope > *') : null;

  // 없으면 마스크 레이어 동적 생성
  if (!mask) {
    mask = document.createElement('div');
    mask.className = 'ne-gate-menu__mask';
    // CSS 마스크(반전) 기본값을 인라인으로도 보강
    Object.assign(mask.style, {
      position: 'absolute',
      inset: '0',
      background: 'var(--gate-bg, #fff)', // 페이지 배경과 동일하게
      pointerEvents: 'none',
      WebkitMaskImage:
        'radial-gradient(circle at var(--maskX,50%) var(--maskY,50%), transparent var(--maskR,0px), black calc(var(--maskR,0px) + 1px))',
      maskImage:
        'radial-gradient(circle at var(--maskX,50%) var(--maskY,50%), transparent var(--maskR,0px), black calc(var(--maskR,0px) + 1px))',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskSize: 'cover',
      maskSize: 'cover',
      willChange: 'transform',
    });
    menu.appendChild(mask);
  }

  // --- 데이터 하위 ---
  const dataImg = data.querySelector('.ne-gate-data__img');
  const dataInner = data.querySelector('.ne-gate-data__inner');
  const dataItems = dataInner ? dataInner.querySelectorAll(':scope > *') : null;

  // 이미지 중앙을 화면 중앙에 맞추기 위한 X 시프트(px)
  const centerShiftX = () => {
    if (!img) return 0;
    gsap.set(img, { '--motion-scale': 1, '--motion-shiftX': '0px' });
    const r = img.getBoundingClientRect();
    return Math.round(innerWidth / 2 - (r.left + r.width / 2));
  };

  // 메뉴 영역을 완전히 드러낼 수 있는 반경(px)
  const getMaxRadius = () => {
    const r = menu.getBoundingClientRect();
    const cx = r.width * 0.5,
      cy = r.height * 0.5;
    return Math.hypot(cx, cy) + 12; // 여유치
  };

  // 초기값 세팅
  const init = () => {
    const shiftX = centerShiftX();

    gsap.set(track, { xPercent: 0 });
    gsap.set(menu, { autoAlpha: 1, position: 'relative', overflow: 'hidden' });
    gsap.set(data, { autoAlpha: 1 });

    // (이전처럼) 이미지 이동 연출: 시작은 centerShiftX만큼 오른쪽으로 밀려 있음
    if (img)
      gsap.set(img, { '--motion-scale': 1, '--motion-shiftX': `${shiftX}px` });

    // 반전 마스크 초기(구멍 아주 작음 → 이미지 가려짐)
    if (mask)
      gsap.set(mask, { '--maskR': '0px', '--maskX': '50%', '--maskY': '50%' });

    if (items) gsap.set(items, { x: '6vw', y: 0, opacity: 0 });
    if (dataImg) gsap.set(dataImg, { x: '6vw', y: 0, opacity: 0 });
    if (dataInner) gsap.set(dataInner, { x: '6vw', y: 0, opacity: 0 });
    if (dataItems && dataItems.length)
      gsap.set(dataItems, { x: '6vw', y: 0, opacity: 0 });
  };
  init();

  // ===== 타임라인 =====
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: swap,
      start: 'top top',
      end: '+=600%',
      scrub: true,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      // markers: true,
    },
  });

  // --- 메뉴(03) 구간 ---
  tl.addLabel('menuStart');

  // (변경) 반전 마스크의 구멍 반경을 키워서 "이미지가 드러나게"
  if (mask) {
    tl.to(
      mask,
      {
        '--maskR': () => `${getMaxRadius()}px`,
        ease: 'power3.out',
        duration: 0.9,
      },
      'menuStart'
    );
  }

  // (이전처럼) 이미지가 왼쪽으로 이동(초기 shiftX → 0)
  if (img) {
    tl.to(
      img,
      {
        '--motion-shiftX': '0px',
        ease: 'power2.inOut',
        duration: 0.5,
      },
      '<+0.2'
    ); // 마스크 확장과 살짝 겹침
  }

  // 텍스트/요소 등장
  if (items) {
    tl.to(
      items,
      {
        x: 0,
        opacity: 1,
        stagger: 0.08,
        ease: 'power3.out',
        duration: 0.8,
      },
      '<'
    );
  }

  // 03 끝 라벨(필요 시 살짝 앞당김으로 네비 판정 안정화)
  tl.addLabel('menuReady', '<+=0.7');

  // --- 스왑 & 데이터(04) 구간 ---
  tl.addLabel('swap'); // 스왑 시작

  // 수평 트랙 이동
  tl.to(
    track,
    { xPercent: -50, ease: 'power2.inOut', duration: 0.9 },
    'swap'
  ).add('dataStartAfterSwap', 'swap'); // 04 시작을 스왑 타이밍으로

  // 데이터 섹션 요소 등장
  if (dataImg)
    tl.to(
      dataImg,
      { x: 0, y: 0, opacity: 1, ease: 'power3.out', duration: 0.4 },
      'dataStartAfterSwap'
    );

  if (dataInner)
    tl.to(
      dataInner,
      { x: 0, y: 0, opacity: 1, ease: 'power3.out', duration: 0.5 },
      'dataStartAfterSwap+=0.05'
    );

  if (dataItems && dataItems.length)
    tl.to(
      dataItems,
      {
        x: 0,
        y: 0,
        opacity: 1,
        stagger: 0.08,
        ease: 'power3.out',
        duration: 0.4,
      },
      'dataStartAfterSwap+=0.1'
    );

  tl.addLabel('dataReady');

  // ===== 네비(03/04) 갱신(라벨 기반) =====
  const nav = document.querySelector('.ne-gate-nav');
  const knob = document.querySelector('.ne-gate-nav-toggle__bg');

  const getProg = (label) => {
    const t = tl.labels[label];
    return t == null || tl.duration() === 0 ? null : t / tl.duration();
  };

  let p03s, p03e, p04s, p04e, pBoundary;
  const computeBounds = () => {
    p03s = getProg('menuStart');
    p03e = getProg('menuReady');
    p04s = getProg('dataStartAfterSwap');
    p04e = getProg('dataReady') ?? 1;
    const a = p03e ?? 0,
      b = p04s ?? 0;
    pBoundary = a != null && b != null ? (a + b) / 2 : a ?? b ?? 0.5;
  };
  computeBounds();

  const updateNavByTimeline = () => {
    if (!nav || !knob) return;
    const p = tl.progress();
    let id, pct;

    if (p03s != null && p03e != null && p >= p03s && p <= p03e) {
      id = 'section03';
      pct = Math.round(((p - p03s) / Math.max(1e-6, p03e - p03s)) * 100);
    } else if (p04s != null && p04e != null && p >= p04s && p <= p04e) {
      id = 'section04';
      pct = Math.round(((p - p04s) / Math.max(1e-6, p04e - p04e)) * 100); // p04e - p04e? 오타 방지
      pct = Math.round(((p - p04s) / Math.max(1e-6, p04e - p04s)) * 100);
    } else {
      if (p <= pBoundary) {
        id = 'section03';
        pct = 100;
      } else {
        id = 'section04';
        pct = 0;
      }
    }

    nav.setAttribute('data-scroll-value', `${id}:${pct}%`);
    knob.style.left = `${pct}%`;

    [...nav.classList].forEach((c) => {
      if (/^ne-gate-nav--section\d{2}$/.test(c)) nav.classList.remove(c);
    });
    nav.classList.add(`ne-gate-nav--${id}`);
  };

  tl.scrollTrigger && tl.scrollTrigger.refresh();
  tl.scrollTrigger &&
    tl.scrollTrigger.animation &&
    tl.scrollTrigger.animation.eventCallback('onUpdate', updateNavByTimeline);

  ScrollTrigger.addEventListener('refresh', () => {
    computeBounds();
    updateNavByTimeline();
    // 리사이즈 시 마스크 반경 보정(과도한 값으로 남아있을 경우)
    if (mask) {
      const r = getMaxRadius();
      const cur =
        parseFloat(getComputedStyle(mask).getPropertyValue('--maskR')) || 0;
      if (cur > r) gsap.set(mask, { '--maskR': `${r}px` });
    }
  });

  // 초기 1회
  updateNavByTimeline();

  // ===== 네비 클릭 → 라벨 스크롤 =====
  const navLinks = document.querySelectorAll(
    '.ne-gate-nav .ne-gate-nav-list a[href^="#"]'
  );

  function smoothScrollTo(st, y, durationSec = 0.9) {
    const start = st.scroll();
    const delta = y - start;
    const t0 = performance.now();
    const dur = Math.max(0.01, durationSec) * 1000;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    let raf;
    const passiveOpt = { passive: true };
    const cancel = () => {
      window.removeEventListener('wheel', cancel, passiveOpt);
      window.removeEventListener('touchmove', cancel, passiveOpt);
      window.removeEventListener('keydown', cancel);
      if (raf) cancelAnimationFrame(raf);
    };
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      st.scroll(start + delta * easeOutCubic(p));
      if (p < 1) raf = requestAnimationFrame(step);
      else cancel();
    };

    window.addEventListener('wheel', cancel, passiveOpt);
    window.addEventListener('touchmove', cancel, passiveOpt);
    window.addEventListener('keydown', cancel);
    raf = requestAnimationFrame(step);
  }

  const scrollToLabelAccurate = (label, duration = 0.9) => {
    const st = tl.scrollTrigger;
    if (!st) return;
    const t = tl.labels[label];
    const total = tl.duration();
    if (t == null || !total) return;

    ScrollTrigger.refresh();
    requestAnimationFrame(() => {
      const p = gsap.utils.clamp(0, 1, t / tl.duration());
      const y = st.start + p * (st.end - st.start);
      smoothScrollTo(st, y, duration);
    });
  };

  navLinks.forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      if (id === 'section03') {
        e.preventDefault();
        scrollToLabelAccurate('menuReady'); // 03 끝
      } else if (id === 'section04') {
        e.preventDefault();
        scrollToLabelAccurate('dataReady'); // 04 시작
      }
    });
  });

  ScrollTrigger.addEventListener('refreshInit', init);
  addEventListener('resize', () => ScrollTrigger.refresh());
})();

// ===== Growup: .ne-gate-data 다음 단계 — 제목/아이콘 인트로 후, 핀 상태에서 Lottie 스크럽 =====
(() => {
  if (!window.gsap || !window.ScrollTrigger || !window.lottie) return;
  gsap.registerPlugin(ScrollTrigger);

  const section = document.querySelector('.ne-gate-growup');
  if (!section) return;

  const titleEl = section.querySelector('.ne-gate-growup__title');
  const iconEl = section.querySelector('.ne-gate-growup__icon');

  // ★ Lottie JSON 경로 수정
  const LOTTIE_JSON_PATH = '../../inc/js/light.json';

  // 0) 초기 상태(아래에서 위로 올라오도록 y/opacity 세팅)
  if (titleEl)
    gsap.set(titleEl, { y: 60, autoAlpha: 0, willChange: 'transform,opacity' });
  if (iconEl)
    gsap.set(iconEl, { y: 80, autoAlpha: 0, willChange: 'transform,opacity' });

  // 1) (인트로1) 제목: 섹션이 화면에 들어오자마자 아래→위로 등장 (핀 없이 가벼운 스크럽)
  if (titleEl) {
    gsap.to(titleEl, {
      y: 0,
      autoAlpha: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%', // .ne-gate-data 이후, growup 섹션이 슬며시 보일 때부터
        end: 'top 60%',
        scrub: true,
        invalidateOnRefresh: true,
      },
      duration: 1, // scrub일 때는 비율로 동작
    });
  }

  // 2) (인트로2) 아이콘: 제목보다 약간 늦게 아래→위로 등장 (역시 핀 없이)
  if (iconEl) {
    gsap.to(iconEl, {
      y: 0,
      autoAlpha: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 75%', // 제목보다 조금 늦게
        end: 'top 55%',
        scrub: true,
        invalidateOnRefresh: true,
      },
      duration: 1,
    });
  }

  // 3) Lottie 로드 (autoplay:false, loop:false)
  const anim = lottie.loadAnimation({
    container: iconEl, // 아이콘 컨테이너 안에 렌더
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: LOTTIE_JSON_PATH,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid meet',
      progressiveLoad: true,
    },
  });
  anim.setSubframe(false);

  let totalFrames = 1;
  const setTotalFrames = () => {
    totalFrames =
      (typeof anim.getDuration === 'function'
        ? anim.getDuration(true)
        : anim.totalFrames) || 1;
  };
  anim.addEventListener('data_ready', setTotalFrames);
  anim.addEventListener('DOMLoaded', setTotalFrames);

  // 4) (본 이벤트) 핀 구간: 제목/아이콘 인트로가 끝난 뒤 섹션이 상단에 닿으면 pin하고,
  //    해당 구간에서 Lottie 프레임을 스크러빙. 끝나면 pin 해제되어 다음 섹션으로 자연스레 이동.
  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: '+=200%',
    scrub: true,
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const f = Math.floor(
        gsap.utils.clamp(0, totalFrames - 1, self.progress * (totalFrames - 1))
      );
      anim.goToAndStop(f, true);
    },
  });

  // ★ 추가: pin 구간 "전반부(+=100%)" 동안 titleEl을 위로 밀어 올리며 페이드아웃
  if (titleEl) {
    gsap.to(titleEl, {
      // 뷰포트 높이 기준으로 충분히 위로 밀어 올림 (필요 시 계수 조정)
      y: () => -window.innerHeight * 1.0,
      autoAlpha: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top', // pin 시작과 동시에
        end: '+=100%', // 전체 pin 길이(+=200%)의 절반까지만 적용
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  }

  // 5) 안전장치: 아이콘 컨테이너 크기 보정 (height가 0이면 보이지 않음)
  if (iconEl && iconEl.clientHeight === 0) {
    iconEl.style.height = '60vh'; // 필요 시 프로젝트에 맞는 높이로 수정
  }

  // 6) 폰트/이미지 로딩 후 레이아웃 재계산
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();

// ===== Curriculum Dots (멀티 섹션, pin 미사용) — CSS 변수만 애니메이션, --motion-scale 최대 1로 제한 =====
// 요소 CSS 예시:
// [data-js="dot-background-dot-top"],
// [data-js="dot-background-dot-bottom"] {
//   transform: translateY(var(--motion-translateY)) scale(var(--motion-scale));
//   transform-origin: 50% 50%;
//   will-change: transform;
// }
(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const DEBUG = false; // markers 보려면 true

  // 유틸
  const baseW = (el) => {
    const dot = el.closest('.dot');
    return (dot && dot.offsetWidth) || el.offsetWidth || window.innerWidth;
  };
  const coverScale = (el, extra = 1.25) => {
    const need = Math.max(window.innerWidth, window.innerHeight) * extra;
    return need / baseW(el);
  };
  const clamp01 = (v) => Math.min(1, Math.max(0, v)); // 0~1로 제한
  const px = (v) => `${Math.round(v)}px`;

  // 컨테이너 자동 수집
  const containers = new Set();
  document
    .querySelectorAll(
      '[data-js="dot-background-section-top"], [data-js="dot-background-section-bottom"]'
    )
    .forEach((el) => {
      containers.add(
        el.closest('.ne-gate-leveltest__inner') ||
          el.closest('.ne-gate-curriculum__inner') ||
          el.closest('.ne-gate-leveltest') ||
          el.closest('.ne-gate-curriculum') ||
          el.parentElement
      );
    });

  containers.forEach((container) => {
    if (!container) return;

    const topSection = container.querySelector(
      '[data-js="dot-background-section-top"]'
    );
    const bottomSection = container.querySelector(
      '[data-js="dot-background-section-bottom"]'
    );
    const topDotSpan = container.querySelector(
      '[data-js="dot-background-dot-top"]'
    );
    const bottomDotSpan = container.querySelector(
      '[data-js="dot-background-dot-bottom"]'
    );

    if (!topSection && !bottomSection) return;

    // 스케일 한계/시작값
    const START_SMALL_DIAMETER = 191; // 위: 작게 시작(지름 px)
    const END_SMALL_DIAMETER = 191; // 아래: 작게 종료(지름 px)
    const TOP_START_SCALE = 0.1; // 참고사이트 초기값

    // Top: 시작/종료 (scale은 최대 1로 clamp)
    const topStartScale = () =>
      clamp01(Math.max(START_SMALL_DIAMETER / baseW(topDotSpan), 0.03));
    const topEndScale = () => clamp01(coverScale(topDotSpan, 1.25));
    const topStartTranslateY = () => -window.innerHeight * 1.3; // 위쪽에서 시작
    const topEndTranslateY = () => 0;

    // Bottom: 시작/종료 (scale은 최대 1로 clamp)
    const bottomStartScale = () => clamp01(coverScale(bottomDotSpan, 1.25));
    const bottomEndScale = () =>
      clamp01(Math.max(END_SMALL_DIAMETER / baseW(bottomDotSpan), 0.06));
    const bottomStartTranslateY = () => 0;
    const bottomEndTranslateY = () => window.innerHeight * 0.9;

    // 초기값: CSS 변수만 세팅
    const setStarts = () => {
      if (topDotSpan) {
        gsap.set(topDotSpan, {
          '--motion-scale': clamp01(TOP_START_SCALE),
          '--motion-translateY': px(topStartTranslateY()),
        });
      }
      if (bottomDotSpan) {
        gsap.set(bottomDotSpan, {
          '--motion-scale': bottomStartScale(),
          '--motion-translateY': px(bottomStartTranslateY()),
        });
      }
    };
    setStarts();

    // Top: 작게(0.1) & 위(-Y) → 크게(≤1) & Y=0
    if (topSection && topDotSpan) {
      gsap.to(topDotSpan, {
        '--motion-scale': () => topEndScale(),
        '--motion-translateY': () => px(topEndTranslateY()),
        ease: 'none',
        scrollTrigger: {
          trigger: topSection,
          start: 'top 100%',
          end: 'bottom 165%',
          scrub: true,
          invalidateOnRefresh: true,
          //markers: true,
        },
        immediateRender: false,
      });
    }

    // Bottom: 크게(≤1) → 작게 + 아래(+Y)
    if (bottomSection && bottomDotSpan) {
      gsap.to(bottomDotSpan, {
        '--motion-scale': () => bottomEndScale(),
        '--motion-translateY': () => px(bottomEndTranslateY()),
        ease: 'none',
        scrollTrigger: {
          trigger: bottomSection,
          start: 'top 0%',
          end: 'bottom 25%',
          scrub: true,
          invalidateOnRefresh: true,
          //markers: true,
        },
        immediateRender: false,
      });
    }

    // 리프레시 시 컨테이너별 초기값 재적용
    ScrollTrigger.addEventListener('refreshInit', setStarts);
  });

  // 전역 리사이즈 대응
  window.addEventListener('resize', () => ScrollTrigger.refresh());
})();

// ===== Gate Nav: 03/04는 containerAnimation, 나머지는 일반 트리거 =====
(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const nav = document.querySelector('.ne-gate-nav');
  const knob = document.querySelector('.ne-gate-nav-toggle__bg');
  if (!nav || !knob) return;

  const ids = [
    'section00',
    'section01',
    'section02',
    'section03',
    'section04',
    'section05',
  ];

  // 표현 업데이트
  function render(id, pct) {
    nav.setAttribute('data-scroll-value', `${id}:${pct}%`);
    knob.style.left = `${pct}%`;

    [...nav.classList].forEach((c) => {
      if (/^ne-gate-nav--section\d{2}$/.test(c)) nav.classList.remove(c);
    });
    nav.classList.add(`ne-gate-nav--${id}`);
  }

  // ===== 1) 03/04: 타임라인 내부를 독립 트리거로 취급 =====
  // 전제: 타임라인 생성 코드에서 window.__gateTL = tl; 해둠
  const TL = window.__gateTL;
  let st03_tl = null;
  let st04_tl = null;

  if (TL && TL.scrollTrigger) {
    // section03: menuStart ~ menuReady
    st03_tl = ScrollTrigger.create({
      id: 'section03_tl',
      containerAnimation: TL, // ✅ 요게 포인트
      start: 'menuStart', // 타임라인 라벨/시간 기반
      end: 'menuReady',
      onUpdate(self) {
        if (self.isActive) render('section03', Math.round(self.progress * 100));
      },
      onEnter() {
        render('section03', 0);
      },
      onEnterBack() {
        render('section03', 100);
      },
      onLeave() {
        /* 04가 이어받음 */
      },
      onLeaveBack() {
        /* 이전 섹션이 이어받음 */
      },
      // markers: true, // 디버깅
    });

    // section04: dataStartAfterSwap ~ dataReady(없으면 타임라인 끝)
    st04_tl = ScrollTrigger.create({
      id: 'section04_tl',
      containerAnimation: TL,
      start: 'dataStartAfterSwap',
      end: TL.labels['dataReady'] != null ? 'dataReady' : TL.duration(),
      onUpdate(self) {
        if (self.isActive) render('section04', Math.round(self.progress * 100));
      },
      onEnter() {
        render('section04', 0);
      },
      onEnterBack() {
        render('section04', 100);
      },
      // markers: true,
    });
  }

  // ===== 2) 그 외 섹션은 기존처럼 window 스크롤 트리거 =====
  const others = [];
  ids
    .filter((id) => id !== 'section03' && id !== 'section04')
    .forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const st = ScrollTrigger.create({
        id,
        trigger: el,
        start: 'top top',
        end: 'bottom top',
        scrub: false,
        onUpdate(self) {
          if (self.isActive) {
            render(id, Math.round(self.progress * 100));
          }
        },
        onEnter() {
          render(id, 0);
        },
        onEnterBack() {
          render(id, 100);
        },
        // markers: true,
      });
      others.push(st);
    });

  // ===== 3) 우선순위 조정 (겹칠 때 03/04가 우선하도록 한 번 더 스냅) =====
  function snapPriority() {
    // 타임라인 구간이 활성인 경우 03/04가 우선 렌더
    if (TL?.scrollTrigger?.isActive) {
      if (st03_tl?.isActive) {
        const p = Math.round(st03_tl.progress * 100);
        render('section03', p);
        return;
      }
      if (st04_tl?.isActive) {
        const p = Math.round(st04_tl.progress * 100);
        render('section04', p);
        return;
      }
    }
    // 아니면 others가 이미 onUpdate에서 렌더함
  }

  // 전역 이벤트로 우선순위 스냅
  ScrollTrigger.addEventListener('update', snapPriority);
  ScrollTrigger.addEventListener('refresh', snapPriority);
  window.addEventListener('scroll', snapPriority, { passive: true });
  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
    snapPriority();
  });

  // 초기 1회
  snapPriority();
})();

// 설명1(작은 배지) → 설명2(큰 카드) FLIP 전환
// (() => {
//   if (!window.gsap || !window.Flip) return;
//   gsap.registerPlugin(Flip);

//   const root = document.querySelector('.ne-gate-introduce');
//   if (!root) return;

//   // 안전장치: 혹시 HTML에 안 붙어 있었다면 즉시 붙여줌
//   root.classList.add('is-compact');
//   root.classList.remove('is-expanded');

//   const targets = () =>
//     root.querySelectorAll(
//       '.ne-gate-introduce-contents, .ne-gate-introduce-item, .ne-gate-introduce-item__title'
//     );

//   function toExpanded() {
//     // 설명1 → 설명2 (정방향)
//     const state = Flip.getState(targets()); // ① 현재(compact) 상태 캡처
//     root.classList.add('is-expanded'); // ② 목표 상태로 클래스 토글
//     root.classList.remove('is-compact');
//     Flip.from(state, {
//       // ③ compact → expanded 로 재생
//       duration: 1.0,
//       ease: 'power2.inOut',
//       absolute: true,
//       stagger: 0.05,
//       onEnter: (el) =>
//         gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.5 }),
//     });
//   }
//   setTimeout(() => {
//     toExpanded();
//   }, 3000);
// })();
