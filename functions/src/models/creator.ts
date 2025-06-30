import type {Timestamp} from "firebase-admin/firestore";

export interface Creator {
    id: string;
    name: string;
    profileImageUrl: string;
    description: string;
    platforms: {
      youtube?: {
        channelId: string;
        channelUrl: string;
        subscriberCount: number;
      };
      twitch?: {
        username: string;
        channelUrl: string;
        followerCount: number;
      };
    };
    tags: string[];
    tagHierarchyCache: string[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
