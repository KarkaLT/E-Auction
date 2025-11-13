import { lt } from './lt';

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

type TranslationPath = NestedKeyOf<typeof lt>;

// Helper function to get nested value from object by path
function getNestedValue(obj: unknown, path: string): string {
  const result = path.split('.').reduce((acc: unknown, part: string) => {
    if (
      acc &&
      typeof acc === 'object' &&
      Object.prototype.hasOwnProperty.call(acc, part)
    ) {
      const record = acc as Record<string, unknown>;
      return record[part];
    }
    return undefined;
  }, obj);

  if (typeof result === 'string') return result;
  if (typeof result === 'number') return String(result);
  return path;
}

// Translation function
export function t(
  key: TranslationPath,
  replacements?: Record<string, string | number>,
): string {
  let translation = getNestedValue(lt, key);

  if (replacements) {
    Object.entries(replacements).forEach(([placeholder, value]) => {
      translation = translation.replace(`:${placeholder}`, String(value));
    });
  }

  return translation;
}

export { lt };
