export function formatDuration(duration:number) {
    
    const minutes = Math.floor(duration / 60).toFixed(0);
    const seconds = (duration % 60).toFixed(0).padStart(2, '0');
    return `${minutes}:${seconds}`;
}