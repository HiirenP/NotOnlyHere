import type { ProfileResponse, UpdateProfileRequest } from '@notonlyhere/contracts';
import { ActivityService } from '../activity/activity.service';
import { BlockService } from '../social/block.service';
import { ConnectionService } from '../social/connection.service';
import { MediaService } from '../media/media.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class ProfilesService {
    private readonly prisma;
    private readonly media;
    private readonly blocks;
    private readonly connections;
    private readonly activity;
    constructor(prisma: PrismaService, media: MediaService, blocks: BlockService, connections: ConnectionService, activity: ActivityService);
    getMyProfile(userId: string): Promise<ProfileResponse>;
    getProfileByUsername(username: string, viewerId: string): Promise<ProfileResponse>;
    updateMyProfile(userId: string, input: UpdateProfileRequest): Promise<ProfileResponse>;
    private buildProfileResponse;
}
