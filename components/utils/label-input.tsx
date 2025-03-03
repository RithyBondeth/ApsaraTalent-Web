import { TypographyMuted } from "./typography/typography-muted";

export default function LabelInput({ label, input }: { label: string, input: React.ReactNode }) {
    return (
        <div className="w-full flex flex-col items-start gap-2">
            <TypographyMuted className="text-xs">{label}</TypographyMuted>
            {input}
        </div>
    )
}