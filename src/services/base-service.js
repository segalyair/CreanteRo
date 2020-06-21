import { auth } from '../firebase/firebase';
export class BaseService {
    static async sendFetch(url, options) {
        try {
            if (!auth.currentUser) {
                await auth.signInAnonymously()
            }
            options.headers = new Headers({
                'Authorization': `Bearer ${await auth.currentUser.getIdToken()}`
            })
            const response = await fetch(url, options)
            return await response.json()
        }
        catch (error) {
            throw error
        }
    }
}