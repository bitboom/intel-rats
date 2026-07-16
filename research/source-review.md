# 출처 검토: Intel Attestation 시각 해설

- 콘텐츠 기준일: 2026-07-16
- 검토 범위: `src/content/sources.ts`와 `src/content/claims.ts`에 현재 등록된 공개 원문 및 그 원문에 연결된 주장
- 상태: 출처 목록과 주장 연결을 기록한 내부 검토 문서이며, 사실 정확성에 대한 외부 승인 기록은 아니다.

## 현재 공식 출처 인벤토리

| 식별자 | 발행 기관 | 원문 | URL | 확인일 | 이 사이트에서의 사용 범위 |
| --- | --- | --- | --- | --- | --- |
| `ietf-rfc-9334` | IETF | RFC 9334: Remote ATtestation procedureS (RATS) Architecture | <https://www.rfc-editor.org/rfc/rfc9334.html> | 2026-07-16 | 일반 RATS 역할, 패스포트/백그라운드 체크 모델, Evidence·Attestation Result·정책 관계 |
| `intel-tdx-overview` | Intel | Intel Trust Domain Extensions (Intel TDX) Overview | <https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/overview.html> | 2026-07-16 | Intel TDX와 TD Quote의 고수준 설명 |
| `intel-dcap` | Intel | Intel Data Center Attestation Primitives (Intel DCAP) | <https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/data-center-attestation-primitives.html> | 2026-07-16 | Intel DCAP 기반 Quote 검증 및 collateral 맥락 |
| `intel-pcs` | Intel | Intel Provisioning Certification Service API | <https://api.portal.trustedservices.intel.com/documentation> | 2026-07-16 | PCS API 및 인증·폐기 관련 collateral의 원천 서비스 맥락 |
| `intel-pccs` | Intel | Intel SGX Provisioning Certification Caching Service | <https://github.com/intel/SGXDataCenterAttestationPrimitives/tree/master/QuoteGeneration/pccs> | 2026-07-16 | PCCS가 PCS collateral을 캐시하는 배포 선택지라는 설명 |

## 범위 구분

- **RATS**: RFC 9334는 벤더 중립적인 원격 검증 아키텍처다. Attester, Verifier, Relying Party와 Evidence, Attestation Result의 일반 역할을 설명할 때만 사용한다. Intel 제품의 API, Quote 형식, 서비스 동작을 RFC만으로 단정하지 않는다.
- **Intel Trust Authority (ITA)**: ITA는 Intel의 별도 신뢰·검증 서비스 제품 범위다. 현재 `sources.ts`에는 ITA 공식 원문이 등록되어 있지 않으며, 이 사이트는 ITA의 제공 기능, API, 운영 상태 또는 DCAP/PCS/PCCS와의 동일성을 주장하지 않는다.
- **Intel TDX**: TDX는 Intel의 Trust Domain 기술 범위다. 이 사이트의 TDX 설명은 TD와 Quote를 원격 검증 Evidence의 예로 연결하는 데 한정한다.
- **Intel DCAP**: DCAP은 데이터센터 환경의 Intel attestation primitives 및 검증 흐름 범위다. RATS 역할 이름과 DCAP 구현·운영 세부 사항은 서로 대체되지 않는다.
- **Intel PCS**: PCS는 인증서·TCB·폐기 정보 등 검증 collateral을 제공하는 Intel 서비스/API 범위다. PCS를 정책 판단자나 Relying Party로 표현하지 않는다.
- **Intel PCCS**: PCCS는 PCS collateral을 캐시·제공하는 구성 요소 범위다. PCCS는 PCS 자체가 아니며, PCCS를 사용한다는 사실만으로 특정 환경의 collateral 최신성이나 검증 결과를 보장하지 않는다.

## 주장 검토 절차

1. 새 주장마다 사용자에게 보이는 제목·설명과 근거 원문을 함께 작성한다.
2. 주장에 맞는 `sourceIds`만 연결하고, 원문 URL·발행 기관·실제 확인일을 `sources.ts`에 기록한다.
3. RATS 일반 아키텍처 주장과 Intel 제품·서비스 주장을 분리한다. 제품별 동작에는 해당 Intel 원문을 추가한다.
4. 원문이 주장 전체를 뒷받침하지 않으면 주장을 좁히거나, 필요한 1차 출처를 추가한다. 추론·예시는 사실처럼 쓰지 않는다.
5. 원문 변경, 폐기, 접근 제한 또는 날짜 차이가 발견되면 설명, 출처, 확인일을 같은 변경에서 갱신한다.
6. 아래 검토 기록을 채운 뒤 사실 검토 외부 게이트를 통과해야 공개 릴리스를 주장할 수 있다.

### 주장별 검토 기록 템플릿

```text
주장 ID:
사용자 노출 문구:
출처 ID 및 원문 URL:
발행 기관:
실제 확인일:
적용 범위 / 제외 범위:
원문에서 직접 확인한 근거:
검토 결과: 유지 | 수정 필요 | 삭제
사실 검토자 역할 및 날짜: (외부 게이트가 완료될 때까지 미확정)
```

## 현재 미완료 외부 게이트

- 사실 정확성 검토 및 승인
- 독자(대상 사용자) 검토 및 승인
- 접근성 검토 및 승인
- Git remote 설정 및 원격 저장소 정책 확인
- 저장소 관리자 권한이 필요한 배포·보호 규칙 설정

위 게이트는 이 문서나 저장소 안에서 완료되었다고 주장하지 않는다.
