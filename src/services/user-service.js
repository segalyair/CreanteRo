import { auth } from '../firebase/firebase';
export class UserService {
    static async connect() {
        return await fetch('http://localhost:8600/account/connect', {
            method: 'get',
            headers: new Headers({
                'Authorization': `Bearer ${await auth.currentUser.getIdToken()}`
            })
        })
    }
}