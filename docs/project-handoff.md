# Ripio Mundial 2026 — Project Handoff

**Última actualización**: 1 marzo 2026
**Proyecto**: App de pronósticos para el Mundial 2026, desarrollada por Ripio
**Stack**: Next.js 16 (App Router) · Supabase (Auth, DB, Storage) · Tailwind CSS v4 · TypeScript · Vercel

---

## Qué es este proyecto

App web de pronósticos deportivos tipo "PRODE" para el Mundial 2026. Los usuarios se registran con email (magic link / OTP), hacen sus predicciones partido a partido, y compiten en un ranking general (Liga Ripio) o en ligas privadas con amigos. El premio del 1er puesto en la liga general es **1.000.000 wARS** (stablecoin de Ripio).

**Modelo de usuario:**
1. Usuario se registra con su email → recibe magic link → hace clic → ingresa a la app
2. Elige un nombre de usuario único (display_name, 3-20 chars)
3. Hace sus pronósticos (home_goals / away_goals por partido)
4. Ve el ranking en tiempo real a medida que los partidos se van jugando
5. Puede crear ligas privadas e invitar amigos

---

## Repositorio y entorno

```
Ruta local: /Users/ripio/Desktop/ripio-mundial-2026/
Hosting: Vercel (auto-deploy desde rama principal)
DB/Auth/Storage: Supabase
```

### Variables de entorno requeridas

```bash
# Supabase (obligatorias)
NEXT_PUBLIC_SUPABASE_URL=https://nisegxadupnavsdammwf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<jwt_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>   # Solo en server/API routes

# Administradores (comma-separated)
ADMIN_EMAILS=email@ripio.com,otro@ripio.com

# Cron sync de resultados (Bearer token)
CRON_SECRET=<secret_string>
```

---

## Estructura del proyecto

```
app/                          # Next.js App Router (pages y API routes)
  ├── page.tsx                # Landing page (home)
  ├── layout.tsx              # Root layout con Navbar
  ├── login/page.tsx          # Login con OTP/magic link
  ├── register/page.tsx       # Registro: email + display_name + OTP
  ├── rules/page.tsx          # Reglas del juego
  ├── matches/page.tsx        # Partidos y formulario de pronósticos
  ├── me/page.tsx             # Perfil: stats, avatar, nombre
  ├── leaderboard/page.tsx    # Ranking general con podio top 3
  ├── leagues/page.tsx        # Mis ligas (crear/unirse)
  ├── leagues/[id]/page.tsx   # Detalle de una liga + ranking + pronósticos
  ├── admin/page.tsx          # Panel de admin (restringido)
  ├── auth/
  │   ├── callback/route.ts   # OTP callback → crea sesión
  │   └── check-email/        # Pantalla "revisá tu email"
  └── api/
      ├── predictions/route.ts            # Guardar/obtener pronósticos
      ├── leagues/create/route.ts         # Crear liga privada
      ├── leagues/join/route.ts           # Unirse con invite_code
      ├── admin/recalculate/route.ts      # Recalcular bracket
      └── cron/sync-results/route.ts      # Sync resultados desde TheSportsDB

components/
  ├── MatchCard.tsx            # Tarjeta de partido con inputs de pronóstico
  ├── MatchesList.tsx          # Lista de partidos con filtros
  ├── LeaderboardTable.tsx     # Tabla de ranking con scroll infinito y avatares
  ├── AvatarUpload.tsx         # Subida de foto de perfil (Supabase Storage)
  ├── EditDisplayName.tsx      # Edición inline del nombre de usuario
  ├── GroupStandingsTable.tsx  # Tabla de posiciones de grupos
  ├── LeaguePredictionsPanel.tsx # Panel de pronósticos por partido en liga
  ├── ShareLeagueCompact.tsx   # Botones de compartir liga
  ├── NavbarClient.tsx         # Navbar con estado de auth
  ├── Hero.tsx                 # Sección hero de la landing
  ├── AdminMatchForm.tsx       # Form de admin para actualizar resultados
  ├── SyncButton.tsx           # Botón de sincronización API (admin)
  └── RecalculateButton.tsx    # Botón de recálculo bracket (admin)

lib/
  ├── scoring.ts               # Lógica de puntos + interfaces TypeScript
  ├── supabase-server.ts       # Cliente Supabase para Server Components
  ├── supabase-browser.ts      # Cliente Supabase para Client Components
  ├── supabase.ts              # Config base de Supabase
  ├── constants.ts             # GENERAL_LEAGUE_ID y otras constantes
  └── team-names.ts            # Normalización de nombres de equipos (ES→EN)

supabase/migrations/           # Migraciones de base de datos
  ├── add_leaderboard_function.sql
  ├── add_auto_classification.sql
  ├── add_knockout_bracket.sql
  ├── add_avatar_upload.sql
  ├── backfill_display_names.sql
  ├── fix_knockout_bracket_pairings.sql
  └── update_matches_refs.sql

types/
  └── match.ts                 # Interfaces Match y Prediction
```

---

## Base de datos (Supabase)

### Tablas principales

#### `profiles`
| Columna | Tipo | Notas |
|---|---|---|
| id | UUID | FK → auth.users.id |
| display_name | TEXT | Único, 3-20 chars, se muestra en rankings |
| email | TEXT | Indexado |
| avatar_url | TEXT | URL al bucket avatars (nullable) |
| created_at | TIMESTAMPTZ | Desempate en ranking |

#### `matches`
| Columna | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| match_number | INT | Número único de partido (1-104) |
| stage | TEXT | 'group', 'ro32', 'ro16', 'quarterfinal', 'semifinal', 'third_place', 'final' |
| group_code | TEXT | 'A'-'H' (solo fase de grupos) |
| home_team / away_team | TEXT | Nombre del equipo |
| home_team_code / away_team_code | TEXT | Código de 2 letras (para banderas) |
| home_team_ref / away_team_ref | JSONB | Referencia dinámica para eliminatoria (ver abajo) |
| is_resolved | BOOLEAN | True cuando se resolvieron los equipos del knockout |
| kickoff_at | TIMESTAMPTZ | Fecha y hora del partido |
| status | TEXT | 'scheduled', 'live', 'finished' |
| home_score / away_score | INT | null hasta que termine |
| venue / city | TEXT | Estadio y ciudad |

**Formato de `home_team_ref` / `away_team_ref`:**
```json
// Para equipos de fase de grupos:
{ "type": "group_position", "group": "A", "position": 1 }

// Para ganador de un partido anterior:
{ "type": "match_winner", "match_number": 73 }

// Para perdedor (partido 3er puesto):
{ "type": "match_loser", "match_number": 101 }
```

#### `predictions`
| Columna | Tipo | Notas |
|---|---|---|
| user_id | UUID | FK → profiles.id |
| match_id | UUID | FK → matches.id |
| home_goals | INT | Pronóstico del usuario |
| away_goals | INT | |
| created_at / updated_at | TIMESTAMPTZ | |
> PK compuesto: (user_id, match_id)

#### `leagues`
| Columna | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| name | TEXT | Nombre de la liga |
| owner_id | UUID | FK → profiles.id |
| is_public | BOOLEAN | true solo para la liga general |
| invite_code | TEXT | 6 chars alfanumérico (ej: "AB12CD") |

#### `league_members`
| Columna | Tipo | Notas |
|---|---|---|
| league_id | UUID | FK → leagues.id |
| user_id | UUID | FK → profiles.id |
| role | TEXT | 'owner' o 'member' |

---

### Funciones SQL y Triggers

#### `get_leaderboard(p_league_id UUID)`
Función central del ranking. Calcula puntos, exactos y aciertos en la DB (no en JS).

```
Retorna: user_id, display_name, avatar_url, points, exact_hits, correct_outcomes, created_at
Orden: points DESC → exact_hits DESC → correct_outcomes DESC → created_at ASC
```

**Sistema de puntos:**
- 3 puntos: pronóstico exacto (home_goals == home_score AND away_goals == away_score)
- 1 punto: resultado correcto (mismo ganador/empate) pero marcador incorrecto
- 0 puntos: fallo

#### `resolve_qualified_teams()`
Resuelve automáticamente los equipos de los partidos de eliminatoria:
- Lee la vista `group_standings` para equipos clasificados por posición de grupo
- Lee resultados de partidos anteriores para ganadores/perdedores
- Se ejecuta automáticamente vía trigger cuando un partido pasa a 'finished'

#### `force_recalculate_classification()`
Para uso del admin. Resetea `is_resolved = false` en todos los partidos de eliminatoria y vuelve a correr `resolve_qualified_teams()`. Accesible desde `/api/admin/recalculate`.

#### View: `group_standings`
Vista que calcula la tabla de posiciones de cada grupo (para la fase de grupos). Incluye: partidos jugados, ganados, empatados, perdidos, goles a favor/contra, diferencia de goles, puntos, posición.

---

### Storage: bucket `avatars`

- **Acceso**: Público para lectura, autenticado para escritura
- **Path**: `avatars/{user_id}` (el UUID del usuario es el nombre del archivo)
- **Upload**: Siempre con `upsert: true` para reemplazar
- **URL pública**: `https://{SUPABASE_URL}/storage/v1/object/public/avatars/{user_id}`
- **RLS**: Solo el propio usuario puede subir/actualizar su avatar

---

## Sistema de autenticación

Usa **Supabase Auth con OTP por email** (magic links). No hay contraseñas.

**Flujo de registro:**
1. `/register` → usuario ingresa email + display_name
2. Se valida que el display_name sea único
3. Se llama `signInWithOtp({ email, options: { data: { display_name } } })`
4. Usuario recibe email con magic link
5. Clic en el link → `/auth/callback?code=...` → `exchangeCodeForSession(code)`
6. Supabase trigger crea el perfil en `profiles` automáticamente (o lo crea el callback)
7. Redirige a `/matches`

**Flujo de login:**
1. `/login` → usuario ingresa email
2. Se verifica que el perfil exista (para distinguir entre registrado y no registrado)
3. `signInWithOtp({ email })`
4. Mismo callback flow

---

## Sistema de sincronización de resultados

**Endpoint:** `POST /api/cron/sync-results`
**Autenticación:** `Authorization: Bearer {CRON_SECRET}`
**Fuente:** TheSportsDB API v1 (gratuita, sin key)

```
URL: https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=153854&s=2026
```

**Proceso:**
1. Fetch de todos los partidos del Mundial 2026 desde TheSportsDB
2. Solo procesa partidos dentro de ventana [-30 días, +180 días]
3. Normaliza nombres de equipos (español → inglés vía `team-names.ts`)
4. Hace matching por (home_team, away_team) con partidos en la DB
5. Actualiza home_score, away_score, status según los datos de la API
6. Para cada partido que pasa a 'finished', el trigger de la DB resuelve automáticamente los equipos del siguiente round

**Configuración de Cron en Vercel:**
Se puede configurar en `vercel.json` para llamar al endpoint periódicamente.

---

## Cómo correr el proyecto localmente

```bash
# Instalar dependencias
npm install

# Crear .env.local con las variables requeridas
cp .env.example .env.local
# Editar .env.local con los valores reales

# Correr en desarrollo
npm run dev

# El servidor corre en http://localhost:3000
```

---

## Componente AvatarUpload — cómo funciona

`components/AvatarUpload.tsx` — Client Component

**Props:**
- `userId: string` — ID del usuario (para el path en Storage)
- `displayName: string` — Para mostrar iniciales si no hay foto
- `currentAvatarUrl: string | null` — URL actual del avatar

**Comportamiento:**
1. Muestra un círculo: foto si hay `avatar_url`, o iniciales si no
2. Al hacer clic → abre selector de archivo (solo imágenes, max 2MB)
3. Sube a `storage.from('avatars').upload(userId, file, { upsert: true })`
4. Obtiene la public URL y actualiza `profiles.avatar_url`
5. Actualiza el estado local inmediatamente (con cache-bust `?t=timestamp`)
6. Llama `router.refresh()` para sincronizar el Server Component padre

**Iniciales (getInitials):**
```typescript
// "Lionel Cortina" → "LC"
// "Juan" → "J"
// null/undefined → "?"
```

---

## Historial de desarrollo (sesiones con Claude)

### Lo que se hizo antes de este documento

1. **Setup inicial** — Next.js, Supabase, rutas básicas, auth flow con OTP
2. **Match predictions** — MatchCard con inputs numéricos, guardado automático, conteo regresivo al kickoff
3. **Leaderboard** — Tabla de ranking, podio top 3 con premios wARS, scroll infinito, sticky bar para posición del usuario
4. **Sistema de ligas** — Liga general (hardcoded UUID), ligas privadas con invite codes, join/create flows
5. **Bracket de eliminatoria** — match_refs en JSONB, `resolve_qualified_teams()` trigger, vista de bracket
6. **Sync de resultados** — Endpoint cron que consume TheSportsDB, normalización de nombres
7. **Mejoras de diseño** — Medallas emoji (🥇🥈🥉), responsive fixes, consistencia visual dark theme
8. **Avatares de usuario** — Supabase Storage bucket `avatars`, `AvatarUpload` component, actualización de `get_leaderboard()` para incluir `avatar_url`, display en LeaderboardTable y leagues

---

## Decisiones técnicas importantes

| Decisión | Por qué |
|---|---|
| Scoring en la DB (`get_leaderboard()`) | Performance: evita traer ~32K filas a JS con 500 usuarios × 64 partidos |
| OTP-only auth (no password) | Menor fricción, no hay olvido de contraseñas. Google OAuth fue descartado por restricciones de GCP corporativo |
| `export const dynamic = 'force-dynamic'` en páginas clave | Datos siempre frescos (ranking, partidos, ligas) |
| Avatares en Supabase Storage (no base64/otra CDN) | Storage integrado con auth/RLS, URL pública simple, sin costos adicionales |
| Invite codes de 6 chars | Balance entre comodidad de compartir y colisiones improbables |
| Liga General con UUID hardcodeado | Simplicidad: todos los usuarios son miembros de la liga general automáticamente |
| TheSportsDB para datos | API gratuita para el Mundial 2026, sin key requerida |

---

## Pendientes / ideas futuras

- Sub-competencias temáticas (por grupo, por ronda) con premios
- Notificaciones por email antes de cada partido
- Vista de bracket visual
- Mini-games / trivias para retención diaria (como tiene Penka, competidor principal)
- Estadísticas más detalladas por usuario (por grupo, por equipo)
- Internacionalización (actualmente es solo español argentino)

---

## Contacto del proyecto

Este proyecto fue iniciado por el equipo de Ripio para el Mundial 2026. Si sos un Claude de otra sesión o cuenta leyendo esto: el código está en `/Users/ripio/Desktop/ripio-mundial-2026/`. La rama de trabajo activa puede estar en un worktree bajo `.claude/worktrees/`. Chequeá `git branch` y `git status` para orientarte.
