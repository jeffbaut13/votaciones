# Componente Button

Componente de boton reutilizable con variantes visuales y opcion de animacion de flecha usando Framer Motion.

## Importacion

```jsx
import { Button } from "@/components/ui/Button";
```

## Props

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `children` | `ReactNode` | - | Contenido visible del boton. |
| `onClick` | `() => void` | `undefined` | Callback al hacer click. |
| `className` | `string` | `""` | Clases extra para personalizacion. |
| `size` | `"sm" \| "base" \| "xl"` | `"xl"` | Tamano tipografico del boton. |
| `disabled` | `boolean` | `false` | Deshabilita interaccion y aplica estilos de disabled. |
| `variant` | `"primary" \| "secondary" \| "third" \| "arrow" \| "ghost"` | `"primary"` | Define estilo visual del boton. |
| `back` | `boolean` | `false` | Invierte el icono/flecha para navegacion hacia atras. |
| `...props` | `ButtonHTMLAttributes` | - | Props nativos de `<button>`. |

## Variantes

- `primary`: fondo claro y texto oscuro.
- `secondary`: borde claro, fondo transparente, hover invertido.
- `third`: boton minimalista sin borde ni fondo.
- `arrow`: estilo minimalista con icono animado de flecha.
- `ghost`: fondo tenue con borde suave.

## Comportamiento de la flecha

La animacion de flecha se ejecuta en secuencia cuando `variant="arrow"` o `back={true}`:

1. Sale hacia un lado (`to`).
2. Se reubica fuera de pantalla al lado opuesto (`from`).
3. Regresa al centro (`quiet`).

La secuencia se controla con `useAnimationControls` para que no haya condiciones de carrera por `setTimeout`.

## Ejemplos

### Primario

```jsx
<Button variant="primary" onClick={handleSubmit}>
  Ver mas
</Button>
```

### Secundario

```jsx
<Button variant="secondary">Secundario</Button>
```

### Terciario

```jsx
<Button variant="third">Terciario</Button>
```

### Continuar (flecha a la derecha)

```jsx
<Button variant="arrow" onClick={handleNext}>
  Continuar
</Button>
```

### Atras (flecha a la izquierda)

```jsx
<Button variant="arrow" back onClick={handleBack}>
  Atras
</Button>
```

### Deshabilitado

```jsx
<Button variant="primary" disabled>
  Disabled
</Button>
```

## Notas

- Si necesitas tamano `xs`, actualmente no existe en `size` y se debe agregar en el switch de `sizes()`.
- Para accesibilidad, usa `aria-label` cuando el texto no sea suficientemente descriptivo.
- Puedes extender estilos con `className` sin perder la logica base del componente.
