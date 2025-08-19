import MatchingCard from "@/components/matching";

export default function MatchingPage() {
    return (
        <div className="flex flex-col items-start gap-3 m-3">
            {[1, 2, 3, 4, 5].map((item) => (
                <MatchingCard/>
            ))}
        </div>
    )
}