# Storybook → Puck 컴포넌트 추가 워크플로우

## 📊 워크플로우 다이어그램

```mermaid
graph TD
    A[1. 컴포넌트 생성] -->|stories/YourComponent.tsx| B[2. Export 추가]
    B -->|src/index.ts| C[3. 라이브러리 빌드]
    C -->|npm run build-lib| D[4. Puck Config 업데이트]
    D -->|puck.config.tsx| E[5. Puck 에디터에서 사용]

    A -->|포함| A1[.tsx 파일]
    A -->|포함| A2[.css 파일]
    A -->|포함| A3[.stories.ts 파일]

    C -->|생성| C1[dist/ 폴더]
    C1 -->|포함| C2[컴포넌트 JS]
    C1 -->|포함| C3[CSS 파일]
    C1 -->|포함| C4[타입 정의]

    E -->|드래그앤드롭| F[페이지 구성]
    F -->|View Code| G[코드/JSON 생성]

    style A fill:#e1f5ff
    style C fill:#fff4e1
    style D fill:#ffe1f5
    style E fill:#e1ffe1
    style G fill:#f5e1ff
```

### 전체 플로우

```mermaid
sequenceDiagram
    participant Dev as 개발자
    participant SB as Storybook
    participant Lib as 라이브러리
    participant Puck as Puck Editor
    participant Export as Export 기능

    Dev->>SB: 1. 컴포넌트 생성 (tsx, css, stories)
    Dev->>SB: 2. src/index.ts에 export 추가
    Dev->>Lib: 3. npm run build-lib
    Lib-->>Lib: Vite 빌드 (dist/ 생성)

    Dev->>Puck: 4. puck.config.tsx 업데이트
    Note over Puck: - import 추가<br/>- 타입 정의<br/>- fields/render 설정

    Puck-->>Puck: HMR 자동 반영
    Dev->>Puck: 5. 에디터에서 컴포넌트 사용

    Puck->>Export: View Code 클릭
    Export-->>Dev: React JSX / SDUI JSON
```

### 파일 구조 흐름

```mermaid
graph LR
    subgraph test-storybook
        S1[stories/YourComponent.tsx]
        S2[stories/YourComponent.css]
        S3[src/index.ts]
        S4[dist/]
    end

    subgraph test-puck
        P1[src/puck.config.tsx]
        P2[Puck Editor]
        P3[View Code]
    end

    S1 --> S3
    S2 --> S3
    S3 -->|npm run build-lib| S4
    S4 -->|import| P1
    P1 --> P2
    P2 --> P3

    style S3 fill:#ffe1e1
    style S4 fill:#e1ffe1
    style P1 fill:#e1e1ff
    style P3 fill:#ffe1ff
```

---

## 🔄 빠른 가이드

### 1. Storybook에서 컴포넌트 생성

**위치:** `test-storybook/stories/`

```bash
# 파일 생성
stories/
├── YourComponent.tsx      # 컴포넌트
├── YourComponent.css      # 스타일
└── YourComponent.stories.ts  # 스토리
```

**컴포넌트 예시:**
```tsx
// YourComponent.tsx
import React from 'react';
import './YourComponent.css';

export interface YourComponentProps {
  label?: string;
  value?: string;
}

export const YourComponent = ({ label, value }: YourComponentProps) => {
  return <div>{/* 구현 */}</div>;
};
```

---

### 2. 라이브러리 Export 추가

**파일:** `test-storybook/src/index.ts`

```ts
export { YourComponent } from '../stories/YourComponent';
export type { YourComponentProps } from '../stories/YourComponent';
```

---

### 3. 라이브러리 빌드

```bash
cd test-storybook
npm run build-lib
```

---

### 4. Puck Config 업데이트

**파일:** `test-puck/src/puck.config.tsx`

```tsx
// 1. Import 추가
import { YourComponent } from 'test-storybook-components';

// 2. 타입 정의
export type UserComponentProps = {
  YourComponent: {
    label?: string;
    value?: string;
  };
  // ... 기존 타입들
};

// 3. Config 추가
export const config: Config<UserComponentProps> = {
  components: {
    YourComponent: {
      fields: {
        label: { type: 'text', label: 'Label' },
        value: { type: 'text', label: 'Value' },
      },
      defaultProps: {
        label: 'Default Label',
        value: '',
      },
      render: ({ label, value }) => {
        return <YourComponent label={label} value={value} />;
      },
    },
    // ... 기존 컴포넌트들
  },
};
```

---

### 5. 확인

- **Storybook**: http://localhost:6006/
- **Puck Editor**: http://localhost:5174/

---

## 📝 실제 예시: mcncInput

### 1. 생성
```bash
stories/mcncInput.tsx       # 컴포넌트
stories/mcncInput.css       # 스타일
stories/mcncInput.stories.ts # 스토리
```

### 2. Export
```ts
// src/index.ts
export { McncInput } from '../stories/mcncInput';
```

### 3. 빌드
```bash
npm run build-lib
```

### 4. Puck 설정
```tsx
import { McncInput } from 'test-storybook-components';

// Config에 추가
McncInput: {
  fields: {
    label: { type: 'text' },
    placeholder: { type: 'text' },
  },
  defaultProps: {
    label: 'Input Field',
  },
  render: (props) => <McncInput {...props} />,
}
```

### 5. 결과
Puck 에디터 좌측 패널에 McncInput 표시 → 드래그앤드롭 사용 가능

---

## 🎯 핵심 포인트

| 단계 | 위치 | 명령어 |
|------|------|--------|
| 컴포넌트 생성 | `test-storybook/stories/` | - |
| Export 추가 | `test-storybook/src/index.ts` | - |
| 빌드 | `test-storybook/` | `npm run build-lib` |
| Puck 설정 | `test-puck/src/puck.config.tsx` | - |
| 확인 | 브라우저 | HMR 자동 반영 |

---

## 🔧 Puck Field 타입

```tsx
fields: {
  text: { type: 'text', label: 'Text' },
  number: { type: 'number', label: 'Number' },
  radio: {
    type: 'radio',
    options: [
      { label: 'Option 1', value: true },
      { label: 'Option 2', value: false }
    ]
  },
  select: {
    type: 'select',
    options: [
      { label: 'Small', value: 'sm' },
      { label: 'Large', value: 'lg' }
    ]
  },
}
```

---

## 💡 Tips

- **HMR 활용**: Puck 설정 변경 시 자동 반영
- **Storybook 확인**: 컴포넌트를 먼저 Storybook에서 테스트
- **타입 안전성**: Props 타입을 정확히 정의
- **CSS 포함**: 빌드 시 CSS 자동 포함됨

---

## 📦 프로젝트 구조

```
test-storybook/          # 컴포넌트 라이브러리
├── stories/             # Storybook 컴포넌트
├── src/index.ts         # Export 엔트리
└── dist/                # 빌드 결과

test-puck/               # Puck 페이지 빌더
├── src/
│   ├── puck.config.tsx  # Puck 설정
│   └── App.tsx          # 메인 앱
└── node_modules/
    └── test-storybook-components/  # 링크된 라이브러리
```
