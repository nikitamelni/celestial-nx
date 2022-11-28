import { ComponentType, FunctionComponent } from 'react';
import { getPersonalizer } from '@uniformdev/personalize-react';
import {
  EsiChoose,
  EsiInclude,
  EsiOtherwise,
  EsiWhen,
  EsiNullComponent,
  EsiForEach,
  EsiAssign,
  EsiText,
  EsiScript,
  EsiNoOutput,
  EsiContextCsr,
  EsiContextSsr,
  getPersonalizedProps
} from '@uniformdev/esi-jss-react';
import { ComponentFactory } from "@sitecore-jss/sitecore-jss-react"

export const NullComponent: FunctionComponent = () => {
  return null;
};

const esiComponents = new Map<string, ComponentType<any>>();
esiComponents.set('EsiChoose', EsiChoose);
esiComponents.set('EsiInclude', EsiInclude);
esiComponents.set('EsiOtherwise', EsiOtherwise);
esiComponents.set('EsiWhen', EsiWhen);
esiComponents.set('EsiNullComponent', EsiNullComponent);
esiComponents.set('EsiVars', EsiNullComponent);
esiComponents.set('EsiForEach', EsiForEach);
esiComponents.set('EsiAssign', EsiAssign);
esiComponents.set('EsiText', EsiText as ComponentType<any>);
esiComponents.set('EsiScript', EsiScript);
esiComponents.set('EsiNoOutput', EsiNoOutput);
esiComponents.set('EsiContextCsr', EsiContextCsr);
esiComponents.set('EsiContextSsr', EsiContextSsr);

/**
 * Generate a componentFactory function which includes Uniform
 * Personalizer for allowed components
 *
 * @param componentFactory Regular JSS componentFactory function
 * @param include The allowed array is a collection of component names
 *                that support personalization. If the array is empty,
 *                all components are supported. If the array has at
 *                least one item, only the components whose names
 *                match a value in the array are supported.
 * @param exclude The exclude array is a collection of component names
 *                which explicitly do not support personalization.
 */
export function componentFactoryWithUniformPersonalizer(
  components: Map<string, any>,
  include: string[] = [],
  exclude: string[] = []
): ComponentFactory {

  const Personalizer = getPersonalizer({
    components,
    getPersonalizedProps,
    allowed: include,
  });

  return function personalizedComponentFactory(componentName) {
    // Check to see if this is one of the special Esi components
    const esiComponent = esiComponents.get(componentName);
    if (esiComponent) return esiComponent;

    const component: ComponentType = components.get(componentName);

    if (!component) {
      return NullComponent as ComponentType;
    }

    if (exclude.includes(componentName)) {
      return component as ComponentType;
    } else if (include.length === 0 || include.includes(componentName)) {
      return Personalizer as ComponentType;
    }

    return component as ComponentType;
  };
}
