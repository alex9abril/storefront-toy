import clsx from "clsx";
import { MenuIcon } from "lucide-react";
import { type HTMLAttributes } from "react";

type Props = {
	onClick: () => void;
} & Pick<HTMLAttributes<HTMLButtonElement>, "aria-controls">;

export const OpenButton = (props: Props) => {
	return (
		<button
			className={clsx(
				"flex h-8 w-8 flex-col items-center justify-center gap-1.5 self-end self-center sm:h-10 sm:w-10 lg:hidden",
			)}
			aria-controls={props["aria-controls"]}
			aria-expanded={false}
			aria-label="Open menu"
			onClick={props.onClick}
		>
			<MenuIcon className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" aria-hidden />
		</button>
	);
};
