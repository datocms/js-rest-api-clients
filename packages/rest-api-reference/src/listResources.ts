import {
  findHyperschemaEntity,
  findResourcesEntityByJsonApiType,
} from './finders.js';
import { code, h1, h2, li, p, render, ul } from './markdown.js';
import type { Hyperschema, ResourcesSchema } from './types.js';

/**
 * Returns a Markdown listing of all available API resources, grouped by theme.
 */
export function listResources(
  hyperschema: Hyperschema,
  resourcesSchema: ResourcesSchema,
): string {
  const resourcesByGroup = hyperschema.groups.map((group) => ({
    title: group.title,
    resources: group.resources
      .map((jsonApiType) => {
        const resourcesEntity = findResourcesEntityByJsonApiType(
          resourcesSchema,
          jsonApiType,
        );
        const hyperschemaEntity = findHyperschemaEntity(
          hyperschema,
          jsonApiType,
        );

        if (!resourcesEntity || !hyperschemaEntity) {
          return undefined;
        }

        return {
          namespace: resourcesEntity.namespace,
          title: hyperschemaEntity.title,
          description: (hyperschemaEntity.description || '').split(/\n/)[0],
        };
      })
      .filter((r): r is NonNullable<typeof r> => r != null),
  }));

  return render(
    h1('Available resources grouped by theme'),
    ...resourcesByGroup.flatMap((group) => [
      h2(group.title),
      ul(
        ...group.resources.map((resource) =>
          li(
            resource.namespace,
            ' (',
            [resource.title, resource.description].filter(Boolean).join(' — '),
            ')',
          ),
        ),
      ),
    ]),
    h1('Further documentation'),
    p(
      'Pass a resource name (ie. ',
      code('items'),
      ') to learn about a specific resource and all the available actions to interact with it.',
    ),
  );
}
