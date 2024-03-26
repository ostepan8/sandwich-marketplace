export default function MenuLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="flex flex-1">
            {children}
        </section>
    );
}
