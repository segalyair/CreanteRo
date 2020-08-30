import { auth } from '../firebase/firebase';
export class BaseService {
    static async sendFetch(url, options) {
        try {
            if (!auth.currentUser) {
                await auth.signInAnonymously()
            }
            const token = await auth.currentUser.getIdToken();
            // console.log(token)
            options.headers = new Headers({
                'Authorization': `Bearer ${token}`
            })
            const response = await fetch(url, options)
            return await response.json()
        }
        catch (error) {
            throw error
        }
    }
}