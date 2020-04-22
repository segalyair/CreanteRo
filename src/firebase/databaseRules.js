const rules =
{
    /* Visit https://firebase.google.com/docs/database/security to learn more about security rules. */
    "rules": {
        ".read": "auth != null",
        ".write": "auth != null",
        "items": {
            "$id": {
                "id": {
                    ".validate": "newData.val().length == 36"
                },
                "creationDate": {
                    ".validate": "newData.val().length > 0"
                },
                "value": {
                    ".validate": "newData.val().length > 0"
                }
            },
            ".indexOn": [
                "id",
                "creationDate"
            ]
        }
    }
}