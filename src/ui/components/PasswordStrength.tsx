"use client";

import { useState, useEffect } from "react";

interface PasswordStrengthProps {
	password: string;
}

export const PasswordStrength = ({ password }: PasswordStrengthProps) => {
	const [strength, setStrength] = useState(0);
	const [feedback, setFeedback] = useState("");

	useEffect(() => {
		if (!password) {
			setStrength(0);
			setFeedback("");
			return;
		}

		let score = 0;
		const feedbacks: string[] = [];

		// Longitud mínima
		if (password.length >= 8) {
			score += 1;
		} else {
			feedbacks.push("Mínimo 8 caracteres");
		}

		// Contiene mayúsculas
		if (/[A-Z]/.test(password)) {
			score += 1;
		} else {
			feedbacks.push("Incluye mayúsculas");
		}

		// Contiene minúsculas
		if (/[a-z]/.test(password)) {
			score += 1;
		} else {
			feedbacks.push("Incluye minúsculas");
		}

		// Contiene números
		if (/\d/.test(password)) {
			score += 1;
		} else {
			feedbacks.push("Incluye números");
		}

		// Contiene caracteres especiales
		if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
			score += 1;
		} else {
			feedbacks.push("Incluye caracteres especiales");
		}

		setStrength(score);
		setFeedback(feedbacks.join(", "));
	}, [password]);

	const getStrengthColor = () => {
		if (strength <= 2) return "bg-red-500";
		if (strength <= 3) return "bg-yellow-500";
		return "bg-green-500";
	};

	const getStrengthText = () => {
		if (strength <= 2) return "Débil";
		if (strength <= 3) return "Media";
		return "Fuerte";
	};

	if (!password) return null;

	return (
		<div className="mt-2">
			<div className="mb-1 flex items-center gap-2">
				<div className="h-2 flex-1 rounded-full bg-gray-200">
					<div
						className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
						style={{ width: `${(strength / 5) * 100}%` }}
					/>
				</div>
				<span className="text-xs font-medium text-gray-600">{getStrengthText()}</span>
			</div>
			{feedback && <p className="text-xs text-gray-500">{feedback}</p>}
		</div>
	);
};
