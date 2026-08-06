import { Injectable } from '@nestjs/common';
import { generateAnonymousDisplayLabel } from './anonymous.constants';

@Injectable()
export class AnonymousService {
  createDisplayLabel() {
    return generateAnonymousDisplayLabel();
  }
}
