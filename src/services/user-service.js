import { BaseService } from './base-service'
export class UserService extends BaseService {
    static async connect() {
        try {
            return await this.sendFetch(`${process.env.API_URL}/account/connect`, { method: 'get' })
        }
        catch (error) {
            throw error
        }
    }
    static async register(formData) {
        try {
            return await this.sendFetch(`${process.env.API_URL}/account/create`, {
                method: 'post',
                body: formData
            })
        }
        catch (error) {
            throw error
        }
    }
    static async getById(firebaseId) {
        try {
            return await this.sendFetch(`${process.env.API_URL}/account/get-by-id?firebaseId=${firebaseId}`, { method: 'get' })
        }
        catch (error) {
            throw error
        }
    }
}