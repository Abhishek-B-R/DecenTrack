export default interface Tick {
    id: string
    timestamp: string
    status: number
    latency?: number
    location:string
}