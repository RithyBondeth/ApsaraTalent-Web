import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ApsaraLoadingSpinner from "../apsara-loading-spinner";
import { TypographyMuted } from "../typography/typography-muted";

export default function LoadingDialog(props: {
  loading: boolean;
  title: string;
  subTitle?: string;
}) {
  return (
    <Dialog open={props.loading}>
      <DialogContent>
        <div className="w-full flex flex-col items-center justify-center gap-3 py-4">
          <ApsaraLoadingSpinner size={80} loop />
          <DialogTitle>{props.title}</DialogTitle>
          {props.subTitle && (
            <TypographyMuted className="text-center">
              {props.subTitle}
            </TypographyMuted>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
