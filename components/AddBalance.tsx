import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "./ui/button"
import { Plus } from "lucide-react"
import { useContext, useState } from "react"
import { MonitorContext } from "@/context/MonitoringContext"
import Website from "@/interfaces/Website"
import { Spinner } from "./ui/loading-spinner"

export default function AddBalance({website,fetchAllData}:{
    website:Website,fetchAllData:() => Promise<void>
}) {
    const [balanceAmount, setBalanceAmount] = useState("0.01")
    const [selectedWebsite, setSelectedWebsite] = useState<string | null>(null)
    const [inProgress,setInProgress]=useState(false)
    const context=useContext(MonitorContext)
    if(!context)    return <div>Context loading...</div>
    const {addWebsiteBalance} = context
    const handleAddBalance = async () => {
        if (!selectedWebsite) return

        try {
          setInProgress(true)
          await addWebsiteBalance(selectedWebsite, balanceAmount)
          console.log(`Added ${balanceAmount} ETH to website balance.`)
          setInProgress(false)
          // Refresh data to show updated balance
          fetchAllData()
        } catch (error) {
        console.error("Error adding balance:", error)
        }
    }

    if(inProgress){
      return <Spinner/>
    }
    return (
        <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setSelectedWebsite(website.id)}
          >
            <Plus className="h-4 w-4" />
            Add Balance
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Balance</DialogTitle>
            <DialogDescription>
              Enter the amount of ETH you want to add to this website&apos;s balance.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount (ETH)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.001"
                min="0.001"
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleAddBalance} className="cursor-pointer">Add Balance</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
};
