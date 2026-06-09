# DDalGGak 환경 변수 설정 가이드 (ENV_SETUP)

이 문서에는 DDalGGak 웹 서비스 운영 및 로컬 개발에 필요한 환경 변수(Environment Variables) 설정 정보가 기재되어 있습니다.

---

## 1. 환경 변수 요약 테이블

| 변수명 | 구분 | 위치 | 설명 | 예시 |
|:---|:---|:---|:---|:---|
| `VITE_PADDLE_SELLER_ID` | Frontend | 클라이언트 (Vite) | Paddle의 Seller ID (판매자 식별자) | `352475` |
| `VITE_PADDLE_CLIENT_TOKEN` | Frontend | 클라이언트 (Vite) | Paddle 클라이언트 토큰 (`live_client_` 또는 `test_client_`로 시작) | `live_client_a4c2f6...` |
| `VITE_PADDLE_PRODUCT_ID` | Frontend | 클라이언트 (Vite) | 결제창에 연동할 상품 ID | `pro_01ktn7wrb9r278s64e2r2vnqac` |
| `VITE_PADDLE_PRICE_ID` | Frontend | 클라이언트 (Vite) | 결제창에 연동할 가격 ID | `pri_01ktn7ychhbc7ye6zc9vgsc639` |
| `VITE_SUPABASE_URL` | Frontend | 클라이언트 (Vite) | Supabase 프로젝트 URL | `https://lmnytisjnyyuxiuespjf.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Frontend | 클라이언트 (Vite) | Supabase 클라이언트용 Anonymous Public Key | `eyJhbGciOiJIUzI1NiIsInR...` |
| `SUPABASE_URL` | Backend | 서버 (Vercel API) | 서버에서 사용할 Supabase 프로젝트 URL (위와 동일) | `https://lmnytisjnyyuxiuespjf.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Backend | 서버 (Vercel API) | **[⚠️ 극비]** RLS 정책을 무시하고 데이터를 읽고 쓸 수 있는 서비스 롤 키 | `eyJhbGciOiJIUzI1NiIsInR...` |
| `PADDLE_WEBHOOK_SECRET` | Backend | 서버 (Vercel API) | **[⚠️ 극비]** Paddle 웹훅 알림 서명을 검증하기 위한 웹훅 시크릿 키 | `whsec_A1B2C3...` |

---

## 2. 세부 설정 가이드

### A. 로컬 개발 환경 (`.env` 파일)
로컬 개발 시에는 프로젝트 루트 디렉터리에 `.env` 파일을 생성하고 아래 형식을 채워 넣습니다.
> [!WARNING]
> `.env` 파일은 절대 Git 저장소에 업로드되어서는 안 됩니다. 현재 `.gitignore`에 제대로 등록되어 있는지 반드시 확인하세요.

```env
# Paddle Settings
VITE_PADDLE_SELLER_ID=352475
VITE_PADDLE_CLIENT_TOKEN=live_a4c2f65f575cf634a03e9577ca2
VITE_PADDLE_PRODUCT_ID=pro_01ktn7wrb9r278s64e2r2vnqac
VITE_PADDLE_PRICE_ID=pri_01ktn7ychhbc7ye6zc9vgsc639

# Supabase Client Settings
VITE_SUPABASE_URL=https://lmnytisjnyyuxiuespjf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJI...
```

### B. Vercel 배포 환경 (Production)
Vercel 대시보드 (`https://vercel.com/dashboard`) -> 프로젝트 설정(Project Settings) -> **Environment Variables** 메뉴로 이동하여 위 표에 명시된 **모든 환경 변수**를 입력합니다.

> [!IMPORTANT]
> - `VITE_` 접두사가 붙은 클라이언트 환경 변수는 빌드 타임에 번들에 포함되므로, 대시보드에 입력한 후 **반드시 재배포(Redeploy)를 진행해야만 반영**됩니다.
> - 서버 측 API 환경 변수(`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `PADDLE_WEBHOOK_SECRET`)는 빌드와 상관없이 즉시 런타임에 적용되지만, 안전을 위해 배포 직후 환경 변수를 변경했다면 프로덕션 재빌드를 돌리는 것을 권장합니다.

### C. Paddle 대시보드 설정
1. Paddle 대시보드 -> Developer Tools -> **Developer Notifications** 메뉴로 이동합니다.
2. **Add URL**을 누르고 아래 주소를 입력합니다.
   `https://ddalggak-web.vercel.app/api/paddle-webhook`
3. 전송할 이벤트 목록 중 **`transaction.completed`**를 필수로 선택하고 등록합니다.
4. 등록이 완료되면 웹훅 항목 옆에 생성되는 **Secret Key**를 복사하여 Vercel의 `PADDLE_WEBHOOK_SECRET` 변수로 지정합니다.
