import * as React from "react"
import { cn } from "@/lib/utils"
import { IInputProps } from "@/utils/interfaces/input.interface"

const Input = React.forwardRef<HTMLInputElement, IInputProps>(
  ({ className, type, prefix, suffix, ...props }, ref) => {
    return (
      <div className={cn(
        "flex items-center h-12 w-full rounded-md border border-input bg-background px-3 text-base ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}>
        {prefix && <span className="mr-2 text-muted-foreground">{prefix}</span>}
        <input
          type={type}
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground placeholder:text-sm"
          ref={ref}
          {...props}
        />
        {suffix && <span className="ml-2 text-muted-foreground">{suffix}</span>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }