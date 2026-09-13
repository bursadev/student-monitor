import { BadRequestException } from '@nestjs/common';

import { parseOnboardingInput } from './onboarding.input.js';

describe('parseOnboardingInput', () => {
  it('accepts a role and a name', () => {
    expect(parseOnboardingInput({ role: 'STUDENT', displayName: 'Ada Yılmaz' })).toEqual({
      role: 'STUDENT',
      displayName: 'Ada Yılmaz',
    });
  });

  it('trims the name', () => {
    expect(parseOnboardingInput({ role: 'COACH', displayName: '  Ada Yılmaz  ' })).toEqual({
      role: 'COACH',
      displayName: 'Ada Yılmaz',
    });
  });

  it('rejects a role outside the enum', () => {
    // Role drives every authorization decision, so anything unrecognised has to
    // bounce rather than be coerced into a default.
    expect(() => parseOnboardingInput({ role: 'ADMIN', displayName: 'Ada' })).toThrow(
      BadRequestException,
    );
  });

  it('rejects a missing role', () => {
    expect(() => parseOnboardingInput({ displayName: 'Ada' })).toThrow(BadRequestException);
  });

  it('rejects a name that is only whitespace', () => {
    expect(() => parseOnboardingInput({ role: 'PARENT', displayName: '   ' })).toThrow(
      BadRequestException,
    );
  });

  it('rejects a name longer than 80 characters', () => {
    expect(() =>
      parseOnboardingInput({ role: 'PARENT', displayName: 'a'.repeat(81) }),
    ).toThrow(BadRequestException);
  });

  it('rejects a body that is not an object', () => {
    expect(() => parseOnboardingInput(null)).toThrow(BadRequestException);
    expect(() => parseOnboardingInput('STUDENT')).toThrow(BadRequestException);
  });

  it('answers in Turkish', () => {
    expect(() => parseOnboardingInput({ role: 'ADMIN', displayName: 'Ada' })).toThrow(
      /rol/i,
    );
  });
});
