import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import { initializePaddle, openCheckout } from './paddle';
import { supabase } from './supabase';


const KEY_MAP = {
  'q': 'key-q', 'w': 'key-w', 'e': 'key-e', 'r': 'key-r', 't': 'key-t',
  'y': 'key-y', 'u': 'key-u', 'i': 'key-i', 'o': 'key-o', 'p': 'key-p',
  'a': 'key-a', 's': 'key-s', 'd': 'key-d', 'f': 'key-f', 'g': 'key-g',
  'h': 'key-h', 'j': 'key-j', 'k': 'key-k', 'l': 'key-l',
  'z': 'key-z', 'x': 'key-x', 'c': 'key-c', 'v': 'key-v', 'b': 'key-b',
  'n': 'key-n', 'm': 'key-m',
  ' ': 'key-space'
};

const SWITCHES = ['blue', 'brown', 'red', 'thock'];

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

const TRANSLATIONS = {
  en: {
    navDemo: 'Web Demo',
    navFeatures: 'Features',
    navInstall: 'Install Guide',
    navPricing: 'Pricing',
    badge: '100% Offline & Ad-Free',
    heroTitle: 'Make Your Typing',
    heroSubtitleColor: 'Satisfying & Addictive',
    heroDesc: 'Listen to crisp mechanical keyboard sounds in real-time as you type. Features a native 100% local audio renderer for instantaneous feedback. Fully compatible with custom soundpacks!',
    btnBuy: 'Get Lifetime Access - $2 💎',
    mockupListening: 'Listening',
    mockupBlueName: 'Blue Clicky',
    mockupBlueDesc: 'Crisp, tactile, buckling spring clicks',
    mockupBrownName: 'Brown Tactile',
    mockupBrownDesc: 'Subtle tactility, quiet strokes',
    mockupRedName: 'Red Linear',
    mockupRedDesc: 'Smooth, light, quiet bottom-out sounds',
    mockupThockName: 'Deep Thock',
    mockupThockDesc: 'Thocky, satisfying, and buttery pebble clicks',
    demoTitle: 'Interactive Web Playground',
    demoDesc: 'Select a switch type below and mash your keys! Feel the precise, instantaneous sound feedback.',
    demoBlue: 'Blue (Clicky)',
    demoBrown: 'Brown (Tactile)',
    demoRed: 'Red (Linear)',
    demoThock: 'Thock (Buttery)',
    demoSpace: 'SPACEBAR',
    demoInstructions: 'Focus here and type on your physical keyboard or click the keys above.',
    featuresTitle: 'Why DDalGGak?',
    featuresDesc: 'Designed for keyboard enthusiasts who value responsiveness, safety, and ultimate customizability.',
    feat1Title: 'Ultra-Low Latency',
    feat1Desc: 'Our native engine on macOS schedules audio buffers in less than 0.2 microseconds. Sound triggers instantly as your finger hits the key.',
    feat2Title: '100% Private & Offline',
    feat2Desc: 'We do not request internet permissions. Your keystrokes never leave your device. No telemetry, no tracking. Purely local operation.',
    feat3Title: 'Custom Soundpacks',
    feat3Desc: 'Simply drag and drop or import any standard custom folder containing config.json and raw audio files. Supports key-by-key layouts.',
    feat4Title: 'Ultra-Lightweight',
    feat4Desc: 'Runs unobtrusively in your system tray or accessibility layer. Uses negligible CPU and battery resources, preserving game performance.',
    installTitle: 'Installation & Permission Guide',
    installDesc: 'Follow these straightforward steps to bypass OS security blocks and grant required accessibility permissions.',
    tabMac: '🍎 macOS Guide',
    tabAndroid: '🤖 Android Guide',
    macStep1Title: 'Get License & Extract Package',
    macStep1Desc: 'After acquiring your license, download the DDalGGak.zip package, unzip it, and move DDalGGak.app into your Applications folder.',
    macStep2Title: 'Resolve Developer Signature Warning (Gatekeeper)',
    macStep2Desc: 'Because the binary is self-signed, macOS might display "unidentified developer" or "damaged and can\'t be opened" warnings. Solve this in seconds:',
    macStep2MethodATitle: 'Method A: Right-Click & Open (Recommended)',
    macStep2MethodADesc: 'Instead of double-clicking the app, Right-Click → Open. A dialogue will appear with an [Open] button. Click it to register the app in your security whitelist permanently.',
    macStep2MethodBTitle: 'Method B: Bypass via Terminal Command',
    macStep2MethodBDesc: 'Open Terminal and run the following command to strip the quarantine flag:',
    macStep2MethodBNote: '* Note: If you downloaded it multiple times, ensure the name matches (e.g. "/Applications/DDalGGak 2.app").',
    macStep3Title: 'Grant Input & Accessibility Permissions',
    macStep3Desc: 'To detect system-wide key presses and play sounds, enable accessibility permissions (fully localized, secure, and private):',
    macStep3Accessibility: 'Accessibility: System Settings -> Privacy & Security -> Accessibility -> Enable DDalGGak',
    macStep3Input: 'Input Monitoring: System Settings -> Privacy & Security -> Input Monitoring -> Enable DDalGGak',
    androidStep1Title: 'Download Android APK',
    androidStep1Desc: 'Purchase your license, download the ddalggak.apk installer package, and run it on your mobile device.',
    androidStep2Title: 'Bypass Play Protect & Install Anyway',
    androidStep2Desc: 'Since this app is distributed directly outside Google Play Store, Play Protect might prompt warning dialogues:',
    androidStep2PlayProtect: 'Play Protect Banner: Tap "More details" → "Install anyway" to bypass.',
    androidStep2Source: 'Source Authorization: If prompted by your browser or file manager, toggle "Allow installs from this source".',
    androidStep3Title: 'Enable DDalGGak Accessibility Service',
    androidStep3Desc: 'Open the app, tap the status banner at the top to navigate to system settings, and enable the service:',
    androidStep3Install: 'Navigate to Installed Apps or Downloaded Services.',
    androidStep3Select: 'Select DDalGGak (Mechanical Keyboard Sound).',
    androidStep3Toggle: 'Toggle the switch to [ON]. Enjoy typing anywhere!',
    pricingBadge: 'Indie Pricing',
    pricingTitle: 'Exactly $2. Lifetime Access.',
    pricingDesc: 'No subscriptions. No tracking. Support the project for just two dollars and unlock pre-built native binaries, lifetime updates, and custom soundpacks.',
    pricingSub: 'One-time payment • Lifetime upgrades',
    btnBuyLarge: 'Buy Lifetime License 🔑',
    ctaTitle: 'Enjoying the Mechanical Sounds?',
    ctaDesc: 'DDalGGak is fully open source. Give us a Star on GitHub or buy a license to help us add more premium switch sounds!',
    btnStar: 'Star on GitHub ⭐',
    btnSupport: 'Support the Developer 🔑',
    footerRelease: '© 2026 DDalGGak Project. Released under CC0 & MIT License. 100% Local Utility.',
    footerSub: 'Designed with premium glassmorphism. For personal testing and evaluation.',
    copyBtn: 'Copy',
    copiedBtn: 'Copied!',
    licenseKeyTitle: 'Your License Key',
    licenseKeyDesc: 'Save this key! You will need it to activate DDalGGak.',
    downloadMac: 'Download for macOS',
    downloadAndroid: 'Download for Android',
    licenseActivated: 'License Activated!',
    licenseActivatedDesc: 'Thank you for your purchase. Download the app and enter your license key to start using DDalGGak.',
    closeBtn: 'Close',
  },
  ko: {
    navDemo: '웹 데모',
    navFeatures: '주요 기능',
    navInstall: '설치 가이드',
    navPricing: '가격',
    badge: '100% 오프라인 & 광고 없음',
    heroTitle: '타이핑을 더',
    heroSubtitleColor: '즐겁고 찰지게',
    heroDesc: '키보드를 누를 때마다 찰진 기계식 타건음을 실시간으로 들려주는 초저지연 오디오 에뮬레이터입니다. 기기 내 로컬 렌더러로 반응 속도가 손가락 끝과 일치하며, 사용자 커스텀 사운드팩을 완벽하게 지원합니다.',
    btnBuy: '평생 라이선스 구매 - $2 💎',
    mockupListening: '작동 중',
    mockupBlueName: '청축 (Blue)',
    mockupBlueDesc: '찰진 구분감과 경쾌한 클릭 타건음',
    mockupBrownName: '갈축 (Brown)',
    mockupBrownDesc: '서걱서걱하고 부드러운 넌클릭 타건음',
    mockupRedName: '적축 (Red)',
    mockupRedDesc: '걸림 없이 매끄러운 리니어 타건음',
    mockupThockName: '보글이 (Thock)',
    mockupThockDesc: '보글보글 조용하고 중독적인 조약돌 소리',
    demoTitle: '웹 데모 플레이그라운드',
    demoDesc: '아래에서 스위치 종류를 고르고 키보드를 두드려보세요! 실제 타건 소리를 즉시 체험하실 수 있습니다.',
    demoBlue: 'Blue (청축)',
    demoBrown: 'Brown (갈축)',
    demoRed: 'Red (적축)',
    demoThock: 'Thock (황축)',
    demoSpace: '스페이스바',
    demoInstructions: '아무 키나 타이핑하거나 마우스로 클릭해 타건음을 감상해보세요.',
    featuresTitle: '왜 딸깍(DDalGGak)인가요?',
    featuresDesc: '기존 키보드 소리 에뮬레이터들과는 급이 다른 최적화와 보안성을 제공합니다.',
    feat1Title: '극도의 초저지연',
    feat1Desc: 'macOS 상의 네이티브 엔진은 오디오 버퍼를 0.2마이크로초 내에 스케줄링합니다. 키를 누름과 동시에 소리가 즉시 재생됩니다.',
    feat2Title: '100% 개인정보 보호',
    feat2Desc: '인터넷 액세스 권한을 요구하지 않습니다. 입력하는 글자나 키 로그는 절대 기기 외부로 전송되거나 저장되지 않습니다.',
    feat3Title: '커스텀 사운드팩 지원',
    feat3Desc: '설정 파일과 사운드 파일이 들어있는 폴더를 직접 등록할 수 있습니다. 키별 커스텀 사운드 매핑을 지원합니다.',
    feat4Title: '친화적인 백그라운드 구동',
    feat4Desc: '메뉴 막대나 시스템 백그라운드에서 가볍게 구동됩니다. CPU 및 배터리 소모를 극도로 억제하여 게임 중에도 영향이 없습니다.',
    installTitle: '설치 및 권한 설정 가이드',
    installDesc: '플랫폼별 보안 경고 해결 및 권한 허용 절차를 따라 안전하게 온보딩을 완료해 보세요.',
    tabMac: '🍎 macOS 가이드',
    tabAndroid: '🤖 Android 가이드',
    macStep1Title: '라이선스 획득 및 압축 해제',
    macStep1Desc: '라이선스를 구매한 후 다운로드한 DDalGGak.zip 패키지의 압축을 풀고, DDalGGak.app 파일을 응용 프로그램(Applications) 폴더로 이동합니다.',
    macStep2Title: '보안 경고 (Gatekeeper) 및 차단 해결',
    macStep2Desc: '자가 서명(Self-signed)된 빌드이므로 macOS에서 "개발자를 확인할 수 없음" 또는 "손상되었기 때문에 열 수 없음" 경고가 표시될 수 있습니다. 아래 방법 중 하나로 해결해 주세요:',
    macStep2MethodATitle: '방법 A: 마우스 우클릭으로 열기 (권장)',
    macStep2MethodADesc: 'Finder에서 앱을 더블 클릭하지 말고, 마우스 우클릭 -> 열기(Open)를 선택합니다. 경고창에서 [열기] 버튼을 누르면 화이트리스트에 즉시 등록됩니다.',
    macStep2MethodBTitle: '방법 B: 터미널 명령어로 직접 격리 제거',
    macStep2MethodBDesc: '터미널을 열고 아래 명령어를 복사하여 실행합니다.',
    macStep2MethodBNote: '* 이름에 숫자가 붙은 경우: xattr -cr "/Applications/DDalGGak 2.app" 형태로 실행',
    macStep3Title: '손쉬운 사용 및 입력 모니터링 권한 부여',
    macStep3Desc: '어느 앱에서 타이핑하든 키 소리를 실시간으로 재생하려면 아래 권한들을 허용해 주어야 합니다.',
    macStep3Accessibility: '손쉬운 사용: 시스템 설정 -> 개인정보 보호 및 보안 -> 손쉬운 사용 -> 딸깍(DDalGGak) 허용',
    macStep3Input: '입력 모니터링: 시스템 설정 -> 개인정보 보호 및 보안 -> 입력 모니터링 -> 딸깍(DDalGGak) 허용',
    androidStep1Title: '안드로이드 설치 APK 준비',
    androidStep1Desc: '라이선스를 구매한 후 다운로드한 ddalggak.apk 설치 파일을 실행합니다.',
    androidStep2Title: '출처가 불분명한 앱 설치 허용',
    androidStep2Desc: '구글 플레이스토어 외부 설치이므로 경고 창이 뜰 수 있습니다. 절차에 따라 허용해 줍니다.',
    androidStep2PlayProtect: '보안 차단 발생 시: 안내 팝업창에서 "무시하고 설치"를 선택하여 진행합니다.',
    androidStep2Source: '설치 권한 팝업 시: 파일 관리자나 브라우저 앱에 대해 "이 출처의 앱 설치 허용"을 켜줍니다.',
    androidStep3Title: '접근성 서비스에서 권한 활성화',
    androidStep3Desc: '설치된 딸깍 앱을 실행하고 화면 상단의 접근성 설정 켜기를 누르면 시스템 설정으로 바로 이동합니다.',
    androidStep3Install: '설정의 설치된 앱 또는 다운로드된 서비스 카테고리로 들어갑니다.',
    androidStep3Select: '목록에서 딸깍 (기계식 키보드 소리) 서비스를 선택합니다.',
    androidStep3Toggle: '서비스 사용 스위치를 [사용함(ON)]으로 켜 줍니다. 이제 어디서나 타건음을 즐기세요!',
    pricingBadge: '인디 가격',
    pricingTitle: '단돈 2달러. 영구 사용 라이선스.',
    pricingDesc: '구독료나 내부 트래커가 없습니다. 2달러의 후원으로 빌드된 네이티브 바이너리 영구 업그레이드와 커스텀 사운드팩 기능을 잠금 해제하세요.',
    pricingSub: '일시불 결제 • 평생 업그레이드 제공',
    btnBuyLarge: '라이선스 구매하기 🔑',
    ctaTitle: '타건음이 마음에 드셨나요?',
    ctaDesc: '딸깍은 완전히 공개된 오픈소스 프로젝트입니다. 깃허브 스타를 주거나 라이선스를 구매하여 개발을 응원해 주세요!',
    btnStar: 'GitHub 스타 주기 ⭐',
    btnSupport: '개발자 후원하기 🔑',
    footerRelease: '© 2026 딸깍 프로젝트. CC0 & MIT 라이선스 제공. 100% 로컬 유틸리티.',
    footerSub: '고급 글래스모피즘 디자인 적용. 개인 테스트 및 검증용 빌드.',
    copyBtn: '복사',
    copiedBtn: '복사 완료!',
    licenseKeyTitle: '라이선스 키',
    licenseKeyDesc: '이 키를 저장하세요! DDalGGak 활성화에 필요합니다.',
    downloadMac: 'macOS 다운로드',
    downloadAndroid: 'Android 다운로드',
    licenseActivated: '라이선스 활성화 완료!',
    licenseActivatedDesc: '구매해 주셔서 감사합니다. 앱을 다운로드하고 라이선스 키를 입력하여 DDalGGak을 시작하세요.',
    closeBtn: '닫기',
  }
};

function LandingPage() {
  const [lang, setLang] = useState('ko');
  const [activeSwitch, setActiveSwitch] = useState('blue');
  const [activeKeys, setActiveKeys] = useState({});
  const [copyStatus, setCopyStatus] = useState({});
  const [activeInstallTab, setActiveInstallTab] = useState('macos');
  const [licenseKey, setLicenseKey] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const t = TRANSLATIONS[lang];

  // Audio elements pool for low latency polyphony
  const audioPool = useRef({});
  const poolCursors = useRef({
    blue: 0,
    brown: 0,
    red: 0,
    thock: 0
  });

  // Initialize Paddle on mount
  useEffect(() => {
    initializePaddle({
      eventCallback: (event) => {
        if (event.name === 'checkout.completed') {
          const transactionId = event.data?.transaction_id || event.data?.transaction?.id;
          if (transactionId && /^txn_[a-zA-Z0-9]+$/.test(transactionId)) {
            window.location.href = `${window.location.origin}/?success=true&transaction_id=${transactionId}`;
          }
        }
      }
    }).catch(err => {
      console.error('Failed to initialize Paddle:', err);
    });

    // Check URL for success callback
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      const key = params.get('license_key');
      const transactionId = params.get('transaction_id');

      // Validate inputs from URL params before taking action (XSS & Injection protection)
      const isKeyValid = key && /^DDGG-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/.test(key.trim().toUpperCase());
      const isTxIdValid = transactionId && /^txn_[a-zA-Z0-9]+$/.test(transactionId.trim());

      if (isKeyValid) {
        setLicenseKey(key.trim().toUpperCase());
        setShowSuccess(true);
      } else if (isTxIdValid) {
        setShowSuccess(true);
        setLicenseKey('Generating license key... Please wait.');

        let attempts = 0;
        const interval = setInterval(async () => {
          attempts++;
          try {
            if (!supabase) {
              setLicenseKey('Database connection is not configured. Please contact support.');
              clearInterval(interval);
              return;
            }

            const { data, error } = await supabase
              .from('license_keys')
              .select('license_key')
              .eq('paddle_order_id', transactionId.trim())
              .maybeSingle();

            if (data && data.license_key) {
              setLicenseKey(data.license_key);
              clearInterval(interval);
            } else if (attempts >= 15) {
              setLicenseKey('License key has been generated, but we took too long to fetch it. Please check your email or contact support.');
              clearInterval(interval);
            }
          } catch (err) {
            console.error('Error fetching license key:', err);
            if (attempts >= 15) {
              setLicenseKey('Failed to load license key. Please check your email or contact support.');
              clearInterval(interval);
            }
          }
        }, 2000);

        return () => clearInterval(interval);
      }
    }
  }, []);

  // Preload audio files on mount
  useEffect(() => {
    // Initialize audio pool (12 channels per switch)
    SWITCHES.forEach(sw => {
      audioPool.current[sw] = [];
      for (let i = 0; i < 12; i++) {
        const audio = new Audio(`/sounds/${sw}-01.wav`);
        audio.preload = 'auto';
        audioPool.current[sw].push(audio);
      }
    });

    return () => {
      document.body.className = '';
    };
  }, []);

  // Update body class whenever active switch changes
  useEffect(() => {
    document.body.className = `theme-${activeSwitch}`;
  }, [activeSwitch]);

  // Trigger switch sound
  const playSound = (switchType) => {
    const pool = audioPool.current[switchType];
    if (!pool || pool.length === 0) return;

    const cursor = poolCursors.current[switchType];
    const audio = pool[cursor];

    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.75;
      audio.play().catch(() => {
        // Browser block autoplay guard
      });
    }

    poolCursors.current[switchType] = (cursor + 1) % pool.length;
  };

  // Switch selection handler
  const handleSelectSwitch = (switchType) => {
    if (!SWITCHES.includes(switchType)) return;
    setActiveSwitch(switchType);
    playSound(switchType);
  };

  // Keyboard Event Listeners for Demo Playground
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }

      const char = e.key.toLowerCase();
      const keyId = KEY_MAP[char];

      if (keyId) {
        if (char === ' ') {
          const isPlayground = e.target.closest('.playground-section');
          if (isPlayground) {
            e.preventDefault();
          }
        }

        setActiveKeys(prev => ({ ...prev, [keyId]: true }));
        playSound(activeSwitch);
      }
    };

    const handleKeyUp = (e) => {
      const char = e.key.toLowerCase();
      const keyId = KEY_MAP[char];
      if (keyId) {
        setActiveKeys(prev => ({ ...prev, [keyId]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeSwitch]);

  // Mouse/Touch Keypress simulation
  const handleKeyClick = (keyId) => {
    setActiveKeys(prev => ({ ...prev, [keyId]: true }));
    playSound(activeSwitch);
    setTimeout(() => {
      setActiveKeys(prev => ({ ...prev, [keyId]: false }));
    }, 100);
  };

  // Copy to clipboard helper
  const handleCopyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [key]: false }));
      }, 2000);
    });
  };

  // Open Paddle Checkout
  const handleBuyClick = () => {
    openCheckout();
  };

  const codeQuarantineText = `xattr -cr /Applications/DDalGGak.app`;

  return (
    <div className="app-container">
      <header className="navbar">
        <div className="nav-container">
          <div className="logo">
            <img src="/DDalGGakIcon.svg" alt="DDalGGak Icon" className="logo-img" />
            <span className="logo-text">DDalGGak</span>
          </div>
          <nav className="nav-links">
            <a href="#demo">{t.navDemo}</a>
            <a href="#features">{t.navFeatures}</a>
            <a href="#install">{t.navInstall}</a>
            <a href="#pricing">{t.navPricing}</a>

            {/* Language Selector Toggle */}
            <button
              className="lang-toggle-btn"
              onClick={() => setLang(lang === 'en' ? 'ko' : 'en')}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                padding: '8px 14px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
                marginRight: '8px'
              }}
            >
              🌐 {lang === 'en' ? '한국어' : 'English'}
            </button>

            <a href="https://github.com/Great-Grace/DDalGGak" target="_blank" rel="noopener noreferrer" className="github-btn">
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <div className="badge">{t.badge}</div>
            <h1>{t.heroTitle}<br /><span className="gradient-text">{t.heroSubtitleColor}</span></h1>
            <p className="hero-subtitle">{t.heroDesc}</p>
            <div className="hero-actions">
              <button
                onClick={handleBuyClick}
                className="btn primary-btn"
              >
                <span>{t.btnBuy}</span>
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="app-mockup">
              <div className="mockup-header">
                <span className="mockup-title">DDalGGak.app</span>
                <div className="mockup-controls">
                  <span className="dot enabled"></span>
                  <span className="status-label">{t.mockupListening}</span>
                </div>
              </div>
              <div className="mockup-body">
                <button className={`profile-row ${activeSwitch === 'blue' ? 'selected' : ''}`} onClick={() => handleSelectSwitch('blue')}>
                  <span className="profile-accent blue"></span>
                  <div className="profile-info">
                    <span className="profile-name">{t.mockupBlueName}</span>
                    <span className="profile-desc">{t.mockupBlueDesc}</span>
                  </div>
                </button>
                <button className={`profile-row ${activeSwitch === 'brown' ? 'selected' : ''}`} onClick={() => handleSelectSwitch('brown')}>
                  <span className="profile-accent brown"></span>
                  <div className="profile-info">
                    <span className="profile-name">{t.mockupBrownName}</span>
                    <span className="profile-desc">{t.mockupBrownDesc}</span>
                  </div>
                </button>
                <button className={`profile-row ${activeSwitch === 'red' ? 'selected' : ''}`} onClick={() => handleSelectSwitch('red')}>
                  <span className="profile-accent red"></span>
                  <div className="profile-info">
                    <span className="profile-name">{t.mockupRedName}</span>
                    <span className="profile-desc">{t.mockupRedDesc}</span>
                  </div>
                </button>
                <button className={`profile-row ${activeSwitch === 'thock' ? 'selected' : ''}`} onClick={() => handleSelectSwitch('thock')}>
                  <span className="profile-accent thock"></span>
                  <div className="profile-info">
                    <span className="profile-name">{t.mockupThockName}</span>
                    <span className="profile-desc">{t.mockupThockDesc}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Success Modal */}
        {showSuccess && (
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-modal-title"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
          >
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '24px',
              padding: '40px',
              maxWidth: '500px',
              width: '100%',
              border: '1px solid rgba(255,255,255,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }} aria-hidden="true">🎉</div>
              <h2 id="success-modal-title" style={{ color: '#fff', marginBottom: '8px' }}>{t.licenseActivated}</h2>
              <p style={{ color: 'var(--color-secondary)', marginBottom: '24px' }}>{t.licenseActivatedDesc}</p>

              <div style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px'
              }}>
                <div style={{ color: 'var(--color-tertiary)', fontSize: '12px', marginBottom: '8px' }}>{t.licenseKeyTitle}</div>
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '18px',
                  color: '#5c6bf2',
                  wordBreak: 'break-all',
                  padding: '12px',
                  background: 'rgba(92, 107, 242, 0.1)',
                  borderRadius: '8px'
                }}>
                  {licenseKey}
                </div>
                <button
                  onClick={() => handleCopyToClipboard(licenseKey, 'license')}
                  style={{
                    marginTop: '12px',
                    background: 'rgba(92, 107, 242, 0.2)',
                    border: '1px solid rgba(92, 107, 242, 0.3)',
                    color: '#5c6bf2',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  {copyStatus['license'] ? t.copiedBtn : t.copyBtn}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <a href="/DDalGGak.zip" download className="btn primary-btn" style={{ padding: '12px 24px' }}>
                  {t.downloadMac}
                </a>
                <a href="/ddalggak.apk" download className="btn primary-btn" style={{ padding: '12px 24px', background: '#4CAF50' }}>
                  {t.downloadAndroid}
                </a>
              </div>

              <button
                onClick={() => {
                  setShowSuccess(false);
                  // Clean up URL parameters so refresh doesn't trigger modal again
                  window.history.replaceState({}, document.title, window.location.pathname);
                }}
                style={{
                  marginTop: '20px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-tertiary)',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {t.closeBtn}
              </button>
            </div>
          </div>
        )}

        {/* Interactive Playground */}
        <section id="demo" className="playground-section">
          <div className="section-header">
            <h2>{t.demoTitle}</h2>
            <p>{t.demoDesc}</p>
          </div>
          <div className="playground">
            <div className="switch-selector">
              <button className={`switch-tab ${activeSwitch === 'blue' ? 'active' : ''}`} onClick={() => handleSelectSwitch('blue')}>
                <span className="color-dot blue"></span>
                {t.demoBlue}
              </button>
              <button className={`switch-tab ${activeSwitch === 'brown' ? 'active' : ''}`} onClick={() => handleSelectSwitch('brown')}>
                <span className="color-dot brown"></span>
                {t.demoBrown}
              </button>
              <button className={`switch-tab ${activeSwitch === 'red' ? 'active' : ''}`} onClick={() => handleSelectSwitch('red')}>
                <span className="color-dot red"></span>
                {t.demoRed}
              </button>
              <button className={`switch-tab ${activeSwitch === 'thock' ? 'active' : ''}`} onClick={() => handleSelectSwitch('thock')}>
                <span className="color-dot thock"></span>
                {t.demoThock}
              </button>
            </div>

            <div className="keyboard-preview">
              {KEYBOARD_ROWS.map((row, rIdx) => (
                <div key={rIdx} className="keyboard-row">
                  {row.map(char => {
                    const keyId = `key-${char.toLowerCase()}`;
                    return (
                      <div
                        key={char}
                        id={keyId}
                        className={`key ${activeKeys[keyId] ? 'active' : ''}`}
                        onMouseDown={() => handleKeyClick(keyId)}
                      >
                        {char}
                      </div>
                    );
                  })}
                </div>
              ))}
              <div className="keyboard-row">
                <div
                  id="key-space"
                  className={`key wide ${activeKeys['key-space'] ? 'active' : ''}`}
                  onMouseDown={() => handleKeyClick('key-space')}
                >
                  {t.demoSpace}
                </div>
              </div>
            </div>
            <div className="playground-instructions">
              <span className="pulse-icon">⌨️</span> {t.demoInstructions}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section">
          <div className="section-header">
            <h2>{t.featuresTitle}</h2>
            <p>{t.featuresDesc}</p>
          </div>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡️</div>
              <h3>{t.feat1Title}</h3>
              <p>{t.feat1Desc}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>{t.feat2Title}</h3>
              <p>{t.feat2Desc}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📁</div>
              <h3>{t.feat3Title}</h3>
              <p>{t.feat3Desc}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔋</div>
              <h3>{t.feat4Title}</h3>
              <p>{t.feat4Desc}</p>
            </div>
          </div>
        </section>

        {/* Installation & Usage Guide */}
        <section id="install" className="install-section">
          <div className="section-header">
            <h2>{t.installTitle}</h2>
            <p>{t.installDesc}</p>
          </div>

          <div className="install-tabs" style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
            <button
              className={`switch-tab ${activeInstallTab === 'macos' ? 'active' : ''}`}
              onClick={() => setActiveInstallTab('macos')}
            >
              {t.tabMac}
            </button>
            <button
              className={`switch-tab ${activeInstallTab === 'android' ? 'active' : ''}`}
              onClick={() => setActiveInstallTab('android')}
            >
              {t.tabAndroid}
            </button>
          </div>

          <div className="install-container">
            {activeInstallTab === 'macos' ? (
              <>
                <div className="step-card">
                  <div className="step-num">1</div>
                  <div className="step-content">
                    <h3>{t.macStep1Title}</h3>
                    <p>{t.macStep1Desc}</p>
                  </div>
                </div>

                <div className="step-card">
                  <div className="step-num">2</div>
                  <div className="step-content">
                    <h3>{t.macStep2Title}</h3>
                    <p>{t.macStep2Desc}</p>

                    <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', border: '1px solid var(--color-border)', marginBottom: '16px' }}>
                      <strong style={{ color: 'var(--accent-active)', display: 'block', marginBottom: '6px' }}>{t.macStep2MethodATitle}</strong>
                      <span style={{ fontSize: '13px', color: 'var(--color-secondary)', lineHeight: '1.5', display: 'block' }}>
                        {t.macStep2MethodADesc}
                      </span>
                    </div>

                    <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                      <strong style={{ color: 'var(--accent-active)', display: 'block', marginBottom: '6px' }}>{t.macStep2MethodBTitle}</strong>
                      <span style={{ fontSize: '13px', color: 'var(--color-secondary)', lineHeight: '1.5', display: 'block', marginBottom: '8px' }}>
                        {t.macStep2MethodBDesc}
                      </span>
                      <div className="code-box" style={{ marginBottom: '8px' }}>
                        <pre><code>{codeQuarantineText}</code></pre>
                        <button
                          className={`copy-btn ${copyStatus['quarantine'] ? 'copied' : ''}`}
                          onClick={() => handleCopyToClipboard(codeQuarantineText, 'quarantine')}
                        >
                          {copyStatus['quarantine'] ? t.copiedBtn : t.copyBtn}
                        </button>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--color-tertiary)' }}>
                        {t.macStep2MethodBNote}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="step-card">
                  <div className="step-num">3</div>
                  <div className="step-content">
                    <h3>{t.macStep3Title}</h3>
                    <p>{t.macStep3Desc}</p>
                    <ul className="permission-list" style={{ gap: '10px' }}>
                      <li>
                        <strong>{t.macStep3Accessibility}</strong>
                      </li>
                      <li>
                        <strong>{t.macStep3Input}</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="step-card">
                  <div className="step-num">1</div>
                  <div className="step-content">
                    <h3>{t.androidStep1Title}</h3>
                    <p>{t.androidStep1Desc}</p>
                  </div>
                </div>

                <div className="step-card">
                  <div className="step-num">2</div>
                  <div className="step-content">
                    <h3>{t.androidStep2Title}</h3>
                    <p>{t.androidStep2Desc}</p>
                    <ul className="permission-list" style={{ gap: '8px' }}>
                      <li><strong>{t.androidStep2PlayProtect}</strong></li>
                      <li><strong>{t.androidStep2Source}</strong></li>
                    </ul>
                  </div>
                </div>

                <div className="step-card">
                  <div className="step-num">3</div>
                  <div className="step-content">
                    <h3>{t.androidStep3Title}</h3>
                    <p>{t.androidStep3Desc}</p>
                    <ul className="permission-list" style={{ gap: '8px' }}>
                      <li>{t.androidStep3Install}</li>
                      <li>{t.androidStep3Select}</li>
                      <li>{t.androidStep3Toggle}</li>
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="pricing-section" style={{ padding: '60px 20px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '24px', border: '1px solid var(--color-border)', margin: '40px 0', textAlign: 'center' }}>
          <div className="section-header" style={{ marginBottom: '32px' }}>
            <span className="badge" style={{ background: 'rgba(92, 107, 242, 0.15)', color: '#5c6bf2' }}>{t.pricingBadge}</span>
            <h2 style={{ fontSize: '32px', fontWeight: '800', marginTop: '12px' }}>{t.pricingTitle}</h2>
            <p style={{ maxWidth: '600px', margin: '12px auto 0', color: 'var(--color-secondary)' }}>{t.pricingDesc}</p>
          </div>
          <div style={{ display: 'inline-block', padding: '32px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '20px', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '48px', fontWeight: '900', color: '#fff', marginBottom: '8px' }}>$2.00</div>
            <div style={{ color: 'var(--color-tertiary)', fontSize: '14px', marginBottom: '24px' }}>{t.pricingSub}</div>
            <button
              onClick={handleBuyClick}
              className="btn coffee-btn"
            >
              {t.btnBuyLarge}
            </button>
          </div>
        </section>

        {/* CTA & Support Section */}
        <section className="cta-section">
          <h2>{t.ctaTitle}</h2>
          <p>{t.ctaDesc}</p>
          <div className="cta-actions">
            <a href="https://github.com/Great-Grace/DDalGGak" target="_blank" rel="noopener noreferrer" className="btn primary-btn">
              <span>{t.btnStar}</span>
            </a>
            <button onClick={handleBuyClick} className="btn coffee-btn">
              <span>{t.btnSupport}</span>
            </button>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 16 }}>
            <Link to="/terms-of-service" style={{ color: 'var(--color-secondary)', fontSize: 13 }}>Terms of Service</Link>
            <Link to="/privacy-policy" style={{ color: 'var(--color-secondary)', fontSize: 13 }}>Privacy Policy</Link>
            <Link to="/refund-policy" style={{ color: 'var(--color-secondary)', fontSize: 13 }}>Refund Policy</Link>
          </div>
          <p>{t.footerRelease}</p>
          <p className="footer-sub">{t.footerSub}</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/refund-policy" element={<RefundPolicy />} />
    </Routes>
  );
}
