# blogsys

## Ustawienia bazy danych

### Firestore > Rules

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Użytkownik widzi tylko swoje dane
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Inne dane, dostępne dla zalogowanych
    match /{collection}/{doc} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Firestore > Indexes

| Collection ID | Fields indexed                | Query scope | Index ID     | Status  |
|---------------|-------------------------------|-------------|--------------|---------|
| accounts      | ownerId, updatedAt, __name__  | Collection  | CICAgJim14AJ | Enabled |
| posts         | authorId, updatedAt, __name__ | Collection  | CICAgOjXh4EK | Enabled |

## Pliki blogsys

Pliki, które są potrzebne do działania blogsys:

- `actions`
- `app/(blogsys)`
- `app/(dashboard)`
- `app/api`
- `components/blogsys`
- `context`
- `lib`
- `public/icons/blogsys`

### Zmienne środowiskowe

```env
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

INIT_ADMIN_SECRET_KEY=

AUTH_SECRET=

ENCRYPTION_KEY=
```

Wartości dla firebase/firestore pochodzą z klucza Service Account. Aby je uzyskać:

- Przejdź do Firebase Console
- Project Settings → Service Accounts
- Kliknij "Generate new private key"
- Pobierz plik JSON

Plik JSON będzie zawierał strukturę podobną do:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSk...\n-----END PRIVATE KEY-----\n",
  "client_id": "xxxxxxxxxxxxxxxxxxxxx",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis...iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
```
