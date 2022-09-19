type Query = { limit?: number; page?: number; }

const DEFAULT_PAGE_LIMIT = 0;

export const getPagination = (query: Query): { skip: number; limit: number } => {
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
    const page = Math.abs(query.page) || 1;
    const skip = (page - 1) * limit;

    return {
        skip,
        limit
    }
}