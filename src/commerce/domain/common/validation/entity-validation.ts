import { validateSync, ValidationError } from 'class-validator';

export class EntityValidation {
  /**
   * 엔티티의 class-validator 검증을 수행하는 범용 메서드
   * @param entity 검증할 엔티티 인스턴스
   * @param createEmptyInstance 빈 인스턴스를 생성하는 함수 (protected 생성자 대응)
   * @param errorPrefix 에러 메시지에 붙일 접두사 (기본값: 'Entity validation failed')
   */
  static validate<T extends object>(
    entity: T,
    createEmptyInstance: () => T,
    errorPrefix: string = 'Entity validation failed',
  ): void {
    // 검증을 위한 검증용 객체 생성 (Object.assign 사용)
    const validationObject = Object.assign(
      createEmptyInstance(),
      entity as object,
    );

    // class-validator로 검증 실행
    const errors = validateSync(validationObject);
    if (errors.length > 0) {
      const errorMessages = this.formatValidationErrors(errors);
      throw new Error(`${errorPrefix}: ${errorMessages}`);
    }
  }

  /**
   * ValidationError 배열을 읽기 쉬운 문자열로 포맷팅
   * @param errors class-validator에서 반환된 ValidationError 배열
   * @returns 포맷팅된 에러 메시지 문자열
   */
  private static formatValidationErrors(errors: ValidationError[]): string {
    return errors
      .map((error) => Object.values(error.constraints || {}))
      .flat()
      .join(', ');
  }
}
