# Design System Specification
## Tecnologia Material de Lujo (Luxury Material Technology)

**Autor:** Eduardo Alfredo Ramirez Torres  
**Plataforma:** LibroSync Enterprise (Sector Seguros / Financiero)  
**Version del Sistema de Diseno:** 2.0.0  

---

## 1. Filosofia de Diseno

El sistema visual de **LibroSync Enterprise** se aleja de las interfaces genericas saturadas de neon y degradados planos comunes en prototipos de IA. 

Adopta la estetica de **"Tecnologia Material de Lujo"**: una combinacion entre el rigor de una institucion financiera/aseguradora tradicional y la sofisticacion de una suite de ingenieria contemporanea. La interfaz transmite peso, sustancialidad, precision mecanica y caracter editorial.

---

## 2. Paleta de Colores Estandar

### 2.1 Fondos y Superficies (Charcoal Slate Calido)
*   **App Deep Canvas:** `#0e121a` (Carbon profundo con matices calidos de grafito).
*   **Surface Panel:** `#141923` (Pizarra calida estructurada).
*   **Card Bed:** `#1a202c` (Sustrato solido con relieve biselado).
*   **Card Hover & Active:** `#202838` (Profundidad refractiva tactil).

### 2.2 Metales y Acentos Primarios
*   **Zafiro Medianoche (Midnight Sapphire):**
    *   Primario: `#1d4ed8` / `#2563eb`
    *   Gradiente Real: `linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)`
    *   Proposito: Acciones primarias de alta jerarquia, botones de confirmacion y marcadores de estado critico.
*   **Cobre Brunido & Bronce de Archivo (Burnished Copper):**
    *   Cobre Base: `#c27803`
    *   Bronce Envejecido: `#92400e`
    *   Foil de Cobre: `linear-gradient(135deg, #d97706 0%, #b45309 60%, #78350f 100%)`
    *   Proposito: Acento secundario, insignias institucionales, biseles de titulos y detalles de micro-interaccion.
*   **Piedra Jade Esmeralda (Success):** `#059669` (Estados activos y confirmaciones contables).
*   **Rubi Quemado (Alert / Due):** `#dc2626` (Alertas de stock o devoluciones pendientes).

---

## 3. Tipografia Editorial

Se implementa una combinacion contrastada de doble familia:

```
[ Titulos & Encabezados de Lujo ] âž” Playfair Display / Cormorant Garamond (Serif de alto contraste)
[ Metadatos, UI y Botoneria ]   âž” Inter / Plus Jakarta Sans (Geometric Sans-Serif de maxima legibilidad)
[ Codigos, ISBN y Telemetria ]  âž” JetBrains Mono (Tipografia monoespaciada para telemetria y SQL)
```

*   **Encabezados Principales (`h1`, `h2`):** `font-family: 'Playfair Display', Georgia, serif; font-weight: 700; letter-spacing: -0.01em;`
*   **Cuerpo de Texto y Formularios:** `font-family: 'Inter', sans-serif; font-size: 0.9rem;`
*   **Etiquetas y Sellos Institucionales:** `font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 700;`

---

## 4. Profundidad Tactil y Biseles Neumorficos

En lugar de sombras flotantes difusas, cada contenedor se estructura con un modelo de relieve biselado mecanizado:

```css
/* Bisel superior iluminado + Sombra de anclaje profundo */
box-shadow: 
  inset 0 1px 1px rgba(255, 255, 255, 0.08),
  inset 0 -1px 2px rgba(0, 0, 0, 0.6),
  0 8px 24px -4px rgba(0, 0, 0, 0.5);
border: 1px solid rgba(255, 255, 255, 0.07);
border-top: 1px solid rgba(217, 119, 6, 0.35); /* Acento sutil de cobre en el borde superior */
```

---

## 5. Iconografia Grabada y Medallones

Cada icono se disena dentro de un glifo o medallon con relieve propio:
*   Borde circular o poligonal con bisel de bronce.
*   Trazo fino con doble linea perimetral para evocar el diseno de sellos notariales y diplomas de archivo.
*   Efecto de chapa metalica iluminada desde la esquina superior izquierda.

---

## 6. Componentes del Ecosistema

1. **Pantalla de Identificacion (Acceso Institucional):** Tarjeta con sello central en bajorrelieve, formulario con rebordes de precision y acceso rapido de evaluacion.
2. **Tablero de Metricas (KPI Modules):** Tarjetas con division estructural, medidores analogicos y tipografia serif contable.
3. **Ficha Bibliografica de Coleccion:** Marco tipo encuadernacion clasica, medidor de inventario con riel bruÃ±ido y boton de solicitud con textura zafiro.
4. **Consola de Telemetria de Archivo:** Disenada como una bitacora de navegacion o panel de instrumentos de sala de servidores con contraste tenue y marcas de tiempo rigurosas.