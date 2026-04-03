"use client"
import { Switch } from "./ui/switch"
import { useRole } from "./RoleContext"
import { Shield, Eye } from "lucide-react"

const RoleToggle = () => {
  const { role, toggleRole, isAdmin } = useRole();

  return (
    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-full px-3 border border-border">
      <div className="flex items-center gap-1.5 text-sm font-medium">
        {isAdmin ? (
          <Shield className="h-4 w-4 text-blue-600" />
        ) : (
          <Eye className="h-4 w-4 text-amber-600" />
        )}
        <span className="capitalize hidden sm:inline w-12">{role}</span>
      </div>
      <Switch checked={isAdmin} onCheckedChange={toggleRole} />
    </div>
  )
}

export default RoleToggle;