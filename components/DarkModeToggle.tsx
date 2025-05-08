import { Moon, Sun } from "lucide-react"
import { useState } from "react"

export default function DarkModeToggle() {
    const [isDark,setIsDark]=useState(true)
    return (
        <button className="cursor-pointer mx-3" onClick={()=>{
            setIsDark(!isDark)
            document.querySelector("html")?.classList.toggle("dark")
            if(document.querySelector("html")?.classList.contains("dark")){
                setIsDark(true)
            }else{
                setIsDark(false)
            }
        }}>
            {isDark ? <Moon /> : <Sun />}
        </button>
    )
};
