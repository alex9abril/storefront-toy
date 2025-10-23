import { Suspense } from "react";
import { Loader } from "@/ui/atoms/Loader";
import { ResetPasswordForm } from "@/ui/components/ResetPasswordForm";

interface ResetPasswordPageProps {
	searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
	const params = await searchParams;

	return (
		<Suspense fallback={<Loader />}>
			<section className="mx-auto max-w-7xl p-8">
				<ResetPasswordForm token={params.token} />
			</section>
		</Suspense>
	);
}
