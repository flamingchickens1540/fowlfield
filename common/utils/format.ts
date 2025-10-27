export function formatDuration(duration: number) {
    const minutes = Math.floor(duration / 60).toFixed(0)
    const seconds = (duration % 60).toFixed(1).padStart(4, '0')
    return `${minutes}:${seconds}`
}

export function roundToPlaces(value: number, places: number): number
export function roundToPlaces(value: number | null, places: number): number | null {
    if (value == null) {
        return null
    }
    const pad = 10 ** places
    return Math.round(value * pad) / pad
}
