import { BaseService } from './base-service'
export class MerchantService extends BaseService {
    static async addProduct(formData) {
        try {
            return await this.sendFetch(`${process.env.API_URL}/merchant/add`, {
                method: 'post',
                body: formData
            })
        }
        catch (error) {
            throw error
        }
    }
}