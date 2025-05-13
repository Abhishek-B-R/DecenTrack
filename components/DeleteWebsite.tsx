
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { MonitorContext } from "@/Context/MonitoringContext"
import { useContext, useState } from "react"
import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"
import Website from "@/interfaces/Website"
import { Spinner } from "./ui/loading-spinner"

export default function DeleteWebsite({website,fetchAllData}:{
    website:Website,fetchAllData:() => Promise<void>
}) {
    const context = useContext(MonitorContext)    
    const [inProgress,setInProgress]=useState(false)
    
    if(!context)    return <div>Context loading</div>
    const { deleteWebsite }=context
    const handleDeleteWebsite = async (websiteId: string) => {
        try {
            setInProgress(true)
            await deleteWebsite(websiteId)
            console.log(`Website ${websiteId} deleted successfully.`)
            setInProgress(false)
            // Refresh data to remove deleted website
            fetchAllData()
        } catch (error) {
            console.error("Error deleting website:", error)
        }
    }

    if(inProgress){
        return <Button variant={'destructive'} className="w-30">
            <Spinner/>
        </Button>
    }

    {/* Delete Website Alert Dialog */}
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex items-center gap-2 w-30 cursor-pointer">
                <Trash2 className="h-4 w-4" />
                Delete
            </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the website &quot;{website.name}&quot; and remove
                all associated data.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteWebsite(website.id)} 
                className="cursor-pointer">Delete</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
};
