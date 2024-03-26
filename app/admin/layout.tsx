export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="flex flex-col   gap-4 py-8 md:py-10">
            <div className="inline-block w-full hull text-center justify-center">
                {children}
            </div>
        </section>
    );
}
