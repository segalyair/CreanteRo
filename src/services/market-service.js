import { BaseService } from './base-service'
export class MarketService extends BaseService {
    static async get() {
        try {
            return await this.sendFetch(`${process.env.API_URL}/market/get`, { method: 'get' })
        }
        catch (error) {
            throw error
        }
    }
}