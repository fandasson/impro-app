import { subMinutes } from "date-fns";

const WEB_API_URL = "https://improvariace.cz/wp-json/wp/v2";

interface CTA {
    title: string;
    url: string;
}
interface PerformanceDto {
    id: number;
    date: string;
    title: { rendered: string };
    link: string;
    content: { rendered: string };
    featured_media: number;
    acf: {
        date: string;
        venue: number;
        sold_out: boolean;
        price: string;
        CTA_main_url: CTA;
        CTA_secondary_url: CTA;
        facebook_url: string;
    };
}

interface FollowUpAction {
    title: string;
    url: string;
}
export interface WebPerformance {
    id: number;
    date: Date;
    title: string;
    link: string;
    soldOut: boolean;
    price: string;
    venue?: string;
    facebookUrl?: string;
    actions: FollowUpAction[];
    coverImageUrl: string;
}

const getVenues = async (venuesIds: number[]) => {
    const venuesPromises = venuesIds.map((venueId) =>
        fetch(`${WEB_API_URL}/venue/${venueId}`, {
            next: { revalidate: 3600 },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch venue ${venueId}: ${res.status}`);
                }
                return res.json();
            })
            .then((venueData) => ({
                id: venueId,
                title: venueData.title.rendered,
            }))
            .catch((error) => {
                console.error(`Error fetching venue ${venueId}:`, error);
                return { id: venueId, title: "Unknown venue" };
            }),
    );

    const venues = await Promise.all(venuesPromises);

    return new Map(venues.map((venue) => [venue.id, venue.title as string]));
};

interface MediaDto {
    media_details: {
        sizes: {
            impro_performance_cover: {
                source_url: string;
            };
        };
    };
}

const getImageUrl = async (id: number): Promise<string> => {
    try {
        const response = await fetch(`${WEB_API_URL}/media/${id}`, {
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch image ${id}: ${response.status}`);
        }

        const mediaData = (await response.json()) as MediaDto;
        return mediaData.media_details.sizes.impro_performance_cover.source_url;
    } catch (error) {
        console.error(`Error fetching image ${id}:`, error);
        return "";
    }
};

async function fetchWebPerformances(): Promise<WebPerformance[]> {
    try {
        const response = await fetch(`${WEB_API_URL}/performance`, {
            next: { revalidate: 3600 }, // Revalidate every hour (1hr cache)
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch performances: ${response.status}`);
        }

        const performances = (await response.json()) as PerformanceDto[];

        const venuesIds = performances.map((performance) => performance.acf.venue);
        const venues = await getVenues(venuesIds);

        const webPerformances = performances.map(async (performance) => {
            const actions: FollowUpAction[] = [];
            if (performance.acf.CTA_main_url) {
                const { title, url } = performance.acf.CTA_main_url;
                actions.push({
                    title,
                    url,
                });
            }
            if (performance.acf.CTA_secondary_url) {
                const { title, url } = performance.acf.CTA_secondary_url;
                actions.push({
                    title,
                    url,
                });
            }
            const coverImageUrl = await getImageUrl(performance.featured_media);
            return {
                id: performance.id,
                title: performance.title.rendered,
                link: performance.link,
                date: new Date(performance.acf.date),
                soldOut: performance.acf.sold_out,
                price: performance.acf.price,
                facebookUrl: performance.acf.facebook_url,
                venue: venues.get(performance.acf.venue) || undefined,
                actions,
                coverImageUrl,
            };
        });
        return Promise.all(webPerformances);
    } catch (error) {
        console.error("Error fetching performances:", error);
        return [];
    }
}

export async function getUpcomingPerformances(): Promise<WebPerformance[]> {
    const today = new Date();

    const performances = await fetchWebPerformances();
    return performances
        .filter((performance) => {
            return performance.date >= subMinutes(today, 30);
        })
        .sort((a, b) => a.date.getTime() - b.date.getTime());
}
