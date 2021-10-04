export type ConfigEntry = string | number | boolean | ConfigEntry[]

export type Config =
  | {
      [key: string]: Config | Config[] | ConfigEntry
    }
  | ConfigEntry
