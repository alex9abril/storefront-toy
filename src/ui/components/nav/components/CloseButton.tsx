import clsx from "clsx";
import { XIcon } from "lucide-react";
import { type HTMLAttributes } from "react";

type Props = {
	onClick: () => void;
} & Pick<HTMLAttributes<HTMLButtonElement>, "aria-controls">;

export const CloseButton = (props: Props) => {
	return (
		<button
			className={clsx(
				"top-0 ml-auto flex h-8 w-8 flex-col items-center justify-center gap-1.5 self-end self-center sm:h-10 sm:w-10 lg:hidden",
			)}
			aria-controls={props["aria-controls"]}
			aria-expanded={true}
			aria-label="Close menu"
			onClick={props.onClick}
		>
			<XIcon className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" aria-hidden />
		</button>
	);
};
