import * as DialogPrimitive from "@radix-ui/react-dialog";
import Button from "./Button";
import classes from "../styles/components/Dialog.module.scss";
import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  MouseEventHandler,
} from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type DialogContentRef = ElementRef<typeof DialogPrimitive.Content>;

interface DialogContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  onDismiss?: MouseEventHandler<HTMLButtonElement>;
}

export const DialogContent = forwardRef<DialogContentRef, DialogContentProps>(
  ({ children, onDismiss, ...restProps }, ref) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={classes.overlay} />
      <DialogPrimitive.Content
        className={classes.content}
        ref={ref}
        {...restProps}
      >
        {onDismiss && (
          <DialogPrimitive.Close asChild>
            <Button
              aria-label="Dismiss"
              className={classes.closeButton}
              onClick={onDismiss}
              title="Dismiss"
              variant="unstyled"
            >
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          </DialogPrimitive.Close>
        )}
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
);

DialogContent.displayName = "DialogContent";

export const Dialog = DialogPrimitive.Root;
export const DialogTitle = DialogPrimitive.Title;
