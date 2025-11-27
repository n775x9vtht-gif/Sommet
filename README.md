<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1V80UTDgQ0LtmLmyewJt9vHckpH-7eWjI

## Variables d'environnement indispensables

Le projet sépare les variables utilisées côté navigateur (préfixe `VITE_`) de celles utilisées côté Node. **Si ces variables ne sont pas définies, l'application lève une erreur de démarrage.**

Front (fichiers Vite) – place ces clés dans `.env.local` :

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GEMINI_API_KEY` (clé API Gemini)

Back/Node (scripts ou API) – place ces clés dans `.env` ou dans l'environnement de ton serveur :

- `SUPABASE_URL` ou `VITE_SUPABASE_URL`
- `SUPABASE_ANON_KEY` ou `VITE_SUPABASE_ANON_KEY`
- `API_KEY` ou `VITE_GEMINI_API_KEY`

Astuce : tu peux définir chaque variable **une seule fois** avec le préfixe `VITE_` pour couvrir les deux contextes (Vite expose automatiquement `import.meta.env` côté front, et le code côté Node lit aussi ces clés).

## Exemple de configuration locale

Crée un fichier `.env.local` (chargé par Vite) et un `.env` (chargé par les scripts Node si besoin) à la racine du repo :

```bash
# .env.local – requis pour le front
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GEMINI_API_KEY=your_gemini_key

# .env – utile pour les scripts Node (optionnel si les clés VITE_ sont déjà définies)
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
API_KEY=your_gemini_key
```

## Lancer en local

**Prérequis :** Node.js

1. Installer les dépendances :
   `npm install`
2. Vérifier que les variables ci-dessus sont renseignées dans `.env.local` (et `.env` si nécessaire).
3. Lancer le serveur de dev :
   `npm run dev`

## Pousser les modifications sur GitHub

Si tu ne vois pas les derniers commits sur GitHub, voici la marche à suivre :

1. Vérifie que ton dépôt local pointe vers le dépôt GitHub :
   ```bash
   git remote -v
   # s'il n'y a rien, ajoute le dépôt
   git remote add origin https://github.com/<TON_ORG>/<TON_REPO>.git
   ```
2. Vérifie les changements en attente et ajoute-les à l'index :
   ```bash
   git status
   git add .
   ```
3. Crée un commit avec un message clair :
   ```bash
   git commit -m "Message décrivant la modification"
   ```
4. Envoie la branche courante vers GitHub (avec suivi) :
   ```bash
   # si ta branche s'appelle work
   git push -u origin work
   ```
5. Après le premier push, tu peux simplement utiliser :
   ```bash
   git push
   ```

Astuce : si le push est refusé à cause de commits distants, récupère-les d'abord avec
`git pull --rebase origin work`, résous les éventuels conflits, puis relance `git push`.
