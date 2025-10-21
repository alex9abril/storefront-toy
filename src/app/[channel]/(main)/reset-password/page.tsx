import { Suspense } from "react";
import { Loader } from "@/ui/atoms/Loader";
import { ResetPasswordForm } from "@/ui/components/ResetPasswordForm";

interface ResetPasswordPageProps {
	searchParams: { token?: string };
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
	return (
		<Suspense fallback={<Loader />}>
			<section className="mx-auto max-w-7xl p-8">
				<ResetPasswordForm token={searchParams.token} />
			</section>
		</Suspense>
	);
}
