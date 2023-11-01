import { SuccessType } from 'src/enum/successType.enum';
import { ErrorMessage } from '../error/error.enum';

type SuccessResult<T> = T extends void
  ? {
      success: true;
      message: SuccessType;
    }
  : {
      success: true;
      data: T;
    };

type FailResult = {
  success: false;
  message: ErrorMessage;
};

export type ApiResult<T> = SuccessResult<T> | FailResult;
