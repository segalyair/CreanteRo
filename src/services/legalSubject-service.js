import { BaseService } from './base-service'
export class RepresentativeService extends BaseService {
    static async count(userId) {
        try {
            return await this.sendFetch(`${process.env.API_URL}/rep/count?userId=${userId}`, { method: 'get' })
        }
        catch (error) {
            throw error
        }
    }
    static async get(userId, skip, take) {
        let url = `${process.env.API_URL}/rep/get?userId=${userId}`
        if (skip) {
            url += `&skip=${skip}`
        }
        if (take) {
            url += `&take=${take}`
        }
        try {
            return await this.sendFetch(url, { method: 'get' })
        }
        catch (error) {
            throw error
        }
    }
    static async getById(repId) {
        try {
            return await this.sendFetch(`${process.env.API_URL}/rep/get-by-id?repId=${repId}`, { method: 'get' })
        }
        catch (error) {
            throw error
        }
    }
    static async add(entParams) {
        try {
            return await this.sendFetch(`${process.env.API_URL}/rep/add`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(entParams)
                }
            )
        }
        catch (error) {
            throw error
        }
    }
    static async delete(repId) {
        try {
            return await this.sendFetch(`${process.env.API_URL}/rep/delete?repId=${repId}`, { method: 'delete' })
        }
        catch (error) {
            throw error
        }
    }
    static async update(entity) {
        try {
            return await this.sendFetch(`${process.env.API_URL}/rep/update`,
                {
                    method: 'PATCH',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(entity)
                }
            )
        }
        catch (error) {
            throw error
        }
    }
}