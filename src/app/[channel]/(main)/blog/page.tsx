import { type Metadata } from "next";
import { BlogContent } from "./BlogContent";
import { blogData } from "@/lib/blog/data";

export const metadata: Metadata = {
	title: "Blog - Refacciones Toyota",
	description: "Artículos y noticias sobre refacciones Toyota, mantenimiento y consejos para tu vehículo.",
};

export default function BlogPage() {
	return <BlogContent data={blogData} />;
}
