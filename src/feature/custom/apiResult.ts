import { SuccessType } from 'src/enum/successType.enum';
import { FailType } from 'src/enum/failType.enum';

type SuccessResult<T> = T extends void
  ? {
      message: SuccessType;
    }
  : {
      message: SuccessType;
      data: T;
    };

type FailResult = {
  message: FailType;
};

export type ApiResult<T> = SuccessResult<T> | FailResult;
