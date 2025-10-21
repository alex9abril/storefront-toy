export const UserMenuSkeleton = () => {
	console.log("⏳ CARGANDO SESIÓN - Mostrando skeleton");

	return (
		<div className="flex items-center gap-2">
			<div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
			<div className="hidden h-4 w-20 animate-pulse rounded bg-gray-200 sm:block"></div>
		</div>
	);
};
