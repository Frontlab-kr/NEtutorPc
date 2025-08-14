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

  // 한 개 타임라인으로: 핀 + 스케일업 → 펼치기 → zIndex 스왑 → 복귀

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: wrap,
      start: 'top 50%',
      endTrigger: '.ne-gate-curriculum',
      end: 'top+=200% top+=150%',
      scrub: true,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      markers: true,
      invalidateOnRefresh: true,
    },
  });

  // [Phase 1] 8px → 300px (ul 스케일업)
  tl.to(target, { scale: 1, ease: 'none', duration: 1.0 });

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

    // 복귀 전에 z-index 역순으로 교체
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
        // 정방향: 요청한 역순(10,20,30,40,50)으로 교체
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
    // [Phase 4] 하강: 다음 화면에 덮이는 느낌을 주기 위해 circle 자체를 아래로 내린다
    .to(wrap, {
      // 반응형: 현재 뷰포트 높이 기준으로 계산
      y: () => window.innerHeight * 0.6, // 필요시 0.5~0.9 사이로 조절
      duration: 0.9,
      ease: 'power2.inOut',
    });
})();

// ===== 레벨테스트 하단 원: CSS 변수 기반 축소 + 상승 =====
(() => {
  const section = document.querySelector('.ne-gate-leveltest');
  const circle = document.querySelector('.ne-gate-leveltest-bottom .circle');
  if (!section || !circle) return;

  const baseW = () => circle.offsetWidth || window.innerWidth;

  // 화면을 덮는 큰 원(초기값)
  const targetScale = () => {
    const need = Math.max(window.innerWidth, window.innerHeight) * 1.2;
    return need / baseW();
  };

  // ★ 최소 보이는 크기(px) → 원의 '지름' 최소값
  const MIN_VISIBLE_DIAMETER = 120; // 작은 원이 확실히 보이도록 최소 지름 상향
  const minVisibleScale = () => MIN_VISIBLE_DIAMETER / baseW();

  // 초기값: 큰 원으로 시작
  gsap.set(circle, {
    '--motion-scale': targetScale(),
    '--motion-translateY': '0px',
  });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: section,
        start: 'bottom 100%',
        end: '+=200%', // 더 긴 스크럽 구간으로 축소 완료까지 pin 유지
        scrub: true,
        // markers: true,
        invalidateOnRefresh: true,
        pin: true,
      },
    })
    .to(circle, {
      // 큰 원 → 최소 가시 크기까지 축소 + 아래로 더 내림(화면 안에 완전한 원)
      '--motion-scale': () => Math.max(minVisibleScale(), 0.2), // 큰 원 → 최소 가시 크기까지 축소
      '--motion-translateY': () => `${window.innerHeight * 0.25}px`, // 아래로 더 내림(화면 안에 완전한 원)
      ease: 'power2.out',
      duration: 1,
    });

  // 리사이즈시 다시 계산
  ScrollTrigger.addEventListener('refreshInit', () => {
    gsap.set(circle, {
      '--motion-scale': targetScale(),
      '--motion-translateY': '0px',
    });
  });
})();

// ===== 커리큘럼 하단 원: CSS 변수 기반 축소 + 상승 =====
(() => {
  const section = document.querySelector('.ne-gate-curriculum');
  const circle = document.querySelector('.ne-gate-curriculum-bottom .circle');
  if (!section || !circle) return;

  const baseW = () => circle.offsetWidth || window.innerWidth;

  // 화면을 덮는 큰 원(초기값)
  const targetScale = () => {
    const need = Math.max(window.innerWidth, window.innerHeight) * 1.2;
    return need / baseW();
  };

  // ★ 최소 보이는 크기(px) → 원의 '지름' 최소값
  const MIN_VISIBLE_DIAMETER = 120; // 작은 원이 확실히 보이도록 최소 지름 상향
  const minVisibleScale = () => MIN_VISIBLE_DIAMETER / baseW();

  // 초기값: 큰 원으로 시작
  gsap.set(circle, {
    '--motion-scale': targetScale(),
    '--motion-translateY': '0px',
  });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: section,
        start: 'bottom 100%',
        end: '+=200%', // 더 긴 스크럽 구간으로 축소 완료까지 pin 유지
        scrub: true,
        // markers: true,
        invalidateOnRefresh: true,
        pin: true,
      },
    })
    .to(circle, {
      // 큰 원 → 최소 가시 크기까지 축소 + 아래로 더 내림(화면 안에 완전한 원)
      '--motion-scale': () => Math.max(minVisibleScale(), 0.2), // 큰 원 → 최소 가시 크기까지 축소
      '--motion-translateY': () => `${window.innerHeight * 0.25}px`, // 아래로 더 내림(화면 안에 완전한 원)
      ease: 'power2.out',
      duration: 1,
    });

  // 리사이즈시 다시 계산
  ScrollTrigger.addEventListener('refreshInit', () => {
    gsap.set(circle, {
      '--motion-scale': targetScale(),
      '--motion-translateY': '0px',
    });
  });
})();
// ===== Gate: Menu — 중앙에서 커지고, 다 커지면 왼쪽으로 사라지고 .ne-gate-data가 오른쪽에서 등장 =====
(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const menuSection = document.querySelector('.ne-gate-menu');
  const dataSection = document.querySelector('.ne-gate-data');
  if (!menuSection || !dataSection) return;

  const img = menuSection.querySelector('.ne-gate-menu__img'); // 메뉴 이미지(원)
  const contentWrap = menuSection.querySelector('.ne-gate-menu__inner'); // 메뉴 텍스트 래퍼
  const items = contentWrap ? contentWrap.querySelectorAll(':scope > *') : null;

  // ▶ 데이터 섹션 하위 요소(이미지/인너) 분리
  const dataImg = dataSection.querySelector('.ne-gate-data__img');
  const dataInner = dataSection.querySelector('.ne-gate-data__inner');
  const dataItems = dataInner ? dataInner.querySelectorAll(':scope > *') : null;

  // ▶ 스크롤로 아래에서 올라오는 현상 방지용 spacer (dataSection을 fixed로 띄울 동안 자리 유지)
  let spacer = document.querySelector('.ne-gate-data-spacer');
  if (!spacer) {
    spacer = document.createElement('div');
    spacer.className = 'ne-gate-data-spacer';
    spacer.style.display = 'none';
    dataSection.parentNode.insertBefore(spacer, dataSection);
  }

  // 중앙 정렬에 필요한 X 이동값 측정
  const measureCenterShift = () => {
    if (!img) return 0;
    gsap.set(img, { '--motion-scale': 1, '--motion-shiftX': '0px' });
    const rect = img.getBoundingClientRect();
    const elemCenter = rect.left + rect.width / 2;
    const viewCenter = window.innerWidth / 2;
    return Math.round(viewCenter - elemCenter);
  };

  // 초기 상태
  const init = () => {
    const shiftX = measureCenterShift();

    if (img) {
      gsap.set(img, {
        '--motion-scale': 0,
        '--motion-shiftX': `${shiftX}px`,
      });
    }
    if (items && items.length) gsap.set(items, { x: '6vw', opacity: 0 });

    // ▶ dataSection은 문서 흐름 그대로 두고(아래서 올라오지 않도록 swap 순간에만 fixed 처리)
    //    초기에는 보이지 않게만 설정
    gsap.set(dataSection, { autoAlpha: 0, clearProps: 'transform' });
    if (dataImg) gsap.set(dataImg, { x: '6vw', opacity: 0 });
    if (dataItems && dataItems.length)
      gsap.set(dataItems, { x: '6vw', opacity: 0 });

    // 메뉴 섹션은 화면 안
    gsap.set(menuSection, { xPercent: 0, autoAlpha: 1 });
    spacer.style.display = 'none';
  };

  init();

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: menuSection,
      start: 'bottom 100%',
      end: '+=240%',
      scrub: true,
      pin: true,
      invalidateOnRefresh: true,
      // markers: true,
    },
  });

  // (1) 중앙에서 커짐
  if (img) {
    tl.to(img, { '--motion-scale': 1, ease: 'power2.out', duration: 1.0 });
  }

  // (2) 왼쪽 자리로 슬라이드
  if (img) {
    tl.to(
      img,
      { '--motion-shiftX': '0px', ease: 'power2.inOut', duration: 0.6 },
      '>-0.1'
    );
  }

  // (3) 메뉴 텍스트 등장
  if (items && items.length) {
    tl.to(
      items,
      {
        x: 0,
        opacity: 1,
        stagger: 0.08,
        ease: 'power3.out',
        duration: 0.9,
      },
      '<'
    );
  }

  // (4) swap 직전: dataSection을 fixed로 띄워서 "아래에서 위로 스크롤" 현상 차단
  tl.add(() => {
    // spacer 높이 갱신 후 표시
    spacer.style.height = `${
      dataSection.offsetHeight || dataSection.scrollHeight
    }px`;
    spacer.style.display = 'block';

    // dataSection을 화면에 고정
    Object.assign(dataSection.style, {
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: '100%',
      zIndex: '10',
    });
    gsap.set(dataSection, { autoAlpha: 1 });

    // 안전하게 재초기화(겹치는 스타일 방지)
    if (dataImg) gsap.set(dataImg, { x: '6vw', opacity: 0 });
    if (dataItems && dataItems.length)
      gsap.set(dataItems, { x: '6vw', opacity: 0 });
  }, '+=0');

  // (5) 메뉴는 왼쪽으로 사라짐
  tl.addLabel('swap').to(
    menuSection,
    {
      xPercent: -100,
      autoAlpha: 0,
      ease: 'power2.inOut',
      duration: 0.6,
    },
    'swap'
  );

  // (6) 데이터 섹션: 이미지와 인너를 오른쪽에서 인 (메뉴 인너와 동일 모션)
  if (dataImg) {
    tl.to(
      dataImg,
      {
        x: 0,
        opacity: 1,
        ease: 'power3.out',
        duration: 0.9,
      },
      'swap'
    );
  }
  if (dataItems && dataItems.length) {
    tl.to(
      dataItems,
      {
        x: 0,
        opacity: 1,
        stagger: 0.08,
        ease: 'power3.out',
        duration: 0.9,
      },
      'swap+=0.05'
    );
  }

  // (7) 교차 전환 종료 후 정리: fixed 해제하고 문서 흐름 복귀
  tl.add(() => {
    dataSection.style.position = '';
    dataSection.style.top = '';
    dataSection.style.left = '';
    dataSection.style.width = '';
    dataSection.style.zIndex = '';
    spacer.style.display = 'none';
  }, 'swap+=1.1');

  // 리사이즈/리프레시 대응
  ScrollTrigger.addEventListener('refreshInit', init);
  window.addEventListener('resize', () => ScrollTrigger.refresh());
})();
