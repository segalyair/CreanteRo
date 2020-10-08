import { auth } from '../firebase/firebase';
export class BaseService {
    static async sendFetch(url, options) {
        try {
            const token = await auth.currentUser.getIdToken();
            if (!options.headers) {
                options.headers = new Headers({ 'Authorization': `Bearer ${token}` })
            }
            options.headers.Authorization = `Bearer ${token}`
            const response = await fetch(url, options)
            return await response.json()
        }
        catch (error) {
            throw error
        }
    }
}