import type { ConnectionStatus } from '@notonlyhere/contracts';
import { BlockService } from './block.service';
import { ActivityService } from '../activity/activity.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class ConnectionService {
    private readonly prisma;
    private readonly blocks;
    private readonly activity;
    constructor(prisma: PrismaService, blocks: BlockService, activity: ActivityService);
    private findPairConnection;
    listConnections(userId: string, status?: ConnectionStatus): Promise<{
        id: string;
        status: ConnectionStatus;
        requester: {
            id: string;
            username: string;
            displayName: string;
            avatar: null;
        };
        addressee: {
            id: string;
            username: string;
            displayName: string;
            avatar: null;
        };
        createdAt: string;
        respondedAt: string | null;
        direction: "connected" | "outgoing" | "incoming";
    }[]>;
    getConnectionContext(viewerId: string, targetUserId: string): Promise<{
        connectionStatus: ConnectionStatus | null;
        connectionId: string | null;
        isBlocked: boolean;
        isBlockedBy: boolean;
        canConnect: boolean;
        canMessage: boolean;
    }>;
    sendRequest(requesterId: string, addresseeUsername: string): Promise<{
        id: string;
        status: ConnectionStatus;
        requester: {
            id: string;
            username: string;
            displayName: string;
            avatar: null;
        };
        addressee: {
            id: string;
            username: string;
            displayName: string;
            avatar: null;
        };
        createdAt: string;
        respondedAt: string | null;
        direction: "connected" | "outgoing" | "incoming";
    }>;
    acceptConnection(connectionId: string, userId: string): Promise<{
        id: string;
        status: ConnectionStatus;
        requester: {
            id: string;
            username: string;
            displayName: string;
            avatar: null;
        };
        addressee: {
            id: string;
            username: string;
            displayName: string;
            avatar: null;
        };
        createdAt: string;
        respondedAt: string | null;
        direction: "connected" | "outgoing" | "incoming";
    }>;
    removeConnection(connectionId: string, userId: string): Promise<{
        ok: boolean;
    }>;
    countAcceptedConnections(userId: string): import(".prisma/client").Prisma.PrismaPromise<number>;
    private serialize;
}
