// if using "use server", move getPlayerPhotos to client
const BASE_PATH = "https://meudxrcsglqhfsylqmhs.supabase.co/storage/v1/object/public/photos/";

export const getPlayerPhotos = (playerId: number) => {
    return {
        body: `${BASE_PATH}${playerId}-body.jpg`,
        profile: `${BASE_PATH}${playerId}-body.jpg`,
    };
};
