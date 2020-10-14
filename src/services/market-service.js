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
    static async issueBuy(buyParams) {
        try {
            return await this.sendFetch(`${process.env.API_URL}/market/issue-buy`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(buyParams)
            }, true)
        }
        catch (error) {
            throw error
        }
    }
}