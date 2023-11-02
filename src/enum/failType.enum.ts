// NOTE: {자원명}_{동사}로 작성
export enum FailType {
  PASSWORD_LENGTH_REQUIRE = '비밀번호는 10자 이상이여야 합니다.',
  PASSWORD_CHARACTER_REQUIRE = '비밀번호는 숫자, 문자, 특수문자 중 2가지 이상을 포함해야 합니다.',
  PASSWORD_DISALLOW_CONSECUTIVE = '비밀번호는 3회 이상 연속되는 문자 사용은 불가능합니다.',
  PASSWORD_MISMATCHED = '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
}
