import { FailType } from 'src/enum/failType.enum';
import { SuccessType } from 'src/enum/successType.enum';

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
