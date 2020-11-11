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
                login: "Login",
                loginFailed: ""
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
                login: "Autentificare",
                loginFailed: "Autentificarea a eșuat"
            },
            register: {
                register: "Înregistrare",
                accountFailRegister: "Înregistrarea a eșuat",
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
                tryAgain: "Încearcă din nou",
                addItem: "Adaugă",
                remove: "Șterge",
                buy: "Cumpără",
                areYouSureYouWishToDelete: "Ești sigur că dorești să ștergi",
                yes: "Da",
                no: "Nu",
                itemDeleted: "Creanța a fost ștearsă",
                itemFailDelete: "Ștergerea creanței a eșuat",
                itemImageFailOpen: "Încărcarea imaginii a eșuat"
            },
            sellProduct: {
                addNewItem: "Creează o creanță",
                submit: "Trimite",
                cancel: "Anulează",
                productCreated: "Creanța a fost creată",
                productFailCreate: "Crearea creanței a eșuat",
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
                    label: "Datornic",
                    error: {
                        isRequired: "Datornicul este necesar"
                    }
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
                juridical: "Juridic",
                areYouSureYouWishToDelete: "Ești sigur că dorești să ștergi",
                yes: "Da",
                no: "Nu",
                debtorDeleted: "Datornicul a fost șters",
                debtorFailDelete: "Ștergerea datornicului a eșuat",
                editDebtor: "Modifică datornic",
                addDebtor: "Adaugă datornic"
            },
            entityModal: {
                submit: "Trimite",
                cancel: "Anulează",
                debtorEdited: "Datornicul a fost modificat",
                debtorFailEdit: "Modificarea datornicului a eșuat",
                debtorAdded: "Datornicul a fost adăugat",
                debtorFailAdd: "Adăugarea datornicului a eșuat",
                type: {
                    label: "Tip"
                },
                email: {
                    label: "Email",
                    error: {
                        isInvalid: "Email-ul este invalid"
                    }
                },
                firstName: {
                    label: "Prenume",
                    error: {
                        isRequired: "Prenumele este necesar",
                    }
                },
                lastName: {
                    label: "Nume",
                    error: {
                        isRequired: "Numele este necesar",
                    }
                },
                cnp: {
                    label: "CNP",
                    error: {
                        isInvalid: "CNP-ul este invalid",
                        isRequired: "CNP-ul este necesar",
                    }
                },
                series: {
                    label: "Serie",
                    error: {
                        isInvalid: "Seria este invalidă",
                        isRequired: "Seria este necesară",
                    }
                },
                number: {
                    label: "Număr",
                    error: {
                        isInvalid: "Numărul este invalid",
                        isRequired: "Numărul este necesar",
                    }
                },
                identityIssuer: {
                    label: "Emitent",
                    error: {
                        isRequired: "Emitentul este necesar",
                    }
                },
                expiryDate: {
                    label: "Valabilitate",
                    error: {
                        isRequired: "Valabilitatea este necesară",
                    }
                },
                name: {
                    label: "Nume",
                    error: {
                        isRequired: "Numele este necesar",
                    }
                },
                cui: {
                    label: "CUI",
                    error: {
                        isRequired: "CUI-ul este necesar",
                    }
                },
                recom: {
                    label: "RECOM",
                    error: {
                        isRequired: "RECOM-ul este necesar",
                    }
                },
                address: {
                    label: "Adresă",
                    error: {
                        isRequired: "Adresa este necesară",
                    }
                }
            },
            verifyAccount: {
                verifyAccount: "Activare cont",
                verifyAccountFirst: "Trebuie să îți activezi contul înainte să continui",
                submit: "Trimite",
                cancel: "Anulează",
                accountActivated: "Contul tău a fost activat",
                accountFailActivate: "Activarea contului tău a eșuat",
                userInformation: "Informații cont",
                bankInformation: "Informații bancă",
                identityCard: "Actul de identitate",
                firstName: {
                    label: "Prenume",
                    error: {
                        isRequired: "Prenumele este necesar",
                    }
                },
                lastName: {
                    label: "Nume",
                    error: {
                        isRequired: "Numele este necesar",
                    }
                },
                phone: {
                    label: "Telefon",
                    error: {
                        isRequired: "Telefonul este necesar",
                    }
                },
                address: {
                    label: "Adresă",
                    error: {
                        isRequired: "Adresa este necesară",
                    }
                },
                photo: {
                    label: "Poză",
                    error: {
                        isRequired: "Poza este necesară",
                    }
                },
                bank: {
                    label: "Banca",
                    error: {
                        isRequired: "Banca este necesară",
                    }
                },
                iban: {
                    label: "IBAN",
                    error: {
                        isInvalid: "IBAN-ul este invalid",
                        isRequired: "IBAN-ul este necesar",
                    }
                },
                cnp: {
                    label: "CNP",
                    error: {
                        isInvalid: "CNP-ul este invalid",
                        isRequired: "CNP-ul este necesar",
                    }
                },
                series: {
                    label: "Serie",
                    error: {
                        isInvalid: "Seria este invalidă",
                        isRequired: "Seria este necesară",
                    }
                },
                number: {
                    label: "Număr",
                    error: {
                        isInvalid: "Numărul este invalid",
                        isRequired: "Numărul este necesar",
                    }
                },
                identityIssuer: {
                    label: "Emitent",
                    error: {
                        isRequired: "Emitentul este necesar",
                    }
                },
                expiryDate: {
                    label: "Valabilitate",
                    error: {
                        isRequired: "Valabilitatea este necesară",
                    }
                },
            },
            issueBuy: {
                buy: "Cumpără",
                cancel: "Anulează",
            }
        },
    });
    locale.set(_locale);
}
export { _, setupI18n };