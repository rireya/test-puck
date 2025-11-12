import type { Data } from '@measured/puck';

/**
 * SDUI Schema Interface
 */
export interface SDUIComponent {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: SDUIComponent[];
}

export interface SDUISchema {
  version: string;
  meta: {
    generatedAt: string;
    generator: string;
  };
  components: SDUIComponent[];
}

/**
 * Convert Puck JSON data to SDUI JSON format
 */
export function generateSDUIJSON(data: Data): SDUISchema {
  const sduiComponents: SDUIComponent[] = data.content.map((item, index) => {
    const { type, props } = item;

    // Clean props - remove internal Puck properties
    const cleanProps = Object.entries(props)
      .filter(([key]) => key !== 'id')
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, any>);

    // Convert to SDUI component format
    const sduiComponent: SDUIComponent = {
      id: props.id || `${type.toLowerCase()}-${index}`,
      type: type,
      props: cleanProps,
    };

    // Handle components with children (if needed in the future)
    // For now, Puck components are flat, but we can extend this

    return sduiComponent;
  });

  return {
    version: '1.0.0',
    meta: {
      generatedAt: new Date().toISOString(),
      generator: 'Puck SDUI Exporter',
    },
    components: sduiComponents,
  };
}

/**
 * Generate formatted SDUI JSON string
 */
export function generateSDUIString(data: Data): string {
  const sdui = generateSDUIJSON(data);
  return JSON.stringify(sdui, null, 2);
}

/**
 * Convert SDUI JSON back to Puck Data (for import functionality)
 */
export function sduiToPuckData(sdui: SDUISchema): Data {
  const content = sdui.components.map((component) => ({
    type: component.type,
    props: {
      id: component.id,
      ...component.props,
    },
  }));

  return {
    content,
    root: { props: { title: 'Imported Page' } },
  };
}

/**
 * Generate OpenAPI-like schema for SDUI components
 */
export function generateSDUIComponentSchema(data: Data): Record<string, any> {
  const componentTypes = new Set<string>();
  const schemas: Record<string, any> = {};

  // Collect all unique component types
  data.content.forEach((item) => {
    componentTypes.add(item.type);
  });

  // Generate schema for each component type
  componentTypes.forEach((type) => {
    const examples = data.content.filter((item) => item.type === type);
    const firstExample = examples[0];

    if (firstExample) {
      const propsSchema: Record<string, any> = {};

      Object.entries(firstExample.props).forEach(([key, value]) => {
        if (key === 'id') return;

        const valueType = typeof value;
        propsSchema[key] = {
          type: valueType === 'object' && value === null ? 'null' : valueType,
          example: value,
        };
      });

      schemas[type] = {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique identifier for the component' },
          type: { type: 'string', enum: [type] },
          props: {
            type: 'object',
            properties: propsSchema,
          },
        },
        required: ['id', 'type', 'props'],
      };
    }
  });

  return {
    openapi: '3.0.0',
    info: {
      title: 'SDUI Component Schema',
      version: '1.0.0',
      description: 'Schema for Server-Driven UI components',
    },
    components: {
      schemas,
    },
  };
}

/**
 * Generate React Native compatible SDUI JSON
 */
export function generateReactNativeSDUI(data: Data): any {
  return {
    screen: {
      type: 'ScrollView',
      props: {
        style: {
          flex: 1,
          backgroundColor: '#ffffff',
        },
      },
      children: data.content.map((item, index) => {
        const { type, props } = item;

        // Map web components to React Native equivalents
        const rnType = mapToReactNativeComponent(type);
        const rnProps = mapToReactNativeProps(type, props);

        return {
          id: props.id || `${type.toLowerCase()}-${index}`,
          type: rnType,
          props: rnProps,
        };
      }),
    },
  };
}

function mapToReactNativeComponent(webType: string): string {
  const mapping: Record<string, string> = {
    'Button': 'TouchableOpacity',
    'Header': 'View',
    'HeadingBlock': 'Text',
    'ColumnsBlock': 'View',
  };
  return mapping[webType] || 'View';
}

function mapToReactNativeProps(webType: string, webProps: any): any {
  if (webType === 'Button') {
    return {
      style: {
        backgroundColor: webProps.primary ? '#555ab9' : 'transparent',
        paddingVertical: webProps.size === 'small' ? 10 : webProps.size === 'large' ? 12 : 11,
        paddingHorizontal: webProps.size === 'small' ? 16 : webProps.size === 'large' ? 24 : 20,
        borderRadius: 30,
      },
      text: webProps.label,
    };
  } else if (webType === 'HeadingBlock') {
    return {
      style: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 20,
      },
      children: webProps.title,
    };
  }

  return { ...webProps };
}
