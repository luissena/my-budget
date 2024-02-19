import { UseCaseError } from '@/core/errors/use-case-error';

export class InvalidTypeError extends Error implements UseCaseError {
  constructor() {
    super(`Invalid type.`);
  }
}
