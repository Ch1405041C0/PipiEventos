# Pipi Eventos

Pipi Eventos ayuda a organizar celebraciones conectando a clientes con artistas, shows y lugares compatibles con su zona, fecha, cantidad de invitados y presupuesto.

## MVP actual

- Wizard para armar un evento: tipo, lugar, zona, invitados, fecha, hora, presupuesto y estilo de show.
- Matches demo para experiencias completas, artistas y lugares.
- Botón de consulta por WhatsApp con el evento precargado.
- Formularios de alta para artistas y lugares.
- Regla de negocio visible para artistas: comisión de plataforma del 30% sobre el show acordado.
- Entrada **Admin** para gestionar solicitudes de artistas/lugares, agenda de eventos y liquidaciones de comisión.

Los perfiles, teléfonos y datos del panel admin son demostrativos. El acceso Admin todavía no tiene autenticación: se conectará a roles reales antes de producción.

## Desarrollo

```bash
npm install
npm run dev
```

Para una compilación de producción:

```bash
npm run build
```

## Próximos hitos

1. Persistencia y roles con Supabase.
2. Perfiles verificables de artistas y lugares.
3. Solicitudes, disponibilidad y reservas.
4. Cobro de gestión al cliente y liquidación de comisión.
