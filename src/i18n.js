import { dictionary, locale, _ } from 'svelte-i18n';
function setupI18n({ withLocale: _locale } = { withLocale: 'ro' }) {
    dictionary.set({
        en: {
            home: {
                title1: '',
                title2: ''
            },
            navbar: {

            },
            routes: {
                list: ""
            },
            login: {
                email: "Email",
                password: "Password",
                register: "Register",
                login: "Login"
            }
        },
        ro: {
            home: {
                title1: 'Bine ai venit la Bursa de Creanțe',
                title2: 'Singurul site unde poți cumpăra și vinde creanțe rapid și usor'
            },
            navbar: {
                signout: 'Ieși din cont'
            },
            routes: {
                list: "Listă",
                login: "Autentificare",
                register: "Înregistrare"
            },
            label: {
                optional: "Opțional"
            },
            fileUpload: {
                chooseFile: "Alege fișierul",
                uploadFiles: "Încarcă fișiere",
                noFilesUploaded: "Nu există un fișier încărcat"
            },
            login: {
                email: {
                    label: "Email",
                    error: {
                        isInvalid: "Email-ul este invalid"
                    }
                },
                password: {
                    label: "Parolă",
                    error: {
                        isRequired: "Parola este necesară",
                        atLeast6Characters: "Parola trebuie să aibă minimum 6 caractere"
                    },
                },
                register: "Înregistrare",
                login: "Autentificare"
            },
            register: {
                register: "Înregistrare",
                email: {
                    label: "Email",
                    error: {
                        isInvalid: "Email-ul este invalid"
                    }
                },
                password: {
                    label: "Parolă",
                    error: {
                        isRequired: "Parola este necesară",
                        atLeast6Characters: "Parola trebuie să aibă minimum 6 caractere"
                    },
                },
                confirmPassword: {
                    label: "Confirmă Parola",
                    error: {
                        isRequired: "Confirmarea parolei este necesară",
                        atLeast6Characters: "Confirmarea parolei trebuie să aibă minimum 6 caractere",
                        mustMatchWithPassword: "Cele două parole trebuie să fie identice"
                    },
                }
            },
            list: {
                addItem: "Creează",
                remove: "Șterge",
                buy: "Cumpără"
            },
            sellProduct: {
                addNewItem: "Creează o creanță",
                submit: "Trimite",
                cancel: "Anulează",
                title: {
                    label: "Titlu",
                    error: {
                        isRequired: "Titlul este necesar"
                    }
                },
                documents: {
                    label: "Documente",
                    error: {
                        isRequired: "Documentele sunt necesare"
                    }
                },
                owedAmount: {
                    label: "Suma datorată",
                    error: {
                        isRequired: "Suma datorată este necesară"
                    }
                },
                price: {
                    label: "Preț",
                    error: {
                        isRequired: "Prețul este necesar",
                        hasToBeSmallerThanOwedAmount: "Prețul trebuie să fie mai mic decât suma datorată"
                    }
                },
                debtor: {
                    label: "Datornic"
                },
                otherDocuments: {
                    label: "Alte documente"
                },
                details: {
                    label: "Detalii"
                }

            },
            entity: {
                name: "Nume",
                type: "Tip",
                address: "Adresă",
                email: "Email",
                actions: "Acțiuni",
                edit: "Modifică",
                delete: "Șterge",
                add: "Adaugă",
                loadingEntities: "Se încarcă",
                noEntitiesFound: "Lista este goală",
                page: "Pagina",
                outOf: "din",
                physical: "Fizic",
                juridical: "Juridic"
            }
        },
    });
    locale.set(_locale);
}
export { _, setupI18n };