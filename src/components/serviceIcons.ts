import {
  DoorIcon,
  InstallIcon,
  MeshIcon,
  ShutterIcon,
  SillIcon,
  WindowIcon,
} from './Icons';

/**
 * Ikonnév → komponens. A `src/config/site.ts` szolgáltatásainál megadott
 * `icon` mező ezt a táblát címzi meg, így a konfigurációban elég egy
 * rövid kulcsot írni.
 */
export const SERVICE_ICONS = {
  window: WindowIcon,
  door: DoorIcon,
  shutter: ShutterIcon,
  mesh: MeshIcon,
  sill: SillIcon,
  install: InstallIcon,
} as const;

export type ServiceIconName = keyof typeof SERVICE_ICONS;
