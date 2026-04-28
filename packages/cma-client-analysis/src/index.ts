export { getCmaClientProgram } from './getCmaClientProgram.js';
export type { CmaClientProgram } from './getCmaClientProgram.js';

export { extractAllMethodNames } from './extractAllMethodNames.js';

export {
  extractMethodSignature,
  findResourceProperty,
  formatMethodSignature,
} from './extractMethodSignature.js';
export type {
  MethodSignatureInfo,
  ParameterInfo,
  SignatureOverload,
} from './extractMethodSignature.js';

export { extractResourcesEndpointMethods } from './extractEndpointMethods.js';
export type { ExtractedResourcesEndpointMethod } from './extractEndpointMethods.js';

export { extractTypeDependencies } from './extractTypeDependencies.js';
export type {
  TypeExtractionOptions,
  TypeExtractionResult,
} from './extractTypeDependencies.js';

export { extractClientCalls } from './extractClientCalls.js';
export type { ClientCall } from './extractClientCalls.js';

export {
  BUILT_IN_TYPE_NAMES,
  isPrimitiveOrBuiltInType,
  isTypeParameter,
  shouldIncludeTypeName,
} from './typeFilters.js';
