# Export Formats Documentation

Puck 페이지 빌더는 다양한 형식으로 페이지를 내보낼 수 있습니다.

## 📋 지원되는 Export 형식

### 1. **React JSX** (기본)
실제 사용 가능한 React 컴포넌트 코드를 생성합니다.

**예시:**
```jsx
import { Button, Header } from 'test-storybook-components';
import 'test-storybook-components/dist/styles/test-storybook-components.css';

export default function GeneratedPage() {
  return (
    <div>
      <h1 style={{ padding: '20px' }}>Welcome to Puck</h1>
      <Header showUser userName="John Doe" />
      <Button label="Get Started" primary size="large" />
    </div>
  );
}
```

**사용 사례:**
- React 프로젝트에 직접 붙여넣기
- 정적 페이지 생성
- 코드 리뷰 및 커스터마이징

---

### 2. **SDUI JSON** (Server-Driven UI)
서버에서 UI를 동적으로 구성할 수 있는 JSON 형식입니다.

**예시:**
```json
{
  "version": "1.0.0",
  "meta": {
    "generatedAt": "2025-11-12T05:30:00.000Z",
    "generator": "Puck SDUI Exporter"
  },
  "components": [
    {
      "id": "heading-1",
      "type": "HeadingBlock",
      "props": {
        "title": "Welcome to Puck Page Builder"
      }
    },
    {
      "id": "header-1",
      "type": "Header",
      "props": {
        "showUser": true,
        "userName": "John Doe"
      }
    },
    {
      "id": "button-1",
      "type": "Button",
      "props": {
        "label": "Get Started",
        "primary": true,
        "size": "large"
      }
    }
  ]
}
```

**사용 사례:**
- API 응답으로 UI 전달
- A/B 테스팅
- 다국어 지원 (서버에서 텍스트 치환)
- 권한별 UI 제어
- CMS와 통합

**백엔드 예시 (Node.js):**
```javascript
// API 엔드포인트
app.get('/api/pages/:pageId', async (req, res) => {
  const sduiJson = await db.getPage(req.params.pageId);
  res.json(sduiJson);
});

// 클라이언트에서 렌더링
import { Render } from '@measured/puck';
import { config } from './puck.config';

function DynamicPage({ sduiData }) {
  const puckData = sduiToPuckData(sduiData);
  return <Render config={config} data={puckData} />;
}
```

---

### 3. **SDUI Component Schema** (OpenAPI 스타일)
컴포넌트의 타입 스키마를 OpenAPI 형식으로 제공합니다.

**예시:**
```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "SDUI Component Schema",
    "version": "1.0.0",
    "description": "Schema for Server-Driven UI components"
  },
  "components": {
    "schemas": {
      "Button": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique identifier for the component"
          },
          "type": {
            "type": "string",
            "enum": ["Button"]
          },
          "props": {
            "type": "object",
            "properties": {
              "label": { "type": "string", "example": "Get Started" },
              "primary": { "type": "boolean", "example": true },
              "size": { "type": "string", "example": "large" }
            }
          }
        },
        "required": ["id", "type", "props"]
      }
    }
  }
}
```

**사용 사례:**
- API 문서화
- 타입 체크 (백엔드)
- SDK 자동 생성
- 컴포넌트 검증

---

### 4. **React Native SDUI**
React Native 앱을 위한 SDUI JSON 형식입니다.

**예시:**
```json
{
  "screen": {
    "type": "ScrollView",
    "props": {
      "style": {
        "flex": 1,
        "backgroundColor": "#ffffff"
      }
    },
    "children": [
      {
        "id": "heading-1",
        "type": "Text",
        "props": {
          "style": {
            "fontSize": 24,
            "fontWeight": "bold",
            "padding": 20
          },
          "children": "Welcome to Puck Page Builder"
        }
      },
      {
        "id": "button-1",
        "type": "TouchableOpacity",
        "props": {
          "style": {
            "backgroundColor": "#555ab9",
            "paddingVertical": 12,
            "paddingHorizontal": 24,
            "borderRadius": 30
          },
          "text": "Get Started"
        }
      }
    ]
  }
}
```

**사용 사례:**
- React Native 앱에서 동적 화면 구성
- 웹-모바일 UI 일관성 유지
- 앱 업데이트 없이 UI 변경

**React Native 렌더러 예시:**
```javascript
// React Native SDUI Renderer
function SDUIRenderer({ schema }) {
  const renderComponent = (component) => {
    const { type, props, children } = component;
    const Component = componentMap[type]; // View, Text, TouchableOpacity 등

    return (
      <Component {...props} key={component.id}>
        {children && children.map(renderComponent)}
      </Component>
    );
  };

  return renderComponent(schema.screen);
}
```

---

## 🚀 사용 방법

1. **Puck 에디터에서 페이지 구성**
   - 컴포넌트 드래그앤드롭
   - Props 설정

2. **"</> View Code" 버튼 클릭**

3. **원하는 형식 선택**
   - React JSX
   - SDUI JSON
   - Schema
   - React Native

4. **복사 또는 다운로드**
   - 📋 Copy: 클립보드에 복사
   - ⬇ Download: 파일로 다운로드

---

## 🔄 SDUI JSON → Puck Data 변환

SDUI JSON을 다시 Puck 에디터로 불러올 수 있습니다:

```typescript
import { sduiToPuckData } from './utils/sduiGenerator';

const sduiJson = {
  version: "1.0.0",
  components: [/* ... */]
};

const puckData = sduiToPuckData(sduiJson);
// Puck 에디터에 로드
<Puck config={config} data={puckData} />
```

---

## 💡 Best Practices

### SDUI 사용 시
1. **버전 관리**: `version` 필드로 스키마 버전 추적
2. **검증**: 백엔드에서 Schema를 사용하여 데이터 검증
3. **캐싱**: SDUI JSON을 CDN에 캐싱하여 성능 최적화
4. **점진적 업데이트**: 버전 호환성 유지

### React Native 사용 시
1. **컴포넌트 매핑**: 웹 컴포넌트를 Native 컴포넌트로 정확히 매핑
2. **스타일 변환**: 웹 CSS를 React Native StyleSheet로 변환
3. **플랫폼 분기**: iOS/Android 차이 처리

---

## 🔧 커스터마이징

### 새로운 Export 형식 추가

1. **Generator 함수 작성:**
```typescript
// src/utils/customExporter.ts
export function generateCustomFormat(data: Data): string {
  // 변환 로직
  return customFormatString;
}
```

2. **CodeViewer에 추가:**
```typescript
// src/components/CodeViewer.tsx
type ExportFormat = 'react' | 'sdui' | 'custom';

const getContent = () => {
  switch (format) {
    case 'custom':
      return generateCustomFormat(data);
    // ...
  }
};
```

---

## 📚 참고 자료

- [Puck Documentation](https://puckeditor.com/docs)
- [Server-Driven UI Pattern](https://www.judo.app/blog/server-driven-ui/)
- [OpenAPI Specification](https://swagger.io/specification/)
