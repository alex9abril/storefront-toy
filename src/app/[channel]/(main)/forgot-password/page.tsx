import { Suspense } from "react";
import { Loader } from "@/ui/atoms/Loader";
import { PasswordResetForm } from "@/ui/components/PasswordResetForm";

export default function ForgotPasswordPage() {
	return (
		<Suspense fallback={<Loader />}>
			<section className="mx-auto max-w-7xl p-8">
				<PasswordResetForm />
			</section>
		</Suspense>
	);
}
