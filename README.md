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

| Collection ID | Fields indexed                  | Query scope | Index ID       | Status   |
|---------------|---------------------------------|-------------|----------------|----------|
| accounts      | ownerId, updatedAt, __name__    | Collection  | CICAgJim14AJ   | Enabled  |
| posts         | authorId, updatedAt, __name__   | Collection  | CICAgOjXh4EK   | Enabled  |


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
