import { CanActivate, ExecutionContext } from '@nestjs/common';
import { SessionService } from './session.service';
export declare class AuthGuard implements CanActivate {
    private readonly sessions;
    constructor(sessions: SessionService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
