import { SuccessType } from 'src/enum/successType.enum';
import { ErrorMessage } from '../error/error.enum';

type SuccessResult<T> = T extends void
  ? {
      message: SuccessType;
    }
  : {
      message: SuccessType;
      data: T;
    };

type FailResult = {
  message: ErrorMessage;
};

export type ApiResult<T> = SuccessResult<T> | FailResult;
