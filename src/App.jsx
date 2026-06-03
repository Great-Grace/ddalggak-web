import React, { useState, useEffect, useRef } from 'react';

const SWITCHES = ['blue', 'brown', 'red', 'thock'];

const KEY_MAP = {
  'q': 'key-q', 'w': 'key-w', 'e': 'key-e', 'r': 'key-r', 't': 'key-t',
  'y': 'key-y', 'u': 'key-u', 'i': 'key-i', 'o': 'key-o', 'p': 'key-p',
  'a': 'key-a', 's': 'key-s', 'd': 'key-d', 'f': 'key-f', 'g': 'key-g',
  'h': 'key-h', 'j': 'key-j', 'k': 'key-k', 'l': 'key-l',
  'z': 'key-z', 'x': 'key-x', 'c': 'key-c', 'v': 'key-v', 'b': 'key-b',
  'n': 'key-n', 'm': 'key-m',
  ' ': 'key-space'
};

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

export default function App() {
  const [activeSwitch, setActiveSwitch] = useState('blue');
  const [activeKeys, setActiveKeys] = useState({});
  const [copyStatus, setCopyStatus] = useState({});

  // Audio elements pool for low latency polyphony
  const audioPool = useRef({});
  const poolCursors = useRef({
    blue: 0,
    brown: 0,
    red: 0,
    thock: 0
  });

  // Preload audio files on mount
  useEffect(() => {
    // Set initial theme class
    document.body.className = `theme-${activeSwitch}`;

    // Initialize audio pool (10 channels per switch)
    SWITCHES.forEach(sw => {
      audioPool.current[sw] = [];
      for (let i = 0; i < 12; i++) {
        const audio = new Audio(`/sounds/${sw}-01.wav`);
        audio.preload = 'auto';
        audioPool.current[sw].push(audio);
      }
    });

    return () => {
      // Cleanup body class
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
    if (!pool) return;

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
      // Skip if user is inside a form input element
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }

      const char = e.key.toLowerCase();
      const keyId = KEY_MAP[char];

      if (keyId) {
        // Prevent page scroll on spacebar inside playground focus
        if (char === ' ') {
          const isPlayground = e.target.closest('.playground-section');
          if (isPlayground) {
            e.preventDefault();
          }
        }

        // Trigger active visual key
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

  const codeBuildText = `git clone https://github.com/Great-Grace/DDalGGak.git
cd DDalGGak
Scripts/package_app.sh
rm -rf /Applications/DDalGGak.app
cp -R dist/DDalGGak.app /Applications/
open /Applications/DDalGGak.app`;

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
            <a href="#demo">웹 데모</a>
            <a href="#features">주요 기능</a>
            <a href="#install">설치 방법</a>
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
            <div className="badge">v0.1.0 Release</div>
            <h1>타이핑을 더 즐겁게,<br /><span className="gradient-text">딸깍 (DDalGGak)</span></h1>
            <p className="hero-subtitle">키보드를 누를 때마다 찰진 기계식 타건음을 실시간으로 들려주는 macOS 메뉴 바 앱입니다. 100% 로컬 오디오 렌더러로 반응 속도가 손가락 끝과 일치합니다.</p>
            <div className="hero-actions">
              <a href="#install" className="btn primary-btn">
                <span>지금 무료 설치</span>
              </a>
              <a href="#demo" className="btn secondary-btn">웹 데모 체험하기</a>
            </div>
          </div>
          <div className="hero-visual">
            {/* App Mockup Floating UI */}
            <div className="app-mockup">
              <div className="mockup-header">
                <span className="mockup-title">DDalGGak.app</span>
                <div className="mockup-controls">
                  <span className="dot enabled"></span>
                  <span className="status-label">Listening</span>
                </div>
              </div>
              <div className="mockup-body">
                <button className={`profile-row ${activeSwitch === 'blue' ? 'selected' : ''}`} onClick={() => handleSelectSwitch('blue')}>
                  <span className="profile-accent blue"></span>
                  <div className="profile-info">
                    <span className="profile-name">Blue Click</span>
                    <span className="profile-desc">청량하고 클래식한 버클링 스프링 타건음</span>
                  </div>
                </button>
                <button className={`profile-row ${activeSwitch === 'brown' ? 'selected' : ''}`} onClick={() => handleSelectSwitch('brown')}>
                  <span className="profile-accent brown"></span>
                  <div className="profile-info">
                    <span className="profile-name">Brown Tactile</span>
                    <span className="profile-desc">구분감이 뚜렷하고 정갈한 넌클릭 타건음</span>
                  </div>
                </button>
                <button className={`profile-row ${activeSwitch === 'red' ? 'selected' : ''}`} onClick={() => handleSelectSwitch('red')}>
                  <span className="profile-accent red"></span>
                  <div className="profile-info">
                    <span className="profile-name">Red Linear</span>
                    <span className="profile-desc">부드럽고 신속한 로우 프로파일 타건음</span>
                  </div>
                </button>
                <button className={`profile-row ${activeSwitch === 'thock' ? 'selected' : ''}`} onClick={() => handleSelectSwitch('thock')}>
                  <span className="profile-accent thock"></span>
                  <div className="profile-info">
                    <span className="profile-name">Deep Thock</span>
                    <span className="profile-desc">조용하고 깊이 있는 저소음 황축 타건음</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Playground */}
        <section id="demo" className="playground-section">
          <div className="section-header">
            <h2>웹 데모 플레이그라운드</h2>
            <p>아래에서 스위치 종류를 고르고 키보드를 마구 두드려보세요! 실제 타건 소리를 즉시 체험하실 수 있습니다.</p>
          </div>
          <div className="playground">
            <div className="switch-selector">
              <button className={`switch-tab ${activeSwitch === 'blue' ? 'active' : ''}`} onClick={() => handleSelectSwitch('blue')}>
                <span className="color-dot blue"></span>
                Blue (청축)
              </button>
              <button className={`switch-tab ${activeSwitch === 'brown' ? 'active' : ''}`} onClick={() => handleSelectSwitch('brown')}>
                <span className="color-dot brown"></span>
                Brown (갈축)
              </button>
              <button className={`switch-tab ${activeSwitch === 'red' ? 'active' : ''}`} onClick={() => handleSelectSwitch('red')}>
                <span className="color-dot red"></span>
                Red (적축)
              </button>
              <button className={`switch-tab ${activeSwitch === 'thock' ? 'active' : ''}`} onClick={() => handleSelectSwitch('thock')}>
                <span className="color-dot thock"></span>
                Thock (황축)
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
                  SPACE
                </div>
              </div>
            </div>
            <div className="playground-instructions">
              <span className="pulse-icon">⌨️</span> 아무 키나 타이핑하거나 마우스로 클릭해 타건음을 감상해보세요.
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section">
          <div className="section-header">
            <h2>왜 딸깍(DDalGGak)인가요?</h2>
            <p>기존 키보드 소리 에뮬레이터들과는 급이 다른 최적화와 보안성을 제공합니다.</p>
          </div>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡️</div>
              <h3>극도의 초저지연 오디오</h3>
              <p>C 언어로 구축된 커스텀 믹서 엔진이 오디오 스케줄링을 단 <strong>0.2마이크로초(0.0002ms)</strong> 만에 끝내며, 하드웨어 버퍼 최적화를 통해 키를 누름과 동시에 소리가 재생됩니다.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>100% 로컬 보안성</h3>
              <p>어떠한 인터넷 연결도 요구하지 않습니다. 사용자가 입력하는 글자, 키 로그, 활동 데이터를 외부 서버로 일절 전송하거나 저장하지 않는 완전한 프라이빗 환경을 보장합니다.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔊</div>
              <h3>다양한 고품질 커스텀 음원</h3>
              <p>청축, 갈축, 적축, 황축 고품질 음원이 기본 내장되어 있으며, 원할 경우 사용자 폴더에 직접 리얼 음원을 추가하여 기호에 맞춰 오버라이드할 수 있습니다.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎛️</div>
              <h3>친화적인 백그라운드 구동</h3>
              <p>macOS 상단 메뉴 막대에서 한눈에 켜고 끄기, 스위치 변경 등을 빠르게 조작할 수 있습니다. 시스템 자원 소모와 배터리 소모를 극도로 억제하도록 설계되었습니다.</p>
            </div>
          </div>
        </section>

        {/* Installation & Usage Guide */}
        <section id="install" className="install-section">
          <div className="section-header">
            <h2>쉽고 빠른 설치 가이드</h2>
            <p>Xcode Command Line Tools 또는 빌드 셸을 사용해 맥북에 설치하는 법을 안내합니다.</p>
          </div>
          
          <div className="install-container">
            <div className="step-card">
              <div className="step-num">1</div>
              <div className="step-content">
                <h3>소스 빌드 및 배포</h3>
                <p>터미널을 열고 아래 명령어를 순서대로 실행해 프로젝트를 빌드하고 응용 프로그램 폴더로 이동시킵니다.</p>
                <div className="code-box">
                  <pre><code>{codeBuildText}</code></pre>
                  <button 
                    className={`copy-btn ${copyStatus['build'] ? 'copied' : ''}`} 
                    onClick={() => handleCopyToClipboard(codeBuildText, 'build')}
                  >
                    {copyStatus['build'] ? '복사 완료!' : '복사'}
                  </button>
                </div>
              </div>
            </div>

            <div className="step-card">
              <div className="step-num">2</div>
              <div className="step-content">
                <h3>Gatekeeper 격리 해제 (최초 1회 필수)</h3>
                <p>개발자 서명 인증이 되어 있지 않아 다운로드/로컬 빌드 후 손상 관련 차단창이 뜰 수 있습니다. 아래 코드로 앱의 격리를 해제해줍니다.</p>
                <div className="code-box">
                  <pre><code>{codeQuarantineText}</code></pre>
                  <button 
                    className={`copy-btn ${copyStatus['quarantine'] ? 'copied' : ''}`}
                    onClick={() => handleCopyToClipboard(codeQuarantineText, 'quarantine')}
                  >
                    {copyStatus['quarantine'] ? '복사 완료!' : '복사'}
                  </button>
                </div>
              </div>
            </div>

            <div className="step-card">
              <div className="step-num">3</div>
              <div className="step-content">
                <h3>macOS 시스템 권한 부여</h3>
                <p>전역 키보드 입력을 감지하기 위해 두 가지 설정이 필수적입니다.</p>
                <ul className="permission-list">
                  <li><strong>시스템 설정 &rarr; 개인정보 보호 및 보안 &rarr; 손쉬운 사용 (Accessibility)</strong>: DDalGGak 허용</li>
                  <li><strong>시스템 설정 &rarr; 개인정보 보호 및 보안 &rarr; 입력 모니터링 (Input Monitoring)</strong>: DDalGGak 허용</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>손가락 끝을 더 즐겁게, 딸깍을 후원해 주세요</h2>
          <p>이 오픈소스 유틸리티가 마음에 드셨다면 따뜻한 응원이나 커피 한 잔을 통해 후원에 동참하실 수 있습니다.</p>
          <div className="cta-actions">
            <a href="https://github.com/Great-Grace/DDalGGak" target="_blank" rel="noopener noreferrer" className="btn primary-btn">
              <span>GitHub 스타 주기 ⭐</span>
            </a>
            <a href="https://buymeacoffee.com/ddalggak" target="_blank" rel="noopener noreferrer" className="btn coffee-btn">
              <span>Buy me a coffee ☕</span>
            </a>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-container">
          <p>© 2026 DDalGGak Project. Released under CC0 & MIT License. 100% Local Utility.</p>
          <p className="footer-sub">Designed with premium glassmorphism. For personal pre-release testing.</p>
        </div>
      </footer>
    </div>
  );
}
