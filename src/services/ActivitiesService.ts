import { PrismaClient } from "@prisma/client";
import { NotFoundError } from "elysia";
import { InvariantError } from "../exceptions/InvariantError";

const db = new PrismaClient();

interface activityPayload {
    user_id: string,
    activity: string,
}

export const activitiesService = {
    addActivity: async (payload: activityPayload) => {
        const activity = await db.activities.create({
            data: {
                user_id: payload.user_id,
                activity: payload.activity,
            }
        })

        if (!activity) throw new InvariantError('Activity failed to be added')
    }
}