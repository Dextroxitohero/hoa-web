# HabitaPro Web (`hoa-maintenance-web`)

Frontend de HabitaPro para administración de privadas (HOA-Maintenance), construido con Next.js y TypeScript.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query + TanStack Table
- Modo claro/oscuro con `next-themes`

## Configuración local

```bash
npm install
cp .env.example .env.local
npm run dev
```

App disponible en `http://localhost:3000`.

## Estructura

- `src/app`: rutas App Router
- `src/components`: componentes compartidos y UI
- `src/modules`: arquitectura por módulos de negocio
- `src/lib`: utilidades comunes

## Integración con API

- Configura `NEXT_PUBLIC_API_URL` en `.env.local`.
- La API base esperada es `http://localhost:3001/api/v1`.
