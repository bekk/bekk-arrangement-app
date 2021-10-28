# bekk-arrangement-app

Administrere og delta på arrangementer i Bekk.
Kun interne kan opprette og endre, alle (eksterne og interne) kan melde seg på.

Dev: https://skjer-dev.bekk.no
Prod: https://skjer.bekk.no

## Oppstart

```
npm install
```
Sjekk node versjon dersom du har problemer med å installere pakker.

I en terminal, fra mappen `app`:

```
npm run server
```

I en annen terminal, fra mappen `app`:

```
npm start
```

Appen kjører da på http://localhost:3000

### 🔥Hett tips🔥

Skaff deg tmux, gå til rotmappa til prosjektet og kjør

```
./tmux.sh
```

### Koble mot lokal backend

export ARRANGEMENT_SVC_URL=http://localhost:5000
