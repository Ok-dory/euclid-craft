---
description: src/data/ 폴더 파일 편집 시 적용
globs: src/data/**
---

# Data Protection Rules

이 폴더의 파일은 유클리드 원론 1권 기반 확정 데이터다.

## 절대 금지
- cards.json의 id, type, name 변경 금지
- recipes.json의 조합 로직 임의 변경 금지
- 데이터 구조 변경 금지

## 허용
- imageUrl 교체 (모에 일러스트 추가 시)
- quote 텍스트 수정 (사용자 요청 시만)
- 버그 수정 (오탈자 등)

## 위반 시
수정하지 말고 사용자에게 보고.
