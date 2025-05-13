import Tick from "./Tick"

export default interface Website{
    id: string
    name: string
    url?: string
    disabled?: string
    ticks?: Tick[]
    balance?: string
}