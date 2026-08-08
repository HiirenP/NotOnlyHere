import type { Response } from 'express';
import { OAuthService } from './oauth.service';
export declare class OAuthController {
    private readonly oauth;
    constructor(oauth: OAuthService);
    start(provider: string, returnTo: string, res: Response): Promise<void>;
    callback(provider: string, code: string, state: string, res: Response): Promise<void>;
}
