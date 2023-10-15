import { createSubscription } from "libs/global-state-hook"

export const locationStore = createSubscription<{name: string, code: string}[]>([])
