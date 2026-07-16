# Intel Attestation 시각 해설

Intel SGX와 Intel TDX의 원격 검증 흐름을 RATS 역할, 증거, 검증, 허용·거부 판단으로 설명하는 정적 Astro 사이트입니다.

## 로컬 실행

Node.js 22 이상과 npm이 필요합니다.

```bash
npm ci
npm run dev
```

정적 결과물과 검사, 브라우저 검사는 각각 다음 명령으로 실행합니다.

```bash
npm run build
npm run check
npm run test
```

`npm run test`는 빌드된 정적 사이트를 Astro preview로 제공한 뒤 Playwright 검사를 실행합니다. 프로젝트 Pages 경로에서 확인하려면 `BASE_PATH=/저장소-이름/ npm run test`처럼 `BASE_PATH`를 지정합니다. 기본값은 `/`입니다.

## 콘텐츠와 출처 갱신

1. `src/content/`의 타입과 데이터에서 역할, 흐름, 설명을 함께 갱신합니다.
2. 각 사실의 공개 원문 URL, 발행 기관, 확인일(`accessedAt`)을 출처 데이터에 기록합니다.
3. 확인일은 실제로 원문을 확인한 날짜로 바꾸고, 과거 설명이 현재 문서와 다르면 설명과 출처를 함께 수정합니다.
4. `npm run check`, `npm run build`, `npm run test`를 모두 통과시킨 뒤 검토합니다.

출처와 확인일은 설명의 일부입니다. 링크만 바꾸거나 날짜만 일괄 갱신하지 않습니다.

## 라이선스 갱신

현재 저장소에 라이선스 파일이 추가되거나 변경되면 이 문서의 라이선스 안내와 배포 산출물의 저작권 표기를 같은 변경에서 갱신합니다. 외부 출처의 문장·도표·상표는 해당 원문의 이용 조건을 먼저 확인하고, 필요한 귀속과 링크를 보존합니다.

## GitHub Pages 배포 전 외부 게이트

워크플로 파일이 있다고 해서 Pages 배포가 구성되거나 활성화된 것은 아닙니다. 배포 전 저장소 관리자 또는 조직 관리자가 다음 외부 설정을 확인해야 합니다.

- GitHub Pages의 배포 원본을 **GitHub Actions**로 설정합니다.
- `github-pages` 환경의 보호 규칙과 승인 요구 사항을 확인합니다.
- 사용자/조직 사이트는 `BASE_PATH=/`, 프로젝트 사이트는 `BASE_PATH=/저장소-이름/`을 저장소 변수로 설정합니다. 필요하면 `SITE_URL`도 공개 사이트 URL로 설정합니다.
- 기본 브랜치와 Pages 공개 URL이 의도한 대상인지 확인합니다.

이 저장소는 Pages가 이미 설정되었거나 배포되었다고 주장하지 않습니다.
