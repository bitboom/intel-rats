# 라이선스·시각물 검토

- 콘텐츠 기준일: 2026-07-16
- 대상: 이 정적 사이트의 텍스트, 코드, 자체 제작 시각물 및 외부 사실 출처 링크
- 상태: 배포 승인이나 법률 자문이 아닌 내부 기록이다.

## 외부 원문 및 시각 자료 사용 방식

기술 사실은 IETF RFC 9334 및 Intel의 TDX, DCAP, PCS, PCCS 공개 원문을 근거로 사용한다. 사용자에게 보이는 역할도·시퀀스·비교 표현은 이 저장소에서 독립적으로 작성했다.

추가로 Confidential Containers 공식 저장소의 외부 도면 2개를 원본 그대로 복제해 로컬 자산으로 제공한다. 해당 저장소는 Apache License 2.0을 적용하며, 각 도면 바로 아래에 프로젝트명, 원본 URL, 라이선스 URL, 변경 여부와 확인일을 표시한다.

| 로컬 자산 | 원본 | SHA-256 | 사용 방식 |
|---|---|---|---|
| `public/images/external/coco-tee-container.png` | `https://github.com/confidential-containers/confidential-containers/blob/main/images/CC_TEE_container.png` | `80284383dcd0db0617ba7dd247de838fdfe3ce3fd607458c23a01a344461b4b4` | 원본 그대로 복제 |
| `public/images/external/coco-v1-tee.png` | `https://github.com/confidential-containers/confidential-containers/blob/main/images/COCO_ccv1_TEE.png` | `45299558967462e1c4003c9230b4b5b88fb03b58f3c706e543d31c978ce3caff` | 원본 그대로 복제 |

- 권리자/발행 기관: Confidential Containers project contributors
- 원본 저장소: `https://github.com/confidential-containers/confidential-containers`
- 적용 라이선스: Apache License 2.0
- 라이선스 원문: `https://github.com/confidential-containers/confidential-containers/blob/main/LICENSE`
- 확인일: 2026-07-16
- 외부 이미지에 Intel TDX 전용 규격도라는 의미를 부여하지 않고, TDX를 포함할 수 있는 Confidential Containers 구현 참고 구조로만 설명한다.
- Intel 문서의 저작권 이미지는 복제하지 않는다.

## 라이선스 판단 범위

이 검토는 외부 도면이 Apache-2.0 저장소에 포함되어 있고 필요한 출처·라이선스 표시가 페이지에 제공되는지를 확인한다. 상표 사용 허가, 법률 자문 또는 사이트 전체 코드의 라이선스를 확정하지 않는다.

현재 저장소 루트에는 사이트 전체에 적용되는 별도 `LICENSE` 또는 `NOTICE` 파일이 없다. 따라서 외부 도면의 Apache-2.0 조건 외에 저장소 전체가 Apache-2.0으로 배포된다고 주장하지 않는다.

## 변경 전 검토 절차

외부 자산 또는 외부 문구를 추가하기 전 다음 기록을 남긴다.

```text
추가 대상:
자산/문구 원문 URL:
권리자 또는 발행 기관:
사용 방식: 링크 | 인용 | 복제 | 임베드 | 상표 노출
적용 이용 조건·라이선스 URL:
필요한 귀속 문구와 표시 위치:
검토 결론: 사용 가능 | 조건부 가능 | 사용하지 않음
검토자 역할 및 날짜: (외부 게이트가 완료될 때까지 미확정)
```

조건을 확인할 수 없거나 필요한 귀속을 제공할 수 없으면 자산을 추가하지 않고 독립 제작 시각물 또는 단순 링크로 대체한다.

## 외부 릴리스 게이트

아래 항목은 저장소 안에서 완료되었다고 주장하지 않는다.

- 사실 정확성 검토 및 승인
- 독자 검토 및 승인
- 접근성 검토 및 승인
- Git remote 설정과 원격 저장소 정책 확인
- 저장소 관리자 권한이 필요한 라이선스, 배포, 보호 규칙 결정
